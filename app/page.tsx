"use client"
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Transfer from "../components/Transfer";
import Approval from "@/components/Approval";
import TransactionDetails from "@/components/TransactionDetails";
import TransferFrom from "@/components/TransferFrom";

export default function Home() {
  const [transactionHash, setTransactionHash] = useState<string>('');

  const handleTransactionHash = (hash: string) => {
    setTransactionHash(hash);
  };
  return (
    <>
    <section className="m-10 my-10">
      <div className="m-auto md:w-full w-1/2">
        <h1 className="text-white text-center">Getting info related to transactions on our Token.</h1>
        <div className="my-5 flex justify-center"><ConnectButton/></div>
      </div>
    <div className="my-20">

      <Transfer onTransactionHash={handleTransactionHash}/>
      <Approval onTransactionHash={handleTransactionHash}/>
      <TransferFrom onTransactionHash={handleTransactionHash}/>
      <br/>
      <TransactionDetails hash={transactionHash} />
    </div>
    </section>
    </>
  );
}

