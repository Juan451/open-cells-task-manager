import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  newTaskTitle: '',
  loading: false,
  error: '',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    resetTasksPage: () => initialState,

    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setNewTaskTitle: (state, action) => {
      state.newTaskTitle = action.payload;
    },

    // Resultado del data-manager
    getTasksSuccess: (state, action) => {
      state.items = action.payload ?? [];
      state.loading = false;
      state.error = '';
    },
    toggleTaskSuccess: (state, action) => {
      const updated = action.payload;
      state.items = state.items.map((t) => (t.id === updated.id ? updated : t));
    },
    createTaskSuccess: (state, action) => {
      state.items.push(action.payload);
      state.newTaskTitle = '';
    },
  },
});

export const {
  resetTasksPage,
  setAuthenticated,
  setLoading,
  setError,
  setNewTaskTitle,
  getTasksSuccess,
  toggleTaskSuccess,
  createTaskSuccess,
} = tasksSlice.actions;

export default tasksSlice.reducer;
