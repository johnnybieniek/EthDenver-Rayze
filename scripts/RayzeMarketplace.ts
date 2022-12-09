import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import {
    MealToken,
    MealToken__factory,
    RayzeMarketplace,
    RayzeMarketplace__factory,
    RayzeMeal,
    RayzeMeal__factory,
} from "../typechain-types"

let rayze: RayzeMarketplace
let token: MealToken
let accounts: SignerWithAddress[]

const TOKEN_NAME = "Meal Token"
const TOKEN_SYMBOL = "MTK"

async function main() {
    accounts = await ethers.getSigners()
    await initializeContracts()
}

async function initializeContracts() {
    const rayzeContractFactory = new RayzeMarketplace__factory(accounts[0])
    rayze = await rayzeContractFactory.deploy(TOKEN_NAME, TOKEN_SYMBOL)
    await rayze.deployed()

    const tokenAddress = await rayze.mealToken()
    const mealTokenFactory = new MealToken__factory()
    token = mealTokenFactory.attach(tokenAddress).connect(ethers.provider)

    console.log(`Rayze marketplace deployed at: ${rayze.address}`)
    console.log(`Meal token deployed at: ${tokenAddress}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
