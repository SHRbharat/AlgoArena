import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const topicSlice = createSlice({
    name: "topics",
    initialState,
    reducers: {
        setTopics: (state, action) => {
            state.length = 0; // Clear the current state
            state.push(...action.payload); // Add new elements
        },
        editTopic: (state, action) => {
            const topic = state.find(t => t.id === action.payload.id);
            if (topic) {
                topic.name = action.payload.name.trim(); // Directly mutate the found topic
            }
        },
        removeTopic: (state, action) => {
            return state.filter(topic => topic.id !== action.payload); // Replace state with the filtered array
        }
    }
});

export const { setTopics, editTopic, removeTopic } = topicSlice.actions;
export default topicSlice.reducer;
