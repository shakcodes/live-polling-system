import { createSlice } from "@reduxjs/toolkit";

const pollSlice = createSlice({
  name: "poll",
  initialState: {
    currentPoll: null,
    results: {},
    history: [],
  },
  reducers: {
    setPoll: (state, action) => {
      state.currentPoll = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    clearPoll: (state) => {
      state.currentPoll = null;
      state.results = {};
    },
  },
});

export const { setPoll, setResults, setHistory, clearPoll } = pollSlice.actions;
export default pollSlice.reducer;
