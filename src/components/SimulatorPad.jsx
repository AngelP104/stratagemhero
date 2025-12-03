import { useNavigate } from "react-router";
import { StratagemSidebar } from "./StratagemSidebar";
import { useState } from "react";
import stratagems from '../data/stratagems.json';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useSound } from "use-sound";

import input1 from '../sounds/input1.ogg';
import input2 from '../sounds/input2.ogg';
import input3 from '../sounds/input3.ogg';
import input4 from '../sounds/input4.ogg';
import inputDone from '../sounds/inputDone.ogg';
import inputCancel from '../sounds/inputCancel.wav'
import sfx500kg from '../sounds/sfx500kg.wav';
import sfxAutocannonSentry from '../sounds/sfxAutocannonSentry.wav';
import sfxPortableHellbomb from '../sounds/sfxPortableHellbomb.wav';

export const SimulatorPad = () => {

  const navigate = useNavigate();

  const handleFullscreen = useFullScreenHandle();

  // Sounds
  const [playInput1] = useSound(input1, { preload: true });
  const [playInput2] = useSound(input2, { preload: true });
  const [playInput3] = useSound(input3, { preload: true });
  const [playInput4] = useSound(input4, { preload: true });
  const [playInputDone] = useSound(inputDone, { preload: true });
  const [playInputCancel] = useSound(inputCancel, { preload: true });

  const [playSfx500kg] = useSound(sfx500kg, { preload: true });
  const [playSfxAutocannonSentry] = useSound(sfxAutocannonSentry, { preload: true });
  const [playSfxPortableHellbomb] = useSound(sfxPortableHellbomb, { preload: true });

  const [showStratagemSidebar, setShowStratagemSidebar] = useState(false);
  const [buttonsUsageMode, setButtonsUsageMode] = useState(true);
  const [buttonInput, setButtonInput] = useState("");
  const [matchedStratagem, setMatchedStratagem] = useState(null);

  const getArrowSymbol = (direction) => {
    switch (direction) {
      case 'w': return 'fa-sharp fa-solid fa-up';
      case 's': return 'fa-sharp fa-solid fa-down';
      case 'd': return 'fa-sharp fa-solid fa-right';
      case 'a': return 'fa-sharp fa-solid fa-left';
      default: return direction;
    }
  }

  const showSidebar = () => {
    playInputCancel();
    setShowStratagemSidebar(!showStratagemSidebar);
  }

  const changeUsageMode = () => {
    setButtonsUsageMode(!buttonsUsageMode);
  }

  const resetInputButton = () => {
    setButtonInput("");
    playInputCancel();
    setMatchedStratagem(null);
  }

  const handleButtonPress = (dir) => {

    //SFX
    switch (dir) {
      case "w":
        playInput1();
        break;
      case "s":
        playInput2();
        break;
      case "a":
        playInput3();
        break;
      case "d":
        playInput4();
        break;

      default:
        break;
    }

    // Input acumulado
    const newInput = buttonInput + dir;
    setButtonInput(newInput);

    if (newInput !== "") {
      setMatchedStratagem(null);
    }
    const match = stratagems.find(s => s.code === newInput);

    if (match) {
      setMatchedStratagem(match);
      playInputDone();
    }

    const stillPosible = stratagems.some(s => s.code.startsWith(newInput));

    if (!stillPosible) {
      setButtonInput("");
    }
  }

  //Al lanzar una estratagema se reproduce un SFX si tiene
  const stratagemSfxPlayer = (code) => {

    playInputCancel();
    setButtonInput("");
    setMatchedStratagem("");

    switch (code) {
      case "wdsss":
        playSfx500kg();
        break;

      case "swdwaw":
        playSfxAutocannonSentry();
        break;

      case "sdwww":
        playSfxPortableHellbomb();
      default:
        break;
    }


  }

  return (
    <>
      <FullScreen handle={handleFullscreen}>

        <div class="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
          {/* Botón usar simulador */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <button className='border-2 border-neutral-200 px-1' onClick={() => navigate("/")}>
              <i className='fa-sharp fa-solid fa-gamepad text-2xl text-white'></i>
            </button>
            <p className="text-white mr-1">Arcade</p>
          </div>
          {/* Botón mostrar sidebar estratagemas */}
          <div className="absolute top-16 left-4 flex items-center gap-2">
            <button className='border-2 border-neutral-200 px-1' onClick={() => showSidebar()}>
              <i className='fa-sharp fa-solid fa-globe text-2xl text-white'></i>
            </button>
            <p className="text-white mr-1">Stratagems</p>
          </div>

          {/* Botón cambiar modo de uso (BUTTONS / SLIDE) */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button className='border-2 border-neutral-200 px-1' onClick={() => changeUsageMode()}>
              {buttonsUsageMode ?
                <>
                  <i className='fa-sharp fa-solid fa-circle-dot text-2xl text-white'></i>

                </> : <>

                  <i className='fa-sharp fa-solid fa-up-down-left-right text-2xl text-white'></i>
                </>}
            </button>
            <p className="text-white mr-1">Usage Mode</p>
          </div>

          {/* Enter FullScreen */}
          <div className="absolute top-16 right-4 flex items-center gap-2">
            <button className='border-2 border-neutral-200 px-2' onClick={() => handleFullscreen.enter}>

              <i className='fa-sharp fa-solid fa-expand text-2xl text-white'></i>

            </button>
            <p className="text-white mr-1">Fullscreen</p>
          </div>

          {/* Reset stratagem */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button className='border-2 border-neutral-200 px-2' onClick={() => resetInputButton()}>

              <i className='fa-sharp fa-solid fa-xmark text-2xl text-white'></i>

            </button>
            <p className="text-white mr-1">Reset Input</p>
          </div>

          {showStratagemSidebar && (
            <>
              <div className="absolute top-28 left-4">
                <StratagemSidebar filteredCode={buttonInput}/>
              </div>
            </>
          )}


          {/* ARROWS if button mode is selected (buttonsUsageMode === true) */}
          {buttonsUsageMode && !matchedStratagem ?
            <>
              <div className="flex flex-col min-h-screen w-full justify-center items-center text-8xl text-white">
                {/* UP */}
                <div className="border-2 border-white">
                  <button onClick={() => handleButtonPress("w")} className="mx-5 my-1">
                    <i className="fa-sharp fa-solid fa-up"></i>
                  </button>
                </div>

                <div className="flex">
                  {/* LEFT */}
                  <div className="border-2 border-white">

                    <button onClick={() => handleButtonPress("a")} className="mx-3 my-1">
                      <i className="fa-sharp fa-solid fa-left"></i>
                    </button>
                  </div>
                  <div className="mx-12 px-2">
                  </div>

                  {/* RIGHT */}
                  <div className="border-2 border-white">
                    <button onClick={() => handleButtonPress("d")} className="mx-3 my-1">
                      <i className="fa-sharp fa-solid fa-right"></i>
                    </button>
                  </div>
                </div>

                {/* DOWN */}
                <div className="border-2 border-white">
                  <button onClick={() => handleButtonPress("s")} className="mx-5 my-1">
                    <i className="fa-sharp fa-solid fa-down"></i>
                  </button>
                </div>
              </div>
            </> : <>

            </>}

          {/* Arrows selected until the next stratagem pops up */}
          {buttonInput !== "" && (
            <>
              <div className="absolute top-36 right-4 text-center text-xl text-white">
                <p>{[...buttonInput].map((dir, i) => {
                  return (
                    <i key={i} className={`${getArrowSymbol(dir)} ml-1`}></i>

                  )
                })}
                </p>
              </div>
            </>
          )}

          {/* Found stratagem */}
          {matchedStratagem && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
               bg-black/70 p-4 w-96 rounded-lg text-white text-center z-50"
              onClick={() => stratagemSfxPlayer(buttonInput)}
            >
              <p className="text-xl">{matchedStratagem.name}</p>
              <img
                src={`/stratagem_icons/${matchedStratagem.name}.svg`}
                alt={matchedStratagem.name}
                width="200px"
                draggable="false"
                className='border-2 border-yellow-400 mx-auto mb-2'
              />
            </div>
          )}

        </div>
      </FullScreen>
    </>
  )
}
