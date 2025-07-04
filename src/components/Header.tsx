import React from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="mb-6 sm:mb-8 animate-fadeInDown animation-delay-200">
      <img 
        src="https://i.imgur.com/QJxTIcN.png" 
        alt="Blue Drops Logo"
        className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onLogoClick}
      />
    </header>
  );
};