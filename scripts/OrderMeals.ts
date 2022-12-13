import { ethers } from "hardhat"
import * as readline from "readline"
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

const BET_PRICE = 1
const BET_FEE = 0.2
const TOKEN_RATIO = 1

const PURCHASE_AMOUNT = "0.01"

async function main() {
    await initAccounts()
    await initContracts()
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    mainMenu(rl)
}

async function initContracts() {
    const tokenFactory = await ethers.getContractFactory("MealToken")
    token = await tokenFactory.deploy("Rayze", "RYZ")
    await token.deployed()

    const tx = await token.connect(accounts[0]).mint(accounts[1].address, {
        value: ethers.utils.parseEther(PURCHASE_AMOUNT),
    })
    tx.wait()

    const balBN = await token.balanceOf(accounts[1].address)
    const bal = ethers.utils.formatEther(balBN)
    console.log(`The balance of ${accounts[1].address} is ${bal} MTK`)

    const contractFactory = await ethers.getContractFactory("RayzeMarketplace")
    rayze = await contractFactory.deploy(token.address)
    await rayze.deployed()
}

async function initAccounts() {
    accounts = await ethers.getSigners()
}

async function mainMenu(rl: readline.Interface) {
    menuOptions(rl)
}

function menuOptions(rl: readline.Interface) {
    rl.question(
        "Select operation: \n Options: \n [0]: Exit \n [1]: Add restaurant \n [2]: Create & Register Meal NFT \n [3]: Set Max Meals to Sell for the day \n [4]: Buy Meal \n [5]: Redeem Meal \n [6]: Load Meal Coin \n [7]: Restaurant withdraw \n [8]: Lookup Restaurant\n [9]: Lookup Meal \n",
        async (answer: string) => {
            console.log(`Selected: ${answer}\n`)
            const option = Number(answer)
            switch (option) {
                case 0:
                    rl.close()
                    return
                case 1:
                    rl.question("Add Restaurant Name\n", async (name) => {
                        try {
                            await addRestaurant(name)
                        } catch (error) {
                            console.log("error\n")
                            console.log({ error })
                        }
                        mainMenu(rl)
                    })
                    break
                case 2:
                    rl.question("What is the name of the restaurant\n", async (rName) => {
                        rl.question("What is the name of the meal?\n", async (mName) => {
                            try {
                                await createMeal(rName, mName)
                            } catch (error) {
                                console.log("error\n")
                                console.log({ error })
                            }
                            mainMenu(rl)
                        })
                    })
                    break
                case 3:
                    rl.question("What is the name of the restaurant\n", async (rName) => {
                        rl.question("What is the index of the meal?\n", async (mIx) => {
                            rl.question(
                                "What are the Max Meals you are willing to sell\n",
                                async (maxSupply) => {
                                    try {
                                        await setMaxSupply(rName, mIx, maxSupply)
                                    } catch (error) {
                                        console.log("error\n")
                                        console.log({ error })
                                    }
                                    mainMenu(rl)
                                }
                            )
                        })
                    })
                    break
                case 4:
                    rl.question("What is the name of the restaurant\n", async (rName) => {
                        rl.question("What is the index of the meal?\n", async (mIx) => {
                            try {
                                await bookMeal(rName, mIx)
                            } catch (error) {
                                console.log("error\n")
                                console.log({ error })
                            }
                            mainMenu(rl)
                        })
                    })
                    break
                case 5:
                    rl.question("What is the name of the restaurant\n", async (rName) => {
                        rl.question("What is the index of the meal?\n", async (mIx) => {
                            rl.question(
                                "What is the index of the NFT to redeem?\n",
                                async (nftIx) => {
                                    try {
                                        await redeemMeal(rName, mIx, nftIx)
                                    } catch (error) {
                                        console.log("error\n")
                                        console.log({ error })
                                    }
                                    mainMenu(rl)
                                }
                            )
                        })
                    })
                    break
                case 6:
                    rl.question("What account (index) to use?\n", async (index) => {
                        const prize = await displayPrize(index)
                        if (Number(prize) > 0) {
                            rl.question(
                                "Do you want to claim your prize? [Y/N]\n",
                                async (answer) => {
                                    if (answer.toLowerCase() === "y") {
                                        // try {
                                        //   await claimPrize(index, prize);
                                        // } catch (error) {
                                        //   console.log("error\n");
                                        //   console.log({ error });
                                        // }
                                    }
                                    mainMenu(rl)
                                }
                            )
                        } else {
                            mainMenu(rl)
                        }
                    })
                    break
                case 7:
                    await displayTokenBalance("0")
                    await displayOwnerPool()
                    rl.question("Withdraw how many tokens?\n", async (amount) => {
                        // try {
                        //   await withdrawTokens(amount);
                        // } catch (error) {
                        //   console.log("error\n");
                        //   console.log({ error });
                        // }
                        mainMenu(rl)
                    })
                    break
                case 8:
                    rl.question("Input index of the restaurant\n", async (name) => {
                        try {
                            await listRestaurant(name)
                        } catch (error) {
                            console.log("error\n")
                            console.log({ error })
                        }
                        mainMenu(rl)
                    })
                    break
                case 9:
                    rl.question("Input index of the meal\n", async (name) => {
                        try {
                            await listMeal(name)
                        } catch (error) {
                            console.log("error\n")
                            console.log({ error })
                        }
                        mainMenu(rl)
                    })
                    break

                default:
                    throw new Error("Invalid option")
            }
        }
    )
}

async function addRestaurant(name: string) {
    const tx = await rayze.connect(accounts[0]).registerRestaurant(name, "Rockafeller center", 55)
    tx.wait()
    const rName = await rayze.restaurantLookup(name)
    console.log(`The restaurant registered is ${rName}\n`)
}

async function createMeal(rName: string, mName: string) {
    const restInfo = await rayze.restaurantLookup(rName)
    const restAddress = restInfo.owner
    const rayzeMealFactory = await ethers.getContractFactory("RayzeMeal")
    const rMeal = await rayzeMealFactory.deploy(
        mName,
        "RYM",
        1,
        "ipfs://QmWC6NEbHNrAWy8x6BzR2rnWpkjzoVMrKxXgRxSpqNTgFh/",
        restAddress,
        50
    )
    await rMeal.deployed()

    const tx = await rayze.connect(accounts[0]).registerRayzeMeal(rName, rMeal.address)
    tx.wait()
    console.log(`sender is ${accounts[0].address}, and owner is ${restAddress}`)
    const bookWinTx = await rayze.connect(accounts[0]).setBookingOpen(true)
    bookWinTx.wait()
    // const openMealTx = await rayze.connect(accounts[0]).openMealSales(rName, rMeal.address,50);
    // openMealTx.wait();
    const meal = rMeal.address
    //const meal = await rayze.rayzeMealLookup(rName);
    console.log(`The restaurant is ${restInfo} and meal registered is ${meal}\n`)
}

async function openMealSale(rName: string, mealAddress: string) {}

async function listRestaurant(restId: string) {
    const len = await rayze.restaurantList.length
    var ix: number
    ix = +restId

    const rest = await rayze.restaurantList(ix)
    console.log(`We have ${len} restaurants. The restaurant listed is ${rest}\n`)
}

async function setMaxSupply(rName: string, mIx: string, maxSupply: string) {
    const rest = await rayze.rayzeMealList(Number(mIx))
    const rayzeMealFactory = await ethers.getContractFactory("RayzeMeal")
    const rMeal = await rayzeMealFactory.attach(rest).setMaxSupplyForSale(Number(maxSupply))
    rMeal.wait()
    const currSupply = await rayzeMealFactory.attach(rest).currentSupply()
    console.log(`The current and max supply is ${currSupply} ${maxSupply}`)
}

async function bookMeal(rName: string, mIx: string) {
    const rest = await rayze.rayzeMealList(Number(mIx))
    const appr = await token.connect(accounts[1]).approve(rayze.address, 100)
    const tx = await rayze.connect(accounts[1]).bookMeal(rest)
    tx.wait()
    console.log(`The meal is booked ${rest}`)
}

async function redeemMeal(rName: string, mIx: string, nftIx: string) {
    const rest = await rayze.rayzeMealList(Number(mIx))
    const tx = await rayze.connect(accounts[1]).redeemMeal(rest, Number(nftIx))
    tx.wait()
    console.log(`The meal is redeemed ${rest}`)
}

async function listMeal(mealId: string) {
    const len = await rayze.rayzeMealList

    var ix: number
    ix = +mealId

    const meal = await rayze.rayzeMealList(ix)
    console.log(`We have ${len.toString()} meals. The meal listed is ${meal}\n`)
}

// async function openBets(duration: string) {
//   const currentBlock = await ethers.provider.getBlock("latest");
//   const tx = await contract.openBets(currentBlock.timestamp + Number(duration));
//   const receipt = await tx.wait();
//   console.log(`Bets opened (${receipt.transactionHash})`);
// }

// async function displayBalance(index: string) {
//   const balanceBN = await ethers.provider.getBalance(
//     accounts[Number(index)].address
//   );
//   const balance = ethers.utils.formatEther(balanceBN);
//   console.log(
//     `The account of address ${
//       accounts[Number(index)].address
//     } has ${balance} ETH\n`
//   );
// }

// async function buyTokens(index: string, amount: string) {
//   const tx = await contract.connect(accounts[Number(index)]).purchaseTokens({
//     value: ethers.utils.parseEther(amount).div(TOKEN_RATIO),
//   });
//   const receipt = await tx.wait();
//   console.log(`Tokens bought (${receipt.transactionHash})\n`);
// }

// async function displayTokenBalance(index: string) {
//   const balanceBN = await token.balanceOf(accounts[Number(index)].address);
//   const balance = ethers.utils.formatEther(balanceBN);
//   console.log(
//     `The account of address ${
//       accounts[Number(index)].address
//     } has ${balance} LT0\n`
//   );
// }

// async function bet(index: string, amount: string) {
//   const allowTx = await token
//     .connect(accounts[Number(index)])
//     .approve(contract.address, ethers.constants.MaxUint256);
//   await allowTx.wait();
//   const tx = await contract.connect(accounts[Number(index)]).betMany(amount);
//   const receipt = await tx.wait();
//   console.log(`Bets placed (${receipt.transactionHash})\n`);
// }

// async function closeLottery() {
//   const tx = await contract.closeLottery();
//   const receipt = await tx.wait();
//   console.log(`Bets closed (${receipt.transactionHash})\n`);
// }

// async function displayPrize(index: string): Promise<string> {
//   const prizeBN = await contract.prize(accounts[Number(index)].address);
//   const prize = ethers.utils.formatEther(prizeBN);
//   console.log(
//     `The account of address ${
//       accounts[Number(index)].address
//     } has earned a prize of ${prize} Tokens\n`
//   );
//   return prize;
// }

// async function claimPrize(index: string, amount: string) {
//   const tx = await contract
//     .connect(accounts[Number(index)])
//     .prizeWithdraw(ethers.utils.parseEther(amount));
//   const receipt = await tx.wait();
//   console.log(`Prize claimed (${receipt.transactionHash})\n`);
// }

// async function displayOwnerPool() {
//   const balanceBN = await contract.ownerPool();
//   const balance = ethers.utils.formatEther(balanceBN);
//   console.log(`The owner pool has (${balance}) Tokens \n`);
// }

// async function withdrawTokens(amount: string) {
//   const tx = await contract.ownerWithdraw(ethers.utils.parseEther(amount));
//   const receipt = await tx.wait();
//   console.log(`Withdraw confirmed (${receipt.transactionHash})\n`);
// }

// async function burnTokens(index: string, amount: string) {
//   const allowTx = await token
//     .connect(accounts[Number(index)])
//     .approve(contract.address, ethers.constants.MaxUint256);
//   const receiptAllow = await allowTx.wait();
//   console.log(`Allowance confirmed (${receiptAllow.transactionHash})\n`);
//   const tx = await contract
//     .connect(accounts[Number(index)])
//     .returnTokens(ethers.utils.parseEther(amount));
//   const receipt = await tx.wait();
//   console.log(`Burn confirmed (${receipt.transactionHash})\n`);
// }

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
