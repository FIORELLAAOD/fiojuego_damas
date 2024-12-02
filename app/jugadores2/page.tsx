
//cumple todas las reglas  para jugar entre 2 personas
"use client";
 import React, { useState, useEffect } from 'react';
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Crown, User, RotateCw, Home } from "lucide-react";
 import { Volume2, VolumeX } from "lucide-react";

 // Constantes del juego
 const TAMAÑO_TABLERO = 8;
 const CASILLA_VACIA = 0;
 const NEGRA = 1;
 const BLANCA = 2;
 const NEGRA_REINA = 3;
 const BLANCA_REINA = 4;
 
 // Tipos de datos
 type ModoJuego = 'un_jugador' | 'dos_jugadores' | null;
 type EstadoJuego = 'esperando' | 'jugando' | 'terminado';
 type Ganador = 'NEGRAS' | 'BLANCAS' | null;
 type Tablero = number[][];
 type Posicion = [number, number] | null;
 type Movimiento = {
   desde: [number, number];
   hasta: [number, number];
 };
 
 const JuegoDeDamas: React.FC = () => {
   // Estados del juego
   const [tablero, setTablero] = useState<Tablero>(() => inicializarTablero());
   const [modoJuego, setModoJuego] = useState<ModoJuego>(null);
   const [piezaSeleccionada, setPiezaSeleccionada] = useState<Posicion>(null);
   const [jugadorActual, setJugadorActual] = useState<number>(BLANCA);
   const [estadoJuego, setEstadoJuego] = useState<EstadoJuego>('esperando');
   const [ganador, setGanador] = useState<Ganador>(null);
 



 
 
 
 
   const [soundEnabled, setSoundEnabled] = useState(false);
 
   const audioRef = React.useRef<HTMLAudioElement | null>(null);
 
   // Cargar el estado del sonido desde localStorage al montar el componente
   useEffect(() => {
     const savedSoundState = localStorage.getItem("soundEnabled") === "true";
     setSoundEnabled(savedSoundState);
 
     if (savedSoundState && audioRef.current) {
       audioRef.current.play();
     }
   }, []);
 
   // Función para manejar la reproducción o pausa del sonido
   const toggleSound = () => {
     const newSoundState = !soundEnabled;
     setSoundEnabled(newSoundState);
     localStorage.setItem("soundEnabled", newSoundState.toString()); // Guardar el estado en localStorage
 
     if (newSoundState) {
       // Reproducir sonido desde el inicio
       if (audioRef.current) {
         audioRef.current.currentTime = 0; // Reinicia el sonido
         audioRef.current.play();
       }
     } else {
       // Pausar sonido
       if (audioRef.current) {
         audioRef.current.pause();
       }
     }
   };
 
 
 





   // Inicializar tablero
   function inicializarTablero(): Tablero {
     const tablero = Array(TAMAÑO_TABLERO).fill(null).map(() => Array(TAMAÑO_TABLERO).fill(CASILLA_VACIA));
     
     for (let fila = 0; fila < TAMAÑO_TABLERO; fila++) {
       for (let columna = 0; columna < TAMAÑO_TABLERO; columna++) {
         if ((fila + columna) % 2 === 1) {
           if (fila < 3) tablero[fila][columna] = NEGRA;
           else if (fila > 4) tablero[fila][columna] = BLANCA;
         }
       }
     }
     return tablero;
   }
 
   // Resetear juego completamente
   function reiniciarEstadoInicial(): void {
     setTablero(inicializarTablero());
     setModoJuego(null);
     setPiezaSeleccionada(null);
     setJugadorActual(BLANCA);
     setEstadoJuego('esperando');
     setGanador(null);
   }
 
   // Reiniciar partida
   function reiniciarJuego(): void {
     setTablero(inicializarTablero());
     setJugadorActual(BLANCA);
     setPiezaSeleccionada(null);
     setEstadoJuego('jugando');
     setGanador(null);
   }
 
   // Verificar coronación de reina
   function verificarCoronacion(fila: number, pieza: number): number {
     if (pieza === NEGRA && fila === TAMAÑO_TABLERO - 1) return NEGRA_REINA;
     if (pieza === BLANCA && fila === 0) return BLANCA_REINA;
     return pieza;
   }
 
   // Obtener movimientos válidos-----------------------------------------------------------------------
   
 
   function obtenerMovimientosValidos(fila: number, columna: number): [number, number][] {
     const pieza = tablero[fila][columna];
     const movimientos: [number, number][] = [];
     const saltos: [number, number][] = [];
 
     // Direcciones de movimiento según el tipo de pieza
     const direccionesPeon: [number, number][] = 
         pieza === BLANCA ? [[-1, -1], [-1, 1]] : 
         pieza === NEGRA ? [[1, -1], [1, 1]] : 
         [];
 
     const direccionesReina: [number, number][] = 
         pieza === BLANCA_REINA || pieza === NEGRA_REINA ? 
         [[-1, -1], [-1, 1], [1, -1], [1, 1]] : 
         [];
 
    // Lógica para peones (piezas simples)
if (pieza === BLANCA || pieza === NEGRA) {
  // Función recursiva para verificar los saltos consecutivos
  const obtenerSaltosConsecutivos = (filaInicial: number, columnaInicial: number, saltosAnteriores: [number, number][] = []): [number, number][] => {
      const todosSaltos: [number, number][] = [];
      
      // Verificar todos los posibles saltos en las direcciones de los peones
      direccionesPeon.forEach(([df, dc]) => {
          let filaSalto = filaInicial + df * 2;
          let columnaSalto = columnaInicial + dc * 2;
          let filaIntermedia = filaInicial + df;
          let columnaIntermedia = columnaInicial + dc;

          // Continuar verificando saltos en esa dirección
          while (esPosicionValida(filaSalto, columnaSalto)) {
              if (tablero[filaIntermedia][columnaIntermedia] !== CASILLA_VACIA && 
                  esPiezaOponente(tablero[filaIntermedia][columnaIntermedia], pieza) && 
                  tablero[filaSalto][columnaSalto] === CASILLA_VACIA &&
                  !saltosAnteriores.some(s => s[0] === filaSalto && s[1] === columnaSalto)) {
                  
                  // Si es un salto válido, agregarlo
                  todosSaltos.push([filaSalto, columnaSalto]);
                  tablero[filaIntermedia][columnaIntermedia] = CASILLA_VACIA;
          
                  // Buscar saltos consecutivos desde la nueva posición
                  const saltosSecundarios = obtenerSaltosConsecutivos(filaSalto, columnaSalto, [...saltosAnteriores, [filaSalto, columnaSalto]]);
                  todosSaltos.push(...saltosSecundarios);
              }

              // Si no se puede seguir saltando, romper el ciclo
              if (tablero[filaSalto][columnaSalto] !== CASILLA_VACIA) {
                  break;
              }

              // Continuar al siguiente paso de salto
              filaSalto += df * 2;
              columnaSalto += dc * 2;
              filaIntermedia += df;
              columnaIntermedia += dc;
          }
      });

      return todosSaltos;
  };

  // Llamar a la función recursiva para obtener todos los saltos consecutivos posibles
  const saltosConsecutivos = obtenerSaltosConsecutivos(fila, columna);

  // Si hay saltos consecutivos, agregar todos los saltos
  if (saltosConsecutivos.length > 0) {
    saltos.push(...saltosConsecutivos);
    // Capturar la pieza oponente
    for (const [filaSalto, columnaSalto] of saltosConsecutivos) {
      // Mover la pieza blanca a la nueva posición
      tablero[fila][columna] = CASILLA_VACIA;
      tablero[filaSalto][columnaSalto] = pieza; //COREGIDO
      
      // Capturar la pieza oponente
      const filaIntermedia = (fila + filaSalto) / 2;
      const columnaIntermedia = (columna + columnaSalto) / 2;
      tablero[filaIntermedia][columnaIntermedia] = CASILLA_VACIA;
      
      // Actualizar la posición de la pieza blanca
      fila = filaSalto;
      columna = columnaSalto;
    }
    setJugadorActual(jugadorActual === BLANCA ? NEGRA : BLANCA);
    if (pieza === NEGRA && fila === TAMAÑO_TABLERO - 1) {
      tablero[fila][columna] = NEGRA_REINA;
    }
    if (pieza === BLANCA && fila === 0) {
      tablero[fila][columna] = BLANCA_REINA;
    }
  } else {
      // Si no hay saltos consecutivos, agregar los movimientos simples
      direccionesPeon.forEach(([df, dc]) => {
          const nuevaFila = fila + df;
          const nuevaColumna = columna + dc;
          if (esPosicionValida(nuevaFila, nuevaColumna) && tablero[nuevaFila][nuevaColumna] === CASILLA_VACIA) {
              movimientos.push([nuevaFila, nuevaColumna]);
          }
      });
  }
}

 
     // Lógica para reinas con saltos largos
   //----------------
   if (pieza === BLANCA_REINA || pieza === NEGRA_REINA) {
     direccionesReina.forEach(([df, dc]) => {
         // Variables de control de captura
         let piezaCapturada = false;

 
         for (let paso = 1; paso < TAMAÑO_TABLERO; paso++) {
             const nuevaFila = fila + df * paso;
             const nuevaColumna = columna + dc * paso;
 
             // Salir si se sale del tablero
             if (!esPosicionValida(nuevaFila, nuevaColumna)) break;
 
             // Movimiento simple si no ha capturado
             if (!piezaCapturada && tablero[nuevaFila][nuevaColumna] === CASILLA_VACIA) {
                 movimientos.push([nuevaFila, nuevaColumna]);
             } 
             // Detectar posible captura
             else if (!piezaCapturada && 
                      esPiezaOponente(tablero[nuevaFila][nuevaColumna], pieza)) {
                 // Verificar espacio tras la pieza para salto
                 const filaSalto = nuevaFila + df;
                 const columnaSalto = nuevaColumna + dc;
                 
                 if (esPosicionValida(filaSalto, columnaSalto) && 
                     tablero[filaSalto][columnaSalto] === CASILLA_VACIA) {
                     // Registrar el salto
                     saltos.push([filaSalto, columnaSalto]);
                     piezaCapturada = true;
 
                     // Remover la pieza capturada
                     tablero[nuevaFila][nuevaColumna] = CASILLA_VACIA;
 
                     // Actualizar posición de la reina
                     tablero[fila][columna] = CASILLA_VACIA; // Vaciar la posición actual
                     tablero[filaSalto][columnaSalto] = pieza; // Mover la reina a la nueva posición
 
                     // Actualizar las coordenadas de la reina
                     fila = filaSalto;
                     columna = columnaSalto;
                 } else {
                     break;
                 }
                 setJugadorActual(jugadorActual === BLANCA ? NEGRA : BLANCA);
             }
             // Después de capturar, solo moverse a casillas vacías
             else if (piezaCapturada) {
                 if (tablero[nuevaFila][nuevaColumna] === CASILLA_VACIA) {
                     saltos.push([nuevaFila, nuevaColumna]);
                 } else {
                     break;
                 }
             }
             // Encontró otra pieza, detener movimiento
             else {
                 break;
             }
         }
     });
 }
     //-----------
     // Priorizar saltos obligatorios
     return saltos.length > 0 ? saltos : movimientos;
 }
   //------------------------------------------------------------------------------------------------
   // Verificar posición válida en el tablero
   function esPosicionValida(fila: number, columna: number): boolean {
     return fila >= 0 && fila < TAMAÑO_TABLERO && 
            columna >= 0 && columna < TAMAÑO_TABLERO;
   }
 
   // Verificar si es una pieza oponente
   function esPiezaOponente(pieza1: number, pieza2: number): boolean {
     const piezasNegras = [NEGRA, NEGRA_REINA];
     const piezasBlancas = [BLANCA, BLANCA_REINA];
     
     return (piezasNegras.includes(pieza1) && piezasBlancas.includes(pieza2)) ||
            (piezasBlancas.includes(pieza1) && piezasNegras.includes(pieza2));
   }
 
   // Mover pieza
   function moverPieza(desdeF: number, desdeC: number, hastaF: number, hastaC: number): void {
     const nuevoTablero = tablero.map(fila => [...fila]);
     const pieza = nuevoTablero[desdeF][desdeC];
     
     // Mover pieza y verificar coronación
     nuevoTablero[hastaF][hastaC] = verificarCoronacion(hastaF, pieza);
     nuevoTablero[desdeF][desdeC] = CASILLA_VACIA;
 
     // Capturar pieza si es un salto
     if (Math.abs(desdeF - hastaF) === 2) {
       const filaMedia = (desdeF + hastaF) / 2;
       const columnaMedia = (desdeC + hastaC) / 2;
       nuevoTablero[filaMedia][columnaMedia] = CASILLA_VACIA;
     }
 
     setTablero(nuevoTablero);
     setJugadorActual(jugadorActual === BLANCA ? NEGRA : BLANCA);
     verificarCondicionVictoria(nuevoTablero);
   }
 
   // IA para movimiento automático
   function calcularMovimientoIA(): Movimiento | null {
     const movimientosPosibles: Movimiento[] = [];
 
     for (let fila = 0; fila < TAMAÑO_TABLERO; fila++) {
       for (let columna = 0; columna < TAMAÑO_TABLERO; columna++) {
         if (tablero[fila][columna] === NEGRA || tablero[fila][columna] === NEGRA_REINA) {
           const movimientos = obtenerMovimientosValidos(fila, columna);
           movimientos.forEach(movimiento => {
             movimientosPosibles.push({
               desde: [fila, columna],
               hasta: movimiento
             });
           });
         }
       }
     }
 
     return movimientosPosibles.length > 0 
       ? movimientosPosibles[Math.floor(Math.random() * movimientosPosibles.length)] 
       : null;
   }
 
   // Movimiento de IA en modo un jugador
   useEffect(() => {
     if (modoJuego === 'un_jugador' && jugadorActual === NEGRA && estadoJuego === 'jugando') {
       const movimientoIA = calcularMovimientoIA();
       if (movimientoIA) {
         setTimeout(() => {
           moverPieza(movimientoIA.desde[0], movimientoIA.desde[1], 
                      movimientoIA.hasta[0], movimientoIA.hasta[1]);
         }, 500);
       }
     }
   }, [jugadorActual, modoJuego, estadoJuego]);
 
   // Verificar condición de victoria
   function verificarCondicionVictoria(tableroActual: Tablero): void {
     const piezasNegras = tableroActual.flat().filter(pieza => 
       pieza === NEGRA || pieza === NEGRA_REINA
     ).length;
     
     const piezasBlancas = tableroActual.flat().filter(pieza => 
       pieza === BLANCA || pieza === BLANCA_REINA
     ).length;
 
     if (piezasNegras === 0) {
       setEstadoJuego('terminado');
       setGanador('BLANCAS');
     } else if (piezasBlancas === 0) {
       setEstadoJuego('terminado');
       setGanador('NEGRAS');
     }
   }
 
   // Gestionar clic en casilla
   function manejarClicCasilla(fila: number, columna: number): void {
     if (estadoJuego !== 'jugando') return;
     if (modoJuego === 'un_jugador' && jugadorActual === NEGRA) return;
 
     const pieza = tablero[fila][columna];
     
     // Seleccionar pieza del jugador actual
     if (!piezaSeleccionada && pieza !== CASILLA_VACIA && 
         ((jugadorActual === BLANCA && (pieza === BLANCA || pieza === BLANCA_REINA)) ||
          (jugadorActual === NEGRA && (pieza === NEGRA || pieza === NEGRA_REINA)))) {
       setPiezaSeleccionada([fila, columna]);
       return;
     }
 
     // Realizar movimiento
     if (piezaSeleccionada) {
       const movimientosValidos = obtenerMovimientosValidos(piezaSeleccionada[0], piezaSeleccionada[1]);
       if (movimientosValidos.some(mov => mov[0] === fila && mov[1] === columna)) {
         moverPieza(piezaSeleccionada[0], piezaSeleccionada[1], fila, columna);
       }
       setPiezaSeleccionada(null);
     }
   }
 
   // Renderizar casilla
   function renderizarCasilla(fila: number, columna: number): JSX.Element {
     const pieza = tablero[fila][columna];
     const estaSeleccionada = piezaSeleccionada && 
       piezaSeleccionada[0] === fila && piezaSeleccionada[1] === columna;
     
     const movimientosValidos = piezaSeleccionada 
       ? obtenerMovimientosValidos(piezaSeleccionada[0], piezaSeleccionada[1]) 
       : [];
     
     const esMovimientoValido = movimientosValidos.some(
       mov => mov[0] === fila && mov[1] === columna
     );
 
     return (
       <div
         key={`${fila}-${columna}`}
         className={`w-16 h-16 flex items-center justify-center
           ${(fila + columna) % 2 === 0 ? 'bg-amber-200' : 'bg-amber-800'}
           ${estaSeleccionada ? 'ring-4 ring-blue-500' : ''}
           ${esMovimientoValido ? 'ring-4 ring-green-500' : ''}
         `}
         onClick={() => manejarClicCasilla(fila, columna)}
       >
         {pieza !== CASILLA_VACIA && (
           <div className={`w-12 h-12 rounded-full flex items-center justify-center
             ${pieza === NEGRA || pieza === NEGRA_REINA ? 'bg-gray-800' : 'bg-gray-200'}
             ${estaSeleccionada ? 'border-4 border-blue-500' : ''}
           `}>
             {(pieza === NEGRA_REINA || pieza === BLANCA_REINA) && (
               <Crown className={`w-8 h-8 ${pieza === NEGRA_REINA ? 'text-gray-200' : 'text-gray-800'}`} />
             )}
           </div>
         )}
       </div>
     );
   }
   return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-blue-800 to-turquoise-600 py-18">
      <Card className="max-w-4xl mx-auto shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-4xl font-extrabold text-white glow-text">
            Juego de Damas Inglesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {estadoJuego === 'esperando' ? (
            <div className="flex flex-col items-center gap-4">
              <Button
                className="w-64 bg-gradient-to-r from-blue-400 to-turquoise-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-all"
                onClick={() => {
                  setModoJuego('dos_jugadores');
                  setEstadoJuego('jugando');
                }}
              >
                <User className="mr-2" /> 2 Jugadores
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black transition-all"
                  onClick={reiniciarJuego}
                >
                  <RotateCw className="mr-2" /> Reiniciar
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black transition-all"
                  onClick={reiniciarEstadoInicial}
                >
                  <Home className="mr-2" /> Menú Principal
                </Button>
              </div>
  
              {estadoJuego === 'jugando' && (
                <div className="text-lg font-semibold text-white mb-4">
                  Turno: {jugadorActual === BLANCA ? 'Blancas' : 'Negras'}
                </div>
              )}
  
              {estadoJuego === 'terminado' && (
                <div className="text-xl font-bold text-turquoise-400 mb-4">
                  ¡Ganador: {ganador === 'BLANCAS' ? 'Blancas' : 'Negras'}!
                </div>
              )}
  
              <div className="grid grid-cols-8 gap-0 border-4 border-gradient-to-br from-blue-600 to-turquoise-500">
                {Array(TAMAÑO_TABLERO).fill(null).map((_, fila) =>
                  Array(TAMAÑO_TABLERO).fill(null).map((_, columna) => renderizarCasilla(fila, columna))
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>


 {/* Botón para controlar el sonido */}
 <div className="absolute bottom-6 right-4 z-10">
        <Button
          onClick={toggleSound}
          className="bg-gradient-to-r from-blue-400 to-turquoise-500 text-white p-3 rounded-full"
        >
          {soundEnabled ? (
            <Volume2 size={24} />
          ) : (
            <VolumeX size={24} />
          )}
        </Button>
      </div>

      {/* Audio oculto para controlar la música */}
      <audio ref={audioRef} loop>
        <source src="/blue.mp3" type="audio/mp3" />
      </audio>



    </div>
  );
  
  
   };
   export default JuegoDeDamas;
