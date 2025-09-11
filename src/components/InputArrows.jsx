import { useLayoutEffect, useState, useCallback } from "react";


export const InputArrows = ({ code, onComplete }) => {
  const [arrows, setArrows] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  
  // Cuando cambia el código, reiniciar el input y mostrar las flechas
  useLayoutEffect(() => {
    if (code) {
      showArrows();
      setCurrentInput('');
    }
  }, [code]);

  // Mostrar las flechas basadas en el código
  const showArrows = () => {
    const arrowArray = code.split('');
    setArrows(arrowArray);
  }

  // Manejar la pulsación de teclas
  const handleKeyPress = useCallback((event) => {
    let pressedKey = '';

    // Mapear teclas a direcciones
    switch (event.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        pressedKey = 'w';
        break;
      case 's':
      case 'arrowdown':
        pressedKey = 's';
        break;
      case 'd':
      case 'arrowright':
        pressedKey = 'd';
        break;
      case 'a':
      case 'arrowleft':
        pressedKey = 'a';
        break;
      default:
        return;
    }

    setCurrentInput(prev => {
      const newInput = prev + pressedKey;

      // Verificar si la secuencia coincide hasta ahora
      if (code.startsWith(newInput)) {
        // Si la secuencia está completa
        if (newInput === code) {
          onComplete();
          //console.log("estratagema completa");
          return '';
        }
        return newInput;
      }

      // Si la secuencia es incorrecta, reiniciar
      return '';
    });

    event.preventDefault();
  }, [code, onComplete]);

  // Añadir y remover el event listener
  useLayoutEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const getArrowSymbol = (direction) => {
    switch (direction) {
      case 'w': return '/arrows/arrow_W.png';
      case 's': return '/arrows/arrow_S.png';
      case 'd': return '/arrows/arrow_D.png';
      case 'a': return '/arrows/arrow_A.png';
      default: return direction;
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 items-center justify-center my-4">
        {arrows.map((direction, index) => (
          <span
            key={index}
            className={`select-none transition- ${
              index < currentInput.length ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <img 
              src={getArrowSymbol(direction)}  
              alt=""
              draggable="false"
              className="w-12 h-12 object-contain"
            />
          </span>
        ))}
      </div>
      <div className="text-sm text-neutral-500">
        Use WASD or Arrow Keys
      </div>
    </div>
  )
}
