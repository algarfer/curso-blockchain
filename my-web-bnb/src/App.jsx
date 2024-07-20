import detectEthereumProvider from "@metamask/detect-provider"
import { Contract, ethers } from "ethers"
import myContractManifest from "./contracts/MyContract.json"
import { useEffect, useState, useRef } from "react"

const App = () => {
  const myContract = useRef(null)
  const [tickets, setTickets] = useState([])
  const [msg, setMsg] = useState("")
  const error = useRef(false)

  const configureBlockchain = async () => {
    try {
      let provider = await detectEthereumProvider()
      if(provider) {
        await provider.request({ method: "eth_requestAccounts" })
        const networkId = await provider.request({ method: 'net_version' })
  
        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();
  
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
  }

  const clickBuyTiket = async (i) => {
    const tx = await myContract.current.buyTiket(i,  {
      value: ethers.utils.parseEther("0.02"),
      gasLimit: 6721975,
      gasPrice: 20000000000,
    });
    await tx.wait();


    const tiketsUpdated = await myContract.current.getTikets();
    setTickets(tiketsUpdated);
  }

  const withdrawBalance = async () => {
    await myContract.current.transferBalanceToAdmin();
  }

  const formHandler = async (e) => {
    e.preventDefault()
    const wallet = e.target[0].value

    if(!ethers.utils.isAddress(wallet)) {
      error.current = true
      setMsg("The given value is not an address")
      return
    }
    
    const tx = await myContract.current.changeAdmin(wallet)
    await tx.wait()
    error.current = false
    setMsg("Admin changed successfully")
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
      {msg && <p style={{
        color: error.current ? "red" : "green"
      }}>{msg}</p>}
      <div style={{
        display: "flex",
        flexFlow: "column",
        alignItems: "flex-start",
        gap: "2rem",
        marginTop: "2rem"
      }}>
        <button onClick={withdrawBalance}>Withdraw balance</button>
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
