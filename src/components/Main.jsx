import React, { useState } from "react";
import { newContextComponents } from "@drizzle/react-components";
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

const { AccountData, ContractData, ContractForm } = newContextComponents;

const Main = ({ drizzle, drizzleState }) => {
  const [amount, setAmount] = useState(0);
  const account = drizzleState.accounts[0];
  const { TokenFarm, DaiToken } = drizzle.contracts;

  console.log(drizzle);

  const stakeTokens = () => {
    if (amount > 0) {
      
      const tokenFarmAddress = TokenFarm.address;
      DaiToken.methods
        .approve(tokenFarmAddress, amount)
        .send({ from: account })
        .on("transactionHash", () => {
          TokenFarm.methods
            .stakeTokens(amount)
            .send({ from: account })
            .on("transactionHash", (hash) => {
              toast(`You have successfully staked ${amount} Dai Tokens`);
            });
        });
      console.log(tokenFarmAddress);
    } else {
      console.log("Amount should be greater than zero");
    }
  };

  const unstakeTokens = () => {
    TokenFarm.methods.unstakeTokens.send({ from: account })
    .on("transactionHash", (hash) => {
      toast(`You have successfully unstaked`);
    });
  }

  return (
    <div>
      <h1>Token Farm</h1>
      <h3>Account Address</h3>
      <AccountData
        drizzle={drizzle}
        drizzleState={drizzleState}
        accounts={drizzleState.accounts}
        accountIndex={0}
      />
      <h3>Dai Balance</h3>
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="DaiToken"
        method="balanceOf"
        methodArgs={[account]}
      />
      <h3>Dapp Balance</h3>
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="DappToken"
        method="balanceOf"
        methodArgs={[account]}
      />
      <br />
      <label>
        Select amount:
        <br />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={stakeTokens}>Submit</button>
      </label>
      <button onClick={() => unstakeTokens}>Unstake Tokens</button>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Same as */}
      <ToastContainer />
    </div>
  );
};

export default Main;
