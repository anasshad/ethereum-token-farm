import React, { useState, useEffect } from "react";
import { ContractData } from "@drizzle/react-components";

const Main = async ({ drizzle, drizzleState }) => {
  console.log("Drizzle", drizzle);
  console.log("State", drizzleState);
  const [balance, setBalance] = useState(0);
  const tokenFarm = drizzle.contracts.TokenFarm;
  const account = drizzleState.accounts[0];

  useEffect(async () => {
    const daiTokens = await drizzle.contracts.DaiToken.methods;
    console.log(daiTokens);
  }, []);

  return (
    <div>
      <h1>Token Farm</h1>
      <p>Account: </p>
      <p>Mock Dai Tokens: </p>
    </div>
  );
};

export default Main;
