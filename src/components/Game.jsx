import { useEffect, useState } from "react";
import stratagems from '../data/stratagems.json';
import { InputArrows } from "./InputArrows";
import useSound from 'use-sound';

//Sounds
import tone1 from '../sounds/tone1.mp3';
import tone2 from '../sounds/tone2.mp3';
import tone3 from '../sounds/tone3.mp3';
import tone4 from '../sounds/tone4.mp3';

export const Game = ({ showMenu, music }) => {
  const [availableStratagems, setAvailableStratagems] = useState(stratagems); // todas las estratagemas disponibles
  const [currentStratagems, setCurrentStratagems] = useState([]); // lista de estratagemas de esta ronda
  const [roundNumber, setRoundNumber] = useState(1); // num ronda
  const [playTone1] = useSound(tone1, { preload: true });
  const [playTone2] = useSound(tone2, { preload: true });
  const [playTone3] = useSound(tone3, { preload: true });
  const [playTone4] = useSound(tone4, { preload: true });
  const stratagemCountInList = 6; //*num de estratagemas por ronda

  const timer = 10; // tiempo con el que empieza cada ronda, en segundos
  const [currentTime, setCurrentTime] = useState(timer); // tiempo actual del temporizador

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

  useEffect(() => {
    if (currentTime === 0) {
      showMenu(true);
    }
}  , [currentTime]);
  //Añade segundos sin pasarse del límite
  const addSecondsToTimer = (seconds) => {
    if (currentTime + seconds >= timer) {
      setCurrentTime(timer);
      return;
    } else {
      setCurrentTime(currentTime + seconds);
    }
  }

  const onCompletedStratagem = () => {
    // Remover la estratagema actual
    setCurrentStratagems(prev => {
      const remaining = prev.slice(1);

      addSecondsToTimer(1); // Añadir tiempo al temporizador

      // Si no quedan estratagemas, iniciar nueva ronda
      if (remaining.length === 0) {
        setRoundNumber(prev => prev + 1);
      }
      return remaining;
    });
  }

  const exitGame = () => {
    music(); // Llamar a la función para detener la música
    showMenu(true);
  }

  useEffect(() => {
    newRound();
  }, [roundNumber]); // Solo se busca una ronda cuando pasa a la siguiente ronda

  return (
    <div className="game-container w-full">

      <h2 className="text-3xl">Round {roundNumber}</h2>

      <button className="bg-red-700" onClick={() => exitGame()}>exit game</button>
      <div className="flex-col items-start justify-start text-center">
        {currentStratagems.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className=" flex gap-4 ml-60 items-center">

              {currentStratagems.map((stratagem, index) => {
                return (
                  <div key={stratagem.id} className="">
                    {/* <p>{stratagem.name} - Code: {stratagem.code}</p> */}
                    <div className={` flex justify-center items-center w-fit  ${index === 0 ? 'border-yellow-400 border-4 bg-neutral-800' : ''}`}>
                      <img
                        src={`/stratagem_icons/${stratagem.name}.svg`}
                        alt={stratagem.name}
                        width={`${index === 0 ? '140px' : '100px'}`}
                        draggable="false"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-yellow-400 text-black w-full text-3xl">
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

