import { useEffect, useReducer, useState } from "preact/hooks";

type Board = number[][];
type Figure = {
  position: {
    x: number;
    y: number;
  };
  shape: number[][];
};

const boardSize = {
  width: 10,
  height: 16,
};

const getEmptyCell = () => 0;

const getEmptyRow = () =>
  new Array(boardSize.width).fill(null).map(() => getEmptyCell());

const getEmptyBoard = () =>
  new Array(boardSize.height).fill(null).map(() => getEmptyRow());

const shapes = {
  I: [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  J: [
    [0, 2, 0],
    [0, 2, 0],
    [2, 2, 0],
  ],
  L: [
    [0, 3, 0],
    [0, 3, 0],
    [0, 3, 3],
  ],
  O: [
    [4, 4],
    [4, 4],
  ],
  S: [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  T: [
    [6, 6, 6],
    [0, 6, 0],
    [0, 0, 0],
  ],
  Z: [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
};

const getBagShapes = () => {
  const shapesArray = [
    shapes.I,
    shapes.J,
    shapes.L,
    shapes.O,
    shapes.S,
    shapes.T,
    shapes.Z,
  ];
  return shapesArray.toSorted(() => Math.random() - 0.5);
};

const getRotatedShape = <T,>(figure: T[][]): T[][] => {
  const newFigure = Array.from(
    { length: figure.length },
    () => Array(figure.length).fill(0),
  );

  for (let row = 0; row < figure.length; row++) {
    for (let column = 0; column < figure.length; column++) {
      newFigure[row][column] = figure[figure.length - column - 1][row];
    }
  }

  return newFigure;
};

const getFigureCanBeInsertedInBoard = (
  board: Board,
  shape: Figure["shape"],
  position: Figure["position"],
) => {
  const result = shape.every((rowValues, row) =>
    rowValues.every((cell, column) => {
      if (cell === 0) return true;
      const boardRow = board[position.y + row];
      if (boardRow === undefined) return false;
      const boardCell = board[position.y + row][position.x + column];
      if (boardCell === undefined) return false;
      return boardCell === 0;
    })
  );

  return result;
};

const getInitialState = () => {
  const bag = getBagShapes();
  const shape = bag[0];
  bag.shift();
  return {
    bag,
    board: getEmptyBoard(),
    figure: {
      position: {
        x: Math.floor(boardSize.width / 2),
        y: 0,
      },
      shape: shape,
    },
    score: 0,
  };
};

const initialState = getInitialState();

const hook = () => {
  const [intervalState, setIntervalState] = useState<undefined | number>();
  const [gameIsOn, setGameIsOn] = useState(false);
  const [state, dispatch] = useReducer(
    (previousState, action: string) => {
      if (action === "initGame") {
        return getInitialState();
      } else if (!gameIsOn) return previousState;
      else if (action === "nextStep") {
        // Lo mueve hacia a abajo si se puede
        const newPosition = {
          x: previousState.figure.position.x,
          y: previousState.figure.position.y + 1,
        };

        if (
          getFigureCanBeInsertedInBoard(
            previousState.board,
            previousState.figure.shape,
            newPosition,
          )
        ) {
          const newState = structuredClone(previousState);
          newState.figure.position = newPosition;
          return newState;
        }

        const newState = structuredClone(previousState);

        // fija la figura
        previousState.figure.shape.forEach((rowValues, row) =>
          rowValues.forEach((cell, column) => {
            if (cell === 0) return;
            newState
              .board[row + previousState.figure.position.y][
                column + previousState.figure.position.x
              ] = cell;
          })
        );

        // Mira si el juego terminó por haber una pieza en la fila de más arriba
        const thereIsAPieceInTopRow = newState.board[0].some((cell) =>
          cell !== 0
        );

        if (thereIsAPieceInTopRow) {
          clearInterval(intervalState);
          alert(`GAME OVER.\nScore: ${previousState.score}`);
          setGameIsOn(false);
          stopGame();
          return newState;
        }

        // Setea otra figura
        newState.figure.shape = newState.bag[0];
        newState.bag.shift();
        if (newState.bag.length === 0) newState.bag = getBagShapes();

        // Reinicia la posición de la figura
        newState.figure.position = {
          x: Math.floor(boardSize.width / 2),
          y: 0,
        };

        // Quita las filas
        newState.board = newState.board.filter((row) =>
          row.some((cell) => cell === 0)
        );

        // Calcula el nuevo score
        const rowsCleaned = previousState.board.length - newState.board.length;
        newState.score += rowsCleaned ** 2;

        // Agrega las filas faltantes
        while (previousState.board.length > newState.board.length) {
          newState.board.unshift(getEmptyRow());
        }

        return newState;
      } else if (action === "rotate") {
        const rotatedShape = getRotatedShape(
          previousState.figure.shape,
        );

        if (
          getFigureCanBeInsertedInBoard(
            previousState.board,
            rotatedShape,
            previousState.figure.position,
          )
        ) {
          const newState = structuredClone(previousState);
          newState.figure.shape = rotatedShape;
          return newState;
        }
      } else if (action === "moveRight") {
        const newPosition = {
          x: previousState.figure.position.x + 1,
          y: previousState.figure.position.y,
        };

        if (
          getFigureCanBeInsertedInBoard(
            previousState.board,
            previousState.figure.shape,
            newPosition,
          )
        ) {
          const newState = structuredClone(previousState);
          newState.figure.position = newPosition;
          return newState;
        }
      } else if (action === "moveDown") {
        const newPosition = {
          x: previousState.figure.position.x,
          y: previousState.figure.position.y + 1,
        };

        if (
          getFigureCanBeInsertedInBoard(
            previousState.board,
            previousState.figure.shape,
            newPosition,
          )
        ) {
          const newState = structuredClone(previousState);
          newState.figure.position = newPosition;
          return newState;
        }
      } else if (action === "moveFullDown") {
        for (
          let newY = previousState.figure.position.y + 1;
          newY <= boardSize.height;
          newY++
        ) {
          if (
            !getFigureCanBeInsertedInBoard(
              previousState.board,
              previousState.figure.shape,
              {
                x: previousState.figure.position.x,
                y: newY,
              },
            )
          ) {
            const newState = structuredClone(previousState);
            newState.figure.position.y = newY - 1;
            return newState;
          }
        }
      } else if (action === "moveLeft") {
        const newPosition = {
          x: previousState.figure.position.x - 1,
          y: previousState.figure.position.y,
        };

        if (
          getFigureCanBeInsertedInBoard(
            previousState.board,
            previousState.figure.shape,
            newPosition,
          )
        ) {
          const newState = structuredClone(previousState);
          newState.figure.position = newPosition;
          return newState;
        }
      }

      return previousState;
    },
    initialState,
  );

  const initGame = () => {
    setGameIsOn(true);
    dispatch("initGame");
    setIntervalState(setInterval(() => {
      dispatch("nextStep");
    }, 300));
  };

  const stopGame = () => {
    clearInterval(intervalState);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowUp") return dispatch("rotate");
      if (event.code === "ArrowRight") return dispatch("moveRight");
      if (event.code === "ArrowDown") return dispatch("moveDown");
      if (event.code === "ArrowLeft") return dispatch("moveLeft");
      if (event.code === "Space") return dispatch("moveFullDown");
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.addEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalState);
    };
  }, []);

  return {
    bag: state.bag,
    board: state.board,
    figure: state.figure,
    initGame,
    gameIsOn,
    score: state.score,
  };
};

export default hook;
