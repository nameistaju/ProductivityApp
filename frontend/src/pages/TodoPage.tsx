'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit, Calendar, Tag } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
}

export default function EnhancedTodo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    // Load todos from localStorage
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    // Save todos to localStorage
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodo.trim()) return;
    
    const todoToAdd: Todo = {
      id: editingTodo ? editingTodo.id : Date.now().toString(),
      title: newTodo,
      completed: editingTodo ? editingTodo.completed : false,
      priority,
      dueDate: dueDate || undefined,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    };
    
    if (editingTodo) {
      setTodos(todos.map(todo => (todo.id === editingTodo.id ? todoToAdd : todo)));
    } else {
      setTodos([todoToAdd, ...todos]);
    }
    
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setNewTodo('');
    setPriority('medium');
    setDueDate('');
    setTags('');
    setEditingTodo(null);
    setIsDialogOpen(false);
  };
  
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const editTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.title);
    setPriority(todo.priority);
    setDueDate(todo.dueDate || '');
    setTags(todo.tags?.join(', ') || '');
    setIsDialogOpen(true);
  };

  const openNewTodoDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'border-red-400';
      case 'medium': return 'border-yellow-400';
      case 'low': return 'border-green-400';
      default: return 'border-yellow-400';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" 
      style={{
        backgroundColor: '#FFDB70',
        backgroundImage: `
          linear-gradient(white 1px, transparent 1px),
          linear-gradient(90deg, white 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        position: 'relative',
      }}>
      
      <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg border border-yellow-300">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4 text-center">My Tasks</h1>
        
        <div className="flex justify-end mb-4">
          <button 
            onClick={openNewTodoDialog}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2 shadow-sm transition-colors"
            aria-label="Add new task"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
        
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No tasks yet. Add your first task!</p>
        ) : (
          <ul className="space-y-3">
            {todos
              .sort((a, b) => {
                // Sort by completion status then by priority
                if (a.completed !== b.completed) return a.completed ? 1 : -1;
                
                const priorityValue = { high: 3, medium: 2, low: 1 };
                return priorityValue[b.priority] - priorityValue[a.priority];
              })
              .map(todo => (
                <li 
                  key={todo.id} 
                  className={`flex justify-between items-center p-3 bg-yellow-50 rounded-lg border-l-4 ${getPriorityColor(todo.priority)} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                        todo.completed 
                          ? "bg-green-500 border-green-500 text-white" 
                          : "border-gray-300"
                      }`}
                      aria-label={`${todo.completed ? "Mark as incomplete" : "Mark as complete"}: ${todo.title}`}
                    >
                      {todo.completed && <Check className="h-3 w-3" />}
                    </button>
                    
                    <div className="flex flex-col">
                      <span className={todo.completed ? "line-through text-gray-400" : "text-gray-700"}>
                        {todo.title}
                      </span>
                      
                      <div className="flex flex-wrap gap-2 mt-1">
                        {todo.dueDate && (
                          <div className="flex items-center text-xs text-gray-500 gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {todo.tags && todo.tags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {todo.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => editTodo(todo)}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      aria-label={`Edit task: ${todo.title}`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={`Delete task: ${todo.title}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
        
        {todos.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-right">
            {todos.filter(t => t.completed).length} of {todos.length} completed
          </div>
        )}
      </div>

      {/* Task Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-yellow-600">
                {editingTodo ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={addTodo} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="w-full p-3 border-2 border-yellow-200 rounded focus:outline-none focus:border-yellow-400"
                  placeholder="What needs to be done?"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full p-3 border-2 border-yellow-200 rounded focus:outline-none focus:border-yellow-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date (Optional)
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-3 border-2 border-yellow-200 rounded focus:outline-none focus:border-yellow-400"
                />
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (Optional, comma separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-3 border-2 border-yellow-200 rounded focus:outline-none focus:border-yellow-400"
                  placeholder="work, personal, urgent"
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                >
                  {editingTodo ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}