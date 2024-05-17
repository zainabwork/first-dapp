export interface TransferEvent {
    blockNumber: number;
    transactionHash: string;
    from: string;
    to: string;
    value: bigint;
  }
  
export interface TransactionListProps {
    onTransactionHash: (hash: string) => void;
    contractAddress?: string;
    abi?: number; 
  }


export interface TransactionListProps {
    onTransactionHash: (hash: string) => void; // Callback function to update hash in Home component
  }