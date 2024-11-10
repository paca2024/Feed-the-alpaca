import React, { useState, useEffect } from 'react';
import Alpaca from './Alpaca';
import GameStats from './GameStats';
import HighScores from './HighScores';
import GameControls from './GameControls';
import { Heart } from 'lucide-react';
import { showMainButton, hideMainButton } from '../utils/telegram-config';

interface Score {
  username: string;
  score: number;
  date: string;
}

interface GameProps {
  isTelegramWebApp: boolean;
}

export default function Game({ isTelegramWebApp }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [highScores, setHighScores] = useState<Score[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [alpacaMood, setAlpacaMood] = useState<'happy' | 'neutral' | 'sad'>('happy');
  const [lastFeedTime, setLastFeedTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);

  const username = isTelegramWebApp 
    ? (window.Telegram?.WebApp.initDataUnsafe?.user?.username || 
       window.Telegram?.WebApp.initDataUnsafe?.user?.first_name || 
       'Player')
    : 'Player';

  useEffect(() => {
    const storedCooldown = localStorage.getItem('alpacaCooldown');
    if (storedCooldown) {
      setCooldownEnd(Number(storedCooldown));
    }
  }, []);

  useEffect(() => {
    const storedScores = localStorage.getItem('alpacaHighScores');
    if (storedScores) {
      setHighScores(JSON.parse(storedScores));
    }
  }, []);

  const saveScore = () => {
    const newScore: Score = {
      username,
      score,
      date: new Date().toLocaleDateString()
    };
    const updatedScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    setHighScores(updatedScores);
    localStorage.setItem('alpacaHighScores', JSON.stringify(updatedScores));
  };

  const startGame = () => {
    if (cooldownEnd && Date.now() < cooldownEnd) return;
    
    setIsPlaying(true);
    setScore(0);
    setHealth(100);
    setGameOver(false);
    setAlpacaMood('happy');
    setLastFeedTime(Date.now());
    setTimeLeft(60);
    
    if (isTelegramWebApp) {
      hideMainButton();
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    saveScore();
    setAlpacaMood('sad');
    const newCooldownEnd = Date.now() + (60 * 60 * 1000); // 1 hour
    setCooldownEnd(newCooldownEnd);
    localStorage.setItem('alpacaCooldown', newCooldownEnd.toString());
    
    if (isTelegramWebApp) {
      showMainButton(startGame);
    }
  };

  const handleFeed = (foodType: 'hay') => {
    if (gameOver || timeLeft <= 0) return;
    
    const now = Date.now();
    const timeSinceLastFeed = now - lastFeedTime;
    
    if (timeSinceLastFeed < 100) return;
    
    setLastFeedTime(now);
    setScore(prev => prev + 1);
    setHealth(prev => Math.min(100, prev + 3));
    setAlpacaMood('happy');
    
    setTimeout(() => setAlpacaMood('neutral'), 200);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setHealth(prev => {
        const newHealth = prev - 1;
        if (newHealth <= 0) {
          handleGameOver();
          return 0;
        }
        setAlpacaMood(newHealth > 50 ? 'neutral' : 'sad');
        return newHealth;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isPlaying) {
    const now = Date.now();
    const isOnCooldown = cooldownEnd && now < cooldownEnd;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-4 bg-gradient-to-b from-gray-900 to-purple-900">
        <h1 className="text-3xl font-bold text-purple-400">Feed the Alpaca</h1>
        <p className="text-gray-300 text-center max-w-md text-sm">
          Feed the alpaca with hay! You have 1 minute to get the highest score.
          {!isTelegramWebApp && (
            <span className="block mt-2 text-yellow-400">
              Open in Telegram for the full experience!
            </span>
          )}
        </p>
        {isOnCooldown ? (
          <div className="text-center text-purple-400">
            Come back in {Math.ceil((cooldownEnd - now) / (1000 * 60))} minutes
          </div>
        ) : (
          <button
            onClick={startGame}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            Start Game
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 p-4">
      <div className="max-w-md mx-auto">
        <GameStats score={score} health={health} timeLeft={timeLeft} />

        <div className="bg-gray-800 rounded-xl shadow-xl p-4 mb-4 border border-purple-500">
          <div className="flex flex-col items-center">
            <div className="mb-2 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Heart className={`${health > 50 ? 'text-red-500' : 'text-red-300'} w-4 h-4`} />
                <span className="text-lg font-bold text-white">{health}%</span>
              </div>
            </div>
            <Alpaca 
              mood={alpacaMood} 
              onClick={() => {}}
              disabled={gameOver}
            />
            <GameControls 
              onFeed={handleFeed}
              disabled={gameOver}
            />
          </div>
        </div>

        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-6 rounded-xl max-w-xs w-full border border-purple-500">
              <h2 className="text-xl font-bold text-center mb-3 text-purple-400">Game Over!</h2>
              <p className="text-center mb-3 text-white">Final Score: {score}</p>
              <p className="text-center mb-3 text-purple-300 text-sm">Come back in 1 hour to play again!</p>
            </div>
          </div>
        )}

        <HighScores scores={highScores} />
      </div>
    </div>
  );
}