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
const NFT_NAME = "RayzeMeal"
const NFT_SYMBOL = "RML"

const PURCHASE_AMOUNT = "0.01"

describe("Rayze Marketplace", async () => {
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
        rayze = await rayzeContractFactory.deploy(TOKEN_NAME, TOKEN_SYMBOL, NFT_NAME, NFT_SYMBOL)
        await rayze.deployed()

        // deploying the token contract
        const tokenAddress = await rayze.mealToken()
        mealToken = mealTokenFactory.attach(tokenAddress).connect(ethers.provider)

        // deploying the NFT contract
        const nftAddress = await rayze.rayzeMeal()
        mealNFT = nftContractFactory.attach(nftAddress).connect(ethers.provider)
        await mealNFT.deployed()
    })

    describe("After deploying the contracts", async () => {
        it("Initializes the contracts properly", async () => {
            const tokenName = await mealToken.name()
            const tokenSymbol = await mealToken.symbol()
            const nftName = await mealNFT.name()
            const nftSymbol = await mealNFT.symbol()

            expect(TOKEN_NAME).to.eq(tokenName)
            expect(TOKEN_SYMBOL).to.eq(tokenSymbol)
            expect(NFT_NAME).to.eq(nftName)
            expect(NFT_SYMBOL).to.eq(nftSymbol)
        })
        it("Token supply is zero", async () => {
            const tokenSupply = await mealToken.totalSupply()
            expect(tokenSupply).to.eq(0)
        })
    })

    describe("Purchase Meal Tokens", async () => {
        it("Only accepts the right stablecoins as payment", async () => {
            throw new Error("Not implemented!")
        })
        it("Reverts if the stablecoin amount sent is below minimum", async () => {
            throw new Error("Not implemented!")
        })
        it("Mints the correct amount of tokens to the user's wallet", async () => {
            const userBalanceBefore = await mealToken.balanceOf(accounts[1].address)
            expect(userBalanceBefore.toString()).to.eq("0")

            const tx = await rayze
                .connect(accounts[1])
                .purchaseMealTokens({ value: ethers.utils.parseEther(PURCHASE_AMOUNT) })
            await tx.wait()
            const userBalanceBnAfter = await mealToken.balanceOf(accounts[1].address)
            const userBalanceAfter = ethers.utils.formatEther(userBalanceBnAfter)
            expect(userBalanceAfter).to.eq("10.0")
        })
    })

    describe("Redeem Meal Tokens", async () => {
        it("Reverts if user's balance is 0", async () => {
            throw new Error("Not implemented!")
        })
        it("Allows the user to redeem meal coins back to the stablecoin", async () => {
            throw new Error("Not implemented!")
        })
    })

    describe("Register a restaurant", async () => {
        it("Allows a new reestaurant to register with a wallet address(es?)", async () => {
            throw new Error("Not implemented!")
        })
        it("Reverts if the restaurant already exists in the mapping", async () => {
            throw new Error("Not implemented!")
        })
        it("Makes sure that all of the fields are properly filled out. Reverts otherwise", async () => {
            throw new Error("Not implemented!")
        })
    })

    describe("Issue Rayze Meal (by the restaurant)", async () => {
        it("Requires all of the fields to be properly filled. Reverts otherwise", async () => {
            throw new Error("Not implemented!")
        })
        it("Successfully mints the number of meals requested to the restaurant's wallet", async () => {
            throw new Error("Not implemented!")
        })
    })

    describe("Escrow balance (restaurant)", async () => {
        it("Reverts when a third-party is trying to view this data (?)", async () => {
            throw new Error("Not implemented!")
        })
        it("Returns the restaurant's escrow balance", async () => {
            throw new Error("Not implemented!")
        })
    })

    describe("Withdraw proceeds (restaurant)", async () => {
        it("Only allows the restaurant's wallet to withdraw", async () => {
            throw new Error("Not implemented!")
        })
        it("Reverts if the restaurant doesn't have any proceeds", async () => {
            throw new Error("Not implemented!")
        })
        it("Successfully withdraws when all conditions are satisfied. Restaurant's wallet balance increases accordingly", async () => {
            throw new Error("Not implemented!")
        })
    })

    describe("Balanced booked", async () => {
        it("returns the types and numbers of active meals that a user can redeem", async () => {
            throw new Error("Not implemented!")
        })
    })
})
