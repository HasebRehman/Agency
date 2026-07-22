"use client";

import React, { useRef, useEffect } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  glowSize: number;
}

export default function ThreeDStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;

    const handleResize = () => {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      centerX = width / 2;
      centerY = height / 2;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Color palette matching the website themes (soft white, cyan, light violet)
    const COLORS = [
      "rgba(234, 241, 251, 1)", // Soft white
      "rgba(53, 208, 255, 1)",  // Cyan
      "rgba(139, 123, 255, 1)", // Violet
      "rgba(255, 255, 255, 0.9)",
    ];

    const STARS_COUNT = 300;
    const stars: Star[] = [];

    // Initialize stars spread out along the Z-axis depth
    for (let i = 0; i < STARS_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2400,
        y: (Math.random() - 0.5) * 1800,
        z: Math.random() * 1200, // depth from 0 to 1200
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 1.8 + 0.4,
        glowSize: Math.random() * 6 + 3,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinate values from -1 to 1
      mouseRef.current.targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouseRef.current.targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const focalLength = 350; // Camera zoom factor
    const speed = 1.8;       // Flight speed forward

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse positions for smooth camera steering
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // 3D rotation angles derived from cursor steering
      const rx = mouse.y * 0.55; // Pitch (rotation around X-axis)
      const ry = mouse.x * 0.55; // Yaw (rotation around Y-axis)

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      // Draw all stars
      stars.forEach((star) => {
        // Move star closer to the camera along Z-axis
        star.z -= speed;

        // If the star flies past the camera, recycle it to the back
        if (star.z <= 0) {
          star.z = 1200;
          star.x = (Math.random() - 0.5) * 2400;
          star.y = (Math.random() - 0.5) * 1800;
        }

        // Apply 3D coordinate rotations based on cursor camera angle
        // 1. Rotate Y-axis (Yaw)
        const x1 = star.x * cosY - star.z * sinY;
        const z1 = star.x * sinY + star.z * cosY;

        // 2. Rotate X-axis (Pitch)
        const y2 = star.y * cosX - z1 * sinX;
        const z2 = star.y * sinX + z1 * cosX;

        const depth = z2;
        if (depth <= 10) return; // Prevent division by zero

        // 3. Perspective projection
        const scale = focalLength / depth;
        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;

        // Render only if within viewport bounds
        if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
          const finalSize = star.size * scale;
          const finalGlow = star.glowSize * scale;

          if (finalSize < 0.1) return;

          // Smooth fade-in when appearing far away, and fade-out when rushing past screen
          const opacityFar = Math.min(1, (1200 - depth) / 250);
          const opacityClose = Math.min(1, (depth - 40) / 120);
          const opacity = Math.min(opacityFar, opacityClose);

          if (opacity <= 0) return;

          // Draw soft glow halo backplate
          ctx.beginPath();
          ctx.arc(screenX, screenY, finalGlow, 0, Math.PI * 2);
          ctx.fillStyle = star.color.replace("1)", `${opacity * 0.12})`);
          ctx.fill();

          // Draw solid core particle
          ctx.beginPath();
          ctx.arc(screenX, screenY, finalSize, 0, Math.PI * 2);
          ctx.fillStyle = star.color.replace("1)", `${opacity})`);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-[1]"
    />
  );
}
