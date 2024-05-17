import { useWaitForTransactionReceipt } from "wagmi";
import { ethers } from "ethers";
import abi from '../components/abi/ContractAbi.json'
import { useState } from "react";

function stripLeadingZeros(address: string|undefined) {
    return address?.replace(/^0x0+/, '0x');
  }

export default function SingleDetail({ hash }: { hash: any }) {
    const { data: transactionData, isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
      hash,
    });
    const [method,setMethod] = useState('');
    const [value,setValue] = useState(0);

  async function fetchTransactionDetails() {
    try {
      if (!transactionData) return console.log("no transaction");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const transaction = await provider.getTransaction(transactionData.transactionHash);
      const receipt = await provider.getTransactionReceipt(transactionData.transactionHash);

      if (!receipt || !receipt.logs) {
        throw new Error("Transaction receipt or logs not available");
      }
      const contractLogs = receipt.logs.filter(log => log.address === "0x138521Fb2b82FaB7BBC1804420D0dFD1fc40627E");
      const contractInterface = new ethers.utils.Interface(abi);
  
      contractLogs.forEach(log => {
        const parsedLog = contractInterface.parseLog(log);
        setMethod(parsedLog.name);
        const weiValue = parsedLog.args[2].toString();
        const weiToEth = weiValue / 10 ** 18; 
        setValue(weiToEth);
        // console.log("parsedlog:",parsedLog);
      });
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  }

  if (isConfirming) {
    return <div>Loading...</div>;
  }

  if (!isConfirmed || !transactionData) {
    return <div>Transaction data not available.</div>;
  }

  fetchTransactionDetails();

    const etherscanUrl = `https://sepolia.etherscan.io/tx/${hash}`;

    return (
          <>
          
          {transactionData && (
            <tr className="text-sm">
              <td className="p-2 border border-gray-500 whitespace-nowrap"><a href={etherscanUrl} target="_blank" rel="noopener noreferrer">{transactionData.transactionHash}</a></td>
              <td className="p-2 border border-gray-500">{method}</td>
              <td className="p-2 border border-gray-500">{stripLeadingZeros(transactionData.logs[0].topics[1])}</td>
              <td className="p-2 border border-gray-500">{stripLeadingZeros(transactionData.logs[0].topics[2])}</td>
              <td className="p-2 border border-gray-500">{value}</td>
              </tr>
              
          )}
          
          </>
    );
  }
  