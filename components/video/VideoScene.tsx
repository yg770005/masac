"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";

export default function VideoScene() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showCover, setShowCover] = useState(true);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => { setPlaying(false); setShowCover(true); };
    const onError = () => setShowPlaceholder(true);

    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || showPlaceholder) return;
    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      setShowCover(false);
      video.play().catch(() => setShowPlaceholder(true));
      setPlaying(true);
    }
  }, [playing, showPlaceholder]);

  return (
    <div ref={ref} className="w-full h-full flex flex-col items-center justify-center px-4 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <p className="text-cyan-400 font-mono tracking-[0.3em] uppercase mb-4" style={{ fontSize: "14px" }}>
          演示中心
        </p>
        <h2
          className="font-bold text-white"
          style={{ fontSize: "clamp(40px, 7vw, 100px)" }}
        >
          亲眼见证集群行动
        </h2>
      </motion.div>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative w-full max-w-5xl rounded-lg overflow-hidden bg-black"
        style={{ aspectRatio: "16/9" }}
      >
        {showPlaceholder ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-slate-700 mb-4" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M15 10l4.5-3.5L15 3v7z" />
              <rect x="2" y="3" width="20" height="18" rx="2" />
            </svg>
            <p className="text-slate-500" style={{ fontSize: "16px" }}>演示视频文件不存在</p>
            <p className="text-slate-600 mt-1 font-mono" style={{ fontSize: "12px" }}>请将 demo.mp4 放入 /public/videos/ 目录</p>
          </div>
        ) : (
          <video ref={videoRef} src="/videos/demo.mp4" className="absolute inset-0 w-full h-full object-contain bg-black" preload="metadata" playsInline />
        )}

        {showCover && !showPlaceholder && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/50 via-black/30 to-black/70 cursor-pointer group" onClick={togglePlay}>
            <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center group-hover:border-cyan-400/50 group-hover:scale-105 transition-all duration-500">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 backdrop-blur flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-white ml-0.5" fill="currentColor">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-4 text-slate-600 font-mono"
        style={{ fontSize: "13px" }}
      >
        五架无人机实时协同仿真飞行演示
      </motion.p>
    </div>
  );
}
