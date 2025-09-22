import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { role: null },
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    resetRole: (state) => {
      state.role = null;
    },
  },
});

export const { setRole, resetRole } = authSlice.actions;
export default authSlice.reducer;
