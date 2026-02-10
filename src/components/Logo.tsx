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
        {/* Light Mode Logo */}
        <img 
          src="/light-mode-logo.png" 
          alt="Izabi Logo" 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-lg dark:hidden"
        />
        {/* Dark Mode Logo */}
        <img 
          src="/dark-mode-logo.png" 
          alt="Izabi Logo" 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-lg hidden dark:block"
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent leading-none tracking-tighter">
            IZABI
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
            AI Learning
          </span>
        </div>
      )}
    </div>
  );
};
