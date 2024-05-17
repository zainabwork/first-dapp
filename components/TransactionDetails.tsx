import React from 'react'
import { useEffect,useState } from 'react';
import SingleDetail from './SingleDetail';

const TransactionDetails = ({hash}) => {
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);

    useEffect(() => {
        const storedHashes = JSON.parse(localStorage.getItem('transactionHashes') || '[]');
        setTransactionHashes(storedHashes);
      }, []);
    
      useEffect(() => {
        if (hash) {
          const updatedHashes = [...transactionHashes, hash];
          localStorage.setItem('transactionHashes', JSON.stringify(updatedHashes));
          setTransactionHashes(updatedHashes);
        }
      }, [hash]);
  return (
    <>
    <h1 className='text-center font-bold text-white my-5'>See the whole transaction list</h1>
    <div className='overflow-y-auto'>
    <table className='border border-collapse border-gray-400 text-center w-full'>
      <tbody>
        <tr className='text-nowrap'>
          <th className="p-4 border border-gray-400 text-wrap">Hash</th>
          <th className="p-4 border border-gray-400">Method Name</th>
          <th className="p-4 border border-gray-400">From</th>
          <th className="p-4 border border-gray-400">To</th>
          <th className="p-4 border border-gray-400">Value</th>
        </tr>
        {transactionHashes.map((transactionHash) => (
        <SingleDetail key={transactionHash} hash={transactionHash} />
      ))}
        
      </tbody>
    </table>
    </div>
    </>
  )
}

export default TransactionDetails