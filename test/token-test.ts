import { expect } from "chai"
import { beforeEach, it } from "mocha"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { MealToken, MealToken__factory } from "../typechain-types"

const TOKEN_NAME = "Meal Token"
const TOKEN_SYMBOL = "MTK"

const PURCHASE_AMOUNT = "0.01"
const LITTLE_AMOUNT = "0.0001"

describe("Meal Token", async function () {
    let accounts: SignerWithAddress[]
    let token: MealToken
    let mealTokenFactory: MealToken__factory

    beforeEach(async () => {
        accounts = await ethers.getSigners()
        mealTokenFactory = await ethers.getContractFactory("MealToken")

        token = await mealTokenFactory.deploy(TOKEN_NAME, TOKEN_SYMBOL)
        await token.deployed()
    })

    describe("After deploying the contracts", async () => {
        it("Initializes the contracts properly", async () => {
            console.log(`Token successfully deployed at: ${token.address}`)
        })
        it("Token supply is zero", async () => {
            const tokenSupply = await token.totalSupply()
            expect(tokenSupply).to.eq(0)
        })
    })

    describe("Purchase Meal Tokens", async () => {
        it("Only accepts the right stablecoins as payment", async () => {
            throw new Error("Not implemented!")
        })
        it("Reverts if the transaction amount is below minimum", async () => {
            await expect(
                token.mint(accounts[1].address, {
                    value: ethers.utils.parseEther(LITTLE_AMOUNT),
                })
            ).to.be.revertedWithCustomError(token, "MealToken__NotEnoughEthSent")
        })
        it("Mints the correct amount of tokens to the user's wallet", async () => {
            const userBalanceBefore = await token.balanceOf(accounts[1].address)
            expect(userBalanceBefore.toString()).to.eq("0")

            const tx = await token.mint(accounts[1].address, {
                value: ethers.utils.parseEther(PURCHASE_AMOUNT),
            })
            await tx.wait()
            const userBalanceBnAfter = await token.balanceOf(accounts[1].address)
            const userBalanceAfter = ethers.utils.formatEther(userBalanceBnAfter)
            expect(userBalanceAfter).to.eq("10.0")
        })
    })
})
