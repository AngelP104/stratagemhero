import { useState } from 'react';
import { Game } from './Game';

import useSound from 'use-sound';
import loopSong from '../sounds/loop.mp3';

export const Menu = () => {
  const [showMenu, setShowMenu] = useState(true);
  const [playMusic, { stop }] = useSound(loopSong, {loop: true, volume: 0.5});

  const startGame = () => {
    setShowMenu(false);
    playMusic();
    //console.log("Game started");
  }

  return (
    <>
      <main className='bg-neutral-900 text-white min-h-screen flex flex-col justify-center items-center w-full'>
        {showMenu ? (
          <>
            <div className=''>
              <h1 className='text-5xl'>Stratagem Hero</h1>
              <div>
                <p className='text-xl'>Press start!</p>
                <button onClick={startGame} className='font-bold text-2xl border-2 p-2 mt-2 hover:bg-neutral-700 hover:border-yellow-300'>Start game</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Game showMenu={setShowMenu} music={stop} />
          </>
        )}
      </main>
    </>
  )
}
