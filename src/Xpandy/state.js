// TODO: I want to pull _preview out of state... but it isn't super pressing
const stateFactory = () => {
  let statesArray = [];

  // ---------------------------------------------------------------
  // Takes an element and sees if a state with that element as the container exists
  // Returns the element or and empty array

  const getState = element => statesArray.find(state => state.container === element);

  // ---------------------------------------------------------------

  const register = element => {
    let newState = {
      items: [],
      isAnimating: false,
      container: element,
      activeItems: [],
      _preview: '',
      _previewElements: []
    };

    statesArray.push(newState);

    return newState;
  };

  // ---------------------------------------------------------------

  return { getState, register };
};

export default stateFactory;
