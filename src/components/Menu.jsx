import { useState } from 'react';
import { Game } from './Game';

export const Menu = () => {
  const [showMenu, setShowMenu] = useState(true);

  const startGame = () => {
    setShowMenu(false);
    //console.log("Game started");
  }

  return (
    <>
      <main className='bg-neutral-900 text-white min-h-screen flex flex-col justify-center items-center w-full'>
        {showMenu ? (
          <>
            <div className=''>
              <h1>Stratagem Hero</h1>
              <div>
                <p>Press start to begin</p>
                <button onClick={startGame} className='font-bold text-2xl border-2 p-2 mt-2 hover:bg-neutral-700'>Start game</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Game showMenu={setShowMenu} />
          </>
        )}
      </main>
    </>
  )
}
