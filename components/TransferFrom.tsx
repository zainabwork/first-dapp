"use client";
import { FormEvent, useState } from "react";
import { config } from "@/app/providers";
import { useWriteContract, type BaseError } from "wagmi";
import { readContract, getAccount } from "@wagmi/core";
import { TransactionListProps } from "./InterfacesAndTypes/interfaces";
import contractAbi from "./abi/ContractAbi.json";

export default function TransferFrom({onTransactionHash}: TransactionListProps) {
  const {address} = getAccount(config);
  // console.log("account:",address)

  const {data: hash, error, isPending, writeContractAsync} = useWriteContract();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const from = formData.get("from") as string;
    const to = formData.get("to") as string;
    const amount = formData.get("amount") as string;
    const amountInWei = parseFloat(amount) * 10 ** 18;


    const allowance:any = await readContract(config, {
      address: "0x138521Fb2b82FaB7BBC1804420D0dFD1fc40627E",
      abi: contractAbi,
      functionName: "allowance",
      args: [from, address],
    });

    // console.log("allowance",allowance);

    if (BigInt(allowance) < BigInt(amountInWei)) {
      throw new Error("Insufficient allowance bro");
    } else {
      await writeContractAsync({
        address: "0x138521Fb2b82FaB7BBC1804420D0dFD1fc40627E",
        abi: contractAbi,
        functionName: "transferFrom",
        args: [from, to, BigInt(amountInWei)],
      });
    }
  }
  
  onTransactionHash(hash!);

  return (
    <>
    <h1 className='text-center font-bold text-purple-600 my-5'>Transfer from your wallet to another</h1>
    <div className="md:w-full w-1/2 m-auto flex flex-col gap-2 mb-10">

      <form className="text-black flex flex-col" onSubmit={submit}>
        <input name="from" placeholder="Spender Address" required className='bg-transparent border-2 p-2 rounded-full my-2'/>
        <input name="to" placeholder="Recipient Address" required className='bg-transparent border-2 p-2 rounded-full my-2'/>
        <input name="amount" placeholder="Amount" required className='bg-transparent border-2 p-2 rounded-full my-2'/>
        <button disabled={isPending} type="submit" className='text-white bg-purple-600 p-2 rounded-xl my-2 w-40 m-auto'>
          {isPending ? "TransferFrom..." : "TransferFrom"}
        </button>
      </form>
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
    </>
  );
}
