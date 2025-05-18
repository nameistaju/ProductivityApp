'use client';

import React, { useState } from 'react';
import { Habit } from './habit';
import { Pencil, Trash2, Check, X } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onEditHabit: (id: string, updates: Partial<Habit>) => void;
  darkMode?: boolean;
}

const HabitList: React.FC<HabitListProps> = ({ 
  habits, 
  onToggleHabit, 
  onDeleteHabit, 
  onEditHabit,
  darkMode = false 
}) => {
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Habit>>({});

  const today = new Date().toISOString().split('T')[0];

  const startEditing = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setEditForm({
      name: habit.name,
      description: habit.description,
      frequency: habit.frequency,
      category: habit.category
    });
  };

  const cancelEditing = () => {
    setEditingHabitId(null);
    setEditForm({});
  };

  const saveEditing = (id: string) => {
    onEditHabit(id, editForm);
    setEditingHabitId(null);
    setEditForm({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  // Group habits by category
  const habitsByCategory: Record<string, Habit[]> = {};
  habits.forEach(habit => {
    if (!habitsByCategory[habit.category]) {
      habitsByCategory[habit.category] = [];
    }
    habitsByCategory[habit.category].push(habit);
  });

  if (habits.length === 0) {
    return (
      <div className={`text-center py-8 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
        <p className="text-lg">You haven't added any habits yet.</p>
        <p>Use the form above to create your first habit!</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        Your Habits
      </h2>
      
      {Object.entries(habitsByCategory).map(([category, categoryHabits]) => (
        <div key={category} className="mb-6">
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {category}
          </h3>
          <div className={`rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white border'}`}>
            {categoryHabits.map(habit => (
              <div key={habit.id} className={`p-4 ${darkMode ? 'border-gray-600' : 'border-gray-100'} border-b last:border-b-0`}>
                {editingHabitId === habit.id ? (
                  <div className="edit-form">
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name || ''}
                          onChange={handleInputChange}
                          className={`mt-1 w-full rounded-md ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border px-3 py-2`}
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={editForm.description || ''}
                          onChange={handleInputChange}
                          className={`mt-1 w-full rounded-md ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border px-3 py-2`}
                          rows={2}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Frequency
                          </label>
                          <select
                            name="frequency"
                            value={editForm.frequency || ''}
                            onChange={handleInputChange}
                            className={`mt-1 w-full rounded-md ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border px-3 py-2`}
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Category
                          </label>
                          <input
                            type="text"
                            name="category"
                            value={editForm.category || ''}
                            onChange={handleInputChange}
                            className={`mt-1 w-full rounded-md ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border px-3 py-2`}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-3">
                        <button
                          onClick={cancelEditing}
                          className={`p-2 rounded-md ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                          <X size={16} />
                        </button>
                        <button
                          onClick={() => saveEditing(habit.id)}
                          className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => onToggleHabit(habit.id)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                            habit.completedDates.includes(today)
                              ? 'bg-green-500 text-white'
                              : darkMode
                              ? 'border-2 border-gray-400'
                              : 'border-2 border-gray-300'
                          }`}
                        >
                          {habit.completedDates.includes(today) && <Check size={14} />}
                        </button>
                        <div>
                          <h3 className={`font-medium ${habit.completedDates.includes(today) ? 'line-through opacity-70' : ''}`}>
                            {habit.name}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {habit.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {habit.frequency}
                        </span>
                        <span className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                          darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {habit.streak} streak
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-3 space-x-2">
                      <button
                        onClick={() => startEditing(habit)}
                        className={`p-2 rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteHabit(habit.id)}
                        className={`p-2 rounded-md ${darkMode ? 'text-red-300 hover:bg-red-900' : 'text-red-600 hover:bg-red-100'}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HabitList;