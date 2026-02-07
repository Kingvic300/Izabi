import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 40, showText = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        style={{ width: size, height: size }} 
        className="relative group"
      >
        {/* Glow Effect */}
        
        {/* Main Logo Container */}
        <div className="relative w-full h-full bg-gradient-hero rounded-xl p-[2px] shadow-lg overflow-hidden group-hover:scale-110 transition-transform duration-500">
          <div className="w-full h-full bg-background/10 backdrop-blur-sm rounded-none flex items-center justify-center relative overflow-hidden">
            {/* Abstract Brain/Circuit SVG */}
            <svg 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-8/12 h-8/12"
            >
              {/* Outer Brain Shape */}
              <path 
                d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15ZM50 80C33.43 80 20 66.57 20 50C20 33.43 33.43 20 50 20C66.57 20 80 33.43 80 50C80 66.57 66.57 80 50 80Z" 
                fill="white" 
                fillOpacity="0.3"
              />
              
              {/* Inner Node - Stylized 'I' / Person */}
              <path 
                d="M50 35C44.48 35 40 39.48 40 45V65H60V45C60 39.48 55.52 35 50 35Z" 
                fill="white"
              />
              <circle cx="50" cy="28" r="5" fill="white" />
              
              {/* Tech/AI Accents */}
              <path 
                d="M25 45L35 35M75 45L65 35M25 55L35 65M75 55L65 65" 
                stroke="white" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeOpacity="0.6"
              />
              
              {/* Pulse Animation Node */}
              <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="2" strokeDasharray="4 4">
                <animateTransform 
                  attributeName="transform"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="10s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent leading-none tracking-tighter">
            Izabi
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
            Learning AI
          </span>
        </div>
      )}
    </div>
  );
};
