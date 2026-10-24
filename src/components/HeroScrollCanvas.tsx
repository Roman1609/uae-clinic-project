"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowDown, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Sparkles, Award, TrendingUp, ChevronDown } from "lucide-react";

// ============================================================================
// ANIMATION & TIMING CONFIGURATION SETTINGS
// Easily adjust these parameters to fine-tune playback speeds for desktop & mobile
// ============================================================================
export const HERO_ANIMATION_CONFIG = {
  /**
   * Desktop scroll lerp smoothing factor (0.01 - 1.0)
   * Higher = more immediate/responsive, Lower = heavier cinematic inertia
   * Default: 0.25 (silky 60fps response)
   */
  desktopLerpSpeed: 0.25,

  /**
   * Mobile slide transition minimum duration (in milliseconds)
   * Minimum time spent smoothly animating frames between adjacent slides
   * Default: 650ms
   */
  mobileMinDurationMs: 650,

  /**
   * Mobile slide transition maximum duration (in milliseconds)
   * Maximum time when jumping across multiple slides
   * Default: 1200ms
   */
  mobileMaxDurationMs: 1200,

  /**
   * Mobile frame duration scale multiplier
   * Scales duration proportionally to the frame distance
   * Default: 1500
   */
  mobileDurationScale: 1500,

  /**
   * Mobile horizontal swipe threshold (in pixels)
   * Distance needed for a deliberate swipe to change slides
   * Default: 35px
   */
  mobileSwipeThresholdPx: 35,

  /**
   * Desktop total scroll height multiplier in vh units
   * Default: 480vh
   */
  desktopScrollHeightVh: 480,
};

interface HeroScrollCanvasProps {
  totalFrames?: number;
  framePrefix?: string;
  desktopLerpSpeed?: number;
  mobileMinDurationMs?: number;
  mobileMaxDurationMs?: number;
}

export default function HeroScrollCanvas({
  totalFrames = 196,
  framePrefix = "ezgif-frame-",
  desktopLerpSpeed = HERO_ANIMATION_CONFIG.desktopLerpSpeed,
  mobileMinDurationMs = HERO_ANIMATION_CONFIG.mobileMinDurationMs,
  mobileMaxDurationMs = HERO_ANIMATION_CONFIG.mobileMaxDurationMs,
}: HeroScrollCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mobile & Tablet slide stage state
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [mobileStage, setMobileStage] = useState<1 | 2 | 3 | 4>(1);
  const mobileStageRef = useRef<1 | 2 | 3 | 4>(1);
  const isTransitioningRef = useRef(false);

  // Target and current frame for smooth lerp
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Helper to format frame path (using converted WebP frames)
  const getFramePath = (index: number) => {
    const frameNum = String(index + 1).padStart(3, "0");
    return `/hero-frames/${framePrefix}${frameNum}.webp`;
  };

  // Draw frame on canvas with aspect ratio "cover"
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Cover math
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw the video frame
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Subtle dark obsidian tone mapping onto canvas for deep luxury feel
    ctx.fillStyle = "rgba(13, 15, 18, 0.45)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }, []);

  // Resize canvas to match display size with DPR
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    drawFrame(Math.round(currentFrameRef.current));
  }, [drawFrame]);

  // Check mobile & tablet detection (< 1024px or touch device)
  useEffect(() => {
    const checkDevice = () => {
      const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
      const isMobile = window.innerWidth < 1024 || (isTouch && window.innerWidth < 1200);
      setIsMobileDevice(isMobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Preload all 196 WebP frames
  useEffect(() => {
    let loadedCount = 0;
    const imageElements: HTMLImageElement[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = getFramePath(i);

      img.onload = () => {
        loadedCount++;
        const pct = Math.round((loadedCount / totalFrames) * 100);
        setLoadProgress(pct);

        // Draw first frame as soon as it's ready
        if (i === 0) {
          drawFrame(0);
        }

        if (loadedCount >= totalFrames) {
          setIsLoaded(true);
          drawFrame(0);
        }
      };

      img.onerror = () => {
        // Fallback: if .webp fails, attempt loading original .jpg
        if (img.src.includes(".webp")) {
          img.src = img.src.replace(".webp", ".jpg");
          return;
        }
        loadedCount++;
        if (loadedCount >= totalFrames) {
          setIsLoaded(true);
        }
      };

      imageElements.push(img);
    }

    imagesRef.current = imageElements;

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [totalFrames, drawFrame, resizeCanvas]);

  // Smooth continuous frame-by-frame playback between stages on mobile/tablet
  const animateToStage = useCallback((targetStage: 1 | 2 | 3 | 4) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    mobileStageRef.current = targetStage;
    setMobileStage(targetStage);

    const startFrame = currentFrameRef.current;
    const stageTargets = {
      1: 0,
      2: Math.round(totalFrames * 0.33),
      3: Math.round(totalFrames * 0.66),
      4: totalFrames - 1,
    };
    const endFrame = stageTargets[targetStage];

    const stageProgress = {
      1: 0,
      2: 0.33,
      3: 0.66,
      4: 1.0,
    };
    const startProg = scrollProgress;
    const endProg = stageProgress[targetStage];

    // Smooth duration proportional to frame distance
    const frameDiff = Math.abs(endFrame - startFrame);
    const duration = Math.min(
      mobileMaxDurationMs,
      Math.max(mobileMinDurationMs, (frameDiff / totalFrames) * HERO_ANIMATION_CONFIG.mobileDurationScale)
    );
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Smooth cubic easeInOut
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const nextFrame = startFrame + (endFrame - startFrame) * ease;
      currentFrameRef.current = nextFrame;
      targetFrameRef.current = nextFrame;
      drawFrame(Math.round(nextFrame));

      const nextProg = startProg + (endProg - startProg) * ease;
      setScrollProgress(nextProg);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        currentFrameRef.current = endFrame;
        targetFrameRef.current = endFrame;
        drawFrame(endFrame);
        setScrollProgress(endProg);
        isTransitioningRef.current = false;
      }
    };

    requestAnimationFrame(step);
  }, [totalFrames, drawFrame, scrollProgress]);

  // Ensure document & body scrolling are completely free and unobstructed
  useEffect(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.style.touchAction = "";
    document.body.style.overscrollBehaviorY = "";
    document.documentElement.style.overscrollBehaviorY = "";
  }, []);

  // Desktop scroll listener: calculates progress from scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileDevice) return; // In mobile/tablet mode, controlled via horizontal slider/chevrons
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const progress = Math.min(Math.max(-rect.top / scrollableHeight, 0), 1);
      setScrollProgress(progress);

      const target = Math.min(totalFrames - 1, Math.floor(progress * (totalFrames - 1)));
      targetFrameRef.current = target;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [totalFrames, isMobileDevice]);

  // Mobile/Tablet horizontal swipe gesture handling (touch-action: pan-y preserves 100% native vertical scroll)
  useEffect(() => {
    if (!isMobileDevice) return;
    const container = containerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let isTracking = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isTracking = true;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isTracking) return;
      isTracking = false;
      if (isTransitioningRef.current) return;

      const touchEndX = e.changedTouches[0]?.clientX ?? touchStartX;
      const touchEndY = e.changedTouches[0]?.clientY ?? touchStartY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Only respond if the gesture is predominantly horizontal (flipping slides)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > HERO_ANIMATION_CONFIG.mobileSwipeThresholdPx) {
        if (diffX > 0) {
          // Swipe LEFT -> advance to next stage (1 -> 2 -> 3 -> 4)
          if (mobileStageRef.current < 4) {
            animateToStage((mobileStageRef.current + 1) as 1 | 2 | 3 | 4);
          }
        } else {
          // Swipe RIGHT -> return to previous stage (4 -> 3 -> 2 -> 1)
          if (mobileStageRef.current > 1) {
            animateToStage((mobileStageRef.current - 1) as 1 | 2 | 3 | 4);
          }
        }
      }
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobileDevice, animateToStage]);

  // Smooth desktop lerp loop for silky 60fps frame rendering
  useEffect(() => {
    if (isMobileDevice) return; // Mobile uses rAF inside animateToStage
    const loop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * desktopLerpSpeed;
        drawFrame(Math.round(currentFrameRef.current));
      }
      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [drawFrame, isMobileDevice]);

  // Helper for CTA buttons to scroll smoothly to target
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Calculate opacities and transformations for the 4 stages across all 196 frames
  const getStageStyle = (stage: 1 | 2 | 3 | 4) => {
    let opacity = 0;
    let translateY = 20;

    if (stage === 1) {
      if (scrollProgress < 0.18) {
        opacity = 1;
        translateY = 0;
      } else if (scrollProgress < 0.25) {
        const factor = (scrollProgress - 0.18) / 0.07;
        opacity = 1 - factor;
        translateY = -25 * factor;
      }
    } else if (stage === 2) {
      if (scrollProgress >= 0.21 && scrollProgress < 0.27) {
        const factor = (scrollProgress - 0.21) / 0.06;
        opacity = factor;
        translateY = 25 * (1 - factor);
      } else if (scrollProgress >= 0.27 && scrollProgress < 0.44) {
        opacity = 1;
        translateY = 0;
      } else if (scrollProgress >= 0.44 && scrollProgress < 0.50) {
        const factor = (scrollProgress - 0.44) / 0.06;
        opacity = 1 - factor;
        translateY = -25 * factor;
      }
    } else if (stage === 3) {
      if (scrollProgress >= 0.46 && scrollProgress < 0.52) {
        const factor = (scrollProgress - 0.46) / 0.06;
        opacity = factor;
        translateY = 25 * (1 - factor);
      } else if (scrollProgress >= 0.52 && scrollProgress < 0.69) {
        opacity = 1;
        translateY = 0;
      } else if (scrollProgress >= 0.69 && scrollProgress < 0.75) {
        const factor = (scrollProgress - 0.69) / 0.06;
        opacity = 1 - factor;
        translateY = -25 * factor;
      }
    } else if (stage === 4) {
      if (scrollProgress >= 0.71 && scrollProgress < 0.77) {
        const factor = (scrollProgress - 0.71) / 0.06;
        opacity = factor;
        translateY = 25 * (1 - factor);
      } else if (scrollProgress >= 0.77) {
        opacity = 1;
        translateY = 0;
      }
    }

    return {
      opacity: Math.max(0, Math.min(1, opacity)),
      transform: `translate3d(0, ${translateY}px, 0)`,
      pointerEvents: opacity > 0.4 ? ("auto" as const) : ("none" as const),
      visibility: opacity <= 0.01 ? ("hidden" as const) : ("visible" as const),
    };
  };

  const activeStage = isMobileDevice
    ? mobileStage
    : scrollProgress < 0.25
    ? 1
    : scrollProgress < 0.5
    ? 2
    : scrollProgress < 0.75
    ? 3
    : 4;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isMobileDevice ? "min-h-[100dvh] h-[100dvh]" : "h-[480vh]"} bg-obsidian`}
      style={{
        touchAction: isMobileDevice ? "pan-y" : "auto",
      }}
      id="hero-scroll-container"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex items-center justify-center">
        {/* HTML5 Canvas for the 196-frame sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Mobile & Tablet Floating Navigation Arrows */}
        {isMobileDevice && (
          <>
            {/* Left Chevron (Previous Slide) */}
            <button
              type="button"
              aria-label="Previous Phase"
              onClick={() => {
                if (mobileStage > 1) {
                  animateToStage((mobileStage - 1) as 1 | 2 | 3 | 4);
                }
              }}
              disabled={mobileStage === 1}
              className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-obsidian-card/90 border border-gold-500/40 text-gold-300 backdrop-blur-md flex items-center justify-center shadow-gold-glow transition-all active:scale-90 ${
                mobileStage === 1 ? "opacity-20 pointer-events-none" : "opacity-90 hover:opacity-100 hover:border-gold-300"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Chevron (Next Slide) */}
            <button
              type="button"
              aria-label="Next Phase"
              onClick={() => {
                if (mobileStage < 4) {
                  animateToStage((mobileStage + 1) as 1 | 2 | 3 | 4);
                } else {
                  const nextSection = document.getElementById("authorities");
                  nextSection?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-obsidian-card/90 border border-gold-500/40 text-gold-300 backdrop-blur-md flex items-center justify-center shadow-gold-glow transition-all active:scale-90 opacity-90 hover:opacity-100 hover:border-gold-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Ambient Luxury Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-obsidian/80 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10 opacity-70" />

        {/* Subtle Gold Ambient Glow Spots */}
        <div className="ambient-glow w-[550px] h-[550px] bg-gold-500/10 -top-40 -right-40 z-10" />
        <div className="ambient-glow w-[500px] h-[500px] bg-gold-600/10 -bottom-40 -left-40 z-10" />

        {/* Preloader Overlay (smoothly fades out once loaded) */}
        {!isLoaded && (
          <div className="absolute inset-0 z-50 bg-obsidian flex flex-col items-center justify-center px-6 transition-opacity duration-700">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-gold-500/20 animate-ping" />
              <div className="w-16 h-16 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-gold-400 font-bold font-playfair text-xs">
                {loadProgress}%
              </div>
            </div>
            <div className="text-sm font-semibold tracking-[0.25em] uppercase text-gold-300 mb-2">
              Loading DubaiMed Experience
            </div>
            <div className="w-48 h-1 bg-obsidian-surface rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-200"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Dynamic Overlay Content Containers */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-8 text-center flex items-center justify-center min-h-[520px] sm:min-h-[580px] w-full">

          {/* STAGE 1: Turnkey Medical Clinic Setup in Dubai (Scene 1 Opening) */}
          <div
            className="absolute inset-0 max-w-4xl mx-auto px-4 transition-all duration-500 ease-out flex flex-col items-center justify-center text-center"
            style={getStageStyle(1)}
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-obsidian-card/90 border border-gold-500/30 backdrop-blur-md mb-4 sm:mb-6 shadow-gold-glow">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-300">
                Phase 01 • Turnkey Advisory
              </span>
            </div>
            <h1 className="font-playfair text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-[1.1]">
              Turnkey Medical Clinic <br />
              <span className="gold-gradient-text">Setup in Dubai</span>
            </h1>
            <p className="font-jakarta text-sm sm:text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              Complete legal support, DHA/MOH licensing, and full documentation
              for launching your healthcare business in the UAE.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-obsidian bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 shadow-gold-glow hover:shadow-gold-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Your Project
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#services"
                onClick={(e) => handleNavClick(e, "services")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-widest text-slate-200 bg-obsidian-card/80 border border-white/10 hover:border-gold-500/40 hover:text-white transition-all duration-300 backdrop-blur-md"
              >
                Explore Services
              </a>
            </div>
          </div>

          {/* STAGE 2: Official Licenses & Regulatory Approvals (Scene 1 Mid/Climax) */}
          <div
            className="absolute inset-0 max-w-4xl mx-auto px-4 transition-all duration-500 ease-out flex flex-col items-center justify-center text-center"
            style={getStageStyle(2)}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-card/90 border border-gold-500/30 backdrop-blur-md mb-4 sm:mb-6 shadow-gold-glow">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-300">
                Phase 02 • DHA & MOH Regulatory Licensing
              </span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-[1.1]">
              Official Licenses & <br />
              <span className="gold-gradient-text">Regulatory Approvals</span>
            </h2>
            <p className="font-jakarta text-sm sm:text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              We handle government authorities, facility compliance, and business
              license acquisition seamlessly without delays.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 max-w-xl mx-auto">
              {["100% DHA Audit Pass", "Fast-track Clearance", "Medical Staff Credentialing", "Zero Rejection Risk"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-obsidian-card border border-gold-500/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* STAGE 3: Sovereign Authority Alignment & Proven Metrics (Scene 2 - 2nd Section Content Integrated) */}
          <div
            className="absolute inset-0 max-w-5xl mx-auto px-4 transition-all duration-500 ease-out flex flex-col items-center justify-center text-center"
            style={getStageStyle(3)}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-card/90 border border-gold-500/30 backdrop-blur-md mb-3 sm:mb-4 shadow-gold-glow">
              <Award className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-300">
                Phase 03 • Sovereign Compliance & Track Record
              </span>
            </div>
            <h2 className="font-playfair text-2xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-2 sm:mb-3 leading-[1.1]">
              Direct Regulatory Access & <br />
              <span className="gold-gradient-text">Verified Track Record</span>
            </h2>
            <p className="font-jakarta text-xs sm:text-base md:text-lg text-slate-300 font-light max-w-2xl mx-auto mb-5 sm:mb-6 leading-relaxed">
              We eliminate intermediaries by directly submitting and defending clinical applications with Dubai Health Authority (DHA) & UAE MOHAP.
            </p>

            {/* 4 Trust Metric Cards in Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-4xl mx-auto mb-4 sm:mb-6">
              {[
                { value: "100%", label: "DHA Audit Pass", desc: "First-attempt approval rate" },
                { value: "50+", label: "Clinics Launched", desc: "Aesthetic, dental & polyclinics" },
                { value: "45 Days", label: "Average Setup", desc: "From corporate incorporation" },
                { value: "AED 250M+", label: "Client Assets", desc: "Guiding doctors & investors" },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-xl bg-obsidian-card/85 border border-gold-500/25 backdrop-blur-md text-center hover:border-gold-400/50 transition-all hover:-translate-y-0.5"
                >
                  <div className="font-playfair text-xl sm:text-3xl font-extrabold gold-gradient-text mb-0.5 sm:mb-1">
                    {m.value}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white mb-0.5">
                    {m.label}
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 font-light line-clamp-1 sm:line-clamp-none">
                    {m.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Authority Accreditations Badges */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-obsidian-card/70 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10">
              <span className="text-gold-300">DHA Dubai</span>
              <span className="text-white/20">•</span>
              <span className="text-gold-300">MOHAP Federal</span>
              <span className="text-white/20">•</span>
              <span className="text-gold-300">DHCC Freezone</span>
              <span className="text-white/20">•</span>
              <span className="text-gold-300">DOH Abu Dhabi</span>
            </div>
          </div>

          {/* STAGE 4: A Profitable Healthcare Business Ready to Scale (Scene 2 Grand Finale) */}
          <div
            className="absolute inset-0 max-w-4xl mx-auto px-4 transition-all duration-500 ease-out flex flex-col items-center justify-center text-center"
            style={getStageStyle(4)}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-card/90 border border-gold-500/30 backdrop-blur-md mb-4 sm:mb-6 shadow-gold-glow">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-300">
                Phase 04 • Operational Launch & Growth
              </span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-[1.1]">
              A Profitable Healthcare <br />
              <span className="gold-gradient-text">Business Ready to Scale</span>
            </h2>
            <p className="font-jakarta text-sm sm:text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              Guiding you through every step — from concept and real estate to
              equipment procurement and medical staffing.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-obsidian bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 shadow-gold-glow hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Schedule Executive Consultation
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#process"
                onClick={(e) => handleNavClick(e, "process")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-widest text-slate-200 bg-obsidian-card/80 border border-white/10 hover:border-gold-500/40 transition-all duration-300 backdrop-blur-md"
              >
                View 4-Step Roadmap
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Bar with Progress Indicators & Scroll cue */}
        <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-30 px-4 sm:px-6 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
          {/* Stage Step Indicators for all 4 phases */}
          <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
            {[
              { num: 1 as const, label: "Advisory" },
              { num: 2 as const, label: "Licensing" },
              { num: 3 as const, label: "Metrics" },
              { num: 4 as const, label: "Launch" },
            ].map(({ num, label }) => (
              <div
                key={num}
                className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group py-2"
                onClick={() => {
                  if (isMobileDevice) {
                    animateToStage(num);
                  } else {
                    if (!containerRef.current) return;
                    const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
                    const targetScroll =
                      containerRef.current.offsetTop +
                      (num === 1
                        ? 0
                        : num === 2
                          ? totalHeight * 0.33
                          : num === 3
                            ? totalHeight * 0.60
                            : totalHeight * 0.88);
                    window.scrollTo({ top: targetScroll, behavior: "smooth" });
                  }
                }}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeStage === num
                      ? "w-6 sm:w-8 bg-gradient-to-r from-gold-400 to-gold-200 shadow-[0_0_10px_#D4AF37]"
                      : "w-2 bg-white/20 group-hover:bg-white/40"
                  }`}
                />
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold tracking-wider transition-colors ${
                    activeStage === num ? "text-gold-400" : "text-slate-500 hidden sm:inline"
                  }`}
                >
                  0{num} <span className="hidden lg:inline font-normal opacity-75">{label}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Central Animated Scroll Cue (Desktop) */}
          <div className="hidden md:flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-slate-400">
              Scroll To Scrub Sequence
            </span>
            <div className="w-5 h-8 rounded-full border border-gold-500/40 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-gold-400 animate-bounce" />
            </div>
          </div>

          {/* Mobile / Tablet Next Phase tap & swipe cue */}
          <div className="flex md:hidden items-center pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                if (activeStage < 4) {
                  animateToStage((activeStage + 1) as 1 | 2 | 3 | 4);
                } else {
                  const nextSection = document.getElementById("authorities");
                  nextSection?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-obsidian-card/90 border border-gold-500/30 text-[10px] font-bold uppercase tracking-wider text-gold-300 shadow-gold-glow active:scale-95 transition-all"
            >
              <span>{activeStage < 4 ? `0${activeStage}/04 • Swipe ›` : "Explore Site ↓"}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
            </button>
          </div>

          {/* Authority Accreditation Badges */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-slate-400 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden md:inline">Authority Compliant:</span>
            <span className="text-gold-300 font-semibold">DHA / MOH / DOH</span>
          </div>
        </div>

      </div>
    </div>
  );
}
