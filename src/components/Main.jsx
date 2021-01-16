import React, { useState } from "react";
import { newContextComponents } from "@drizzle/react-components";
import { ToastContainer, toast } from "react-toastify";

const { AccountData, ContractData, ContractForm } = newContextComponents;

const Main = ({ drizzle, drizzleState }) => {
  const [amount, setAmount] = useState(0);
  const account = drizzleState.accounts[0];

  console.log(drizzle);

  const stakeTokens = () => {
    if (amount > 0) {
      const { TokenFarm, DaiToken } = drizzle.contracts;
      const tokenFarmAddress = TokenFarm.address;
      DaiToken.methods
        .approve(tokenFarmAddress, amount)
        .send({ from: account })
        .on("transactionHash", () => {
          TokenFarm.methods
            .stakeTokens(amount)
            .send({ from: account })
            .on("transactionHash", (hash) => {
              toast(`You have successfully staked ${amount} Dai Tokens`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            });
        });
      console.log(tokenFarmAddress);
    } else {
      console.log("Amount should be greater than zero");
    }
  };

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
