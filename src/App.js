import React, { useState, useRef, useCallback } from "react";
import "./App.css";
import produce from "immer";

const numsRows = 40;
const numsCols = 50;
const moves = [
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
  [-1, 0],
  [-1, -1],
  [-1, 1],
];

function App() {
  const [grid, setGrid] = useState(() => {
    const g = [];
    for (let i = 0; i < numsRows; i++) {
      g.push(Array(numsCols).fill(0));
    }
    return g;
  });

  const [run, setRun] = useState(false);

  const runningRef = useRef(run);
  runningRef.current = run;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;
    setGrid((g) => {
      return produce(g, (copyGrid) => {
        for (let i = 0; i < numsRows; i++) {
          for (let j = 0; j < numsCols; j++) {
            let cells_around = 0;
            moves.forEach((move) => {
              const new_i = move[0] + i;
              const new_j = move[1] + j;
              if (
                new_i >= 0 &&
                new_i < numsRows &&
                new_j >= 0 &&
                new_j < numsCols
              ) {
                cells_around += grid[new_i][new_j];
              }
            });
            if (cells_around < 2 || cells_around > 3) {
              copyGrid[i][j] = 0;
            } else if (grid[i][j] === 0 && cells_around === 3) {
              copyGrid[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 1000);
  });

  return (
    <>
      <button
        onClick={() => {
          setRun(!run);
          if (!run) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {run ? "stop" : "start"}
      </button>
      <div
        className="App"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numsCols}, 20px)`,
        }}
      >
        {grid.map((row, i) =>
          row.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = gridCopy[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                border: "1px solid black",
                background: grid[i][j] ? "pink" : undefined,
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
