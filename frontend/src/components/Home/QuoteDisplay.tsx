import React, { useState, useEffect } from 'react';

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Productivity is never an accident. It is always the result of a commitment to excellence.", author: "Paul J. Meyer" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", author: "Steve Jobs" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Do the hard jobs first. The easy jobs will take care of themselves.", author: "Dale Carnegie" },
  { text: "Don't judge each day by the harvest you reap but by the seeds that you plant.", author: "Robert Louis Stevenson" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "If you spend too much time thinking about a thing, you'll never get it done.", author: "Bruce Lee" },
  { text: "You will never plough a field if you only turn it over in your mind.", author: "Irish Proverb" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The most difficult thing is the decision to act, the rest is merely tenacity.", author: "Amelia Earhart" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  { text: "Your talent determines what you can do. Your motivation determines how much you're willing to do. Your attitude determines how well you do it.", author: "Lou Holtz" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Either you run the day, or the day runs you.", author: "Jim Rohn" },
  { text: "Success is liking yourself, liking what you do, and liking how you do it.", author: "Maya Angelou" },
  { text: "If you want to make an easy job seem mighty hard, just keep putting off doing it.", author: "Olin Miller" },
  { text: "If you're going through hell, keep going.", author: "Winston Churchill" },
  { text: "Without hard work, nothing grows but weeds.", author: "Gordon B. Hinckley" },
  { text: "Things may come to those who wait, but only the things left by those who hustle.", author: "Abraham Lincoln" },
  { text: "The question isn't who is going to let me; it's who is going to stop me.", author: "Ayn Rand" },
  { text: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupéry" },
  { text: "Small deeds done are better than great deeds planned.", author: "Peter Marshall" },
  { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
  { text: "Opportunity is missed by most people because it is dressed in overalls and looks like work.", author: "Thomas Edison" },
  { text: "Productivity is being able to do things that you were never able to do before.", author: "Franz Kafka" },
  { text: "Until we can manage time, we can manage nothing else.", author: "Peter Drucker" },
  { text: "Nothing is less productive than to make more efficient what should not be done at all.", author: "Peter Drucker" },
  { text: "Never mistake motion for action.", author: "Ernest Hemingway" },
  { text: "Work expands so as to fill the time available for its completion.", author: "Parkinson's Law" },
  { text: "The beginning is the most important part of the work.", author: "Plato" },
  { text: "Simplicity boils down to two steps: Identify the essential. Eliminate the rest.", author: "Leo Babauta" },
  { text: "Do the best you can until you know better. Then when you know better, do better.", author: "Maya Angelou" },
  { text: "You've got to get up every morning with determination if you're going to go to bed with satisfaction.", author: "George Lorimer" },
  { text: "Start by doing what's necessary; then do what's possible; and suddenly you are doing the impossible.", author: "Francis of Assisi" },
  { text: "It is not enough to be busy. The question is: what are we busy about?", author: "Henry David Thoreau" },
  { text: "Don't be fooled by the calendar. There are only as many days in the year as you make use of.", author: "Charles Richards" },
  { text: "The path to success is to take massive, determined action.", author: "Tony Robbins" }

];

const QuoteDisplay: React.FC = () => {
  const [quote, setQuote] = useState<{ text: string; author: string }>({ text: '', author: '' });

  useEffect(() => {
    // Get today's date to keep the quote consistent throughout the day
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = seed % quotes.length;
    setQuote(quotes[index]);
  }, []);

  if (!quote.text) return null;

  return (
    <div className="bg-pastel-yellow p-5 rounded-lg shadow-md mb-8 animate-scale-in">
      <p className="text-gray-700 italic mb-2">{quote.text}</p>
      <p className="text-right text-sm text-gray-600">— {quote.author}</p>
    </div>
  );
};

export default QuoteDisplay;
