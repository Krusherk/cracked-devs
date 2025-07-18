import { ethers } from 'ethers'

const connectWallet = async () => {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = await provider.getSigner()
    console.log("Connected:", await signer.getAddress())
  } else {
    alert("Install MetaMask!")
  }
}