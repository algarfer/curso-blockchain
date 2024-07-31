import detectEthereumProvider from "@metamask/detect-provider"
import { Contract, ethers } from "ethers"
import stockManagerManifest from "./contracts/StocksManager.json"
import { useEffect, useState, useRef } from "react"

const App = () => {
  const stockManager = useRef(null)
  const myProvider = useRef(null)
  const [actions, setActions] = useState(0)
  const [msg, setMsg] = useState("")

  const configureBlockchain = async () => {
    try {
      let provider = await detectEthereumProvider()
      if(provider) {
        await provider.request({ method: "eth_requestAccounts" })
  
        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();
        myProvider.current = provider;
  
        stockManager.current = new Contract(
          import.meta.env.VITE_STOCK_MANAGER_ADDRESS || "no-address",
          stockManagerManifest.abi,
          signer
        );

      }
      //eslint-disable-next-line
    } catch (error) {}
  }

  const initContracts = async () => {
    await configureBlockchain()
    await getActions()
  }

  const getActions = async () => {
    try {
      const actions = await stockManager.current.getNumberOfActions();
      setActions(actions.toNumber())
    } catch (error) {
      console.error(error)
    }
  }

  const buttonHandler = async () => {
    try {
      const tx = await stockManager.current.buyAction({
        value: ethers.utils.parseEther("0.01")
      })  
      await tx.wait()

      setMsg("Transacción exitosa")
      await getActions()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    initContracts()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setMsg("")
    }, 5000);
  }, [msg])

  return (
    <div style={{
      margin: "2rem",
    }}>
      <h1>BNB Stocks Manager</h1>
      <hr />
      <p>Actualmente posees {actions} {actions === 1 ? "accion" : "acciones"}</p>
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem"
      }}>
        <button onClick={buttonHandler}>Comprar una accion</button>
        {msg && <p style={{ margin: 0 }}>{msg}</p>}
      </div>
    </div>
  )
}

export default App
