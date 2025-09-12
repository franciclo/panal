'use client';

import { useState, useEffect } from 'react';

// Generate 400 random numbers between 1 and 100
const generateNumbers = () => {
  return Array.from({ length: 400 }, () => Math.floor(Math.random() * 100) + 1);
};

export default function Home() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const globalNumber = 50; // Fixed global number

  useEffect(() => {
    setNumbers(generateNumbers());
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Grid Container */}
      <div className="w-full h-screen overflow-hidden">
        <div 
          className="grid h-full w-full"
          style={{
            gridTemplateColumns: 'repeat(20, 1fr)',
            gridTemplateRows: 'repeat(20, 1fr)'
          }}
        >
          {numbers.map((number, index) => (
            <div
              key={index}
              className={`
                ${number > globalNumber 
                  ? 'bg-blue-500' 
                  : 'bg-white'
                }
                transition-colors duration-200 hover:scale-105 cursor-pointer
              `}
              title={`Box ${index + 1}: ${number}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
