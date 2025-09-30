'use client';

import { useTheme } from '@/components/theme-provider';
import { useEffect } from 'react';

export function ThemeFavicon() {
  const { theme } = useTheme();

  useEffect(() => {
    // Create a canvas to generate the favicon
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Set background
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, 32, 32);

    // Set stroke color based on theme
    const strokeColor = theme === 'dark' ? '#ffffff' : '#000000';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw the Git merge folder icon
    // Folder outline
    ctx.beginPath();
    ctx.moveTo(4, 6);
    ctx.lineTo(4, 26);
    ctx.lineTo(28, 26);
    ctx.lineTo(28, 10);
    ctx.lineTo(20, 10);
    ctx.lineTo(16, 6);
    ctx.closePath();
    ctx.stroke();

    // Git merge symbol
    // Left branch
    ctx.beginPath();
    ctx.moveTo(8, 20);
    ctx.quadraticCurveTo(12, 20, 12, 16);
    ctx.quadraticCurveTo(12, 12, 16, 12);
    ctx.stroke();

    // Right branch
    ctx.beginPath();
    ctx.moveTo(24, 20);
    ctx.quadraticCurveTo(20, 20, 20, 16);
    ctx.quadraticCurveTo(20, 12, 16, 12);
    ctx.stroke();

    // Merge point
    ctx.beginPath();
    ctx.arc(16, 12, 2, 0, 2 * Math.PI);
    ctx.fill();

    // Branch endpoints
    ctx.beginPath();
    ctx.arc(8, 20, 1.5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(24, 20, 1.5, 0, 2 * Math.PI);
    ctx.fill();

    // Merge line
    ctx.beginPath();
    ctx.moveTo(16, 12);
    ctx.lineTo(16, 24);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(16, 24, 1.5, 0, 2 * Math.PI);
    ctx.fill();

    // Convert canvas to favicon
    const favicon = canvas.toDataURL('image/png');
    
    // Update favicon
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = favicon;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [theme]);

  return null;
}
