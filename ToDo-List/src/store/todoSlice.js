import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action) {
        state.unshift(action.payload);
      },
      prepare(text) {
        return {
          payload: {
            id: Date.now(),
            text,
            completed: false,
            important: false,
            date: Date.now(),
          },
        };
      },
    },

    toggleTodo(state, action) {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },

    toggleImportant(state, action) {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) todo.important = !todo.important;
    },

    deleteTodo(state, action) {
      return state.filter((t) => t.id !== action.payload);
    },

    clearCompleted(state) {
      return state.filter((t) => !t.completed);
    },

    setTodosFromStorage(_, action) {
      return Array.isArray(action.payload) ? action.payload : [];
    },

    editTodo(state, action) {
      const { id, text } = action.payload;
      const todo = state.find((t) => t.id === id);
      if (todo) todo.text = text;
    },

    moveTodo(state, action) {
      const { fromIndex, toIndex } = action.payload;
      const updated = [...state];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  toggleImportant,
  deleteTodo,
  clearCompleted,
  setTodosFromStorage,
  editTodo,
  moveTodo,
} = todoSlice.actions;

export default todoSlice.reducer;