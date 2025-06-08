import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setCompanies: (state, action) => {
      state.length = 0; // Clear the current state
      state.push(...action.payload); // Add new elements
    },
    editCompany: (state, action) => {
      const company = state.find(c => c.id === action.payload.id);
      if (company) {
        company.name = action.payload.name.trim(); // Directly mutate the found company
      }
    },
    removeCompany: (state, action) => {
      return state.filter(company => company.id !== action.payload); // Replace state with filtered array
    }
  }
});

export const { setCompanies, editCompany, removeCompany } = companySlice.actions;
export default companySlice.reducer;
