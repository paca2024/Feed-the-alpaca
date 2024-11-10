import React from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';

interface Score {
  username: string;
  score: number;
  date: string;
}

interface HighScoresProps {
  scores: Score[];
}

export default function HighScores({ scores }: HighScoresProps) {
  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Trophy className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-purple-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-400">Leaderboard</h2>
        <div className="text-sm text-purple-300">
          {scores.length} {scores.length === 1 ? 'Player' : 'Players'}
        </div>
      </div>
      
      <div className="space-y-3">
        {scores.map((score, index) => (
          <div 
            key={index}
            className={`
              flex justify-between items-center p-3
              ${index < 3 ? 'bg-gray-700/80' : 'bg-gray-700/40'}
              rounded-lg border
              ${index === 0 ? 'border-yellow-400/30' : 
                index === 1 ? 'border-gray-300/30' : 
                index === 2 ? 'border-amber-600/30' : 'border-purple-400/20'}
              transform transition-all duration-300
              hover:scale-102 hover:bg-gray-700/90
            `}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 flex justify-center">
                {getMedalIcon(index)}
              </div>
              <div className="flex flex-col">
                <span className={`
                  font-medium
                  ${index === 0 ? 'text-yellow-400' : 
                    index === 1 ? 'text-gray-300' : 
                    index === 2 ? 'text-amber-600' : 'text-white'}
                `}>
                  {score.username}
                </span>
                <span className="text-xs text-gray-400">{score.date}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-purple-400">{score.score}</span>
              <span className="text-xs text-gray-400">pts</span>
            </div>
          </div>
        ))}
        {scores.length === 0 && (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-purple-400/30 mx-auto mb-3" />
            <p className="text-gray-400">No scores yet!</p>
            <p className="text-sm text-gray-500">Be the first to play</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-purple-500/20">
        <p className="text-sm text-center text-purple-300">
          Play through Telegram to compete!
        </p>
      </div>
    </div>
  );
}