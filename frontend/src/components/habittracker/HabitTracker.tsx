'use client';

import React, { useState, useEffect } from 'react';
import HabitList from './HabitList';
import AddHabitForm from './AddHabitForm';
import HabitStats from './HabitStats';
import { Habit } from './habit';

const gridBackgroundStyle = {
  backgroundColor: 'rgb(255, 219, 112)',
  backgroundImage: `
    linear-gradient(white 1px, transparent 1px),
    linear-gradient(90deg, white 1px, transparent 1px)
  `,
  backgroundSize: '20px 20px',
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
};

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window !== 'undefined') {
      const savedHabits = localStorage.getItem('habits');
      return savedHabits ? JSON.parse(savedHabits) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (newHabit: Omit<Habit, 'id' | 'streak' | 'lastCompleted' | 'completedDates'>) => {
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      description: newHabit.description,
      frequency: newHabit.frequency,
      category: newHabit.category,
      streak: 0,
      lastCompleted: null,
      completedDates: []
    };
    setHabits([...habits, habit]);
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const wasPreviouslyCompleted = habit.completedDates.includes(today);
        let updatedCompletedDates: string[];
        let updatedStreak: number;
        let updatedLastCompleted: string | null;

        if (wasPreviouslyCompleted) {
          updatedCompletedDates = habit.completedDates.filter(date => date !== today);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayString = yesterday.toISOString().split('T')[0];
          updatedStreak = updatedCompletedDates.includes(yesterdayString) ? habit.streak : Math.max(0, habit.streak - 1);
          updatedLastCompleted = updatedCompletedDates.length > 0 ? updatedCompletedDates[updatedCompletedDates.length - 1] : null;
        } else {
          updatedCompletedDates = [...habit.completedDates, today].sort();
          updatedLastCompleted = today;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayString = yesterday.toISOString().split('T')[0];
          updatedStreak = habit.completedDates.includes(yesterdayString) || habit.streak === 0 ? habit.streak + 1 : 1;
        }

        return {
          ...habit,
          completedDates: updatedCompletedDates,
          streak: updatedStreak,
          lastCompleted: updatedLastCompleted
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const editHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  };

  return (
    <div style={gridBackgroundStyle} className="min-h-screen p-4 md:p-8">
      {/* Center line for decoration */}
      <div className="absolute left-1/2 top-32 bottom-12 border-l border-dashed border-white hidden md:block"></div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center pb-2 border-b border-black">
          <h1 className="text-2xl font-bold">HABIT TRACKER</h1>
        </div>
        
        <div className="mt-4 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="border border-black bg-white bg-opacity-50 rounded p-4 mb-6">
              <AddHabitForm onAddHabit={addHabit} />
            </div>
            <div className="border border-black bg-white bg-opacity-50 rounded p-4">
              <HabitList
                habits={habits}
                onToggleHabit={toggleHabit}
                onDeleteHabit={deleteHabit}
                onEditHabit={editHabit}
              />
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="border border-black bg-white bg-opacity-50 rounded p-4">
              <HabitStats habits={habits} />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-black"></div>
      </div>
    </div>
  );
};

export default HabitTracker;
