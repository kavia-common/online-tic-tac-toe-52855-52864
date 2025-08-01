import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Returns "X" if xIsNext is true, otherwise "O"
 * @param {boolean} xIsNext
 */
function getCurrentPlayer(xIsNext) {
  return xIsNext ? "X" : "O";
}

/**
 * PUBLIC_INTERFACE
 * Returns the winner symbol if there is one, or null otherwise.
 * @param {array} squares
 */
function calculateWinner(squares) {
  /** This is a public function. */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
/**
 * Square component - represents a single cell of the board.
 */
function Square({ value, onClick, highlight }) {
  /** This is a public function. */
  return (
    <button
      className={`ttt-square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      aria-label={
        value ? `Square filled with ${value}` : "Empty game square"
      }
      disabled={!!value}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
/**
 * Board component - the 3x3 Tic Tac Toe grid.
 */
function Board({ squares, onSquareClick, winLine }) {
  /** This is a public function. */
  function renderSquare(i) {
    const isHighlight =
      winLine && winLine.includes(i) ? true : false;
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={isHighlight}
      />
    );
  }

  // Render the 3x3 grid
  let grid = [];
  for (let row = 0; row < 3; row++) {
    let cols = [];
    for (let col = 0; col < 3; col++) {
      cols.push(renderSquare(row * 3 + col));
    }
    grid.push(
      <div className="ttt-board-row" key={row}>
        {cols}
      </div>
    );
  }
  return <div className="ttt-board">{grid}</div>;
}

// PUBLIC_INTERFACE
/**
 * Main App component for the Tic Tac Toe game.
 */
function App() {
  /** This is a public function. */
  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [winLine, setWinLine] = useState(null);

  // Theme state (light only, but keep for extensibility)
  const [theme, setTheme] = useState("light");

  // Color config (from container_details)
  const colors = {
    primary: "#1976d2",
    secondary: "#e0e0e0",
    accent: "#f44336"
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Update win/draw status
  useEffect(() => {
    // Find the line if there's a winner
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    let winnerFound = null;
    let winningLine = null;
    lines.forEach(line => {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        winnerFound = squares[a];
        winningLine = line;
      }
    });
    setWinner(winnerFound);
    setWinLine(winningLine);
    if (!winnerFound && squares.every(sq => sq)) {
      setDraw(true);
    } else {
      setDraw(false);
    }
  }, [squares]);

  // Reset the game
  // PUBLIC_INTERFACE
  function handleRestart() {
    /** This is a public function. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setDraw(false);
    setWinLine(null);
  }

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    /** This is a public function. */
    if (squares[index] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[index] = getCurrentPlayer(xIsNext);
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // Status display logic
  let statusMessage;
  if (winner) {
    statusMessage = (
      <span>
        <span style={{ color: colors.accent, fontWeight: 700 }}>
          Player {winner}
        </span>{" "}
        wins!
      </span>
    );
  } else if (draw) {
    statusMessage = (
      <span style={{ color: colors.primary, fontWeight: 700 }}>
        It's a draw!
      </span>
    );
  } else {
    statusMessage = (
      <span>
        Turn:{" "}
        <span
          style={{
            color: colors.primary,
            fontWeight: 700
          }}
        >
          Player {getCurrentPlayer(xIsNext)}
        </span>
      </span>
    );
  }

  return (
    <div className="App" style={{ background: "var(--bg-primary)" }}>
      <main className="ttt-container">
        <h1 className="ttt-title" style={{ color: colors.primary }}>
          Tic Tac Toe
        </h1>
        <div className="ttt-status" aria-live="polite">{statusMessage}</div>
        <Board squares={squares} onSquareClick={handleSquareClick} winLine={winLine} />
        <button
          className="ttt-restart-btn"
          onClick={handleRestart}
          aria-label="Restart the game"
          style={{
            background: colors.primary,
            color: "#fff",
            marginTop: 32
          }}
        >
          Restart Game
        </button>
      </main>
      {/* Minimal footer/brand for completion */}
      <footer className="ttt-footer" style={{ marginTop: 50, color: "#aaa", fontSize: 14, textAlign: "center" }}>
        <span>Powered by React | KAVIA Modern Theme</span>
      </footer>
    </div>
  );
}

export default App;
