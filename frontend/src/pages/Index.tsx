'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import QuoteDisplay from '../components/Home/QuoteDisplay';
import PixelCat from '../components/UI/PixelCat';

const gridBackgroundStyle = {
  backgroundColor: 'rgb(255, 219, 112)', // Updated to specified RGB color
  backgroundImage: `
    linear-gradient(white 1px, transparent 1px),
    linear-gradient(90deg, white 1px, transparent 1px)
  `,
  backgroundSize: '20px 20px',
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
};

const Index: React.FC = () => {
  const tools = [
    {
      path: "/todo",
      title: "To-Do List",
      description: "Organize tasks with priorities and due dates",
      bgColor: "bg-blue-100",
      hoverBorder: "hover:border-blue-500",
      emoji: "✅"
    },
    {
      path: "/pomodoro",
      title: "Pomodoro Timer",
      description: "Focus with cute pixel cat companions",
      bgColor: "bg-pink-100",
      hoverBorder: "hover:border-pink-500",
      emoji: "⏱️"
    },
    {
      path: "/journal",
      title: "Journal",
      description: "Document your thoughts and ideas",
      bgColor: "bg-green-100",
      hoverBorder: "hover:border-green-500",
      emoji: "📓"
    },
    {
      path: "/habits",
      title: "Habit Tracker",
      description: "Build consistency with visual progress",
      bgColor: "bg-purple-100",
      hoverBorder: "hover:border-purple-500",
      emoji: "📊"
    },
  ];

  return (
    <div style={gridBackgroundStyle} className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center text-primary mb-6">
          Welcome to PixelProd
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
          Your cozy productivity companion with cute pixel cats to help you stay focused and organized!
        </p>
        
        <div className="flex justify-center mb-8">
          <PixelCat state="sitting" size="lg" />
        </div>
        
        <div className="mb-10 max-w-2xl mx-auto">
          <QuoteDisplay />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <Link
              key={index}
              to={tool.path}
              className={`p-6 bg-white/90 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 
                         hover:-translate-y-1 flex flex-col items-start space-y-2 border border-transparent ${tool.hoverBorder}`}
            >
              <div className={`w-12 h-12 ${tool.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                <span className="text-2xl">{tool.emoji}</span>
              </div>
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-primary">{tool.title}</h2>
              </div>
              <p className="text-gray-600">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;