require('dotenv').config();

const MyContract = artifacts.require("MyContract");

module.exports = function(deployer) {
    deployer.deploy(MyContract, process.env.PUBLIC_KEY || "no-key");
};