import { createSlice } from "@reduxjs/toolkit";
import { board } from "../utils/datas";

const playerNames = [{ 1: "" }, { 2: "" }];

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    theBoard: board,
    currentPlayer: 1,
    players: playerNames,
    startBtn: true,
    chosen: [],
  },
  reducers: {
    playerChange: (state) => {
      return state.currentPlayer === 1
        ? (state.currentPlayer = 2)
        : (state.currentPlayer = 1);
    },

    choosingField: {
      reducer: (state, action) => {
        console.log(action.payload.indexArray);
        if (!state.startBtn) {
          state.currentPlayer === action.payload.player &&
            (state.chosen = action.payload.indexArray);
        }
      },
      // Adding a second parameter to the action.
      prepare: (indexArray, player) => {
        return { payload: { indexArray, player } };
      },
    },
    // Moving & knock out settings
    moving: (state, action) => {
      const firstParam = action.payload[0];
      const secondParam = action.payload[1];
      const aimedField = state.theBoard[firstParam][secondParam]; // New field's place.
      const currentField = state.theBoard[state.chosen[0]][state.chosen[1]]; // Current field's place.

      const lastThreeRow = [6, 7, 8];
      const firstThreeRow = [0, 1, 2];

      // Updating the field's parameters (like pieceType, player)
      if (
        state.currentPlayer === 1 &&
        firstThreeRow.includes(firstParam) &&
        !currentField.piece.includes("Promoted") // Avoid adding multiple Promoted sign.
      ) {
        aimedField.piece = `Promoted${currentField.piece}`;
      } else if (
        state.currentPlayer === 2 &&
        lastThreeRow.includes(firstParam) &&
        !currentField.piece.includes("Promoted")
      ) {
        aimedField.piece = `Promoted${currentField.piece}`;
      } else {
        aimedField.piece = currentField.piece;
      }

      aimedField.player = state.currentPlayer;

      // Clearing the old field parameters.
      currentField.piece = "";
      currentField.currentPlayer = null;

      state.chosen = [];
      state.currentPlayer === 1
        ? (state.currentPlayer = 2)
        : (state.currentPlayer = 1);
    },

    namingPlayer1: (state, { payload }) => {
      state.players[0][1] = payload;
    },
    namingPlayer2: (state, { payload }) => {
      state.players[1][2] = payload;
    },

    starting: (state, action) => {
      action.payload.preventDefault();
      state.startBtn = !state.startBtn;
      state.players[0][1] === "" && (state.players[0][1] = "player1");
      state.players[1][2] === "" && (state.players[1][2] = "player2");
    },
  },
});

export const {
  playerChange,
  choosingField,
  moving,
  namingPlayer1,
  namingPlayer2,
  starting,
} = gameSlice.actions;

export default gameSlice.reducer;
