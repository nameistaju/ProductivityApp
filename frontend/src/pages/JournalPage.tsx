"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Save, Printer, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface JournalEntry {
  id: string;
  date: string;
  morningGratitude: string[];
  eveningGratitude: string[];
  thoughts: string;
  tomorrow: string;
  tags: string[];
}

const JournalPage: React.FC = () => {
  // Get the current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).toUpperCase();
  
  const todayISODate = today.toISOString().split('T')[0];
  
  // State management
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    id: Date.now().toString(),
    date: todayISODate,
    morningGratitude: ['', '', ''],
    eveningGratitude: ['', '', ''],
    thoughts: '',
    tomorrow: '',
    tags: []
  });
  const [selectedDate, setSelectedDate] = useState<string>(todayISODate);
  const [tagInput, setTagInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);

  // Load entries from local storage
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      setEntries(parsedEntries);
      
      // Check if there's an entry for today
      const todayEntry = parsedEntries.find((entry: JournalEntry) => entry.date === todayISODate);
      
      if (todayEntry) {
        setCurrentEntry(todayEntry);
        setSelectedDate(todayISODate);
      }
    }
  }, []);

  // Save entries to local storage
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  // Filter entries based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEntries([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = entries.filter(entry => 
      entry.thoughts.toLowerCase().includes(query) || 
      entry.tomorrow.toLowerCase().includes(query) ||
      entry.morningGratitude.some(item => item.toLowerCase().includes(query)) ||
      entry.eveningGratitude.some(item => item.toLowerCase().includes(query)) ||
      entry.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    setFilteredEntries(filtered);
  }, [searchQuery, entries]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    
    // Check if there's an entry for this date
    const existingEntry = entries.find(entry => entry.date === newDate);
    
    if (existingEntry) {
      setCurrentEntry(existingEntry);
    } else {
      setCurrentEntry({
        id: Date.now().toString(),
        date: newDate,
        morningGratitude: ['', '', ''],
        eveningGratitude: ['', '', ''],
        thoughts: '',
        tomorrow: '',
        tags: []
      });
    }
  };

  // Handle gratitude changes
  const handleMorningGratitudeChange = (index: number, value: string) => {
    const newGratitude = [...currentEntry.morningGratitude];
    newGratitude[index] = value;
    setCurrentEntry({
      ...currentEntry,
      morningGratitude: newGratitude
    });
  };
  
  const handleEveningGratitudeChange = (index: number, value: string) => {
    const newGratitude = [...currentEntry.eveningGratitude];
    newGratitude[index] = value;
    setCurrentEntry({
      ...currentEntry,
      eveningGratitude: newGratitude
    });
  };

  const handleThoughtsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentEntry({
      ...currentEntry,
      thoughts: e.target.value
    });
  };

  const handleTomorrowChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentEntry({
      ...currentEntry,
      tomorrow: e.target.value
    });
  };

  const handleTagsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    
    const newTags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    setCurrentEntry({
      ...currentEntry,
      tags: [...new Set([...currentEntry.tags, ...newTags])]
    });
    
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentEntry({
      ...currentEntry,
      tags: currentEntry.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const saveEntry = () => {
    const hasContent = 
      currentEntry.thoughts.trim() || 
      currentEntry.tomorrow.trim() || 
      currentEntry.morningGratitude.some(item => item.trim()) ||
      currentEntry.eveningGratitude.some(item => item.trim());
      
    if (!hasContent) {
      toast.error("Entry cannot be completely empty!");
      return;
    }

    const entryToSave = { 
      ...currentEntry, 
      id: currentEntry.id || Date.now().toString() 
    };
    
    const existingIndex = entries.findIndex(entry => entry.date === currentEntry.date);
    
    if (existingIndex >= 0) {
      // Update existing entry
      const updatedEntries = [...entries];
      updatedEntries[existingIndex] = entryToSave;
      setEntries(updatedEntries);
    } else {
      // Add new entry
      setEntries([...entries, entryToSave]);
    }
    
    toast.success('Journal entry saved!');
  };

  const loadEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setSelectedDate(entry.date);
    setSearchQuery('');
  };

  // Clear journal entries
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear this entry?')) {
      setCurrentEntry({
        ...currentEntry,
        morningGratitude: ['', '', ''],
        eveningGratitude: ['', '', ''],
        thoughts: '',
        tomorrow: '',
        tags: []
      });
    }
  };
  
  // Print journal
  const handlePrint = () => {
    window.print();
  };
  
  // Grid background style
  const gridBackgroundStyle = {
    backgroundColor: '#FFDB70',
    backgroundImage: `
      linear-gradient(white 1px, transparent 1px),
      linear-gradient(90deg, white 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    position: 'relative' as const,
  };

  return (
    <div style={gridBackgroundStyle} className="min-h-screen p-4 md:p-8">
      {/* Center line */}
      <div className="absolute left-1/2 top-32 bottom-12 border-l border-dashed border-white hidden md:block"></div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Journal header */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-2 border-b border-black">
          <h1 className="text-2xl font-bold">DAILY JOURNAL</h1>
          <div className="flex items-center mt-2 md:mt-0">
            <div className="flex items-center mr-4">
              <Calendar className="h-4 w-4 mr-2" />
              <input 
                type="date" 
                value={selectedDate} 
                onChange={handleDateChange}
                className="bg-white bg-opacity-70 px-2 py-1 text-xs rounded focus:outline-none"
              />
            </div>
            <button 
              onClick={handleClear}
              className="bg-white bg-opacity-70 px-3 py-1 text-xs rounded mr-2 hover:bg-opacity-100 flex items-center"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </button>
            <button
              onClick={handlePrint}
              className="bg-white bg-opacity-70 px-3 py-1 text-xs rounded mr-2 hover:bg-opacity-100 flex items-center"
            >
              <Printer className="h-3 w-3 mr-1" />
              Print
            </button>
            <button
              onClick={saveEntry}
              className="bg-white bg-opacity-70 px-3 py-1 text-xs rounded hover:bg-opacity-100 flex items-center"
            >
              <Save className="h-3 w-3 mr-1" />
              Save
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          {/* Left sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <div className="border border-black bg-white bg-opacity-50 rounded p-3">
              <h2 className="font-medium text-sm mb-2">Search Entries</h2>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search journal..."
                className="w-full bg-transparent border-b border-gray-400 focus:outline-none text-sm p-1"
              />
              
              {filteredEntries.length > 0 && (
                <div className="mt-3 max-h-60 overflow-y-auto">
                  <h3 className="text-xs font-medium mb-2 text-gray-600">Results</h3>
                  {filteredEntries.map(entry => (
                    <button
                      key={entry.id}
                      onClick={() => loadEntry(entry)}
                      className="w-full text-left p-1 hover:bg-white hover:bg-opacity-50 rounded mb-1 block text-sm"
                    >
                      <span className="font-medium text-xs">{new Date(entry.date).toLocaleDateString()}</span>
                      <p className="text-xs text-gray-600 truncate">
                        {entry.thoughts.substring(0, 40) || entry.morningGratitude[0] || "Empty entry"}...
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border border-black bg-white bg-opacity-50 rounded p-3 print:hidden">
              <h3 className="text-xs font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {currentEntry.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-white bg-opacity-70 px-2 py-0.5 rounded-md text-xs flex items-center"
                  >
                    {tag}
                    <button 
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              <form onSubmit={handleTagsSubmit} className="flex">
                <input 
                  type="text" 
                  placeholder="Add tags (comma separated)" 
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  className="flex-1 bg-transparent border-b border-gray-400 focus:outline-none text-xs p-1"
                />
                <button 
                  type="submit" 
                  className="ml-1 bg-white bg-opacity-70 px-2 py-0.5 text-xs rounded hover:bg-opacity-100"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Morning Gratitude */}
              <div className="border border-black bg-white bg-opacity-50 rounded">
                <div className="border-b border-black py-1">
                  <h2 className="text-center text-sm">MORNING GRATITUDE</h2>
                </div>
                <div className="p-4">
                  {[0, 1, 2].map((index) => (
                    <div key={`morning-${index}`} className="mb-4">
                      <div className="flex">
                        <span className="mr-2">{index + 1}</span>
                        <input
                          type="text"
                          className="w-full bg-transparent border-b border-gray-400 focus:outline-none pb-1"
                          value={currentEntry.morningGratitude[index] || ''}
                          onChange={(e) => handleMorningGratitudeChange(index, e.target.value)}
                          placeholder="I am grateful for..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
                    
              {/* Thoughts */}
              <div className="border border-black bg-white bg-opacity-50 rounded">
                <div className="border-b border-black py-1">
                  <h2 className="text-center text-sm">THOUGHTS</h2>
                </div>
                <div className="p-4">
                  <textarea
                    className="w-full h-40 bg-transparent focus:outline-none resize-none"
                    style={{
                      backgroundImage: 'linear-gradient(#d0d0d0 1px, transparent 1px)',
                      backgroundSize: '100% 20px',
                      lineHeight: '20px',
                      padding: '0',
                    }}
                    value={currentEntry.thoughts}
                    onChange={handleThoughtsChange}
                    placeholder="Write your thoughts here..."
                  ></textarea>
                </div>
              </div>

              {/* Evening Gratitude */}
              <div className="border border-black bg-white bg-opacity-50 rounded">
                <div className="border-b border-black py-1">
                  <h2 className="text-center text-sm">EVENING GRATITUDE</h2>
                </div>
                <div className="p-4">
                  {[0, 1, 2].map((index) => (
                    <div key={`evening-${index}`} className="mb-4">
                      <div className="flex">
                        <span className="mr-2">{index + 1}</span>
                        <input
                          type="text"
                          className="w-full bg-transparent border-b border-gray-400 focus:outline-none pb-1"
                          value={currentEntry.eveningGratitude[index] || ''}
                          onChange={(e) => handleEveningGratitudeChange(index, e.target.value)}
                          placeholder="Today I appreciated..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Make Tomorrow Better */}
              <div className="border border-black bg-white bg-opacity-50 rounded">
                <div className="border-b border-black py-1">
                  <h2 className="text-center text-sm">HOW CAN YOU MAKE TOMORROW BETTER</h2>
                </div>
                <div className="p-4">
                  <textarea
                    className="w-full h-40 bg-transparent focus:outline-none resize-none"
                    style={{
                      backgroundImage: 'linear-gradient(#d0d0d0 1px, transparent 1px)',
                      backgroundSize: '100% 20px',
                      lineHeight: '20px',
                      padding: '0'
                    }}
                    value={currentEntry.tomorrow}
                    onChange={handleTomorrowChange}
                    placeholder="Tomorrow I will..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom border */}
        <div className="mt-8 border-t border-black"></div>
      </div>
    </div>
  );
};

export default JournalPage;