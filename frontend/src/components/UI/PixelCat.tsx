
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export type CatState = 'sitting' | 'playing' | 'sleeping';
export type CatEvolutionStage = 'baby' | 'teen' | 'adult';

interface PixelCatProps {
  state: CatState;
  size?: 'sm' | 'md' | 'lg';
  evolutionStage?: CatEvolutionStage;
  showEvolutionAnimation?: boolean;
}

const PixelCat: React.FC<PixelCatProps> = ({ 
  state, 
  size = 'md',
  evolutionStage = 'baby',
  showEvolutionAnimation = false
}) => {
  const [isEvolving, setIsEvolving] = useState(showEvolutionAnimation);
  
  useEffect(() => {
    if (showEvolutionAnimation) {
      setIsEvolving(true);
      const timer = setTimeout(() => {
        setIsEvolving(false);
      }, 2000); // Animation lasts 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showEvolutionAnimation]);

  const getImageSource = (): string => {
    // In a real app, we'd have different images for each state and evolution stage
    // For now, we're using the uploaded images based on state
    switch (state) {
      case 'sitting':
        return '/images/cat-sitting.png'; // From uploaded images
      case 'playing':
        return '/images/cat-playing.png'; // From uploaded images
      case 'sleeping':
        return '/images/cat-sleeping.png'; // From uploaded images
      default:
        return '/images/cat-sitting.png';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'w-16 h-16';
      case 'md':
        return 'w-24 h-24';
      case 'lg':
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  };

  // Animation variants based on cat state
  const getAnimationClass = (): string => {
    switch (state) {
      case 'sitting':
        return 'animate-bounce-light';
      case 'playing':
        return 'animate-bounce';
      case 'sleeping':
        return 'animate-pulse';
      default:
        return '';
    }
  };
  
  // Get evolution stage info
  const getEvolutionInfo = () => {
    switch (evolutionStage) {
      case 'baby':
        return {
          name: "Meow-lette",
          description: "A tiny kitten just starting its journey"
        };
      case 'teen':
        return {
          name: "Purr-trainer",
          description: "A curious and playful teenage cat"
        };
      case 'adult':
        return {
          name: "Meow-ster",
          description: "A wise and confident grown cat"
        };
      default:
        return {
          name: "Meow-lette",
          description: "A tiny kitten just starting its journey"
        };
    }
  };

  const evolutionInfo = getEvolutionInfo();

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        className={`${getSizeClasses()} ${!isEvolving && getAnimationClass()} transition-all duration-300 overflow-hidden`}
        initial={isEvolving ? { scale: 0.8, opacity: 0.5 } : {}}
        animate={isEvolving 
          ? { 
              scale: [0.8, 1.2, 1], 
              opacity: 1, 
              rotate: [0, -5, 5, -3, 3, 0]
            } 
          : {}}
        transition={isEvolving 
          ? { 
              duration: 2, 
              ease: "easeInOut"
            } 
          : {}}
      >
        <img 
          src={getImageSource()} 
          alt={`Pixel cat in ${state} state`} 
          className="w-full h-full object-contain"
        />
      </motion.div>
      
      {/* Optionally show evolution stage name */}
      <div className="mt-2 text-center">
        <p className="text-xs font-medium text-primary">{evolutionInfo.name}</p>
      </div>
    </div>
  );
};

export default PixelCat;
