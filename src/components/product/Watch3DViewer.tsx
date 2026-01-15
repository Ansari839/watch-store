"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { RotateCcw, Hand, Maximize2 } from "lucide-react";

interface Watch3DViewerProps {
  image: string;
  name: string;
}

export const Watch3DViewer = ({ image, name }: Watch3DViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const rotateY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const scale = useMotionValue(1);

  // 3D transforms
  const transformRotateY = useTransform(rotateY, (v) => `${v}deg`);
  const transformRotateX = useTransform(rotateX, (v) => `${v}deg`);

  // Lighting effect based on rotation
  const shadowX = useTransform(rotateY, [-180, 0, 180], [30, 0, -30]);
  const shadowBlur = useTransform(rotateY, [-180, 0, 180], [40, 25, 40]);
  const highlightOpacity = useTransform(rotateY, [-180, -90, 0, 90, 180], [0.1, 0.3, 0.1, 0.3, 0.1]);

  // Reflection intensity
  const reflectionOpacity = useTransform(rotateX, [-30, 0, 30], [0.1, 0.3, 0.1]);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setShowHint(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = e.movementX;
    const deltaY = e.movementY;

    rotateY.set(rotateY.get() + deltaX * 0.8);
    rotateX.set(Math.max(-30, Math.min(30, rotateX.get() - deltaY * 0.5)));
  };

  const handleTouchStart = () => {
    setIsDragging(true);
    setShowHint(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current || e.touches.length === 0) return;

    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left - rect.width / 2;

    rotateY.set(x * 0.5);
  };

  const resetRotation = () => {
    animate(rotateY, 0, { type: "spring", stiffness: 100, damping: 15 });
    animate(rotateX, 0, { type: "spring", stiffness: 100, damping: 15 });
    animate(scale, 1, { type: "spring", stiffness: 100, damping: 15 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = Math.max(0.8, Math.min(1.5, scale.get() - e.deltaY * 0.001));
    scale.set(newScale);
  };

  // Auto-rotate animation when not interacting
  useEffect(() => {
    if (isDragging) return;

    const autoRotate = setInterval(() => {
      if (!isDragging) {
        rotateY.set(rotateY.get() + 0.2);
      }
    }, 50);

    return () => clearInterval(autoRotate);
  }, [isDragging, rotateY]);

  return (
    <div className="relative">
      {/* 3D Viewer Container */}
      <div
        ref={containerRef}
        className="aspect-square bg-gradient-to-br from-muted via-card to-muted rounded-3xl flex items-center justify-center p-8 cursor-grab active:cursor-grabbing overflow-hidden relative select-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onWheel={handleWheel}
        style={{ perspective: "1200px" }}
      >
        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1), transparent 60%)`,
          }}
        />

        {/* Circular Track */}
        <div className="absolute inset-12 rounded-full border-2 border-dashed border-primary/10" />
        <div className="absolute inset-20 rounded-full border border-primary/5" />

        {/* 3D Watch Container */}
        <motion.div
          className="relative"
          style={{
            rotateY: transformRotateY,
            rotateX: transformRotateX,
            scale,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Watch Shadow */}
          <motion.div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-2xl bg-black/20 -z-10"
            style={{
              x: shadowX,
              filter: useTransform(shadowBlur, (v) => `blur(${v}px)`),
            }}
          />

          {/* Watch Highlight Effect */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(135deg, white 0%, transparent 50%)",
              opacity: highlightOpacity,
              mixBlendMode: "overlay",
            }}
          />

          {/* Main Watch Image */}
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-contain drop-shadow-2xl relative z-10"
            draggable={false}
          />

          {/* Glass Reflection */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-full"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)",
              opacity: reflectionOpacity,
            }}
          />
        </motion.div>

        {/* Rotation Indicator Ring */}
        <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] pointer-events-none opacity-20">
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            strokeDasharray="8 8"
            style={{
              rotate: transformRotateY,
            }}
          />
        </svg>

        {/* Drag Hint */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-card/90 backdrop-blur-sm rounded-full shadow-lg border border-border"
          >
            <motion.div
              animate={{ x: [-8, 8, -8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Hand className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm text-muted-foreground">Drag to rotate</span>
          </motion.div>
        )}

        {/* Dragging Indicator */}
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary/90 text-primary-foreground text-xs rounded-full"
          >
            360° View
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <motion.button
          onClick={resetRotation}
          className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm shadow-lg flex items-center justify-center border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Reset rotation"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
        <motion.button
          className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm shadow-lg flex items-center justify-center border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Rotation Degree Indicator */}
      <motion.div
        className="absolute bottom-4 right-4 px-3 py-1.5 bg-card/90 backdrop-blur-sm rounded-lg shadow-lg border border-border text-xs font-mono"
      >
        <motion.span>{useTransform(rotateY, (v) => `${Math.round(v % 360)}°`)}</motion.span>
      </motion.div>
    </div>
  );
};
