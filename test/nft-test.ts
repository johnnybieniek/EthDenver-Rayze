import { expect } from "chai"
import { beforeEach, it } from "mocha"
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

const TOKEN_NAME = "Meal Token"
const TOKEN_SYMBOL = "MTK"

describe("Meal NFT", async () => {
    let accounts: SignerWithAddress[]
    let rayze: RayzeMarketplace
    let mealNFT: RayzeMeal
    let mealToken: MealToken
    let rayzeContractFactory: RayzeMarketplace__factory
    let nftContractFactory: RayzeMeal__factory
    let mealTokenFactory: MealToken__factory

    beforeEach(async () => {
        accounts = await ethers.getSigners()
        rayzeContractFactory = await ethers.getContractFactory("RayzeMarketplace")
        nftContractFactory = await ethers.getContractFactory("RayzeMeal")
        mealTokenFactory = await ethers.getContractFactory("MealToken")

        // deploying the marketplace contract
        rayze = await rayzeContractFactory.deploy(TOKEN_NAME, TOKEN_SYMBOL)
        await rayze.deployed()

        // deploying the token contract
        const tokenAddress = await rayze.mealToken()
        mealToken = mealTokenFactory.attach(tokenAddress).connect(ethers.provider)

        // deploying the NFT contract
        mealNFT = await nftContractFactory.deploy()
        await mealNFT.deployed()
    })

    describe("After deploying the contracts:", async () => {
        it("Displays the addresses of the contracts", async () => {
            console.log(`Rayze marketplace deployed at: ${rayze.address}`)
            console.log(`Meal token deployed at: ${mealToken.address}`)
            console.log(`Meal NFT deployed at: ${mealNFT.address}`)
        })
    })
})
