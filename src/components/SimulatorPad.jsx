import { useNavigate } from "react-router";
import { StratagemSidebar } from "./StratagemSidebar";
import { useState, useCallback, useLayoutEffect } from "react";
import stratagems from '../data/stratagems.json';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useSound } from "use-sound";
import { ModalInfo } from "./ModalInfo";

import input1 from '../sounds/input1.ogg';
import input2 from '../sounds/input2.ogg';
import input3 from '../sounds/input3.ogg';
import input4 from '../sounds/input4.ogg';
import inputDone from '../sounds/inputDone.ogg';
import inputCancel from '../sounds/inputCancel.wav'
import sfx500kg from '../sounds/sfx500kg.wav';
import sfxAutocannonSentry from '../sounds/sfxAutocannonSentry.wav';
import sfxPortableHellbomb from '../sounds/sfxPortableHellbomb.wav';
import sfxEMSMortarSentry from '../sounds/sfxEMSMortarSentry.mp3';
import sfxGatlingSentry from '../sounds/sfxGatlingSentry.mp3';
import sfxMachineGunSentry from '../sounds/sfxMachineGunSentry.mp3';
import sfxOrbitalEMSStrike from '../sounds/sfxOrbitalEMSStrike.mp3';
import sfxOrbitalGasStrike from '../sounds/sfxOrbitalGasStrike.mp3';
import sfxOrbitalLaser from '../sounds/sfxOrbitalLaser.mp3';
import sfxOrbitalRailcannonStrike from '../sounds/sfxOrbitalRailcannonStrike.mp3';


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

  //Stratagem sounds
  const [playSfx500kg] = useSound(sfx500kg, { preload: true });
  const [playSfxAutocannonSentry] = useSound(sfxAutocannonSentry, { preload: true });
  const [playSfxPortableHellbomb] = useSound(sfxPortableHellbomb, { preload: true });
  const [playSfxEMSMortarSentry] = useSound(sfxEMSMortarSentry, { preload: true });
  const [playSfxGatlingSentry] = useSound(sfxGatlingSentry, { preload: true });
  const [playSfxMachineGunSentry] = useSound(sfxMachineGunSentry, { preload: true });
  const [playSfxOrbitalEMSStrike] = useSound(sfxOrbitalEMSStrike, { preload: true });
  const [playSfxOrbitalGasStrike] = useSound(sfxOrbitalGasStrike, { preload: true });
  const [playSfxOrbitalLaser] = useSound(sfxOrbitalLaser, { preload: true });
  const [playSfxOrbitalRailcannonStrike] = useSound(sfxOrbitalRailcannonStrike, { preload: true });

  // Play sounds depending on the stratagem
  const stratagemSoundMap = {
    wdsss: playSfx500kg,                 // 500kg Bomb
    swdwaw: playSfxAutocannonSentry,     // Autocannon Sentry
    sdwww: playSfxPortableHellbomb,      // Hellbomb
    swdsd: playSfxEMSMortarSentry,       // EMS Mortar Sentry
    swda: playSfxGatlingSentry,          // Gatling Sentry
    swddw: playSfxMachineGunSentry,      // Machine Gun Sentry
    ddas: playSfxOrbitalEMSStrike,       // Orbital EMS Strike
    ddsd: playSfxOrbitalGasStrike,       // Orbital Gas Strike
    dwssd: playSfxOrbitalRailcannonStrike // Orbital Railcannon Strike
  };



  //States
  const [showStratagemSidebar, setShowStratagemSidebar] = useState(false);
  const [buttonsUsageMode, setButtonsUsageMode] = useState(true);
  const [buttonInput, setButtonInput] = useState("");
  const [matchedStratagem, setMatchedStratagem] = useState(null);
  const [showModalInfo, setShowModalInfo] = useState(false);

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
      playInputCancel();
      setButtonInput("");
    } else {

      // Play a random sound between different sounds
      //4 is tthe maximum and 1 is the minimum
      let randomInputSfx = Math.floor(Math.random() * ((4 - 1 + 1)) + 1);
      if (randomInputSfx === 1) {
        playInput1();
      } else if (randomInputSfx === 2) {
        playInput2();
      } else if (randomInputSfx === 3) {
        playInput3();
      } else if (randomInputSfx === 4) {
        playInput4();
      }
      // //Play SFX for every button
      // switch (dir) {
      //   case "w":
      //     playInput1();
      //     break;
      //   case "s":
      //     playInput2();
      //     break;
      //   case "a":
      //     playInput3();
      //     break;
      //   case "d":
      //     playInput4();
      //     break;

      //   default:
      //     break;
      // }
    }
  }

  //Al lanzar una estratagema se reproduce un SFX (si tiene)
  const stratagemSfxPlayer = (code) => {

    playInputCancel();
    setButtonInput("");
    setMatchedStratagem("");

    //? Reproduce el sonido dependiendo del codigo, y si no encuentra ninguno no falla
    stratagemSoundMap[code]?.();
  }

  const handleKeyPress = useCallback((event) => {
    let pressedKey = "";

    switch (event.key.toLowerCase()) {
      case "w":
      case "arrowup":
        pressedKey = "w";
        break;
      case "s":
      case "arrowdown":
        pressedKey = "s";
        break;
      case "a":
      case "arrowleft":
        pressedKey = "a";
        break;
      case "d":
      case "arrowright":
        pressedKey = "d";
        break;
      default:
        return; // ignorar otras teclas
    }

    handleButtonPress(pressedKey);
    event.preventDefault();

  }, [handleButtonPress]);

  useLayoutEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);



  return (
    <>
      {/* <FullScreen handle={handleFullscreen}> */}

      <div class="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
        {/* Botón usar simulador */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button className='border-2 border-neutral-200 px-1' onClick={() => navigate("/")}>
            <i className='fa-sharp fa-solid fa-gamepad text-lg text-white'></i>
          </button>
          <p className="text-white mr-1">Arcade</p>
        </div>
        {/* Botón mostrar sidebar estratagemas */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <button className='border-2 border-neutral-200 px-1' onClick={() => showSidebar()}>
            <i className='fa-sharp fa-solid fa-globe text-2xl text-white'></i>
          </button>
          <p className="text-white mr-1">Stratagems</p>
        </div>

        {/* Botón cambiar modo de uso (BUTTONS / SLIDE) */}
        {/* WORK IN PROGRESS */}


        {/* <div className="absolute top-4 right-4 flex items-center gap-2">
          <button className='border-2 border-neutral-200 px-1' onClick={() => changeUsageMode()}>
            {buttonsUsageMode ?
              <>
                <i className='fa-sharp fa-solid fa-circle-dot text-2xl text-white'></i>

              </> : <>

                <i className='fa-sharp fa-solid fa-up-down-left-right text-2xl text-white'></i>
              </>}
          </button>
          <p className="text-white mr-1">Usage Mode</p>
        </div> */}

        {/* Enter FullScreen */}
        {/* <div className="absolute top-16 right-4 flex items-center gap-2">
            <button className='border-2 border-neutral-200 px-2' onClick={() => handleFullscreen.enter}>

              <i className='fa-sharp fa-solid fa-expand text-2xl text-white'></i>

            </button>
            <p className="text-white mr-1">Fullscreen</p>
          </div> */}

        {/* Show Modal Info */}
        <div className="absolute top-16 right-4 flex items-center gap-2">
          <button className='border-2 border-neutral-200 px-1' onClick={() => setShowModalInfo(!showModalInfo)}>

            <i className='fa-sharp fa-solid fa-music text-2xl text-white'></i>

          </button>
          <p className="text-white mr-1">SFX List</p>
        </div>

        {/* Reset stratagem */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2" onClick={() => resetInputButton()}>
          <button className='border-2 border-neutral-200 px-2' >

            <i className='fa-sharp fa-solid fa-xmark text-2xl text-white'></i>

          </button>
          <p className="text-white mr-1">Reset Input</p>
        </div>

        {showStratagemSidebar && (
          <>
            <div className="absolute top-16 left-4">
              <StratagemSidebar filteredCode={buttonInput} />
            </div>
          </>
        )}


        {/* ARROWS if button mode is selected (buttonsUsageMode === true) */}
        {buttonsUsageMode && !matchedStratagem ?
          <>
            <div className="flex flex-col min-h-screen w-full justify-center items-center text-7xl text-white">
              {/* UP */}
              <div className="border-2 border-white/30 active:border-yellow-400 active:text-yellow-400 focus:outline-none focus:ring-0 active:outline-none
" onClick={() => handleButtonPress("w")}>
                <div className="mx-5 my-2">
                  <i className="fa-sharp fa-solid fa-up"></i>
                </div>
              </div>

              <div className="flex">
                {/* LEFT */}
                <div className="border-2 border-white/30 active:border-yellow-400 active:text-yellow-400" onClick={() => handleButtonPress("a")} >
                  <div className="mx-4 my-2">
                    <i className="fa-sharp fa-solid fa-left"></i>
                  </div>
                </div>
                {/* Separador */}
                <div className="mx-10 px-2">
                </div>

                {/* RIGHT */}
                <div className="border-2 border-white/30 active:border-yellow-400 active:text-yellow-400" onClick={() => handleButtonPress("d")}>
                  <div className="mx-4 my-2">
                    <i className="fa-sharp fa-solid fa-right"></i>
                  </div>
                </div>
              </div>

              {/* DOWN */}
              <div className="border-2 border-white/30 active:border-yellow-400 active:text-yellow-400" onClick={() => handleButtonPress("s")}>
                <div className="mx-5 my-2">
                  <i className="fa-sharp fa-solid fa-down"></i>
                </div>
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
               bg-black/70 p-4 rounded-lg text-white text-center z-50"
            onClick={() => stratagemSfxPlayer(buttonInput)}
          >
            <p className="text-2xl my-1">{matchedStratagem.name}</p>
            <img
              src={`/stratagem_icons/${matchedStratagem.name}.svg`}
              alt={matchedStratagem.name}
              width="180px"
              draggable="false"
              className='border-4 border-yellow-400 mx-auto mb-2'
            />
          </div>
        )}
        {/* Modal Info */}
        {showModalInfo && (
          <ModalInfo
            stratagemCodesMap={stratagemSoundMap}
            onClose={() => setShowModalInfo(false)}
          />
        )}

      </div>
      {/* </FullScreen > */}
    </>
  )
}
