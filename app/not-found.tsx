'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Package, Tag, Scan } from 'lucide-react';

export default function NotFound() {
  const glitchRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const icon1Ref = useRef<HTMLDivElement>(null);
  const icon2Ref = useRef<HTMLDivElement>(null);
  const icon3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Digital glitch effect on 404
    const glitchElement = glitchRef.current;
    if (glitchElement) {
      const glitchAnimation = () => {
        gsap.to(glitchElement, {
          x: gsap.utils.random(-5, 5),
          duration: 0.1,
          repeat: 3,
          yoyo: true,
          ease: 'power1.inOut',
          onComplete: () => {
            gsap.to(glitchElement, {
              x: 0,
              duration: 0.1,
            });
          },
        });
      };

      // Glitch every 3-5 seconds
      const glitchInterval = setInterval(() => {
        if (Math.random() > 0.5) {
          glitchAnimation();
        }
      }, gsap.utils.random(3000, 5000));

      return () => clearInterval(glitchInterval);
    }
  }, []);

  useEffect(() => {
    // Scanning line animation
    const scanLine = scanLineRef.current;
    if (scanLine) {
      gsap.fromTo(
        scanLine,
        { y: '-100%' },
        {
          y: '100vh',
          duration: 3,
          ease: 'power1.inOut',
          delay: 0.5,
        }
      );
    }

    // Floating icons
    const animateIcon = (icon: HTMLDivElement | null, delay: number) => {
      if (icon) {
        gsap.to(icon, {
          y: '+=30',
          x: '+=20',
          rotation: 360,
          duration: gsap.utils.random(4, 6),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: delay,
        });
      }
    };

    animateIcon(icon1Ref.current, 0);
    animateIcon(icon2Ref.current, 0.5);
    animateIcon(icon3Ref.current, 1);

    // Button hover effect
    const button = buttonRef.current;
    if (button) {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          boxShadow: '0 0 0px rgba(59, 130, 246, 0)',
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    }

    // Initial reveal animations
    gsap.fromTo(
      glitchRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    gsap.fromTo(
      '.error-message',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 }
    );

    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 1.2 }
    );
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-900 flex items-center justify-center overflow-hidden">
      {/* Scanning line effect */}
      <div
        ref={scanLineRef}
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30 pointer-events-none z-10"
        style={{ top: 0 }}
      />

      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating icons */}
      <div
        ref={icon1Ref}
        className="absolute top-1/4 left-1/4 text-blue-500/20 pointer-events-none"
      >
        <Package size={48} />
      </div>
      <div
        ref={icon2Ref}
        className="absolute top-1/3 right-1/4 text-blue-500/20 pointer-events-none"
      >
        <Tag size={40} />
      </div>
      <div
        ref={icon3Ref}
        className="absolute bottom-1/3 left-1/3 text-blue-500/20 pointer-events-none"
      >
        <Scan size={44} />
      </div>

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-4xl">
        {/* 404 with glitch effect */}
        <div ref={glitchRef} className="mb-8">
          <h1 
            className="text-[180px] md:text-[240px] lg:text-[300px] font-black leading-none tracking-tighter text-transparent"
            style={{
              WebkitTextStroke: '3px rgba(59, 130, 246, 0.5)',
              textShadow: `
                0 0 20px rgba(59, 130, 246, 0.3),
                0 0 40px rgba(59, 130, 246, 0.2),
                0 0 60px rgba(59, 130, 246, 0.1)
              `,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            404
          </h1>
        </div>

        {/* Error message */}
        <div className="error-message mb-4 px-6 py-3 bg-slate-800/50 border border-blue-500/30 rounded-lg backdrop-blur-sm">
          <p className="text-blue-400 font-mono text-sm md:text-base">
            <span className="text-red-400">ERR_PAGE_NOT_FOUND:</span> The requested page is missing from our servers.
          </p>
        </div>

        {/* Description */}
        <p className="error-message text-slate-400 text-sm md:text-base mb-12 max-w-md leading-relaxed">
          The page you're looking for seems to have checked out. Let's get you back to the hotel.
        </p>

        {/* Return button */}
        <Link href="/" passHref>
          <button
            ref={buttonRef}
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <span>Return to Hotel</span>
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </button>
        </Link>

        {/* Technical details */}
        <div className="mt-12 flex items-center space-x-6 text-slate-600 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>STATUS: OFFLINE</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>CODE: 404</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-slate-500 rounded-full" />
            <span>HOTEL BEACH</span>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 text-blue-500/10 font-mono text-xs">
        <div className="border-l-2 border-t-2 border-blue-500/30 w-12 h-12" />
      </div>
      <div className="absolute top-8 right-8 text-blue-500/10 font-mono text-xs">
        <div className="border-r-2 border-t-2 border-blue-500/30 w-12 h-12" />
      </div>
      <div className="absolute bottom-8 left-8 text-blue-500/10 font-mono text-xs">
        <div className="border-l-2 border-b-2 border-blue-500/30 w-12 h-12" />
      </div>
      <div className="absolute bottom-8 right-8 text-blue-500/10 font-mono text-xs">
        <div className="border-r-2 border-b-2 border-blue-500/30 w-12 h-12" />
      </div>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${gsap.utils.random(3, 8)}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
