import { useEffect, useRef, useState } from "react";
import stratagems from '../data/stratagems.json';
import { InputArrows } from "./InputArrows";
import useSound from 'use-sound';

import tone1 from '../sounds/tone1.mp3';
import tone2 from '../sounds/tone2.mp3';
import tone3 from '../sounds/tone3.mp3';
import tone4 from '../sounds/tone4.mp3';
import gameLost from '../sounds/gameLost.wav';
import start from '../sounds/start.wav';

export const Game = ({ showMenu, stopMusic, playMusic, musicEnabled, highscore, setHighscore }) => {

  //tareas en orden de prioridad
  //TODO: arreglar tamaño de juego
  //TODO: sonido de perder no reproduciendose en primera ronda

  // Stratagems
  const [availableStratagems, setAvailableStratagems] = useState(stratagems); // todas las estratagemas disponibles
  const [currentStratagems, setCurrentStratagems] = useState([]); // lista de estratagemas de esta ronda
  const [roundNumber, setRoundNumber] = useState(0); // num ronda
  const stratagemCountInList = 6; //*num de estratagemas por ronda

  // Sounds
  const [playTone1] = useSound(tone1, { preload: true });
  const [playTone2] = useSound(tone2, { preload: true });
  const [playTone3] = useSound(tone3, { preload: true });
  const [playTone4] = useSound(tone4, { preload: true });
  const [playGameLost] = useSound(gameLost, { preload: true });
  const [playStart] = useSound(start, { preload: true });

  //Timer
  const timer = 10; // tiempo con el que empieza cada ronda, en segundos
  const [currentTime, setCurrentTime] = useState(timer); // tiempo actual del temporizador
  const intervalRef = useRef(null);
  const firstRoundRef = useRef(true);

  //Midway transition
  const [isTransition, setIsTransition] = useState(false);
  const [transitionStep, setTransitionStep] = useState(0);
  const [lastRoundStats, setLastRoundStats] = useState(null);

  //Score
  const [score, setScore] = useState(0);
  const [fallos, setFallos] = useState(0);

  //TODO: timer por pantalla

  // Calcular score de la ronda y actualizar
  const endRoundScore = () => {
    const scoreRoundBonus = 75 + ((roundNumber + 1) * 25);
    const scoreTimeBonus = Math.floor(currentTime) * 10 + Math.floor((currentTime % 1) * 10);
    const scorePerfectRound = fallos === 0 ? 100 : 0;

    const roundScore = scoreRoundBonus + scoreTimeBonus + scorePerfectRound;

    return {
      scoreRoundBonus,
      scoreTimeBonus,
      scorePerfectRound,
      roundTotal: scoreRoundBonus + scoreTimeBonus + scorePerfectRound
    };
  }

  // Nueva ronda de estratagemas
  const newRound = () => {
    setFallos(0);
    playStart();

    // Reproducir música solo la primera vez si está activada
    if (firstRoundRef.current && musicEnabled === "on") {
      playMusic();
      firstRoundRef.current = false;
    }


    const tempStratagems = [...availableStratagems];
    const selectedStratagems = [];

    // Se eligen de forma aleatoria
    for (let i = 0; i < stratagemCountInList; i++) {
      if (tempStratagems.length === 0) break;

      const randomIndex = Math.floor(Math.random() * tempStratagems.length);
      selectedStratagems.push(tempStratagems[randomIndex]);
      tempStratagems.splice(randomIndex, 1);
    }
    setCurrentStratagems(selectedStratagems); // Actualizar las estratagemas actuales
    setCurrentTime(timer); // Reiniciar el temporizador
  }

  //Añade segundos sin pasarse del límite
  const addSecondsToTimer = (seconds) => {
    if (currentTime + seconds >= timer) {
      setCurrentTime(timer);
    } else {
      setCurrentTime(currentTime + seconds);
    }
  }

  const transitionBetweenRounds = () => {
    if (roundNumber % 4 === 0) playTone4();
    else if (roundNumber % 3 === 0) playTone3();
    else if (roundNumber % 2 === 0) playTone2();
    else playTone1();

    const stats = endRoundScore(); // calcular stats
    setLastRoundStats(stats); // guardarlos en el state
    setScore(prev => prev + stats.roundTotal); // acumular puntos

    // Pausar música y mostrar transición
    stopMusic();
    setIsTransition(true);
    setTransitionStep(0);

    if (intervalRef.current) clearInterval(intervalRef.current); //DETENEMOS TIMER

    // Mostrar cada mensaje con delay
    setTimeout(() => setTransitionStep(1), 0);
    setTimeout(() => setTransitionStep(2), 700);
    setTimeout(() => setTransitionStep(3), 1400);

    // Después de 4s arranca siguiente ronda
    setTimeout(() => {
      setRoundNumber(prev => prev + 1);
      setIsTransition(false);
      if (musicEnabled === "on") playMusic(); // reanudar música
    }, 4000);
  }

  const onCompletedStratagem = () => {
    setCurrentStratagems(prev => {
      const remaining = prev.slice(1);
      addSecondsToTimer(1);
      setScore(prev => prev + (currentStratagems[0].code.length * 5)); //+5 score por flecha en estratagema completada

      // Si no quedan más estratagemas, iniciar nueva ronda
      if (remaining.length === 0) {
        transitionBetweenRounds();
      }
      return remaining;
    });
  };


  const exitGame = () => {
    const newHighscore = Math.max(score, highscore);
    setHighscore(newHighscore);
    localStorage.setItem("highscore",newHighscore);
    stopMusic();
    showMenu(true);
    playGameLost();

  }

  const timerGoesDown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current); //limpiar si habia uno

    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev <= 0.1) {  // ya se acabó el tiempo
          clearInterval(intervalRef.current);
          exitGame();
          return 0;
        }
        return +(prev - 0.1).toFixed(1); // evitar acumulación de decimales
      });
    }, 100);
    // limpiar el intervalo al cambiar de ronda o desmontar
    return () => clearInterval(intervalRef);
  }


  // Iniciar nueva ronda al montar el componente y al cambiar el número de ronda
  useEffect(() => {
    newRound();
    timerGoesDown();
    return () => clearInterval(intervalRef.current);
  }, [roundNumber]);



  return (
    <div className="game-container w-full">

      {isTransition ? (
        <>
          <div className="flex flex-col items-center text-right justify-center h-full text-4xl">
            <p className="text-2xl">Get ready for Round {roundNumber + 2}</p>
            <div className="text-right">
              {transitionStep >= 1 && <p>Round bonus <span className="text-yellow-400">{lastRoundStats.scoreRoundBonus}</span></p>}
              {transitionStep >= 2 && <p>Time Bonus <span className="text-yellow-400">{lastRoundStats.scoreTimeBonus}</span></p>}
              {transitionStep >= 3 && <><p>Perfect round <span className="text-yellow-400">{lastRoundStats.scorePerfectRound}</span></p>
                <br />
                <p> TOTAL  <span className="text-yellow-400">{score}</span></p>
              </>
              }
            </div>
          </div>
        </>
      ) : (
        <>

          <div className="flex justify-between items-center mb-4 mx-4">
            <h2 className="text-4xl">Round {roundNumber + 1}</h2>
            <div className="text-right">

              <h2 className="text-4xl">Score: <span className="text-yellow-400">{score}</span></h2>
              <h2 className="text-lg">Highscore: <span className="text-yellow-400">{highscore}</span></h2>

            </div>
          </div>

          {/* <button className="bg-red-700" onClick={() => exitGame()}>exit game</button> */}
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
                    onFail={() => setFallos(prev => prev + 1)}
                  />
                </div>
                <div className="w-full h-4 bg-neutral-700 mt-4">
                  <div
                    className="h-4 bg-yellow-400 transition-all duration-100"
                    style={{ width: `${(currentTime / timer) * 100}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

