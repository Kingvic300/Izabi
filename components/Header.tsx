import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-secondary/30 backdrop-blur-lg sticky top-0 z-10 border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494M5.335 12.001L12 3l6.665 9.001-3.332 4.502-3.333-4.502-3.333 4.502L5.335 12.001z"></path></svg>
            <h1 className="text-2xl font-bold text-white">Izabi</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-light/80 hidden sm:block">Welcome, {user.name}</span>
          <button
            onClick={onLogout}
            className="bg-highlight hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
