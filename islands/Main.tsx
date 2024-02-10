import { useState } from "preact/hooks";
import Controller from "./Controller.tsx";

const Component = () => {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => setGameStarted(true);
  const stopGame = () => setGameStarted(false);

  if (gameStarted) return <Controller stopGame={stopGame} />;
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <button
        className="p-10 border border-black rounded-xl text-4xl"
        onClick={startGame}
      >
        Start Game
      </button>
    </div>
  );
};

export default Component;
