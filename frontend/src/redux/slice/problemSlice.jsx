import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  title: "",
  description: "",
  difficulty: "",
  constraints: "",
  inputFormat: "",
  outputFormat: "",
  ownerCode: "",
  ownerCodeLanguage: "",
  resourcePath: [],
  topics: [],
  companies: [],

  code: "",
  languageId: "54",
  example_inputs: ["1 2", "0 0", "3 4"],
  example_exp_outputs: ["3", "0", "7"],
  code_outputs: [],
  submissions: [],
  recent_submission: {},
};

export const problemSlice = createSlice({
  name: "problem",
  initialState,
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload;
    },
    clearCode: (state) => {
      state.code = "";
    },
    setLanguage: (state, action) => {
      state.languageId = action.payload;
    },
    setCodeOutputs: (state, action) => {
      state.code_outputs = action.payload;
    },
    setRecentSubmission: (state, action) => {
      state.recent_submission = action.payload;
    },
    updateRecentSubmission: (state, action) => {
      state.submissions[0] = action.payload;
    },
    pushSubmission: (state, action) => {
      state.submissions.unshift(action.payload);
    },
    setProblem: (state, action) => {
      const problem = action.payload;

      state.id = problem.id;
      state.title = problem.title;
      state.description = problem.description;
      state.difficulty = problem.difficulty;
      state.constraints = problem.constraints;
      state.inputFormat = problem.inputFormat;
      state.outputFormat = problem.outputFormat;
      state.ownerCode = problem.ownerCode;
      state.ownerCodeLanguage = problem.ownerCodeLanguage;
      state.resourcePath = problem.resourcePath;
      state.topics = problem.topics;
      state.companies = problem.companies;
    },
    setExampleTestcases: (state, action) => {
      state.example_inputs = action.payload.input;
      state.example_exp_outputs = action.payload.exp_output;
    },
    setSubmissions: (state, action) => {
      state.submissions = action.payload;
      state.recent_submission = action.payload?.[0] || null;
    },
  },
});

export const {
  setCode,
  clearCode,
  setLanguage,
  setCodeOutputs,
  setRecentSubmission,
  setProblem,
  setExampleTestcases,
  setSubmissions,
  pushSubmission,
  updateRecentSubmission,
} = problemSlice.actions;

export default problemSlice.reducer;
