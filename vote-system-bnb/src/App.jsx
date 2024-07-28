import detectEthereumProvider from "@metamask/detect-provider"
import { Contract, ethers } from "ethers"
import voteSystemManifest from "./contracts/VoteSystem.json"
import { useEffect, useState, useRef } from "react"

const App = () => {
  const voteSystem = useRef(null)
  const [ votesOption1, setVotesOption1 ] = useState(0)
  const [ votesOption2, setVotesOption2 ] = useState(0)

  const configureBlockchain = async () => {
    try {
      let provider = await detectEthereumProvider()
      if(provider) {
        await provider.request({ method: "eth_requestAccounts" })
  
        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();
  
        voteSystem.current = new Contract(
          import.meta.env.VITE_VOTE_ADDRESS || "no-address",
          voteSystemManifest.abi,
          signer
        );
      }
      //eslint-disable-next-line
    } catch (error) {}
  }

  const initContracts = async () => {
    await configureBlockchain()
    await getVotes()
  }
  
  const getVotes = async () => {
    const o1 = await voteSystem.current.getVotesOption1();
    setVotesOption1(o1)
  
    const o2 = await voteSystem.current.getVotesOption2();
    setVotesOption2(o2)
  }

  const clickGiveMeTokens = async () => {
    try {
      const tx = await voteSystem.current.giveTokens();
      await tx.wait();
    } catch (e) {
      console.error(e)
    }
  }

  const voteFor = async (option) => {
    const tx = await voteSystem.current.vote(option)
    await tx.wait()

    await getVotes()
  }
  
  useEffect(() => {
    initContracts()
    //eslint-disable-next-line
  }, [])

  return (
    <div style={{
      margin: "2rem"
    }}>
      <h1>BNB Vote System</h1>
      <h2>
        Option 1: {ethers.BigNumber.from(votesOption1).toNumber()} <button onClick= { () => { voteFor(1) } }> Vote for 1</button>
      </h2>
      <h2>
        Option 2: {ethers.BigNumber.from(votesOption2).toNumber()} <button onClick= { () => { voteFor(2) } }> Vote for 2</button>
      </h2>
      <hr />
      <button onClick={ clickGiveMeTokens }>Give me tokens</button>
    </div>
  )
}

export default App
