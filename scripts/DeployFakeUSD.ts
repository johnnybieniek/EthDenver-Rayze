import { ethers } from "hardhat"
import { FakeUSD__factory } from "../typechain-types"
import * as dotenv from "dotenv"
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""

async function main() {
    console.log("Deploying the FakeUSD contract...")
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const deployer = new ethers.Wallet(PRIVATE_KEY, provider)

    const tokenContractFactory = new FakeUSD__factory(deployer)

    const tokenContract = await tokenContractFactory.deploy()
    await tokenContract.deployed()
    console.log(`FakeUSD contract was successfully deployed at ${tokenContract.address}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
