"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Menu, Volume2, VolumeX } from "lucide-react"; // Importamos el ícono de volumen
import Link from "next/link";

const JuegoDeDamas: React.FC = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(false);

  // Referencia al objeto Audio para controlar la reproducción
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

  useEffect(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.loop = true; // Hacer que el sonido se repita
      audioRef.current.play();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [soundEnabled]); // Este efecto se ejecutará siempre que el estado `soundEnabled` cambie

  return (
    <div className="min-h-screen flex relative flex-col items-center pt-10">
      {/* Ícono del menú en la esquina superior izquierda */}
      <button
        className="fixed top-4 left-4 p-3 bg-blue-500 text-white rounded-full z-10"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Menú lateral izquierdo */}
      <div
        className={`bg-gray-800 text-white p-4 fixed top-0 left-0 w-full sm:w-[250px] h-full transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "250px" }}
      >
        <h3 className="text-2xl font-bold text-center mb-4">Menú</h3>
        <ul className="flex flex-col items-center">
          <li>
            <Link href="/rules" passHref>
              <Button className="w-full mb-2 text-center">
                <Bot className="mr-2" /> Reglas
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/historia" passHref>
              <Button className="w-full mb-2 text-center">
                <Bot className="mr-2" /> Historia
              </Button>
            </Link>
          </li>
          <li>
            <Button
              onClick={toggleSound} // Alterna el estado del sonido
              className="w-full mb-2 text-center"
            >
              {soundEnabled ? (
                <Volume2 className="mr-2" /> // Icono de sonido activado
              ) : (
                <VolumeX className="mr-2" /> // Icono de sonido desactivado
              )}
              Modo espera (sonido)
            </Button>
          </li>
        </ul>
      </div>

      <div className="flex justify-center items-center w-full max-w-4xl mt-16">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">
              Juego de Damas Inglesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Link href="/contraia" passHref>
                <Button className="w-64 flex items-center border border-gray-300 shadow-lg hover:shadow-xl">
                  <Bot className="mr-2" /> 1 Jugador vs IA
                </Button>
              </Link>
              <Link href="/jugadores2" passHref>
                <Button className="w-64 flex items-center border border-gray-300 shadow-lg hover:shadow-xl">
                  <Bot className="mr-2" /> 2 jugadores
                </Button>
              </Link>
              <Link href="/rules" passHref>
                <Button className="w-64 flex items-center border border-gray-300 shadow-lg hover:shadow-xl">
                  <Bot className="mr-2" /> Reglas del juego
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audio oculto para controlar la música */}
      <audio ref={audioRef} loop>
        <source src="/blue.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
};

export default JuegoDeDamas;
