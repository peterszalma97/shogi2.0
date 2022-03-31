import { useSelector } from "react-redux";
import "../styles/app.scss";
import Board from "./Board";

function PlayerNames({ player }) {
  const playerName = useSelector((state) => state.game.players);
  const startButton = useSelector((state) => state.game.startBtn);
  if (!startButton) {
    return (
      <p className="player-info">
        {player === 1 ? playerName[0][1] : playerName[1][2]}
        <p className="player-name"> it's your turn.</p>
      </p>
    );
  }
  return null;
}

function App() {
  const player = useSelector((state) => state.game.currentPlayer);
  return (
    <>
      <div
        style={{ transform: player === 2 ? "rotate(180deg)" : "none" }}
        className="board-container flex-center"
      >
        <Board />
      </div>
      <PlayerNames player={player} />
    </>
  );
}

export default App;
