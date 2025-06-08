import { createSlice } from "@reduxjs/toolkit";

// Function to provide the initial state dynamically
const getInitialState = () => ({
  isAuthenticated: false,
  user: null, // Starts as null since no user is authenticated
});

export const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(), // Call the function to set initial state
  reducers: {
    // Sets the authentication status
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    // Sets the user object, ensuring only valid fields are set
    setUser: (state, action) => {
      if (action.payload) {
        const { id, name, email, role } = action.payload; // Destructure only allowed fields
        state.user = { id, name, email, role }; // Ensure only these fields are set
      } else {
        state.user = null;
      }
    },
    // Clears user and authentication status
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    // Resets to the initial state dynamically
    resetState: () => getInitialState(),
  },
});

// Export actions
export const { setIsAuthenticated, setUser, logout, resetState } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
