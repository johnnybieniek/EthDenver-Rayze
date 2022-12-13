import { HardhatUserConfig } from "hardhat/config"
import "hardhat-gas-reporter"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"
import "@nomiclabs/hardhat-etherscan"

dotenv.config()
const dev_mnemonic = process.env.ETH_WALLET_MNEMONIC || ""
const infura_endpoint = process.env.ETH_INFURA_RINKEBY || ""
const acct = process.env.ETH_W1 || ""
const mumbai_endpoint = process.env.ETH_MUMBAI || ""
const matic_endpoint = process.env.ETH_MATIC || ""
const goerli_endpoint = process.env.ETH_GOERLI || ""

const config: HardhatUserConfig = {
    solidity: "0.8.17",
    gasReporter: {
        currency: "USD",
        coinmarketcap: process.env.COINMARKETCAP,
        gasPrice: 200,
    },
    networks: {
        // hardhat: {
        //   forking: {
        //     url: infura_endpoint
        //   },
        //   gasPrice: 10*10000000000,
        //   initialBaseFeePerGas: 0,
        //   loggingEnabled: false,
        //   accounts: {
        //     mnemonic: dev_mnemonic
        //   },
        //   chainId: 1, // metamask -> accounts -> settings -> networks -> localhost 8545 -> set chainId to 1
        // },
        rinkeby: {
            url: infura_endpoint,
            //gas: 2100000,
            //initialBaseFeePerGas: 0,
            gas: 10 * 1000000000000,
            accounts: {
                mnemonic: dev_mnemonic,
            },
        },
        goerli: {
            url: goerli_endpoint,
            //gas: 2100000,
            //initialBaseFeePerGas: 0,
            gas: 10 * 1000000000000,
            accounts: {
                mnemonic: dev_mnemonic,
            },
        },
        mumbai: {
            url: mumbai_endpoint,
            gas: 10 * 1000000000000,
            accounts: {
                mnemonic: dev_mnemonic,
            },
        },
        matic: {
            url: matic_endpoint,
            gas: 10 * 1000000000000,
            accounts: {
                mnemonic: dev_mnemonic,
            },
        },
    },
}
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})

export default config
