import { useWallet } from '../hooks/useWallet';

export function WalletButton() {
  const { address, error, connectWallet } = useWallet();

  const shortenAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {address ? (
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
          Connected: {shortenAddress(address)}
        </button>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
const sendMon = async (recipientAddress, amount) => {
  if (!provider || !address) return;
  
  const signer = await provider.getSigner();
  const tx = await signer.sendTransaction({
    to: recipientAddress,
    value: ethers.parseEther(amount),
  });
  
  console.log("TX Hash:", tx.hash);
  return tx;
};