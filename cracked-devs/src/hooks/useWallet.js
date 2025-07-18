import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState('');

  // Check if wallet is connected on load
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      checkConnectedWallet();
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnectedWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await connectWallet();
      }
    } catch (err) {
      setError('Failed to check connected wallet');
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== 10143n) {
        throw new Error('Please switch to Monad Testnet');
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAddress(address);
      setChainId(network.chainId.toString());
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // Wallet disconnected
      resetWallet();
    } else {
      connectWallet();
    }
  };

  const handleChainChanged = (chainId) => {
    window.location.reload();
  };

  const resetWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress('');
    setChainId(null);
  };

  return { provider, signer, address, chainId, error, connectWallet, resetWallet };
}