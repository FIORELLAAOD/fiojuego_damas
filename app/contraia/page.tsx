"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Bot, RotateCw, Home } from "lucide-react";
import { Volume2, VolumeX } from "lucide-react";

const BOARD_SIZE = 8;

// Constants for pieces
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;
const BLACK_KING = 3;
const WHITE_KING = 4;

type GameMode = 'single' | 'multi' | null;
type GameStatus = 'waiting' | 'playing' | 'finished';
type Winner = 'BLACK' | 'WHITE' | null;
type Board = number[][];
type Position = [number, number] | null;
type Move = {
  from: [number, number];
  to: [number, number];
};

const GameBoard: React.FC = () => {




  const [board, setBoard] = useState<Board>(() => initializeBoard());
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [selectedPiece, setSelectedPiece] = useState<Position>(null);
  const [currentPlayer, setCurrentPlayer] = useState<number>(WHITE);
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting');
  const [winner, setWinner] = useState<Winner>(null);




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



  // Initialize board
  function initializeBoard(): Board {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if ((row + col) % 2 === 1) {
          if (row < 3) {
            board[row][col] = BLACK;
          } else if (row > 4) {
            board[row][col] = WHITE;
          }
        }
      }
    }
    return board;
  }

  // Reset game state
  function resetToInitialState(): void {
    setBoard(initializeBoard());
    setGameMode(null);
    setSelectedPiece(null);
    setCurrentPlayer(WHITE);
    setGameStatus('waiting');
    setWinner(null);
  }

  function resetGame(): void {
    setBoard(initializeBoard());
    setCurrentPlayer(WHITE);
    setSelectedPiece(null);
    setGameStatus('playing');
    setWinner(null);
  }

  function checkForKing(row: number, piece: number): number {
    if (piece === BLACK && row === BOARD_SIZE - 1) return BLACK_KING;
    if (piece === WHITE && row === 0) return WHITE_KING;
    return piece;
  }

  function getValidMoves(row: number, col: number): [number, number][] {
    const piece = board[row][col];
    const moves: [number, number][] = [];
    const jumps: [number, number][] = [];

    const directions: [number, number][] = [];
    if (piece === WHITE || piece === WHITE_KING) directions.push([-1, -1], [-1, 1]);
    if (piece === BLACK || piece === BLACK_KING) directions.push([1, -1], [1, 1]);
    if (piece === WHITE_KING || piece === BLACK_KING) {
      directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    }

    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      const jumpRow = row + dr * 2;
      const jumpCol = col + dc * 2;

      if (isValidPosition(newRow, newCol)) {
        if (board[newRow][newCol] === EMPTY) {
          moves.push([newRow, newCol]);
        } else if (
          isValidPosition(jumpRow, jumpCol) &&
          board[jumpRow][jumpCol] === EMPTY &&
          isOpponentPiece(board[newRow][newCol], piece)
        ) {
          jumps.push([jumpRow, jumpCol]);
        }
      }
    });

    return jumps.length > 0 ? jumps : moves;
  }

  function isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }

  function isOpponentPiece(piece1: number, piece2: number): boolean {
    return (piece1 === BLACK || piece1 === BLACK_KING) && (piece2 === WHITE || piece2 === WHITE_KING) ||
           (piece1 === WHITE || piece1 === WHITE_KING) && (piece2 === BLACK || piece2 === BLACK_KING);
  }

  function movePiece(fromRow: number, fromCol: number, toRow: number, toCol: number): void {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];
    
    newBoard[toRow][toCol] = checkForKing(toRow, piece);
    newBoard[fromRow][fromCol] = EMPTY;

    if (Math.abs(fromRow - toRow) === 2) {
      const midRow = (fromRow + toRow) / 2;
      const midCol = (fromCol + toCol) / 2;
      newBoard[midRow][midCol] = EMPTY;
    }

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === WHITE ? BLACK : WHITE);
    checkWinCondition(newBoard);
  }

  useEffect(() => {
    if (gameMode === 'single' && currentPlayer === BLACK && gameStatus === 'playing') {
      const aiMove = calculateAIMove();
      if (aiMove) {
        const { from, to } = aiMove;
        setTimeout(() => {
          movePiece(from[0], from[1], to[0], to[1]);
        }, 500);
      }
    }
  }, [currentPlayer, gameMode, gameStatus]);

  function calculateAIMove(): Move | null {
    const possibleMoves: Move[] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === BLACK || board[row][col] === BLACK_KING) {
          const moves = getValidMoves(row, col);
          moves.forEach(move => {
            possibleMoves.push({
              from: [row, col],
              to: move
            });
          });
        }
      }
    }
    
    if (possibleMoves.length === 0) return null;
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  function checkWinCondition(currentBoard: Board): void {
    const blackPieces = currentBoard.flat().filter(piece => piece === BLACK || piece === BLACK_KING).length;
    const whitePieces = currentBoard.flat().filter(piece => piece === WHITE || piece === WHITE_KING).length;

    if (blackPieces === 0) {
      setGameStatus('finished');
      setWinner('WHITE');
    } else if (whitePieces === 0) {
      setGameStatus('finished');
      setWinner('BLACK');
    }
  }

  function handleSquareClick(row: number, col: number): void {
    if (gameStatus !== 'playing') return;
    if (gameMode === 'single' && currentPlayer === BLACK) return;

    const piece = board[row][col];
    
    if (!selectedPiece && piece !== EMPTY && 
        ((currentPlayer === WHITE && (piece === WHITE || piece === WHITE_KING)) ||
         (currentPlayer === BLACK && (piece === BLACK || piece === BLACK_KING)))) {
      setSelectedPiece([row, col]);
      return;
    }

    if (selectedPiece) {
      const validMoves = getValidMoves(selectedPiece[0], selectedPiece[1]);
      if (validMoves.some(move => move[0] === row && move[1] === col)) {
        movePiece(selectedPiece[0], selectedPiece[1], row, col);
      }
      setSelectedPiece(null);
    }
  }

  function renderSquare(row: number, col: number): JSX.Element {
    const piece = board[row][col];
    const isSelected = selectedPiece && selectedPiece[0] === row && selectedPiece[1] === col;
    const validMoves = selectedPiece ? getValidMoves(selectedPiece[0], selectedPiece[1]) : [];
    const isValidMove = validMoves.some(move => move[0] === row && move[1] === col);

    return (
      <div
        key={`${row}-${col}`}
        className={`w-16 h-16 flex items-center justify-center
          ${(row + col) % 2 === 0 ? 'bg-amber-200' : 'bg-amber-800'}
          ${isSelected ? 'ring-4 ring-blue-500' : ''}
          ${isValidMove ? 'ring-4 ring-green-500' : ''}
        `}
        onClick={() => handleSquareClick(row, col)}
      >
        {piece !== EMPTY && (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center
            ${piece === BLACK || piece === BLACK_KING ? 'bg-gray-800' : 'bg-gray-200'}
            ${isSelected ? 'border-4 border-blue-500' : ''}
          `}>
            {(piece === BLACK_KING || piece === WHITE_KING) && (
              <Crown className={`w-8 h-8 ${piece === BLACK_KING ? 'text-gray-200' : 'text-gray-800'}`} />
            )}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-blue-700 to-turquoise-500 py-18 relative ">
      {/* Capa de fondo con animación de estrellas */}
      <div className="absolute inset-0 bg-sparkle-animation z-0"></div>
  
      {/* Contenido principal */}
      <Card className="max-w-4xl mx-auto shadow-lg rounded-xl z-10">
        <CardHeader>
          <CardTitle className="text-center text-4xl font-extrabold text-white glow-text">
            Juego de Damas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameStatus === 'waiting' ? (
            <div className="flex flex-col items-center gap-4">
              <Button
                className="w-64 bg-gradient-to-r from-blue-400 to-turquoise-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-all"
                onClick={() => {
                  setGameMode('single');
                  setGameStatus('playing');
                }}
              >
                <Bot className="mr-2" /> 1 Jugador vs IA
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black transition-all"
                  onClick={resetGame}
                >
                  <RotateCw className="mr-2" /> Reiniciar
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black transition-all"
                  onClick={resetToInitialState}
                >
                  <Home className="mr-2" /> Menú Principal
                </Button>
              </div>
  
              {gameStatus === 'playing' && (
                <div className="text-lg font-semibold text-white mb-4">
                  Turno: {currentPlayer === WHITE ? 'Blancas' : 'Negras'}
                </div>
              )}
  
              {gameStatus === 'finished' && (
                <div className="text-xl font-bold text-turquoise-400 mb-4">
                  ¡Ganador: {winner === 'WHITE' ? 'Blancas' : 'Negras'}!
                </div>
              )}
  
              <div className="grid grid-cols-8 gap-0 border-4 border-gradient-to-br from-blue-600 to-turquoise-500">
                {Array(BOARD_SIZE).fill(null).map((_, row) =>
                  Array(BOARD_SIZE).fill(null).map((_, col) => renderSquare(row, col))
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

export default GameBoard;