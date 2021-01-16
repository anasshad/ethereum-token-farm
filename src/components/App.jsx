import React from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import Main from "./Main";
import "./App.css";

const App = () => {
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        if (!initialized) {
          return "Loading...";
        }

        return <Main drizzle={drizzle} drizzleState={drizzleState} />;
      }}
    </DrizzleContext.Consumer>
  );
};

export default App;
