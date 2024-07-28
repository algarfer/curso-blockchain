import detectEthereumProvider from "@metamask/detect-provider"
import { BigNumber, Contract, ethers } from "ethers"
import bankManifest from "./contracts/Bank.json"
import { useEffect, useState, useRef } from "react"

const weiToEth = (wei) => ethers.utils.formatEther(BigNumber.from(wei))

const App = () => {
  const bank = useRef(null)
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
  
        bank.current = new Contract(
          import.meta.env.VITE_BANK_ADDRESS || "no-address",
          bankManifest.abi,
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

  const formHandler = async (e) => {
    e.preventDefault();

    const BNBamount = parseFloat(e.target.elements[0].value);
  
      // Wei to BNB se pasa con ethers.utils recibe un String!!!
      const tx = await bank.current.deposit({
          value: ethers.utils.parseEther(String(BNBamount)),
          gasLimit: 6721975,
          gasPrice: 20000000000,
      });
      await tx.wait();
      
      e.target.elements[0].value = "";
  }

  const clickWithdraw = async () => {
    await bank.current.withdraw();
  }


  useEffect(() => {
    initContracts()
    //eslint-disable-next-line
  }, [])

  return (
    <div style={{
      margin: "2rem",
    }}>
      <h1>BNB Bank</h1>
      <p>User balance: {weiToEth(userBalance)} BNB</p>
      <form onSubmit={formHandler} style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem"
      }}>
        <input type="number" step="0.01" />
        <input type="submit" value="Deposit" />
      </form>

      <button onClick= { clickWithdraw } > Withdraw </button>
    </div>
  )
}

export default App
