// This script can be used to deploy the "Storage" contract using ethers.js library.
// Please make sure to compile "./contracts/1_Storage.sol" file before running this script.
// And use Right click -> "Run" from context menu of the file to run the script. Shortcut: Ctrl+Shift+S

import { deploy } from './ethers-lib'
import { ethers } from 'ethers'

(async () => {
  try {
    const tokenKey = ""

    const voteSystemContract = await deploy('VoteSystem', [tokenKey])
    console.log(`address voteSystemContract: ${voteSystemContract.address}`)

    const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
    const abi = ["function passMinterRole(address nuevoMinter) public returns (bool)"]

    const tokenVoteContract = new ethers.Contract(tokenKey, abi, signer)

    tokenVoteContract.passMinterRole( voteSystemContract.address );
    console.log(`pass Minter role`)

  } catch (e) {
    console.log(e.message)
  }
})()

