import Board from "../components/Board.tsx";
import usePlayer from "./hooks/usePlayer.tsx";

const Component = () => {
  const { board, figure, initGame, gameIsOn } = usePlayer();

  if (gameIsOn) return <Board board={board} figure={figure} />;

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <button
        className="p-10 border border-black rounded-xl text-4xl"
        onClick={initGame}
      >
        Start Game
      </button>
    </div>
  );
};

export default Component;
