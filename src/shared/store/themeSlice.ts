import { createSlice } from "@reduxjs/toolkit";

type Theme = "dark" | "light";
const themeSlice = createSlice({
  name: "theme",
  initialState: "light" as Theme,
  reducers: {
    toggleTheme(state) {
      return state === "dark" ? "light" : "dark";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
