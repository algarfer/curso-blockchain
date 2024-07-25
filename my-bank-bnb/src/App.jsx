import detectEthereumProvider from "@metamask/detect-provider"
import { BigNumber, Contract, ethers } from "ethers"
import myContractManifest from "./contracts/MyContract.json"
import { useEffect, useState, useRef } from "react"

const weiToEth = (wei) => ethers.utils.formatEther(BigNumber.from(wei))

const App = () => {
  const myContract = useRef(null)
  const myProvider = useRef(null)
  const [userBalance, setUserBalance] = useState(0)
  const walletAddress = useRef("")

  const configureBlockchain = async () => {
    try {
      let provider = await detectEthereumProvider()
      if(provider) {
        await provider.request({ method: "eth_requestAccounts" })
  
        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();
        myProvider.current = provider;
  
        myContract.current = new Contract(
          import.meta.env.VITE_CONTRACT_WALLET_ADDRESS || "no-address",
          myContractManifest.abi,
          signer
        );

        walletAddress.current = await signer.getAddress()
      }
      //eslint-disable-next-line
    } catch (error) {}
  }

  const initContracts = async () => {
    await configureBlockchain()
    await getUserBalance();
  }

  const getUserBalance = async () => {
    const balance = await myProvider.current.getSigner().getBalance()
    setUserBalance(balance.toString())
  }

  useEffect(() => {
    initContracts()
    //eslint-disable-next-line
  }, [])

  return (
    <h1>BNB Bank</h1>
  )
}

export default App
