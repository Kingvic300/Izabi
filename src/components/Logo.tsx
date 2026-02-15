import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
    height?: number;
}

export const Logo: React.FC<LogoProps> = ({
    className = '',
    size = 100,
    height,
}) => {
    const logoHeight = height ?? size;

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div
                style={{ width: size, height: logoHeight }}
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
        </div>
    );
};
