"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";

export default function VideoCenter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showCover, setShowCover] = useState(true);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
    };
    const onLoadedMetadata = () => setDuration(video.duration);
    const onEnded = () => {
      setPlaying(false);
      setShowCover(true);
    };
    const onError = () => {
      setShowPlaceholder(true);
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
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

  const handleFullscreen = useCallback(() => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  }, []);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = ratio * duration;
  };

  return (
    <div className="relative py-24 lg:py-32 px-6 lg:px-16 bg-[#020617] grid-bg">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* 标题 */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em]">
              PROJECT DEMO
            </span>
            <span className="flex-1 h-px w-16 bg-gradient-to-r from-cyan-500/50 to-transparent" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight">
            <span className="section-title pb-4">
              项目<span className="text-cyan-400">演示中心</span>
            </span>
          </h2>
        </motion.div>

        {/* 播放器 */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-black"
        >
          {/* 视频 */}
          <div className="relative aspect-video bg-black">
            {showPlaceholder ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <svg
                  viewBox="0 0 24 24"
                  className="w-16 h-16 text-slate-700 mb-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path d="M15 10l4.5-3.5L15 3v7z" />
                  <rect x="2" y="3" width="20" height="18" rx="2" />
                </svg>
                <p className="text-slate-500 text-sm">
                  演示视频文件不存在
                </p>
                <p className="text-slate-600 text-xs mt-1 font-mono">
                  请将 demo.mp4 放置于 /public/videos/ 目录
                </p>
              </div>
            ) : (
              <video
                ref={videoRef}
                src="/videos/demo.mp4"
                className="absolute inset-0 w-full h-full object-contain bg-black"
                preload="metadata"
                playsInline
              />
            )}

            {/* 封面 + 播放按钮 */}
            {showCover && !showPlaceholder && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/60 via-black/40 to-black/80 cursor-pointer group"
                onClick={togglePlay}
              >
                {/* 封面纹理 */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/5" />

                {/* 播放按钮 */}
                <div className="relative w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-cyan-400/60 group-hover:scale-110 transition-all duration-500">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 backdrop-blur flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-8 h-8 text-white ml-1"
                      fill="currentColor"
                    >
                      <path d="M8 5.14v14l11-7-11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 text-left">
                  <p className="text-white text-lg font-bold">MASAC UAV Demo</p>
                  <p className="text-slate-400 text-xs mt-1 font-mono">
                    多无人机协同决策 · 编队飞行演示
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 控制栏 */}
          <div className="px-4 py-3 bg-black/80 backdrop-blur border-t border-white/5">
            {/* 进度条 */}
            <div
              className="relative h-1 bg-white/10 rounded cursor-pointer mb-3 group/progress"
              onClick={handleProgressClick}
            >
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded transition-all"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg"
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* 播放/暂停 */}
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  disabled={showPlaceholder}
                >
                  {playing ? (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-0.5">
                      <path d="M8 5.14v14l11-7-11-7z" />
                    </svg>
                  )}
                </button>

                {/* 时间 */}
                <span className="text-[10px] text-slate-500 font-mono">
                  {formatTime(currentTime)} / {duration ? formatTime(duration) : "--:--"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* 音量图标 */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-slate-500"
                >
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.5v7a4.47 4.47 0 002.5-3.5z" />
                </svg>

                {/* 全屏 */}
                <button
                  onClick={handleFullscreen}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-slate-500"
                  >
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
