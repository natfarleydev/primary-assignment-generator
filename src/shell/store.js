// The one place that holds changing state. Each dispatch runs the pure
// `update`, keeps the result, and tells the listener.
export const createStore = (initial, update, listener) => {
  const cell = { state: initial };
  return {
    state: () => cell.state,
    dispatch: (action) => {
      cell.state = update(cell.state, action);
      listener(cell.state, action);
    },
  };
};
