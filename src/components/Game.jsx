import { useEffect, useState } from "react";
import stratagems from '../data/stratagems.json';
import { InputArrows } from "./InputArrows";

export const Game = ({ showMenu }) => {
  const [availableStratagems, setAvailableStratagems] = useState(stratagems); // todas las estratagemas disponibles
  const [currentStratagems, setCurrentStratagems] = useState([]); // lista de estratagemas de esta ronda
  const [roundNumber, setRoundNumber] = useState(1); // num ronda

  const stratagemCountInList = 8; //*num de estratagemas por ronda

  const timer = 10; //en segundos

  //TODO: hacer que cuando se pase la ronda aumente el tiempo, sin que se pase del cap de variable "timer"

  // Nueva ronda de estratagemas
  const newRound = () => {
    const tempStratagems = [...availableStratagems];
    const selectedStratagems = [];

    // Se eligen de forma aleatoria
    for (let i = 0; i < stratagemCountInList; i++) {
      if (tempStratagems.length === 0) break;

      const randomIndex = Math.floor(Math.random() * tempStratagems.length);
      selectedStratagems.push(tempStratagems[randomIndex]);
      tempStratagems.splice(randomIndex, 1);
    }

    setCurrentStratagems(selectedStratagems);
  }

  const onCompletedStratagem = () => {
    // Remover la estratagema actual
    setCurrentStratagems(prev => {
      const remaining = prev.slice(1);
      // Si no quedan estratagemas, iniciar nueva ronda
      if (remaining.length === 0) {
        setRoundNumber(prev => prev + 1);
      }
      return remaining;
    });
  }

  useEffect(() => {
    newRound();
  }, [roundNumber]); // Solo se busca una ronda cuando pasa a la siguiente ronda

  return (
    <div className="game-container w-full">

      <h2 className="text-3xl">Round {roundNumber}</h2>

      <button className="bg-emerald-700" onClick={newRound}>re-roll round</button>
      <button className="bg-red-700" onClick={() => showMenu(true)}>exit game</button>
      <div className="flex-col items-start justify-start text-center">
        {currentStratagems.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="p-4 flex gap-4 ml-20 items-center">

              {currentStratagems.map((stratagem, index) => {
                return (
                  <div key={stratagem.id} className="">
                    {/* <p>{stratagem.name} - Code: {stratagem.code}</p> */}
                    <div className={`bg-neutral-800 flex justify-center items-center w-fit border-4 ${index === 0 ? 'border-yellow-300' : 'border-neutral-600'}`}>
                      <img
                        src={`/stratagem_icons/${stratagem.name}.svg`}
                        alt={stratagem.name}
                        width={`${index === 0 ? '120px' : '100px'}`}
                        draggable="false"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-yellow-400 text-black w-full text-2xl">
              <p className="select-none">
                {currentStratagems[0].name}
              </p>
            </div>
            <div>
              <InputArrows 
                code={currentStratagems[0].code} 
                onComplete={onCompletedStratagem} 
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

