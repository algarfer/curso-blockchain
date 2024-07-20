import detectEthereumProvider from "@metamask/detect-provider"
import { BigNumber, Contract, ethers } from "ethers"
import myContractManifest from "./contracts/MyContract.json"
import { useEffect, useState, useRef } from "react"

const weiToEth = (wei) => ethers.utils.formatEther(BigNumber.from(wei))

const App = () => {
  const myContract = useRef(null)
  const myProvider = useRef(null)
  const [tickets, setTickets] = useState([])
  const [msg, setMsg] = useState("")
  const [adminMsg, setAdminMsg] = useState("")
  const [walletBalance, setWalletBalance] = useState(0)
  const [weiBalance, setWeiBalance] = useState(0)
  const [userBalance, setUserBalance] = useState(0)
  const error = useRef(false)

  const configureBlockchain = async () => {
    try {
      let provider = await detectEthereumProvider()
      if(provider) {
        await provider.request({ method: "eth_requestAccounts" })
        const networkId = await provider.request({ method: 'net_version' })
  
        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();
        myProvider.current = provider;
  
        myContract.current = new Contract(
          myContractManifest.networks[networkId].address,
          myContractManifest.abi,
          signer
        );
      
      }
      //eslint-disable-next-line
    } catch (error) {}
  }

  const initContracts = async () => {
    await configureBlockchain()
    const ticketsFromBlockchain = await myContract.current?.getTikets();
    if(ticketsFromBlockchain) {
      setTickets(ticketsFromBlockchain)
    }
    await getContractBalance();
    await getUserBalance();
  }

  const getContractBalance = async () => {
    const [wei, wallet] = await myContract.current.getBalance();

    setWeiBalance(wei.toString())
    setWalletBalance(wallet.toString())
  }

  const getUserBalance = async () => {
    const balance = await myProvider.current.getSigner().getBalance()
    setUserBalance(balance.toString())
  }

  const clickBuyTiket = async (i) => {
    const balance = await myProvider.current.getSigner().getBalance()
    if(balance.lt(ethers.utils.parseEther("0.02"))) {
      setMsg("You need at least 0.02 BNB to buy a ticket")
      return
    }

    try {
      const tx = await myContract.current.buyTiket(i,  {
        value: ethers.utils.parseEther("0.02"),
        gasLimit: 6721975,
        gasPrice: 20000000000,
      });
      await tx.wait(); 
    } catch (e) {
      let transaction = await myProvider.current.getTransaction(e.transactionHash);
      myProvider.current.call(transaction,transaction.blockNumber).then(
        () => { },
        (error) =>  setMsg(error.data.message)
      );
      return
    }

    const tiketsUpdated = await myContract.current.getTikets();
    setTickets(tiketsUpdated);
    await getContractBalance();
    await getUserBalance();
  }

  const withdrawBalance = async () => {
    const tx = await myContract.current.transferBalanceToAdmin();
    await tx.wait()

    await getContractBalance()
  }

  const formHandler = async (e) => {
    e.preventDefault()
    const wallet = e.target[0].value

    if(!ethers.utils.isAddress(wallet)) {
      error.current = true
      setAdminMsg("The given value is not an address")
      return
    }
    
    const tx = await myContract.current.changeAdmin(wallet)
    await tx.wait()
    error.current = false
    setAdminMsg("Admin changed successfully")
  }

  useEffect(() => {
    initContracts()
    //eslint-disable-next-line
  }, [])

  return (
    <div style={{
      margin: "2rem"
    }}>
      <h1>Ticket store</h1>
      <p>{weiToEth(userBalance)} BNB User balance</p>
      {msg && <p style={{color: "red"}}>{msg}</p>}
      <ul>
        {tickets.map((address, i) => (
          <li key={i}>Ticket {i} comprado por {address}
           {address == ethers.constants.AddressZero &&
           <a href="#" onClick={()=>clickBuyTiket(i)}> buy</a>}
          </li>
        ))}
      </ul>
      <hr />
      <h2>Admin Panel</h2>
      {adminMsg && <p style={{
        color: error.current ? "red" : "green"
      }}>{adminMsg}</p>}
      <div style={{
        display: "flex",
        flexFlow: "column",
        alignItems: "flex-start",
        gap: "2rem",
        marginTop: "2rem"
      }}>
        <div style={{
          display: "flex",
          gap: "1rem"
        }}>
          <p>{weiBalance} Wei Balance</p>
          <p>{weiToEth(walletBalance)} BNB Wallet Balance</p>
          <button onClick={withdrawBalance}>Withdraw balance</button>
        </div>
        <form onSubmit={formHandler} style={{
          display: "flex",
          gap: "1rem"
        }}>
          <input type="text" placeholder="Admin wallet"></input>
          <input type="submit" value="Change admin"></input>
        </form>
      </div>
    </ div>
  )
}

export default App
