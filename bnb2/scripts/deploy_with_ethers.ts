// This script can be used to deploy the "Storage" contract using ethers.js library.
// Please make sure to compile "./contracts/1_Storage.sol" file before running this script.
// And use Right click -> "Run" from context menu of the file to run the script. Shortcut: Ctrl+Shift+S

import { deploy } from './ethers-lib'

(async () => {
  try {
    const tokenContract = await deploy('Token', [])
    console.log(`address tokenContract: ${tokenContract.address}`)

    const bankContract = await deploy('Bank', [tokenContract.address])
    console.log(`address bankContract: ${bankContract.address}`)

    tokenContract.passMinterRole( bankContract.address );

  } catch (e) {
    console.log(e.message)
  }
})()
