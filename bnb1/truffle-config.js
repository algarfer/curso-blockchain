require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const provider = new HDWalletProvider({
  privateKeys: [process.env.PRIVATE_KEY || 'no-key'],
  providerOrUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
})
module.exports = {
  networks: {
    binanceTestnet: {
      provider: () => provider,
      network_id: "97",
      gas: 5000000
    },
    develop: {
      port: 8545
    }
  },
  compilers: {
    solc: {
      version: "0.8.17" // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};