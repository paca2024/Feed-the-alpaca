import React from 'react';
import { Trophy, Clock } from 'lucide-react';

interface GameStatsProps {
  score: number;
  health: number;
  timeLeft: number;
}

export default function GameStats({ score, health, timeLeft }: GameStatsProps) {
  return (
    <div className="flex justify-between items-center mb-6 bg-gray-800 p-4 rounded-lg border border-purple-500">
      <div className="flex items-center space-x-2">
        <Trophy className="text-yellow-500" />
        <span className="text-xl font-bold text-white">{score}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="text-purple-400" />
        <span className="text-xl font-bold text-white">{timeLeft}s</span>
      </div>
    </div>
  );
}