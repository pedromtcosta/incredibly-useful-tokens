import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import erc20 from "./artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import { BigNumber, Contract } from "ethers";
import { HttpNetworkAccountsConfig, HttpNetworkConfig } from "hardhat/types";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts")
  .setAction(async (args, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
      console.log(account.address);
    }
  });

task("erc20supply", "Prints the current total supply from a ERC20 token")
  .addParam("token", "The address of the ERC20 token")
  .setAction(async (args: {token: any}, hre) => {
    const accounts = await hre.ethers.getSigners();
    const tokenContract = new hre.ethers.Contract(args.token, cast(erc20.abi), accounts[0]);
    const totalSupply: BigNumber = await tokenContract.totalSupply();
    await logAmountFromERC20(totalSupply, tokenContract);
  });

task("erc20balance", "Prints the amount of a specific ERC20 token an address holds")
  .addParam("token", "The address of the ERC20 token")
  .addParam("account", "The account's address")
  .setAction(async (args: {token: any, account: any}, hre) => {
    const accounts = await hre.ethers.getSigners();
    const tokenContract = new hre.ethers.Contract(args.token, cast(erc20.abi), accounts[0]);
    const balance = await tokenContract.balanceOf(args.account);
    await logAmountFromERC20(balance, tokenContract);
  });

task("erc20transfer", "Transfers ERC20 tokens from one address to another")
  .addParam("token", "The address of the ERC20 token")
  .addParam("sender", "The address or index of the sender")
  .addParam("recipient", "The address or index of the recipient")
  .addParam("amount", "The amount to transfer")
  .setAction(async (args: {token: any, sender: any, recipient: any, amount: any}, hre) => {
    const accounts = await hre.ethers.getSigners();
    const signer = accounts.find(x => x.address === args.sender);
    const tokenContract = new hre.ethers.Contract(args.token, cast(erc20.abi), signer);
    await tokenContract.transfer(args.recipient, BigNumber.from(args.amount));
    const senderNewBalance = await tokenContract.balanceOf(args.sender);
    const recipientNewBalance = await tokenContract.balanceOf(args.recipient);
    console.log("Sender's new balance");
    await logAmountFromERC20(senderNewBalance, tokenContract);
    console.log("Recipient's new balance");
    await logAmountFromERC20(recipientNewBalance, tokenContract);
  });

task("erc20approve", "Calls approve from the ERC20 token")
  .addParam("token", "The address of the ERC20 token")
  .addParam("owner", "The address from the owner")
  .addParam("spender", "The addressfromthe spender")
  .addParam("amount", "The allowance")
  .setAction(async (args, hre) => {
    const accounts = await hre.ethers.getSigners();
    const signer = accounts.find(x => x.address === args.owner);
    const tokenContract = new hre.ethers.Contract(args.token, cast(erc20.abi), signer);
    await tokenContract.approve(args.spender, args.amount);
  });

async function logAmountFromERC20(amount: BigNumber, contract: Contract) {
  const decimals: number = await contract.decimals();
  const adjustedAmount = amount.div(BigNumber.from(10).pow(decimals));
  const symbol = await contract.symbol();
  console.log(adjustedAmount.toString(), symbol, " / ", amount.toString());
}

function cast<T>(arr: any[]): T[] {
  return arr.map(x => x as T);
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
  networks: {
    ropsten: {
      url: "https://ropsten.infura.io/v3/dedc126f2fcf4c43a1d3e522fc527e54",
      accounts: [],
    } as HttpNetworkConfig
  }
};

