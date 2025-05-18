'use client';

import React from 'react';
import { Habit } from './habit';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Flame, Award, Calendar, Activity } from 'lucide-react';

interface HabitStatsProps {
  habits: Habit[];
  darkMode?: boolean;
}

const HabitStats: React.FC<HabitStatsProps> = ({ habits, darkMode = false }) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Stats calculations
  const totalHabits = habits.length;
  const habitsCompletedToday = habits.filter(habit => habit.completedDates.includes(today)).length;
  const completionRate = totalHabits > 0 ? Math.round((habitsCompletedToday / totalHabits) * 100) : 0;
  
  // Find habit with highest streak
  const highestStreakHabit = habits.reduce((highest, current) => 
    (current.streak > (highest?.streak || 0)) ? current : highest, null as Habit | null);
    
  // Category distribution data for pie chart
  const categoryData = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = 0;
    }
    acc[habit.category]++;
    return acc;
  }, {} as Record<string, number>);
  
  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  
  // Weekly completion history (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  const completionHistoryData = last7Days.map(date => {
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    const completed = habits.filter(habit => habit.completedDates.includes(date)).length;
    const total = habits.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      date,
      dayName,
      completed,
      total,
      percentage
    };
  });
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
  return (
    <div className={`stats-container ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        Stats & Progress
      </h2>
      
      <div className={`grid grid-cols-2 gap-4 mb-6`}>
        {/* Today's completion */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} mr-3`}>
              <Calendar size={20} className={darkMode ? 'text-blue-200' : 'text-blue-700'} />
            </div>
            <div>
              <h3 className="text-sm font-medium opacity-80">Today</h3>
              <p className="font-semibold text-lg">{habitsCompletedToday}/{totalHabits}</p>
            </div>
          </div>
        </div>
        
        {/* Completion rate */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${darkMode ? 'bg-green-900' : 'bg-green-100'} mr-3`}>
              <Activity size={20} className={darkMode ? 'text-green-200' : 'text-green-700'} />
            </div>
            <div>
              <h3 className="text-sm font-medium opacity-80">Completion</h3>
              <p className="font-semibold text-lg">{completionRate}%</p>
            </div>
          </div>
        </div>
        
        {/* Best streak */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${darkMode ? 'bg-red-900' : 'bg-red-100'} mr-3`}>
              <Flame size={20} className={darkMode ? 'text-red-200' : 'text-red-700'} />
            </div>
            <div>
              <h3 className="text-sm font-medium opacity-80">Best Streak</h3>
              <p className="font-semibold text-lg">
                {highestStreakHabit ? highestStreakHabit.streak : 0}
              </p>
            </div>
          </div>
          {highestStreakHabit && (
            <p className="text-xs mt-1 opacity-70 truncate">
              {highestStreakHabit.name}
            </p>
          )}
        </div>
        
        {/* Total habits */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${darkMode ? 'bg-purple-900' : 'bg-purple-100'} mr-3`}>
              <Award size={20} className={darkMode ? 'text-purple-200' : 'text-purple-700'} />
            </div>
            <div>
              <h3 className="text-sm font-medium opacity-80">Total Habits</h3>
              <p className="font-semibold text-lg">{totalHabits}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Weekly completion chart */}
      {habits.length > 0 && (
        <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <h3 className={`text-base font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Weekly Progress
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionHistoryData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="dayName" 
                  tick={{ fill: darkMode ? '#9ca3af' : '#4b5563' }} 
                />
                <YAxis 
                  tick={{ fill: darkMode ? '#9ca3af' : '#4b5563' }} 
                  domain={[0, 100]}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : 'white',
                    borderColor: darkMode ? '#374151' : '#e5e7eb',
                    color: darkMode ? 'white' : 'black'
                  }}
                  formatter={(value: any) => [`${value}%`, 'Completion']}
                />
                <Bar 
                  dataKey="percentage" 
                  fill={darkMode ? '#3b82f6' : '#60a5fa'} 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      
      
      {habits.length === 0 && (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>No habit data available yet.</p>
          <p>Start by adding some habits!</p>
        </div>
      )}
    </div>
  );
};

export default HabitStats;