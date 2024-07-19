import detectEthereumProvider from "@metamask/detect-provider"
import { Contract, ethers } from "ethers"
import myContractManifest from "./contracts/MyContract.json"
import { useEffect, useState, useRef } from "react"

const App = () => {
  const myContract = useRef(null)
  const [tickets, setTickets] = useState([])

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

  useEffect(() => {
    initContracts()
    //eslint-disable-next-line
  }, [])

  return (
    <>
      <h1>Tickets store</h1>
      <button onClick={withdrawBalance}>Withdraw balance</button>
      <ul>
        {tickets.map((address, i) => (
          <li key={i}>Ticket {i} comprado por {address}
           {address == ethers.constants.AddressZero &&
           <a href="#" onClick={()=>clickBuyTiket(i)}> buy</a>}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
