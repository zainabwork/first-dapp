"use client"
import * as React from 'react';
import { FormEvent } from 'react';
import { useWriteContract, type BaseError } from 'wagmi';
import contractAbi from './abi/ContractAbi.json'
import { TransactionListProps } from './InterfacesAndTypes/interfaces';

export default function TransactionList({ onTransactionHash }: TransactionListProps){

  const { data: hash, error, isPending, writeContractAsync } = useWriteContract();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get('recipient') as string;
    const amount = formData.get('amount') as string;
    const amountInWei = parseFloat(amount) * 10 ** 18;

    await writeContractAsync({
      address: '0x138521Fb2b82FaB7BBC1804420D0dFD1fc40627E',
      abi: contractAbi,
      functionName: 'transfer',
      args: [to, BigInt(amountInWei)],
    });
  }

    onTransactionHash(hash!);

  return (
    <>
    <h1 className='text-center font-bold text-blue-600 my-5'>Transfer from your wallet to another</h1>
    <div className="md:w-full w-1/2 m-auto flex flex-col gap-2 mb-10">
      <form className="flex flex-col" onSubmit={submit}>
        <input name="recipient" placeholder="Recipient Address" required className='bg-transparent border-2 p-2 rounded-full my-2'/>
        <input name="amount" placeholder="Amount" required className='bg-transparent border-2 p-2 rounded-full my-2'/>
        <button disabled={isPending} type="submit" className='text-white bg-blue-500 p-2 rounded-xl my-2 w-40 m-auto'>
          {isPending ? 'Confirming...' : 'Transfer'}
        </button>
      </form>
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}

    </div>
    </>
  );
}
