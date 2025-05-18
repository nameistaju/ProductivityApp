import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white bg-opacity-80 backdrop-blur-sm py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4">
        <div className="flex items-center mb-4 sm:mb-0">
          <NavLink to="/" className="text-2xl font-fredoka text-primary flex items-center">
            <span className="mr-2">🐱</span>
            <span>PixelProd</span>
          </NavLink>
        </div>
        
        <ul className="flex space-x-1 md:space-x-4">
          {[
            { path: '/', label: 'Home', emoji: '🏠' },
            { path: '/todo', label: 'To-Do', emoji: '✅' },
            { path: '/pomodoro', label: 'Pomodoro', emoji: '⏱️' },
            { path: '/journal', label: 'Journal', emoji: '📓' },
            { path: '/habits', label: 'Habits', emoji: '📊' },
          ].map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => 
                  `px-3 py-2 rounded-lg flex flex-col items-center text-xs md:text-sm transition-colors
                  ${isActive ? 'bg-pastel-purple text-primary font-medium' : 'hover:bg-pastel-purple/50'}`
                }
                end
              >
                <span className="text-lg md:text-xl">{link.emoji}</span>
                <span className="hidden md:block">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;