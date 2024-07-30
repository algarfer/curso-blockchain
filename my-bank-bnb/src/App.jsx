import detectEthereumProvider from "@metamask/detect-provider"
import { BigNumber, Contract, ethers } from "ethers"
import bankManifest from "./contracts/Bank.json"
import { useEffect, useState, useRef } from "react"

const weiToEth = (wei) => ethers.utils.formatEther(BigNumber.from(wei))

const App = () => {
  const bank = useRef(null)
  const myProvider = useRef(null)
  const [userBalance, setUserBalance] = useState(0)
  const [depositedBalance, setDepositedBalance] = useState(0)
  const [interestBalance, setInterestBalance] = useState(0)
  const [BNBamount, setBNBamount] = useState(0)
  const [BMIWamount, setBMIWamount] = useState(0)

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
      }
      //eslint-disable-next-line
    } catch (error) {}
  }

  const initContracts = async () => {
    await configureBlockchain()
    await updateBalances();
  }

  const updateBalances = async () => {
    await getUserBalance()
    await getDepositedBalance()
    await getInterestBalance()
  }

  const getUserBalance = async () => {
    const balance = await myProvider.current.getSigner().getBalance()
    setUserBalance(balance.toString())
  }

  const getDepositedBalance = async () => {
    const deposited = await bank.current.getBNB();
    setDepositedBalance(deposited.toString())
  }

  const getInterestBalance = async () => {
    const interest = await bank.current.getBMIW();
    setInterestBalance(interest.toString())
  }

  const depositFormHandler = async (e) => {
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
      await updateBalances()
  }

  const clickWithdraw = async () => {
    await bank.current.withdraw({
      value: ethers.utils.parseEther("0.05"),
      gasLimit: 6721975,
      gasPrice: 20000000000,
    });
    await updateBalances()
  }

  const buyFormHandler = async (e) => {
    e.preventDefault();

    if(BMIWamount === "") return


    console.log(Number(BMIWamount))
    const tx = await bank.current.buyBMIW(Number(BMIWamount), {
      value: BigNumber.from(BNBamount),
      gasLimit: 6721975,
      gasPrice: 20000000000,
    });

    await tx.wait();

    e.target.elements[0].value = "";
    await updateBalances()
  }

  useEffect(() => {
    initContracts()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(!bank.current) return
    (async () => {
      if(BMIWamount === "") {
        setBNBamount(0)
        return
      }
      
      const amount = await bank.current.costBMIW(BMIWamount)
      setBNBamount(amount.toString())
    })()
  }, [BMIWamount])

  return (
    <div style={{
      margin: "2rem",
    }}>
      <h1>BNB Bank</h1>
      <hr />
      <h2 style={{marginBottom: "1rem"}}>Deposit BNB</h2>
      <p>User balance: {weiToEth(userBalance)} BNB</p>
      <form onSubmit={depositFormHandler} style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        marginBottom: "1rem"
      }}>
        <input type="number" step="0.01" placeholder="10 BNB" />
        <input type="submit" value="Deposit" />
      </form>
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        alignItems: "center",
        alignContent: "center"
      }}>
        <p style={{margin: 0}}>Deposited: {weiToEth(depositedBalance)} BNB</p>
        <p style={{margin: 0}}>Interest: {weiToEth(interestBalance)} BMIW</p>
        <button onClick= { clickWithdraw } > Withdraw </button>
      </div>
      <hr />
      <h2 style={{marginBottom: "1rem"}}>Buy BMIW</h2>
      <form onSubmit={ buyFormHandler } style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        alignItems: "center",
        alignContent: "center"
      }}>
        <p style={{ margin: 0}}>Cost: {weiToEth(BNBamount)} BNB</p>
        <input type="number" step="0.01" placeholder="10 BMIW" onChange={(e) => setBMIWamount(e.target.value)} />
        <input type="submit" value="Buy" />
      </form>
    </div>
  )
}

export default App
