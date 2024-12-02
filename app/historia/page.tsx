import { Card, CardHeader, CardContent } from "@/components/ui/card"; // Ajusta según tu estructura de shadcn/ui
import { ArrowRight, Crown, AlertTriangle, Check, Info } from "lucide-react";

const HistoryPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-18 px-6 bg-gradient-to-r from-turquoise via-blue-900 to-turquoise-800 font-roboto">
      <h1 className="relative text-5xl text-white mb-10">
        Historia del Juego de Damas Inglesas
      </h1>

      {/* Sección Introducción con degradado */}
      <Card className="relative max-w-3xl w-full shadow-lg rounded-lg mb-6 bg-gradient-to-r from-black via-black -900 to-turquoise-900 opacity-100">
        <CardHeader>
          <h2 className="text-2xl text-white">Introducción</h2>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-white mb-4">
            El juego de las damas es uno de los juegos de mesa más populares y antiguos del mundo. Se juega en todo el mundo y ha sido disfrutado por millones de personas durante siglos. En este artículo, te presentamos una guía completa del juego de las damas, incluyendo su historia, las diferentes variantes y datos curiosos que pueden ser útiles para los amantes de este juego.
          </p>
        </CardContent>
      </Card>

      {/* Sección Historia del Juego con degradado */}
      <Card className="relative max-w-3xl w-full shadow-lg rounded-lg mb-6 bg-gradient-to-r from-black via-black -900 to-turquoise-900 opacity-100">
        <CardHeader>
          <h2 className="text-2xl text-white">Historia del Juego</h2>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-white mb-4">
            El juego de las damas tiene una larga y rica historia que se remonta a la antigua Roma. Los romanos jugaban a un juego llamado <i>ludus latrunculorum</i>, que significa «juego de soldados» en latín. Este juego se jugaba en un tablero de 8×8 y las piezas eran hombres y mujeres, representando soldados y sus esposas.
          </p>
          <p className="text-lg text-white mb-4">
            Con el tiempo, el juego se fue adaptando y evolucionando en diferentes partes del mundo. En la Edad Media, el juego se popularizó en Europa y las piezas fueron cambiando hasta convertirse en las damas que conocemos hoy en día.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
