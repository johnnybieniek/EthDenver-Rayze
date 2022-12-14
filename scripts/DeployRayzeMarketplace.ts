import { ethers } from "hardhat"
import { RayzeMarketplace__factory } from "../typechain-types"
import * as dotenv from "dotenv"
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""

const MEAL_TOKEN_ADDRESS = "0x78870c420268A1f1b0652F1aD76bbCBa6685FaD2"

async function main() {
    console.log("Deploying the Rayze Marketplace contract...")
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const deployer = new ethers.Wallet(PRIVATE_KEY, provider)

    const rayzeContractFactory = new RayzeMarketplace__factory(deployer)

    const rayzeContract = await rayzeContractFactory.deploy(MEAL_TOKEN_ADDRESS)
    await rayzeContract.deployed()
    console.log(`Rayze Marketplace contract was successfully deployed at ${rayzeContract.address}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
