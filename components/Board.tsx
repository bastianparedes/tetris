interface Props {
  bag: number[][][];
  board: number[][];
  figure: {
    shape: number[][];
    position: {
      x: number;
      y: number;
    };
  };
  score: number;
}

const Component = ({ bag, board, figure, score }: Props) => {
  const color = [
    "bg-white",
    "bg-blue-400",
    "bg-green-400",
    "bg-orange-400",
    "bg-pink-400",
    "bg-red-400",
    "bg-violet-400",
    "bg-yellow-400",
  ];

  const nextShape = bag[0];

  const boardClone = structuredClone(board);
  figure.shape.forEach((rowValues, row) => {
    rowValues.forEach((cell, column) => {
      if (cell === 0) return;
      boardClone[figure.position.y + row][figure.position.x + column] = cell;
    });
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="relative flex items-start justify-center">
        <div className="border-black border-solid border">
          {boardClone.map((rowValues, row) => {
            return (
              <div className="flex" key={row}>
                {rowValues.map((cell, column) => {
                  return (
                    <div
                      className="aspect-square h-10 border-black border-solid border flex items-center justify-center"
                      key={`${row}-${column}`}
                    >
                      <div
                        className={`w-11/12 aspect-square rounded-full ${
                          color[cell]
                        }`}
                      >
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="absolute right-0 top-0 translate-x-[110%]">
          <div>
            <span>Score:</span>
            <span>{score}</span>
          </div>
          <div className="border-black border-solid border">
            {nextShape.map((rowValues, row) => {
              return (
                <div className="flex" key={row}>
                  {rowValues.map((cell, column) => {
                    return (
                      <div
                        className="aspect-square h-10 border-black border-solid border flex items-center justify-center"
                        key={`${row}-${column}`}
                      >
                        <div
                          className={`w-11/12 aspect-square rounded-full ${
                            color[cell]
                          }`}
                        >
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Component;
