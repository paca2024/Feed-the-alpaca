import React from 'react';

interface AlpacaProps {
  mood: 'happy' | 'neutral' | 'sad';
  onClick: () => void;
  disabled: boolean;
}

export default function Alpaca({ mood, onClick, disabled }: AlpacaProps) {
  const alpacaImages = {
    happy: "https://images.unsplash.com/photo-1652186757197-3e3a6ec45f6d?auto=format&fit=crop&w=800&q=80",
    neutral: "https://images.unsplash.com/photo-1652186756729-d1e3b4831f78?auto=format&fit=crop&w=800&q=80",
    sad: "https://images.unsplash.com/photo-1627869925066-e63cd4e3c01f?auto=format&fit=crop&w=800&q=80"
  };

  return (
    <div 
      className={`
        relative cursor-pointer select-none
        transition-all duration-300
        ${disabled ? 'opacity-50' : 'hover:scale-105'}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      <div 
        className={`
          rounded-2xl overflow-hidden
          border-4 border-purple-500/30
          shadow-xl
          transition-all duration-300 transform
          ${mood === 'happy' ? 'scale-110' : 'scale-100'}
          ${!disabled && 'active:scale-95'}
        `}
      >
        <img 
          src={alpacaImages[mood]} 
          alt={`Alpaca feeling ${mood}`} 
          className="w-64 h-64 object-cover"
          draggable="false"
        />
      </div>
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800/90 px-4 py-1 rounded-full border border-purple-500/30">
        <span className="text-sm font-medium text-purple-300 capitalize">{mood}</span>
      </div>
    </div>
  );
}