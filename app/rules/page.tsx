
import {
    AlertTriangle,
    ArrowRight,
    Check,
    Crown,
    ChevronsUpDown,
  } from "lucide-react";
  import { Card, CardHeader, CardContent } from "@/components/ui/card"; // Ajusta según tu estructura de shadcn/ui
  
  const RulesPage = () => {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center py-18"
    
      >
        <div className="bg-gradient-to-b from-black/70 via-black/60 to-black/70 absolute inset-0" />
  
        <h1 className="relative text-5xl font-roboto text-white mb-10">
          Reglas del Juego de Damas Inglesas
        </h1>
  
        <Card className="relative max-w-3xl w-full bg-white/90 shadow-lg rounded-lg">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-800">
              Detalles de las Reglas
            </h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-6">
              <li className="flex items-center">
                <ArrowRight className="text-green-600 w-6 h-6 mr-4" />
                <span className="font-medium text-gray-700">
                  <span className="font-semibold">Tamaño del tablero:</span> 8x8
                  casillas.
                </span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="text-green-600 w-6 h-6 mr-4" />
                <span className="font-medium text-gray-700">
                  <span className="font-semibold">Movimiento:</span> Diagonal hacia
                  adelante (reina: cualquier diagonal).
                </span>
              </li>
              <li className="flex items-center">
                <AlertTriangle className="text-red-500 w-6 h-6 mr-4" />
                <span className="font-medium text-gray-700">
                  <span className="font-semibold">Capturas:</span> Obligatorias,
                  permitidos saltos múltiples.
                </span>
              </li>
              <li className="flex items-center">
                <Crown className="text-yellow-500 w-6 h-6 mr-4" />
                <span className="font-medium text-gray-700">
                  <span className="font-semibold">Promoción:</span> Se convierte en
                  reina al llegar a la última fila.
                </span>
              </li>
              <li className="flex items-center">
                <Check className="text-teal-500 w-6 h-6 mr-4" />
                <span className="font-medium text-gray-700">
                  <span className="font-semibold">Condiciones de victoria:</span>{" "}
                  Sin piezas o movimientos válidos.
                </span>
              </li>
              <li className="flex items-center">
                <ChevronsUpDown className="text-orange-500 w-6 h-6 mr-4" />
                <span className="font-medium text-gray-700">
                  <span className="font-semibold">Empate:</span> Secuencia repetida
                  tres veces o sin movimientos válidos.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default RulesPage;
  