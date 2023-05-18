import React, { createContext } from "react";

const DataContext = createContext();

export const DataProvider = (props) => {

  return (
    <DataContext.Provider value={props.detail}>{props.children}</DataContext.Provider>
  );
};
export const withContext = (Component) => {
  return function DataContextComponent(props) {
    return (
      <DataContext.Consumer>
        {(globalState) => <Component {...globalState} {...props} />}
      </DataContext.Consumer>
    );
  };
};
