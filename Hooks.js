import React,{useState, useEffect} from 'react';

export function useBooleanArray (length, initialValue) {
  const [state, setState] = useState(new Array(length).fill(initialValue));

  const reset = (length) => {
    setState(new Array(length).fill(initialValue));
  };

  const truefy = (index) => {
    let nstate = [...state];
    nstate[index] = true;
    setState(nstate);
  };

  const falsefy = (index) => {
    let nstate = [...state];
    nstate[index] = false;
    setState(nstate);
  };

  return [state, reset, truefy, falsefy];
}

export function usePersistedState(key, defaultValue) {
  const [state, setState] = React.useState(
    () => JSON.parse(localStorage.getItem(key)) || defaultValue
  );

  const setPersistentState = (newValue) => {
    localStorage.setItem(key,JSON.stringify(newValue));
    setState(newValue);
  }
  /*useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);*/
  return [state, setPersistentState];
}
