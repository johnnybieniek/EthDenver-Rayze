import { ethers } from "hardhat"
import { MealToken__factory } from "../typechain-types"
import * as dotenv from "dotenv"
dotenv.config()

const TOKEN_NAME = "Meal Token"
const TOKEN_SYMBOL = "MTK"
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""

async function main() {
    console.log("Deploying the MealToken contract...")
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const deployer = new ethers.Wallet(PRIVATE_KEY, provider)

    const tokenContractFactory = new MealToken__factory(deployer)

    const tokenContract = await tokenContractFactory.deploy(TOKEN_NAME, TOKEN_SYMBOL)
    await tokenContract.deployed()
    console.log(`MealToken contract was successfully deployed at ${tokenContract.address}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
