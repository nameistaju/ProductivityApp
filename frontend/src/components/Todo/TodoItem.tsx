
import React, { useState } from 'react';
import { Calendar, Edit, Trash2, Check } from 'lucide-react';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
}

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  const priorityColors = {
    low: 'bg-pastel-green',
    medium: 'bg-pastel-yellow',
    high: 'bg-pastel-pink'
  };

  return (
    <div 
      className={`card flex flex-col sm:flex-row sm:items-center justify-between p-4 mb-3 ${todo.completed ? 'bg-pastel-gray/50' : 'bg-white'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start sm:items-center flex-1">
        <button 
          onClick={() => onToggleComplete(todo.id)}
          className={`p-2 rounded-full mr-3 transition-colors ${todo.completed ? 'bg-pastel-green' : 'bg-pastel-gray hover:bg-pastel-blue'}`}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {todo.completed && <Check className="h-4 w-4 text-green-700" />}
        </button>
        
        <div className="flex-1">
          <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {todo.title}
          </h3>
          
          <div className="flex flex-wrap gap-2 mt-2 items-center">
            <span className={`text-xs px-2 py-1 rounded-md ${priorityColors[todo.priority]}`}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </span>
            
            {todo.dueDate && (
              <span className="text-xs flex items-center bg-pastel-blue px-2 py-1 rounded-md">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
            
            {todo.tags && todo.tags.map(tag => (
              <span key={tag} className="text-xs bg-pastel-purple px-2 py-1 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className={`flex mt-3 sm:mt-0 ${isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-30'} transition-opacity`}>
        <button 
          onClick={() => onEdit(todo)}
          className="p-2 text-blue-500 hover:bg-pastel-blue rounded-md"
          aria-label="Edit task"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button 
          onClick={() => onDelete(todo.id)}
          className="p-2 text-red-500 hover:bg-pastel-pink rounded-md ml-1"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
