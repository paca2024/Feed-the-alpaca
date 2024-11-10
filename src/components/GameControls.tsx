import React from 'react';
import { Wheat } from 'lucide-react';

interface GameControlsProps {
  onFeed: (foodType: 'hay') => void;
  disabled: boolean;
}

export default function GameControls({ onFeed, disabled }: GameControlsProps) {
  return (
    <div className="flex justify-center">
      <button
        onClick={() => onFeed('hay')}
        disabled={disabled}
        className="flex items-center space-x-2 bg-yellow-500 text-white px-8 py-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        <Wheat className="w-6 h-6" />
        <span>Feed Hay</span>
      </button>
    </div>
  );
}