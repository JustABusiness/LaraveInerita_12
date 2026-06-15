import React from 'react';

const ReadingCat = () => {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center overflow-hidden">
      <style>{`
        @keyframes tail-wag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes head-bob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(2px) rotate(2deg); }
        }
        @keyframes ear-twitch {
          0%, 80%, 100% { transform: rotate(0deg); }
          90% { transform: rotate(-5deg); }
        }
        @keyframes eye-blink {
          0%, 95%, 100% { transform: scaleY(1); }
          97% { transform: scaleY(0.1); }
        }
        .cat-tail {
          animation: tail-wag 2s ease-in-out infinite;
          transform-origin: bottom left;
        }
        .cat-head {
          animation: head-bob 3s ease-in-out infinite;
          transform-origin: center;
        }
        .cat-ear {
          animation: ear-twitch 4s ease-in-out infinite;
        }
        .cat-eye {
          animation: eye-blink 5s infinite;
          transform-origin: center;
        }
      `}</style>
      
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Tail */}
        <path className="cat-tail" d="M45,150 Q20,140 30,120 Q40,100 55,110" stroke="#fbbf24" strokeWidth="12" strokeLinecap="round" fill="none" />
        
        {/* Body */}
        <ellipse cx="100" cy="140" rx="45" ry="35" fill="#fbbf24" />
        <ellipse cx="100" cy="140" rx="35" ry="25" fill="#f59e0b" opacity="0.3" />
        
        {/* Head Group */}
        <g className="cat-head">
          {/* Ears */}
          <path className="cat-ear" d="M70,85 L60,50 L90,75 Z" fill="#fbbf24" />
          <path className="cat-ear" d="M130,85 L140,50 L110,75 Z" fill="#fbbf24" />
          
          {/* Face */}
          <circle cx="100" cy="100" r="40" fill="#fbbf24" />
          
          {/* Eyes */}
          <ellipse className="cat-eye" cx="85" cy="95" rx="4" ry="6" fill="#1f2937" />
          <ellipse className="cat-eye" cx="115" cy="95" rx="4" ry="6" fill="#1f2937" />
          
          {/* Nose & Mouth */}
          <path d="M97,110 L103,110 L100,113 Z" fill="#f87171" />
          <path d="M90,118 Q100,125 110,118" stroke="#1f2937" strokeWidth="1.5" fill="none" />
          
          {/* Whiskers */}
          <line x1="65" y1="105" x2="45" y2="100" stroke="#1f2937" strokeWidth="1" opacity="0.5" />
          <line x1="65" y1="110" x2="45" y2="110" stroke="#1f2937" strokeWidth="1" opacity="0.5" />
          <line x1="135" y1="105" x2="155" y2="100" stroke="#1f2937" strokeWidth="1" opacity="0.5" />
          <line x1="135" y1="110" x2="155" y2="110" stroke="#1f2937" strokeWidth="1" opacity="0.5" />
        </g>
        
        {/* Arms/Paws holding book */}
        <rect x="75" y="145" width="50" height="40" rx="4" fill="#6366f1" />
        <rect x="80" y="150" width="40" height="30" rx="2" fill="white" />
        
        {/* Book Text */}
        <text x="85" y="165" fontSize="10" fontWeight="bold" fill="#4338ca">IELTS</text>
        <line x1="85" y1="172" x2="115" y2="172" stroke="#e0e7ff" strokeWidth="2" />
        <line x1="85" y1="177" x2="105" y2="177" stroke="#e0e7ff" strokeWidth="2" />
        
        {/* Paw pads over book */}
        <circle cx="75" cy="155" r="8" fill="#fbbf24" />
        <circle cx="125" cy="155" r="8" fill="#fbbf24" />
      </svg>
      
      {/* Sparkles */}
      <div className="absolute top-2 right-2 animate-pulse">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 0L12 7H19L13 11L15 19L10 15L5 19L7 11L1 7H8L10 0Z" fill="#fbbf24" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
};

export default ReadingCat;
