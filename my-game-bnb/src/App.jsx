import detectEthereumProvider from "@metamask/detect-provider"
import { Contract, ethers } from "ethers"
import myGameManifest from "./contracts/Main.json"
import { useEffect, useState, useRef } from "react"

const App = () => {
  const gameContract = useRef(null)
  const player1Ref = useRef(null)
  const player2Ref = useRef(null)
  const selectedRules = useRef(null)
  const [ message, setMessage ] = useState("")

  const configureBlockchain = async () => {
    try {
      let provider = await detectEthereumProvider()
      if(provider) {
        await provider.request({ method: "eth_requestAccounts" })
  
        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();
  
        gameContract.current = new Contract(
          import.meta.env.VITE_MAIN_ADDRESS || "no-address",
          myGameManifest.abi,
          signer
        );
      }
      //eslint-disable-next-line
    } catch (error) {}
  }

  const initContracts = async () => {
    await configureBlockchain()
  }

  const play = async () => {
    const player1 = parseInt(player1Ref.current.value);
    const player2 = parseInt(player2Ref.current.value);
    const winner  = await gameContract.current?.play(player1,player2);
    setMessage(`The winner is: ${winner}`);
  };

  const changeToNewRules = async () => {
    if(!selectedRules.current) selectedRules.current = import.meta.env.VITE_RULES_ADDRESS || "no-address";

    try {
      const tx  = await gameContract.current?.setRules(selectedRules.current);
      await tx.wait();
      setMessage(`New Rules!!`);
    } catch (error) {
      console.log(error)
    }

    selectedRules.current = selectedRules.current === import.meta.env.VITE_RULES_ADDRESS 
      ? import.meta.env.VITE_RULES2_ADDRESS
      : import.meta.env.VITE_RULES_ADDRESS;
  };

  useEffect(() => {
    initContracts()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    setTimeout(() => setMessage(""), 5000);
  }, [message])

  const divStyle = {
    display: "flex",
    flexFlow: "row",
    gap: "1rem",
    alignItems: "center",
    alignContent: "center"
  }

  const pStyle = { margin: 0 }

  return (
    <div style={{
      margin: "2rem"
    }}>
      <h1>BNB Game</h1>
      { message && <p>{message}</p> }
      <div style={{
        display: "flex",
        flexFlow: "column",
        gap: "1rem"
      }}>
        <div style={ divStyle }>
          <p style={ pStyle }>Player 1 selection: </p>
          <input 
            type="number" 
            ref={player1Ref} 
            placeholder="1 STONE 2 PAPER 3 SCISSORS" 
          />
        </div>
        <div style={ divStyle }>
          <p style={ pStyle }>Player 2 selection: </p>
          <input 
            type="number" 
            ref={player2Ref} 
            placeholder="1 STONE 2 PAPER 3 SCISSORS" 
          />
        </div>
        <div style={ divStyle }>
          <button onClick={changeToNewRules}>New Rules!</button>
          <button onClick={play}>Play</button>
        </div>
      </div>
    </div>
  )
}

export default App
