import stratagems from '../data/stratagems.json';
import { useState } from 'react';

export const StratagemSidebar = ({ filteredCode }) => {

  const [availableStratagems, setAvailableStratagems] = useState(
    [...stratagems].sort((a, b) => a.name.localeCompare(b.name))
  ); // todas las estratagemas disponibles

  const getArrowSymbol = (direction) => {
    switch (direction) {
      case 'w': return 'fa-sharp fa-solid fa-up';
      case 's': return 'fa-sharp fa-solid fa-down';
      case 'd': return 'fa-sharp fa-solid fa-right';
      case 'a': return 'fa-sharp fa-solid fa-left';
      default: return direction;
    }
  }

  const filteredStratagems = availableStratagems.filter(s =>
    s.code.startsWith(filteredCode)
  );

  return (
    <div className="max-h-screen overflow-y-auto text-white bg-black/30">
      {filteredStratagems.map(stratagem => {
        return (
          <div className='flex m-1' key={stratagem.id}>
            <img
              src={`/stratagem_icons/${stratagem.name}.svg`}
              alt={stratagem.name}
              width="40px"
              draggable="false"
              className='border-2 border-yellow-400'
            />

            <div className='m-2'>
              <p className='text-xs'>{stratagem.name}</p>

              <div className='flex gap-1'>
                {[...stratagem.code].map((dir, i) => {
                  return (
                    <i key={i} className={getArrowSymbol(dir)}></i>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
