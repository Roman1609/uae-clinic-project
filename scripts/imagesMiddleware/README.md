# Image Upload & Processing Middleware

Комплексне модульне рішення для завантаження та обробки зображень з автоматичною конвертацією у WebP формат та опціональним хмарним сховищем **Cloudinary**.

## Встановлення залежностей

```bash
npm install multer sharp cloudinary slugify
```

## Структура модуля

- **`index.mjs`** — Головна точка входу для експорту всіх компонентів.
- **`uploadIMGMiddleware.mjs`** — Основний фасад для завантаження файлів (Multer) та комбінованих пайплайнів.
- **`imageProcessor.mjs`** — Процесор зображень (Sharp WebP компресія, зміна розміру, slugify-найменування).
- **`cloudinaryStorage.mjs`** — **Окремий сабмодуль** для роботи з Cloudinary SDK (завантаження, видалення, перевірка ключів).

---

## Основні можливості

✅ **100% збереження оригінальної функціональності:** локальне збереження + Sharp WebP  
✅ **Cloudinary сабмодуль:** завантаження в хмару як окрема опція чи глобальне налаштування  
✅ **Безпечний Fallback:** якщо змінні Cloudinary не налаштовані або сталася мережева помилка, модуль автоматично повертає локальний файл без падіння сервера  
✅ **Автоматичне іменування:** підтримка генерації імені з поля форми (`namingField: 'title'`) через slugify  
✅ **Двостороння синхронізація:** копіювання створеного WebP у `frontend/public` для локальної Next.js розробки  
✅ **Очищення старих зображень:** видалення як з локального диску, так і з Cloudinary  

---

## Налаштування Cloudinary

У `.env` файлі бекенду:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
USE_CLOUDINARY=true # (опціонально, за замовчуванням false або перевірка наявності ключів)
```

> **Примітка:** Значення `CLOUDINARY_CLOUD_NAME` має точно збігатися з ім'ям акаунту (Cloud name) у вашому Cloudinary Dashboard (наприклад, `d...`, а не довільна назва проєкту).

---

## Приклади використання

### 1. Використання комбінованого middleware з прапорцем `useCloudinary`

```javascript
import { uploadAndProcessSingle } from './imagesMiddleware/uploadIMGMiddleware.mjs'

// Якщо useCloudinary не передано, береться значення з config.useCloudinary або env
const jobImageUpload = uploadAndProcessSingle('image', {
  dest: 'public/images/jobs',
  quality: 85,
  deleteOriginal: true,
  namingField: 'title',
  useCloudinary: true, // Вмикає відправку у Cloudinary
  cloudinaryFolder: 'visa_ideal/jobs', // Папка у Cloudinary
})

router.post('/', ...jobImageUpload, JobController.create)
```

### 2. Спеціалізовані хелпери для Cloudinary

```javascript
import { 
  uploadAndProcessToCloudinarySingle,
  uploadAndProcessToCloudinaryMultiple 
} from './imagesMiddleware/uploadIMGMiddleware.mjs'

// Одне зображення гарантовано у Cloudinary
router.post('/upload', 
  ...uploadAndProcessToCloudinarySingle('image', {
    cloudinaryFolder: 'visa_ideal/banners'
  }),
  Controller.create
)

// Галерея із 6 зображень у Cloudinary
router.post('/gallery',
  ...uploadAndProcessToCloudinaryMultiple('photos', {
    maxCount: 6,
    cloudinaryFolder: 'visa_ideal/gallery'
  }),
  Controller.uploadGallery
)
```

### 3. Використання окремого сабмодуля `cloudinaryStorage` напряму

Сабмодуль можна імпортувати автономно в будь-якому місці додатку:

```javascript
import { cloudinaryStorage } from './imagesMiddleware/uploadIMGMiddleware.mjs'
// Або прямий імпорт:
// import * as cloudinaryStorage from './imagesMiddleware/cloudinaryStorage.mjs'

// Перевірка наявності ключів
if (cloudinaryStorage.isCloudinaryConfigured()) {
  console.log('Cloudinary is ready')
}

// Завантаження локального файлу
const result = await cloudinaryStorage.uploadToCloudinary('/path/to/image.webp', {
  folder: 'visa_ideal/custom',
  publicId: 'custom-banner-id'
})

if (result.success) {
  console.log('Cloudinary URL:', result.secure_url)
  console.log('Public ID:', result.public_id)
}

// Видалення зображення за URL або public_id
await cloudinaryStorage.deleteFromCloudinary(result.secure_url)
```

---

## Доступ до файлу в контролері (`req.file`)

При завантаженні у Cloudinary об'єкт `req.file` містить як локальні шляхи (для сумісності), так і Cloudinary URL:

```javascript
Controller.create = (req, res) => {
  if (req.file) {
    // URL для збереження в базу (хмарний або локальний)
    const imageUrl = req.file.secure_url || req.file.url || `/images/jobs/${req.file.filename}`
    
    console.log(req.file.secure_url)  // "https://res.cloudinary.com/.../image.webp"
    console.log(req.file.public_id)   // "visa_ideal/jobs/title-123"
    console.log(req.file.filename)    // "title-123.webp"
    console.log(req.file.cloudinary)  // Повний об'єкт відповіді від Cloudinary API
  }
}
```

---

## Ліцензія

MIT
