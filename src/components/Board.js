import { board, pieceImages, movingOptions } from "../utils/datas";
import "../styles/board.scss";
import { choosingField, moving } from "../redux/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import Players from "./Players";

function otherOptionMaker(indexArray, chosen, player, pieceType) {
  // The field options come from static data.
  const options = movingOptions[pieceType].map((option, i) => {
    const singleOption = option.map((opt, i) => {
      return player === 1 ? chosen[i] + opt : chosen[i] - opt;
    });
    return singleOption;
  });
  // Stringify the field arrays two check if the options contains the current field.
  const arrayWithStrings = options.map((opt) => {
    return opt.join();
  });
  const arrayContainsCheck = arrayWithStrings.includes(indexArray.join());
  return arrayContainsCheck;
}

// Setting up moving options for every type of pieces.
function signMovingOptions(indexArray, chosen, theBoard, player) {
  const otherPieces = [
    "PromotedKing",
    "King",
    "Pawn",
    "Gold",
    "Silver",
    "Knight",
  ];
  // Only if there is a chosen piece.
  if (chosen.length !== 0) {
    const currentField = theBoard[indexArray[0]][indexArray[1]];
    // Only if there is not teammate piece on the aimed field.
    if (currentField.player !== player) {
      const pieceType = theBoard[chosen[0]][chosen[1]].piece;
      // Bishop
      if (pieceType === "Bishop") {
        function bishopMove() {
          if (
            chosen !== indexArray &&
            // Used the definition of the diagonals in matrix: first parameters dif === second parameters dif.
            // This is symmetric, so the rotation will not affect it.
            (indexArray[0] - chosen[0] === chosen[1] - indexArray[1] ||
              indexArray[0] - chosen[0] === indexArray[1] - chosen[1])
          ) {
            return true;
          }
        }
        return bishopMove();

        // Promoted Bishop
      } else if (pieceType === "PromotedBishop") {
        function promotedBishopMove() {
          if (
            chosen !== indexArray &&
            // Used the definition of the diagonals in matrix: first parameters dif === second parameters dif.
            // This is symmetric, so the rotation will not affect it.
            (indexArray[0] - chosen[0] === chosen[1] - indexArray[1] ||
              indexArray[0] - chosen[0] === indexArray[1] - chosen[1] ||
              otherOptionMaker(indexArray, chosen, player, pieceType))
          ) {
            return true;
          }
        }
        return promotedBishopMove();
      }

      // Rook
      else if (pieceType === "Rook") {
        function rookMoves() {
          if (
            chosen !== indexArray &&
            // One or the other field parameter is fix.
            // This is symmetric, so the rotation will not affect it.
            (indexArray[0] === chosen[0] || indexArray[1] === chosen[1])
          ) {
            return true;
          }
        }
        return rookMoves();

        // Promoted Rook
      } else if (pieceType === "PromotedRook") {
        function rookMoves() {
          if (
            chosen !== indexArray &&
            // One or the other field parameter is fix.
            // This is symmetric, so the rotation will not affect it.
            (indexArray[0] === chosen[0] ||
              indexArray[1] === chosen[1] ||
              otherOptionMaker(indexArray, chosen, player, pieceType))
          ) {
            return true;
          }
        }
        return rookMoves();
      }

      // Lance
      else if (pieceType === "Lance") {
        function lanceMoves() {
          // The column parameters number is fix and the row one is bigger than the current position's one.
          // Because of the board rotation, the rule has to be reversed.
          if (player === 1) {
            return (
              indexArray[0] < chosen[0] && indexArray[1] === chosen[1] && true
            );
          } else {
            return (
              indexArray[0] > chosen[0] && indexArray[1] === chosen[1] && true
            );
          }
        }
        return lanceMoves();
        // Pawn, king, gold, silver, knight
      } else if (otherPieces.includes(pieceType)) {
        function otherMoves() {
          if (otherOptionMaker(indexArray, chosen, player, pieceType)) {
            return true;
          }
        }
        return otherMoves();
        // Other promoted pieces
      } else {
        // Everyone could move like a Gold piece.
        const gold = "Gold";
        if (otherOptionMaker(indexArray, chosen, player, gold)) {
          return true;
        }
      }
    }
  }
}

// Building pieces' elements.
function Piece({ field, indexArray }) {
  const chosenPiece = useSelector((state) => state.game.chosen);
  const dispatch = useDispatch();

  return (
    <img
      // Signing the chosen piece.
      onClick={() => dispatch(choosingField(indexArray, field.player))}
      style={{
        // Rotate the opponents pieces.
        transform: field.player === 2 ? "rotate(180deg)" : null,
        border:
          chosenPiece[0] === indexArray[0] && chosenPiece[1] === indexArray[1]
            ? "2px solid red"
            : "none",
      }}
      className="piece"
      alt={field.piece}
      src={`./assets/${pieceImages[field.piece]}`}
    />
  );
}

// Building the board with two dimensions array.
function BoardMaker() {
  const chosenPiece = useSelector((state) => state.game.chosen);
  const theBoard = useSelector((state) => state.game.theBoard);
  const currentPlayer = useSelector((state) => state.game.currentPlayer);
  const dispatch = useDispatch();

  const shogiBoard = theBoard.map((row, rowIndex) => {
    const rows = row.map((field, columnIndex) => {
      const indexArray = [rowIndex, columnIndex]; //Two dimension array's parameters.
      return (
        <div
          // Moving the chosen piece, if the aimed field is an optional field. Otherwise do nothing.
          onClick={
            signMovingOptions(indexArray, chosenPiece, theBoard, currentPlayer)
              ? () => dispatch(moving(indexArray))
              : null
          }
          style={{
            background:
              // Signing the background of the optional moving fields.
              signMovingOptions(
                indexArray,
                chosenPiece,
                theBoard,
                currentPlayer
              )
                ? "rgb(10, 10, 10, 0.3)"
                : "none",
          }}
          key={indexArray}
          className="field flex-center"
        >
          {field.piece !== "" ? (
            <Piece field={field} indexArray={indexArray} />
          ) : null}
        </div>
      );
    });
    return rows;
  });
  return shogiBoard;
}

export default function Board() {
  return (
    <div className="board flex-center">
      <BoardMaker />
      <Players />
    </div>
  );
}
