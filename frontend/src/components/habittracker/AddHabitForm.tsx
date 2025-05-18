'use client';

import React, { useState } from 'react';
import { Habit } from './habit';
import { Plus } from 'lucide-react';

interface AddHabitFormProps {
  onAddHabit: (habit: Omit<Habit, 'id' | 'streak' | 'lastCompleted' | 'completedDates'>) => void;
  darkMode?: boolean;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onAddHabit, darkMode = false }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    category: 'General'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Habit name is required');
      return;
    }
    
    onAddHabit(formData);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      frequency: 'daily',
      category: 'General'
    });
    
    setIsFormOpen(false);
  };

  return (
    <div className={`mb-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      {!isFormOpen ? (
        <button
          onClick={() => setIsFormOpen(true)}
          className={`w-full p-4 text-left flex items-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded-lg transition-colors`}
        >
          <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-blue-700' : 'bg-blue-600'} flex items-center justify-center mr-3`}>
            <Plus size={20} className="text-white" />
          </div>
          <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Add a new habit</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-4">
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Add New Habit</h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Habit Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Morning Meditation"
                className={`w-full px-3 py-2 rounded-md border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 placeholder-gray-400'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Why is this habit important to you?"
                className={`w-full px-3 py-2 rounded-md border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 placeholder-gray-400'
                }`}
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Frequency
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Health, Work, etc."
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 placeholder-gray-400'
                  }`}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className={`px-4 py-2 rounded-md ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Habit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddHabitForm;