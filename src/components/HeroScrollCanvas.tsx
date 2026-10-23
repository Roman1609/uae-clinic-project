"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowDown, CheckCircle2, ChevronRight, ShieldCheck, Sparkles, Award, TrendingUp } from "lucide-react";

interface HeroScrollCanvasProps {
  totalFrames?: number;
  framePrefix?: string;
}

export default function HeroScrollCanvas({
  totalFrames = 196,
  framePrefix = "ezgif-frame-",
}: HeroScrollCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Target and current frame for smooth lerp
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Helper to format frame path
  const getFramePath = (index: number) => {
    const frameNum = String(index + 1).padStart(3, "0");
    return `/hero-frames/${framePrefix}${frameNum}.jpg`;
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

  // Preload all 96 frames
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
        // Fallback: if loading with ezgif-frame- fails, attempt loading without prefix (001.jpg)
        if (img.src.includes("ezgif-frame-")) {
          img.src = img.src.replace("ezgif-frame-", "");
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

  // Scroll listener to calculate progress
  useEffect(() => {
    const handleScroll = () => {
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
  }, [totalFrames]);

  // Smooth lerp loop for silky 60fps frame rendering
  useEffect(() => {
    const loop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.25;
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
  }, [drawFrame]);

  // Calculate opacities and transformations for the 4 stages across all 196 frames
  // Stage 1 (0.00 - 0.25): Turnkey Advisory & Launch Concept
  // Stage 2 (0.25 - 0.50): Official Licenses & Regulatory Approvals
  // Stage 3 (0.50 - 0.75): Sovereign Authority Alignment & Proven Metrics (2nd Section Content Integrated)
  // Stage 4 (0.75 - 1.00): Operational Scaling & Ready to Launch
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

  const activeStage =
    scrollProgress < 0.25
      ? 1
      : scrollProgress < 0.5
        ? 2
        : scrollProgress < 0.75
          ? 3
          : 4;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480vh] bg-obsidian"
      id="hero-scroll-container"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* HTML5 Canvas for the 196-frame sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

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
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-8 text-center flex items-center justify-center min-h-[580px] w-full">

          {/* STAGE 1: Turnkey Medical Clinic Setup in Dubai (Scene 1 Opening) */}
          <div
            className="absolute inset-0 max-w-4xl mx-auto px-4 transition-all duration-500 ease-out flex flex-col items-center justify-center text-center"
            style={getStageStyle(1)}
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-obsidian-card/90 border border-gold-500/30 backdrop-blur-md mb-6 shadow-gold-glow">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-300">
                Phase 01 • Turnkey Advisory
              </span>
            </div>
            <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Turnkey Medical Clinic <br />
              <span className="gold-gradient-text">Setup in Dubai</span>
            </h1>
            <p className="font-jakarta text-base sm:text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
              Complete legal support, DHA/MOH licensing, and full documentation
              for launching your healthcare business in the UAE.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-obsidian bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 shadow-gold-glow hover:shadow-gold-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Your Project
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#services"
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-card/90 border border-gold-500/30 backdrop-blur-md mb-6 shadow-gold-glow">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-300">
                Phase 02 • DHA & MOH Regulatory Licensing
              </span>
            </div>
            <h2 className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Official Licenses & <br />
              <span className="gold-gradient-text">Regulatory Approvals</span>
            </h2>
            <p className="font-jakarta text-base sm:text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
              We handle government authorities, facility compliance, and business
              license acquisition seamlessly without delays.
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto">
              {["100% DHA Audit Pass", "Fast-track Clearance", "Medical Staff Credentialing", "Zero Rejection Risk"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-obsidian-card border border-gold-500/20"
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-card/90 border border-gold-500/30 backdrop-blur-md mb-4 shadow-gold-glow">
              <Award className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-300">
                Phase 03 • Sovereign Compliance & Track Record
              </span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-3 leading-[1.1]">
              Direct Regulatory Access & <br />
              <span className="gold-gradient-text">Verified Track Record</span>
            </h2>
            <p className="font-jakarta text-sm sm:text-base md:text-lg text-slate-300 font-light max-w-2xl mx-auto mb-6 leading-relaxed">
              We eliminate intermediaries by directly submitting and defending clinical applications with Dubai Health Authority (DHA) & UAE MOHAP.
            </p>

            {/* 4 Trust Metric Cards in Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl mx-auto mb-6">
              {[
                { value: "100%", label: "DHA Audit Pass", desc: "First-attempt approval rate" },
                { value: "50+", label: "Clinics Launched", desc: "Aesthetic, dental & polyclinics" },
                { value: "45 Days", label: "Average Setup", desc: "From corporate incorporation" },
                { value: "AED 250M+", label: "Client Assets", desc: "Guiding doctors & investors" },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-obsidian-card/85 border border-gold-500/25 backdrop-blur-md text-center hover:border-gold-400/50 transition-all hover:-translate-y-0.5"
                >
                  <div className="font-playfair text-2xl sm:text-3xl font-extrabold gold-gradient-text mb-1">
                    {m.value}
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white mb-0.5">
                    {m.label}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 font-light">
                    {m.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Authority Accreditations Badges */}
            <div className="inline-flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-obsidian-card/70 px-4 py-2 rounded-full border border-white/10">
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-card/90 border border-gold-500/30 backdrop-blur-md mb-6 shadow-gold-glow">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-300">
                Phase 04 • Operational Launch & Growth
              </span>
            </div>
            <h2 className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              A Profitable Healthcare <br />
              <span className="gold-gradient-text">Business Ready to Scale</span>
            </h2>
            <p className="font-jakarta text-base sm:text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
              Guiding you through every step — from concept and real estate to
              equipment procurement and medical staffing.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-obsidian bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 shadow-gold-glow hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Schedule Executive Consultation
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#process"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-widest text-slate-200 bg-obsidian-card/80 border border-white/10 hover:border-gold-500/40 transition-all duration-300 backdrop-blur-md"
              >
                View 4-Step Roadmap
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Bar with Progress Indicators & Scroll cue */}
        <div className="absolute bottom-8 left-0 right-0 z-30 px-6 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
          {/* Stage Step Indicators for all 4 phases */}
          <div className="flex items-center gap-3 pointer-events-auto">
            {[
              { num: 1 as const, label: "Advisory" },
              { num: 2 as const, label: "Licensing" },
              { num: 3 as const, label: "Metrics" },
              { num: 4 as const, label: "Launch" },
            ].map(({ num, label }) => (
              <div
                key={num}
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => {
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
                }}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeStage === num
                      ? "w-8 bg-gradient-to-r from-gold-400 to-gold-200 shadow-[0_0_10px_#D4AF37]"
                      : "w-2 bg-white/20 group-hover:bg-white/40"
                  }`}
                />
                <span
                  className={`text-[11px] font-semibold tracking-wider transition-colors ${
                    activeStage === num ? "text-gold-400" : "text-slate-500 hidden sm:inline"
                  }`}
                >
                  0{num} <span className="hidden lg:inline font-normal opacity-75">{label}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Central Animated Scroll Cue */}
          <div className="hidden md:flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-slate-400">
              Scroll To Scrub Sequence
            </span>
            <div className="w-5 h-8 rounded-full border border-gold-500/40 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-gold-400 animate-bounce" />
            </div>
          </div>

          {/* Authority Accreditation Badges */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Authority Compliant:</span>
            <span className="text-gold-300 font-semibold">DHA / MOH / DOH</span>
          </div>
        </div>

      </div>
    </div>
  );
}
