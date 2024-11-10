import React from 'react';
import Game from './components/Game';

interface AppProps {
  isTelegramWebApp: boolean;
}

function App({ isTelegramWebApp }: AppProps) {
  return <Game isTelegramWebApp={isTelegramWebApp} />;
}

export default App;