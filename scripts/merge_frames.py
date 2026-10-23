#!/usr/bin/env python3
"""
Frame Sequence Merger & Manager for HeroScrollCanvas
Clinik Project (DubaiMed)

This script merges subsequent animation scenes (e.g., from 'second-scene')
into 'public/hero-frames', automatically continuing the numerical sequence (001, 002... N),
and updates totalFrames in src/app/page.tsx.
"""

import os
import sys
import io
import re
import shutil
import argparse
from pathlib import Path

# Fix Windows console Unicode encoding (cp1251/cp866)
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# ANSI Colors for terminal output
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

VALID_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")

def get_project_root() -> Path:
    """Finds project root directory containing package.json."""
    current = Path(__file__).resolve().parent
    for parent in [current] + list(current.parents):
        if (parent / "package.json").exists():
            return parent
    return Path.cwd()

def natural_sort_key(filename: str):
    """Sort strings containing numbers naturally (e.g. 1, 2, 10 instead of 1, 10, 2)."""
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r"(\d+)", filename)]

def extract_frame_number(filename: str) -> int:
    """Extracts the numeric index from a frame filename."""
    nums = re.findall(r"\d+", filename)
    return int(nums[-1]) if nums else 0

def detect_prefix(filenames: list[str]) -> str:
    """Detects whether files use 'ezgif-frame-', 'frame-', or no prefix."""
    if not filenames:
        return "ezgif-frame-"
    ezgif_count = sum(1 for f in filenames if f.startswith("ezgif-frame-"))
    if ezgif_count >= len(filenames) // 2:
        return "ezgif-frame-"
    frame_count = sum(1 for f in filenames if f.startswith("frame-"))
    if frame_count >= len(filenames) // 2:
        return "frame-"
    return ""

def find_source_folder(root: Path, custom_source: str | None = None) -> Path | None:
    """Locates the source folder containing new frames to merge."""
    if custom_source:
        p = Path(custom_source)
        if not p.is_absolute():
            p = root / custom_source
        if p.exists() and p.is_dir():
            return p
        return None

    # Search common candidate paths
    candidates = [
        root / "second-scene",
        root / "public" / "second-scene",
        root / "public" / "hero-frames" / "second-scene",
        root / "new-frames",
        root / "public" / "new-frames",
    ]

    for c in candidates:
        if c.exists() and c.is_dir():
            # Check if it has any image files
            images = [f for f in os.listdir(c) if f.lower().endswith(VALID_EXTENSIONS)]
            if images:
                return c

    # Fallback to any directory that exists even if empty
    for c in candidates[:2]:
        if c.exists() and c.is_dir():
            return c

    return None

def update_page_total_frames(root: Path, new_total: int) -> bool:
    """Updates totalFrames={...} in src/app/page.tsx."""
    page_file = root / "src" / "app" / "page.tsx"
    if not page_file.exists():
        return False

    content = page_file.read_text(encoding="utf-8")
    pattern = r'(<HeroScrollCanvas\s+[^>]*totalFrames=\{)(\d+)(\})'
    
    if re.search(pattern, content):
        new_content = re.sub(pattern, rf"\g<1>{new_total}\g<3>", content)
        if new_content != content:
            page_file.write_text(new_content, encoding="utf-8")
            return True
    return False

def show_status(root: Path):
    """Displays current hero-frames status."""
    hero_dir = root / "public" / "hero-frames"
    print(f"\n{BOLD}{CYAN}=== Hero Frames Status ==={RESET}")
    print(f"Directory: {hero_dir}")

    if not hero_dir.exists():
        print(f"{RED}Папка public/hero-frames не існує!{RESET}")
        return

    existing = [f for f in os.listdir(hero_dir) if f.lower().endswith(VALID_EXTENSIONS)]
    existing.sort(key=natural_sort_key)

    total = len(existing)
    prefix = detect_prefix(existing)

    print(f"Total existing frames: {GREEN}{BOLD}{total}{RESET}")
    print(f"Detected prefix: {YELLOW}'{prefix}'{RESET}")

    if existing:
        print(f"First frame: {existing[0]}")
        print(f"Last frame:  {existing[-1]}")
    else:
        print(f"{YELLOW}Папка порожня.{RESET}")

    # Check page.tsx
    page_file = root / "src" / "app" / "page.tsx"
    if page_file.exists():
        m = re.search(r'totalFrames=\{(\d+)\}', page_file.read_text(encoding="utf-8"))
        if m:
            page_total = int(m.group(1))
            status_match = f"{GREEN}Співпадає ✓{RESET}" if page_total == total else f"{RED}Розбіжність! (page.tsx: {page_total}){RESET}"
            print(f"src/app/page.tsx totalFrames: {page_total} ({status_match})")
    print()

def merge_scenes(root: Path, source_dir: Path | None, prefix_override: str | None = None, copy_mode: bool = False):
    """Merges new frames from source_dir into public/hero-frames, continuing the sequence."""
    hero_dir = root / "public" / "hero-frames"
    hero_dir.mkdir(parents=True, exist_ok=True)

    # 1. Existing frames
    existing_files = [f for f in os.listdir(hero_dir) if f.lower().endswith(VALID_EXTENSIONS)]
    existing_files.sort(key=natural_sort_key)
    existing_count = len(existing_files)

    # Determine highest frame number
    max_frame = 0
    for f in existing_files:
        num = extract_frame_number(f)
        if num > max_frame:
            max_frame = num

    if max_frame == 0 and existing_count > 0:
        max_frame = existing_count

    # Determine prefix
    prefix = prefix_override if prefix_override is not None else detect_prefix(existing_files)

    print(f"\n{BOLD}{CYAN}=== DubaiMed Frame Sequence Merger ==={RESET}")
    print(f"📂 Цільова папка: {hero_dir}")
    print(f"📊 Вже наявних кадрів: {GREEN}{BOLD}{existing_count}{RESET} (найвищий номер: {max_frame:03d})")
    print(f"🏷️  Префікс імен: {YELLOW}'{prefix}'{RESET}")

    # 2. Locate source
    if not source_dir or not source_dir.exists():
        print(f"\n{RED}❌ Папку з новими кадрами не знайдено!{RESET}")
        print(f"{YELLOW}Очікувані локації:{RESET}")
        print(f" - {root / 'second-scene'}")
        print(f" - {root / 'public' / 'second-scene'}")
        print(f"\n💡 {BOLD}Що зробити:{RESET}")
        print("1. Наріжте кадри в ezgif")
        print("2. Збережіть/розпакуйте їх у папку 'second-scene' (або 'public/second-scene')")
        print("3. Запустіть скрипт знову: npm run merge-frames\n")
        return False

    new_files = [f for f in os.listdir(source_dir) if f.lower().endswith(VALID_EXTENSIONS)]
    new_files.sort(key=natural_sort_key)

    if not new_files:
        print(f"\n{YELLOW}⚠️  Папка '{source_dir}' існує, але не містить файлів зображень (.jpg, .jpeg, .png, .webp).{RESET}")
        print(f"Покладіть туди кадри з ezgif і запустіть команду знову: {BOLD}npm run merge-frames{RESET}\n")
        return False

    new_count = len(new_files)
    start_index = max_frame + 1
    end_index = max_frame + new_count
    print(f"📥 Знайдено нових кадрів у '{source_dir.name}': {GREEN}{BOLD}{new_count}{RESET}")
    print(f"🔄 Вони будуть пронумеровані як: {CYAN}{start_index:03d} -> {end_index:03d}{RESET}")

    # 3. Process renaming and moving
    action_verb = "Скопійовано" if copy_mode else "Перенесено"
    for i, file_name in enumerate(new_files):
        current_index = start_index + i
        ext = os.path.splitext(file_name)[1].lower()
        if not ext:
            ext = ".jpg"

        new_name = f"{prefix}{current_index:03d}{ext}"
        src_path = source_dir / file_name
        dest_path = hero_dir / new_name

        if copy_mode:
            shutil.copy2(src_path, dest_path)
        else:
            shutil.move(str(src_path), str(dest_path))

    total_frames = max_frame + new_count
    print(f"\n{GREEN}✔ {action_verb} {new_count} кадрів!{RESET}")
    print(f"📈 Загальна кількість кадрів у послідовності: {BOLD}{total_frames}{RESET}")

    # 4. Clean up source folder if empty and not copy_mode
    if not copy_mode:
        remaining = os.listdir(source_dir)
        if not remaining:
            try:
                source_dir.rmdir()
                print(f"🧹 Порожню папку '{source_dir.name}' прибрано.")
            except Exception:
                pass

    # 5. Automatically update page.tsx
    if update_page_total_frames(root, total_frames):
        print(f"{GREEN}✔ src/app/page.tsx автоматично оновлено:{RESET} totalFrames={{{total_frames}}}")
    else:
        print(f"{YELLOW}⚠️  Будь ласка, перевірте src/app/page.tsx і вкажіть totalFrames={{{total_frames}}}{RESET}")

    print(f"\n{BOLD}{GREEN}🎉 Готово! Нова сцена успішно підключена до скрол-анімації.{RESET}\n")
    return True

def reindex_all(root: Path, new_prefix: str = "ezgif-frame-"):
    """Reindexes ALL files in public/hero-frames from 001 to N cleanly."""
    hero_dir = root / "public" / "hero-frames"
    if not hero_dir.exists():
        print(f"{RED}Папка hero-frames не існує!{RESET}")
        return

    files = [f for f in os.listdir(hero_dir) if f.lower().endswith(VALID_EXTENSIONS)]
    files.sort(key=natural_sort_key)

    total = len(files)
    if total == 0:
        print(f"{YELLOW}Папка hero-frames порожня.{RESET}")
        return

    print(f"\n{BOLD}{CYAN}=== Перенумерація всіх кадрів у hero-frames ==={RESET}")
    print(f"Кількість файлів: {total}")
    print(f"Новий формат: {new_prefix}001.jpg ... {new_prefix}{total:03d}.jpg")

    # To avoid filename collision when renaming in place, rename to temporary names first
    temp_prefix = "__tmp_reindex_"
    for i, file_name in enumerate(files, start=1):
        ext = os.path.splitext(file_name)[1].lower()
        old_path = hero_dir / file_name
        tmp_path = hero_dir / f"{temp_prefix}{i:04d}{ext}"
        os.rename(old_path, tmp_path)

    # Now rename from temporary to target format
    tmp_files = [f for f in os.listdir(hero_dir) if f.startswith(temp_prefix)]
    tmp_files.sort(key=natural_sort_key)

    for i, file_name in enumerate(tmp_files, start=1):
        ext = os.path.splitext(file_name)[1].lower()
        tmp_path = hero_dir / file_name
        final_path = hero_dir / f"{new_prefix}{i:03d}{ext}"
        os.rename(tmp_path, final_path)

    print(f"{GREEN}✔ Успішно перенумеровано {total} кадрів від 001 до {total:03d}!{RESET}")
    update_page_total_frames(root, total)
    print(f"{GREEN}✔ src/app/page.tsx оновлено (totalFrames={total}).{RESET}\n")

def main():
    parser = argparse.ArgumentParser(description="DubaiMed Frame Sequence Merger")
    parser.add_argument("source", nargs="?", help="Шлях до папки з новою сценою (наприклад second-scene)")
    parser.add_argument("--status", action="store_true", help="Показати статус поточної послідовності кадрів")
    parser.add_argument("--prefix", type=str, default=None, help="Префікс для нових файлів (за замовчуванням визначається автоматично)")
    parser.add_argument("--copy", action="store_true", help="Копіювати файли замість переміщення")
    parser.add_argument("--reindex", nargs="?", const="ezgif-frame-", default=None, help="Перенумерувати ВСІ наявні кадри з 001 до N")

    args = parser.parse_args()
    root = get_project_root()

    if args.status:
        show_status(root)
        return

    if args.reindex is not None:
        reindex_all(root, new_prefix=args.reindex)
        return

    source_dir = find_source_folder(root, args.source)
    merge_scenes(root, source_dir, prefix_override=args.prefix, copy_mode=args.copy)

if __name__ == "__main__":
    main()
