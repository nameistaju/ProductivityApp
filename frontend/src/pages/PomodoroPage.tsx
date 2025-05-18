"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCw, Music, Volume2, Star } from 'lucide-react';
import PixelCat, { CatState, CatEvolutionStage } from '../components/UI/PixelCat';

// Timer modes
type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

// Music files
const BACKGROUND_MUSIC_PATH = "/sounds/background-music.mp3";
const ALARM_SOUND_PATH = "/sounds/alarm.mp3";
const START_SOUND_PATH = "/sounds/start.mp3";
const PAUSE_SOUND_PATH = "/sounds/pause.mp3";
const RESET_SOUND_PATH = "/sounds/reset.mp3";

const PomodoroPage = () => {
  // Timer mode and timer states
  const [timerMode, setTimerMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState({ minutes: 25, seconds: 0 });
  const [isActive, setIsActive] = useState(false);

  // Completed sessions, loaded from localStorage
  const [sessionsCompleted, setSessionsCompleted] = useState(() => {
    const saved = localStorage.getItem('pomodorosCompleted');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Cat state and evolution loaded from localStorage
  const [catState, setCatState] = useState<CatState>('sitting');
  const [evolutionStage, setEvolutionStage] = useState<CatEvolutionStage>(() => {
    const saved = localStorage.getItem('catEvolutionStage');
    return saved as CatEvolutionStage || 'baby';
  });

  // Animation flag for cat evolution
  const [showEvolutionAnimation, setShowEvolutionAnimation] = useState(false);

  // Music and volume states
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(50);

  // Refs for timers and audio elements
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const pauseSoundRef = useRef<HTMLAudioElement | null>(null);
  const resetSoundRef = useRef<HTMLAudioElement | null>(null);
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements once
  useEffect(() => {
    // Create audio elements only if they don't exist yet
    if (!musicRef.current) {
      musicRef.current = new Audio(BACKGROUND_MUSIC_PATH);
      musicRef.current.loop = true;
    }
    
    if (!startSoundRef.current) startSoundRef.current = new Audio(START_SOUND_PATH);
    if (!pauseSoundRef.current) pauseSoundRef.current = new Audio(PAUSE_SOUND_PATH);
    if (!resetSoundRef.current) resetSoundRef.current = new Audio(RESET_SOUND_PATH);
    if (!alarmSoundRef.current) alarmSoundRef.current = new Audio(ALARM_SOUND_PATH);
    
    // Set volume for all audio elements
    if (musicRef.current) musicRef.current.volume = volume / 100;
    if (startSoundRef.current) startSoundRef.current.volume = volume / 100;
    if (pauseSoundRef.current) pauseSoundRef.current.volume = volume / 100;
    if (resetSoundRef.current) resetSoundRef.current.volume = volume / 100;
    if (alarmSoundRef.current) alarmSoundRef.current.volume = volume / 100;

    return () => {
      [musicRef, startSoundRef, pauseSoundRef, resetSoundRef, alarmSoundRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      });
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = volume / 100;
    if (startSoundRef.current) startSoundRef.current.volume = volume / 100;
    if (pauseSoundRef.current) pauseSoundRef.current.volume = volume / 100;
    if (resetSoundRef.current) resetSoundRef.current.volume = volume / 100;
    if (alarmSoundRef.current) alarmSoundRef.current.volume = volume / 100;
  }, [volume]);

  // Play or pause background music based on isActive state or manual toggle
  useEffect(() => {
    if (!musicRef.current) return;
    
    // Play music when timer is active AND music toggle is on
    if (isActive && isMusicPlaying) {
      musicRef.current.play().catch(error => {
        console.error("Failed to play background music:", error);
      });
    } else {
      musicRef.current.pause();
    }
  }, [isActive, isMusicPlaying]);

  // Save progress and cat evolution to localStorage
  useEffect(() => {
    localStorage.setItem('pomodorosCompleted', sessionsCompleted.toString());
    localStorage.setItem('catEvolutionStage', evolutionStage);
  }, [sessionsCompleted, evolutionStage]);

  // Update timer duration based on mode changes and reset timer
  useEffect(() => {
    let minutes = 25;
    if (timerMode === 'shortBreak') minutes = 5;
    else if (timerMode === 'longBreak') minutes = 15;

    setTimeLeft({ minutes, seconds: 0 });
    setIsActive(false);
  }, [timerMode]);

  // Manage cat evolution based on sessions completed
  useEffect(() => {
    let newStage = evolutionStage;
    let shouldAnimate = false;

    if (sessionsCompleted >= 12 && evolutionStage !== 'adult') {
      newStage = 'adult';
      shouldAnimate = true;
    } else if (sessionsCompleted >= 5 && evolutionStage === 'baby') {
      newStage = 'teen';
      shouldAnimate = true;
    }

    if (shouldAnimate) {
      setEvolutionStage(newStage);
      setShowEvolutionAnimation(true);
      showToast(`Your cat evolved to ${newStage} stage!`, 'success');

      // Hide animation after 2 seconds
      setTimeout(() => setShowEvolutionAnimation(false), 2000);
    }
  }, [sessionsCompleted, evolutionStage]);

  // Timer countdown logic
  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          // Time's up!
          handleTimerComplete();
          return prev;
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  // Update cat state dynamically based on timer activity and mode
  useEffect(() => {
    if (isActive) {
      setCatState(timerMode === 'pomodoro' ? 'playing' : 'sleeping');
    } else {
      setCatState('sitting');
    }
  }, [isActive, timerMode]);

  // Format time as MM:SS
  const formatTime = (m: number, s: number) =>
    `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  // Simple toast notification UI
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.className = `fixed bottom-4 right-4 p-3 rounded-md ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white z-50 shadow-lg`;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  // Timer control handlers
  const startTimer = () => {
    startSoundRef.current?.play().catch(console.error);
    setIsActive(true);
    // Automatically turn on music when timer starts
    setIsMusicPlaying(true);
  };

  const pauseTimer = () => {
    pauseSoundRef.current?.play().catch(console.error);
    setIsActive(false);
  };

  const resetTimer = () => {
    resetSoundRef.current?.play().catch(console.error);
    setIsActive(false);

    // Reset time based on current mode
    if (timerMode === 'pomodoro') setTimeLeft({ minutes: 25, seconds: 0 });
    else if (timerMode === 'shortBreak') setTimeLeft({ minutes: 5, seconds: 0 });
    else if (timerMode === 'longBreak') setTimeLeft({ minutes: 15, seconds: 0 });
  };

  // Change timer mode
  const switchMode = (mode: TimerMode) => setTimerMode(mode);

  // Toggle background music on/off
  const toggleMusic = () => {
    const newState = !isMusicPlaying;
    setIsMusicPlaying(newState);
    
    // If turning music on while timer is active, play immediately
    if (newState && isActive && musicRef.current) {
      musicRef.current.play().catch(console.error);
    }
  };

  // What happens when timer completes
  const handleTimerComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);

    alarmSoundRef.current?.play().catch(console.error);

    if (timerMode === 'pomodoro') {
      setSessionsCompleted(prev => prev + 1);
    }

    showToast(
      timerMode === 'pomodoro'
        ? 'Pomodoro session complete! Time for a break.'
        : 'Break time is over! Ready for another focus session?'
    );
  };

  // Background color style based on timer mode
  const getModeColor = () => {
    switch (timerMode) {
      case 'pomodoro':
        return 'bg-blue-100 text-blue-800';
      case 'shortBreak':
        return 'bg-green-100 text-green-800';
      case 'longBreak':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{
        backgroundColor: '#FFDB70',
        backgroundImage: `linear-gradient(white 1px, transparent 1px),
          linear-gradient(90deg, white 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }}
    >
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-lg">
       <h1 className="text-2xl font-bold text-center text-yellow-400 mb-6">Pomodoro Timer</h1>

        {/* Timer Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-full overflow-hidden flex p-1">
            {(['pomodoro', 'shortBreak', 'longBreak'] as TimerMode[]).map((mode) => (
              <button
                key={mode}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  timerMode === mode ? 'bg-white shadow-sm' : ''
                }`}
                onClick={() => switchMode(mode)}
              >
                {mode === 'pomodoro' ? 'Pomodoro' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions Counter */}
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1 bg-gray-100 rounded-full text-sm">
            Completed: {sessionsCompleted} sessions
          </span>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-6">
          <h2 
            className="text-8xl font-bold" 
            style={{ color: 'rgb(0, 0, 0)' }}
          >
            {formatTime(timeLeft.minutes, timeLeft.seconds)}
          </h2>
          <p className="text-gray-500 mt-1 capitalize">{timerMode} Session</p>
        </div>

        {/* Cat Display */}
        <div className="flex justify-center mb-6">
          <PixelCat
            state={catState}
            evolutionStage={evolutionStage}
            showEvolutionAnimation={showEvolutionAnimation}
          />
        </div>

        <div className="flex justify-center items-center space-x-2 mb-4">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm">Pomodoros: {sessionsCompleted}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-8 rounded-md shadow-md flex items-center justify-center min-w-36"
            onClick={isActive ? pauseTimer : startTimer}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 mr-2" /> PAUSE
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" /> START
              </>
            )}
          </button>

          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-md shadow-md"
            onClick={resetTimer}
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        {/* Music Controls */}
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Music className="w-5 h-5 mr-2" />
              <span>Background Music</span>
            </div>
            <button
              className={`px-4 py-1 rounded-full ${isMusicPlaying ? 'bg-green-200' : 'bg-gray-300'}`}
              onClick={toggleMusic}
            >
              {isMusicPlaying ? 'On' : 'Off'}
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center space-x-3">
            <Volume2 className="w-5 h-5" />
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={e => {
                const vol = Number(e.target.value);
                setVolume(vol);
                if (musicRef.current) musicRef.current.volume = vol / 100;
              }}
              className="flex-grow"
            />
          </div>
        </div>

        {/* Pomodoro Tips */}
        <div className="bg-yellow-200 p-4 rounded-lg text-yellow-900 shadow-inner text-center font-medium">
          <p>
            Tip: Use Pomodoro sessions to boost focus! Work 25 minutes, then take a 5-minute break.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;