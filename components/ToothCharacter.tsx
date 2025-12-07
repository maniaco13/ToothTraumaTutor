import React from 'react';
import { ToothState, ToothCondition } from '../types';

interface ToothCharacterProps {
  state: ToothState;
  condition: ToothCondition;
}

const ToothCharacter: React.FC<ToothCharacterProps> = ({ state, condition }) => {
  const { mood, animation, visualEffect } = state;

  // Animation Classes
  const getAnimationClass = () => {
    switch (animation) {
      case 'shake': return 'animate-shake origin-center';
      case 'throb': return 'animate-pulse origin-center';
      case 'float': return 'animate-bounce origin-center';
      case 'shiver': return 'animate-shiver origin-center';
      case 'sway': return 'animate-sway origin-bottom';
      case 'jolt': return 'animate-jolt origin-center';
      default: return '';
    }
  };

  // Dynamic Styles
  const bodyColor = mood === 'agony' ? '#ffe4e1' : mood === 'numb' ? '#e0f2fe' : '#ffffff';
  // Use a more visceral red for the nerve
  const nerveColor = mood === 'numb' ? '#94a3b8' : '#ef4444'; 
  
  // Eye Logic
  let eyeType = 'II';
  if (mood === 'agony') eyeType = 'XX';
  else if (mood === 'shock') eyeType = 'OO';
  else if (mood === 'relief' || mood === 'numb') eyeType = 'UU';
  
  return (
    <div className={`relative w-64 h-64 mx-auto transition-all duration-500 ${getAnimationClass()}`}>
      
      {/* VISUAL EFFECTS OVERLAYS */}
      
      {/* Bubbles */}
      {visualEffect === 'bubbles' && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
           {[...Array(5)].map((_, i) => (
             <div key={`bub-${i}`} className="bubble w-4 h-4 bg-white/80 rounded-full absolute left-1/2 top-1/2" style={{ animationDelay: `${i * 0.2}s`, left: `${40 + i * 5}%` }}></div>
           ))}
        </div>
      )}

      {/* Acid Fumes */}
      {visualEffect === 'acid-fumes' && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
           {[...Array(6)].map((_, i) => (
             <div key={`fume-${i}`} className="fume w-6 h-6 absolute" 
                  style={{ 
                    animationDelay: `${i * 0.3}s`, 
                    left: `${20 + i * 10}%`, 
                    top: '60%' 
                  }}></div>
           ))}
        </div>
      )}

      {/* Sparkles */}
      {visualEffect === 'sparkles' && (
        <div className="absolute inset-0 z-20 pointer-events-none">
           {[...Array(6)].map((_, i) => (
             <div key={`spark-${i}`} className="sparkle w-5 h-5 absolute" 
                style={{ 
                   animationDelay: `${i * 0.4}s`, 
                   left: `${Math.random() * 80 + 10}%`, 
                   top: `${Math.random() * 80 + 10}%` 
                }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" /></svg>
             </div>
           ))}
        </div>
      )}
      
      {/* Electric Zap */}
      {visualEffect === 'electric' && (
         <svg className="absolute inset-0 z-30 pointer-events-none overflow-visible w-full h-full">
            <path d="M 20 100 L 40 70 L 30 130 L 50 100" stroke="#facc15" strokeWidth="4" fill="none" className="zap-line" />
            <path d="M 160 100 L 180 70 L 170 130 L 190 100" stroke="#facc15" strokeWidth="4" fill="none" className="zap-line" style={{animationDelay: '0.1s'}} />
            <path d="M 90 20 L 110 5 L 100 40" stroke="#facc15" strokeWidth="3" fill="none" className="zap-line" style={{animationDelay: '0.2s'}} />
         </svg>
      )}

      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl filter z-10 relative">
        <defs>
            <radialGradient id="cavityGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#2a1810" />
                <stop offset="100%" stopColor="#5d4037" />
            </radialGradient>
            <linearGradient id="dentinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
            <filter id="pulpGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        {/* Tooth Body */}
        <path
          d="M 50 60 
             C 30 60, 20 90, 30 130 
             C 35 160, 45 190, 60 190 
             C 75 190, 80 150, 100 130 
             C 120 150, 125 190, 140 190 
             C 155 190, 165 160, 170 130 
             C 180 90, 170 60, 150 60 
             Q 100 40 50 60 Z"
          fill={bodyColor}
          stroke="#334155"
          strokeWidth="4"
          className="transition-colors duration-500"
        />
        
        {/* Sweat Drops (Integrated in SVG) */}
        {visualEffect === 'sweat' && (
           <>
              <path d="M 160 80 Q 165 90 160 100 Q 155 90 160 80" fill="#60a5fa" className="animate-pulse" />
              <path d="M 40 90 Q 45 100 40 110 Q 35 100 40 90" fill="#60a5fa" className="animate-pulse" style={{animationDelay: '0.5s'}} />
           </>
        )}

        {/* CONDITION: BROKEN */}
        {condition === 'BROKEN' && (
          <g>
            {/* The Fracture (Jagged cross-section exposed on the top crown) */}
            <path
              d="M 60 55 
                 L 80 75 
                 L 100 60 
                 L 120 75 
                 L 140 55 
                 Q 100 35 60 55 Z"
              fill="url(#dentinGrad)"
              stroke="#b45309"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            
            {/* Exposed Pulp Tissue (Raw Nerve) */}
            <path
                d="M 90 60 
                   L 95 70 
                   L 105 65 
                   L 110 72 
                   L 100 80 
                   L 85 75 
                   Z"
                fill={nerveColor}
                stroke="#7f1d1d"
                strokeWidth="1"
                filter="url(#pulpGlow)"
                className={`origin-center ${mood === 'numb' ? '' : 'animate-throb'}`}
            />
            
            {/* Pain Radiating Lines */}
            {mood !== 'numb' && mood !== 'relief' && (
                <g stroke={nerveColor} strokeWidth="2" opacity="0.6">
                    <line x1="100" y1="50" x2="100" y2="40" className="animate-pulse" />
                    <line x1="80" y1="55" x2="70" y2="45" className="animate-pulse" />
                    <line x1="120" y1="55" x2="130" y2="45" className="animate-pulse" />
                </g>
            )}

            {/* Cracks propagating from fracture */}
            <path d="M 80 75 L 70 90" stroke="#cbd5e1" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M 120 75 L 130 95" stroke="#cbd5e1" strokeWidth="2" fill="none" opacity="0.5" />
          </g>
        )}

        {/* CONDITION: CAVITY */}
        {condition === 'CAVITY' && (
          <g>
            {/* The Decay Hole - Deeper, jagged */}
            <path
                d="M 90 70 
                   Q 105 65 120 75 
                   Q 130 90 115 105 
                   Q 100 110 85 100 
                   Q 75 85 90 70 Z"
                fill="url(#cavityGrad)" 
                stroke="#3e2723"
                strokeWidth="1.5"
            />
            
            {/* Enamel erosion rings */}
            <path 
                d="M 85 65 Q 110 55 130 70" 
                stroke="#a16207" strokeWidth="1" fill="none" opacity="0.3" 
            />
             <path 
                d="M 80 100 Q 95 115 120 110" 
                stroke="#a16207" strokeWidth="1" fill="none" opacity="0.3" 
            />

            {/* Deep Nerve Inflammation (Inside the hole) - Pulsating glow */}
            <circle 
                cx="105" 
                cy="88" 
                r="6" 
                fill={nerveColor} 
                opacity="0.8"
                filter="url(#pulpGlow)"
                className={mood === 'numb' ? '' : 'animate-throb'}
            />
            
            {/* Bacterial/Plaque build up */}
            <circle cx="125" cy="80" r="4" fill="#fbbf24" opacity="0.3" />
            <circle cx="82" cy="85" r="3" fill="#fbbf24" opacity="0.3" />
            <circle cx="100" cy="115" r="2" fill="#fbbf24" opacity="0.2" />
          </g>
        )}
        
        {/* Face Elements (Eyes, Mouth) - Moved down to allow space for injury on crown */}
        <g transform="translate(0, 30)">
            {/* Eyes */}
            <g>
                {eyeType === 'II' && (
                    <>
                        <circle cx="70" cy="80" r="5" fill="#1e293b" />
                        <circle cx="130" cy="80" r="5" fill="#1e293b" />
                        <path d="M 60 70 L 80 75" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 140 70 L 120 75" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                    </>
                )}
                {eyeType === 'XX' && (
                    <>
                        <path d="M 60 75 L 80 95" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 80 75 L 60 95" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 120 75 L 140 95" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 140 75 L 120 95" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                    </>
                )}
                 {eyeType === 'OO' && (
                    <>
                        <circle cx="70" cy="85" r="8" fill="none" stroke="#1e293b" strokeWidth="3" />
                        <circle cx="130" cy="85" r="8" fill="none" stroke="#1e293b" strokeWidth="3" />
                        <circle cx="70" cy="85" r="2" fill="#1e293b" />
                        <circle cx="130" cy="85" r="2" fill="#1e293b" />
                    </>
                )}
                {eyeType === 'UU' && (
                    <>
                        <path d="M 60 85 Q 70 95 80 85" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 120 85 Q 130 95 140 85" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                    </>
                )}
            </g>

            {/* Mouth */}
            <g transform="translate(0, 0)">
                {mood === 'neutral' && (
                    <path d="M 85 120 Q 100 115 115 120" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                )}
                {mood === 'agony' && (
                     <path d="M 80 130 Q 100 110 120 130 Q 100 150 80 130 Z" fill="#330000" />
                )}
                {mood === 'shock' && (
                     <circle cx="100" cy="130" r="10" fill="#330000" />
                )}
                {mood === 'relief' && (
                     <path d="M 80 120 Q 100 140 120 120" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                )}
                {mood === 'numb' && (
                     <path d="M 80 125 L 120 125" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                )}
            </g>
        </g>
        
        {/* Bandage (Optional decor for broken only) */}
        {condition === 'BROKEN' && (
             <rect x="130" y="55" width="30" height="10" transform="rotate(20 125 50)" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" opacity="0.5" />
        )}
      </svg>
    </div>
  );
};

export default ToothCharacter;