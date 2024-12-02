"use client"
import { useState, useEffect } from "react";
import GameBoard from "@/components/GameBoard";

export default function Home() {
  const [loading, setLoading] = useState(true); // Estado de carga
  const [progress, setProgress] = useState(0); // Progreso del slider

  useEffect(() => {
    // Simula la carga incrementando el progreso
    if (progress < 100) {
      const timer = setInterval(() => {
        setProgress((prev) => Math.min(prev + 2, 100)); // Incrementa el progreso
      }, 50); // Ajusta la velocidad del progreso

      return () => clearInterval(timer);
    } else {
      // Cuando el progreso llega a 100, se muestra el GameBoard
      setLoading(false);
    }
  }, [progress]);

  return (
    <main className="h-screen flex justify-center items-center overflow-hidden relative">
      {/* Slider de carga */}
      {loading && (
        <div className="loading-overlay">
          <div
            className="loading-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Contenido de la página (mostrado solo cuando el progreso está al 100%) */}
      {!loading && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex justify-evenly w-4/5">
    
        </div>
      )}
      
      {/* GameBoard que se muestra cuando loading es false */}
      {!loading && <GameBoard />}
    </main>
  );
}

