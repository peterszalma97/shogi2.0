import { useDispatch, useSelector } from "react-redux";
import {
  namingPlayer1,
  namingPlayer2,
  namingPlayers,
  starting,
} from "../redux/gameSlice";
import "../styles/players.scss";

// With map the redux action doesn't working

// function PlayerNames() {
//   const players = useSelector((state) => state.game.players);
//   const dispatch = useDispatch();
//   return players.map((player, i) => {
//     return (
//       <div key={`player${i + 1}`} className="player-container">
//         <label className="label">{`Player${i + 1}'s name:`}</label>
//         <input
//           value={player[i + 1]}
//           onChange={(e) => dispatch(namingPlayers(i, e.target.value))}
//           className="name"
//           type="text"
//           placeholder="Choose a name"
//         />
//       </div>
//     );
//   });
// }

export default function Players() {
  const startButton = useSelector((state) => state.game.startBtn);
  const players = useSelector((state) => state.game.players);
  const dispatch = useDispatch();

  return startButton ? (
    <div className="playerName-container flex-center">
      <p>Please, add player names:</p>
      <form onSubmit={(e) => dispatch(starting(e))} className="flex-center">
        <div className="player-container">
          <label className="label">Player1's name:</label>
          <input
            value={players[0][1]}
            onChange={(e) => dispatch(namingPlayer1(e.target.value))}
            maxLength={10}
            className="name"
            type="text"
            placeholder="Choose a name"
          />
        </div>

        <div className="player-container">
          <label className="label">Player2's name:</label>
          <input
            value={players[1][2]}
            onChange={(e) => dispatch(namingPlayer2(e.target.value))}
            maxLength={10}
            className="name"
            type="text"
            placeholder="Choose a name"
          />
        </div>

        <button className="btn" type="submit">
          START
        </button>
      </form>
    </div>
  ) : null;
}
