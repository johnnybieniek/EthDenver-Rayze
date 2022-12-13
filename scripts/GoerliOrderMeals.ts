import { ethers } from "ethers";
import * as readline from "readline";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  MealToken,
  MealToken__factory,
  RayzeMarketplace,
  RayzeMarketplace__factory,
  RayzeMeal,
  RayzeMeal__factory,
} from "../typechain-types";

let rayze: RayzeMarketplace;
let token: MealToken;
let accounts: SignerWithAddress[];
let signer: ethers.Wallet; //restaurant signer
let signerCustomer: ethers.Wallet; //customer signer



const MEAL_PRICE =  1;
const TOKEN_RATIO = 1;
const MEALTOKEN_CONTRACT_ADDRESS ='0x56A0B5A1a74A687C94759127cB8FB2E75e7d7A21';
const RAYZEMARKETPLACE_CONTRACT_ADDRESS = '0xfEb9ce2E006a2Fc98e7bbA7825c86Cd55179e239';
//The MTK balance of 0xda20b99355aDb20129149D29eb7Ae9d70469E251 is 0
//The MTK balance of 0x43610EC8743998A8D95831447BC2E59382c60775 is 0

const ALCHEMY_API_KEY= process.env.ETH_GOERLI_KEY;
const ETH_REST = String(process.env.ETH_W3);
const ETH_CUST = String(process.env.ETH_W4);
const ETH_REST_PVT = String(process.env.ETH_P3);
const ETH_CUST_PVT = String(process.env.ETH_P4);




async function main() {
  //await initAccounts();
  await initContracts();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  mainMenu(rl);
}

async function initContracts() {
  ///goerli  
  //connect to provider
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: ALCHEMY_API_KEY
  });
  const wallet = new ethers.Wallet(ETH_REST_PVT);
  signer = wallet.connect(provider);
  var balance = await signer.getBalance();
  console.log(`Rest - W3 balance is ${signer.address} / ${balance} wei`);

  const walletCust = new ethers.Wallet(ETH_CUST_PVT);
  signerCustomer = wallet.connect(provider);
  balance = await signerCustomer.getBalance();
  console.log(`Cust - W3 balance is ${signerCustomer.address} / ${balance} wei`);
  //connect to provider

  //Deploy meal token and mint 100 MTK
  const tokenFactory = new MealToken__factory(signer);
  const contractFactory = new RayzeMarketplace__factory(signer);
  if (MEALTOKEN_CONTRACT_ADDRESS == ''){
    token = await tokenFactory.deploy("MealToken","MTK");
    await token.deployed();
    console.log(`MealToken MTK is deployed at ${token.address}`);
  
    //Mint tokens for both accounts
    var tx = await token.mintAmount(ETH_REST,
      ethers.utils.parseEther(MEAL_PRICE.toFixed(18)).div(1e15));
    tx.wait();
    tx = await token.mintAmount(ETH_CUST,
      ethers.utils.parseEther(MEAL_PRICE.toFixed(18)).div(1e15));
    tx.wait();
  }
  else {
    token = tokenFactory.attach(MEALTOKEN_CONTRACT_ADDRESS);
  }
  console.log(`MealToken MTK is deployed at ${token.address}`);
  var bal = await token.balanceOf(ETH_REST);
  console.log(`The MTK balance of ${ETH_REST} is ${(await bal).toNumber()}`);
  bal = await token.balanceOf(ETH_CUST);
  console.log(`The MTK balance of ${ETH_CUST} is ${(await bal).toNumber()}`);

  if (RAYZEMARKETPLACE_CONTRACT_ADDRESS == ''){
    rayze = await contractFactory.deploy(token.address);
    await rayze.deployed();
  } 
  else {
    rayze = contractFactory.attach(RAYZEMARKETPLACE_CONTRACT_ADDRESS);
  }
  console.log(`RayzeMarketPlace is deployed at ${rayze.address}`);
}

// async function initAccounts() {
//   accounts = await ethers.getSigners();
// }

async function mainMenu(rl: readline.Interface) {
  menuOptions(rl);
}

function menuOptions(rl: readline.Interface) {
  rl.question(
    "Select operation: \n Options: \n [0]: Exit \n [1]: Add restaurant \n [2]: Create & Register Meal NFT \n [3]: Set Max Meals to Sell for the day \n [4]: Buy Meal \n [5]: Redeem Meal \n [6]: Load Meal Coin \n [7]: Restaurant withdraw \n [8]: Lookup Restaurant\n [9]: Lookup Meal \n",
    async (answer: string) => {
      console.log(`Selected: ${answer}\n`);
      const option = Number(answer);
      switch (option) {
        case 0:
          rl.close();
          return;
        case 1:
          rl.question("Add Restaurant Name\n", async (name) => {
            try {
              await addRestaurant(name);
            } catch (error) {
              console.log("error\n");
              console.log({ error });
            }
            mainMenu(rl);
          });
          break;
        case 2:
          rl.question("What is the name of the restaurant\n", async (rName) => {
            rl.question("What is the name of the meal?\n", async (mName) => {
              try {
                await createMeal(rName, mName);
              } catch (error) {
                console.log("error\n");
                console.log({ error });
              }
              mainMenu(rl);
            });
          });
          break;
        case 3:
          rl.question("What is the name of the restaurant\n", async (rName) => {
            rl.question("What is the index of the meal?\n", async (mIx) => {
              rl.question("What are the Max Meals you are willing to sell\n", async (maxSupply) => {
                try {
                  await setMaxSupply(rName, mIx, maxSupply);
                } catch (error) {
                  console.log("error\n");
                  console.log({ error });
                }
                mainMenu(rl);
              });
            });
          });
          break;
        case 4:
          rl.question("What is the name of the restaurant\n", async (rName) => {
            rl.question("What is the index of the meal?\n", async (mIx) => {
                try {
                  await bookMeal(rName, mIx);
                } catch (error) {
                  console.log("error\n");
                  console.log({ error });
                }
                mainMenu(rl);
            });
          });
          break;
        case 5:
          rl.question("What is the name of the restaurant\n", async (rName) => {
            rl.question("What is the index of the meal?\n", async (mIx) => {
              rl.question("What is the index of the NFT to redeem?\n", async (nftIx) => {
                try {
                  await redeemMeal(rName, mIx, nftIx);
                } catch (error) {
                  console.log("error\n");
                  console.log({ error });
                }
                mainMenu(rl);
              });
            });
          });
          break;
        case 6:
          rl.question("How much MealToken MTK do you want to mint?\n", async (loadVal) => {
            try {
              await mintMealToken(loadVal);
            } catch (error) {
              console.log("error\n");
              console.log({ error });
            }
            mainMenu(rl);
          });
          break;
        case 7:
          await displayTokenBalance("0");
          await displayOwnerPool();
          rl.question("Withdraw how many tokens?\n", async (amount) => {
            // try {
            //   await withdrawTokens(amount);
            // } catch (error) {
            //   console.log("error\n");
            //   console.log({ error });
            // }
            mainMenu(rl);
          });
          break;
        case 8:
          rl.question("Input index of the restaurant\n", async (name) => {
            try {
              await listRestaurant(name);
            } catch (error) {
              console.log("error\n");
              console.log({ error });
            }
            mainMenu(rl);
          });
          break;
        case 9:
          rl.question("Input index of the meal\n", async (name) => {
            try {
              await listMeal(name);
            } catch (error) {
              console.log("error\n");
              console.log({ error });
            }
            mainMenu(rl);
          });
          break;
  
        default:
          throw new Error("Invalid option");
      }
    }
  );
}

async function addRestaurant(name: string) {
  const tx = await rayze.connect(signer).registerRestaurant(name, "Rockafeller center", 55);
  tx.wait();
  const rName = await rayze.restaurantLookup(name);
  console.log(`The restaurant registered is ${rName}\n`);
}

async function createMeal(rName: string, mName: string) {
  const restInfo = await rayze.restaurantLookup(rName);
  const restAddress = restInfo.owner;
  const rayzeMealFactory = new RayzeMeal__factory(signer);
  const rMeal = await rayzeMealFactory.deploy(mName, "RYM",1,
    "ipfs://QmWC6NEbHNrAWy8x6BzR2rnWpkjzoVMrKxXgRxSpqNTgFh/", restAddress, 50);
  await rMeal.deployed();
  
  const tx = await rayze.connect(signer).registerRayzeMeal(rName, rMeal.address);
  tx.wait();
  console.log(`sender is ${ETH_REST}, and owner is ${restAddress}`);
  const bookWinTx = await rayze.connect(signer).setBookingOpen(true);
  bookWinTx.wait();
  // const openMealTx = await rayze.connect(accounts[0]).openMealSales(rName, rMeal.address,50);
  // openMealTx.wait();
  const meal = rMeal.address;
 //const meal = await rayze.rayzeMealLookup(rName);
 console.log(`The restaurant is ${restInfo} and meal registered is ${meal}\n`);
}

async function openMealSale(rName: string, mealAddress: string) {
}

async function mintMealToken(loadVal: string) {
  var mintAmt: number;
  mintAmt = +loadVal;

  //Mint tokens for both accounts
  var tx = await token.mintAmount(ETH_REST,
    ethers.utils.parseEther(MEAL_PRICE.toFixed(18)).div(1e15));
  tx.wait();
  tx = await token.mintAmount(ETH_CUST,
    ethers.utils.parseEther(MEAL_PRICE.toFixed(18)).div(1e15));
  tx.wait();

  //balances
  var bal = await token.balanceOf(ETH_REST);
  console.log(`The MTK balance of ${ETH_REST} is ${(await bal).toNumber()}`);
  bal = await token.balanceOf(ETH_CUST);
  console.log(`The MTK balance of ${ETH_CUST} is ${(await bal).toNumber()}`);
}

async function listRestaurant(restId: string) {
  const len = await rayze.restaurantList.length;
  var ix: number;
  ix = +restId;

    const rest = await rayze.restaurantList(ix);
    console.log(`We have ${len} restaurants. The restaurant listed is ${rest}\n`);
}

async function setMaxSupply(rName: string, mIx: string, maxSupply: string) {
  
  const meal = await rayze.rayzeMealList(Number(mIx));
  const rayzeMealFactory = new RayzeMeal__factory(signer).attach(meal);
  const rMeal = await rayzeMealFactory.connect(signer).setMaxSupplyForSale(Number(maxSupply));
  rMeal.wait();
  const currSupply = await rayzeMealFactory.currentSupply();
  console.log(`The current and max supply is ${currSupply} ${maxSupply}`);
}

async function bookMeal(rName: string, mIx: string) {
  
  const rest = await rayze.rayzeMealList(Number(mIx));
  const appr = await token.connect(signerCustomer).approve(rayze.address,100);
  const tx = await rayze.connect(signerCustomer).bookMeal(rest);
  tx.wait();
  console.log(`The meal is booked ${rest}`);
}

async function redeemMeal(rName: string, mIx: string, nftIx: string) {
  
  const rest = await rayze.rayzeMealList(Number(mIx));
  const tx = await rayze.connect(signerCustomer).redeemMeal(rest, Number(nftIx));
  tx.wait();
  console.log(`The meal is redeemed ${rest}`);
}

async function listMeal(mealId: string) {
  const len = await rayze.rayzeMealList;
  
  var ix: number;
  ix = +mealId;

    const meal = await rayze.rayzeMealList(ix);
    const mealContract = new RayzeMeal__factory(signer).attach(meal);
    console.log(`We have ${(await mealContract.name())} 
      with current supply of ${(await mealContract.currentSupply())}  
      and max supply of ${(await mealContract.maxSupply())}. The isRedeemed array is 
      ${(await mealContract.isRedeemed(0))} ${(await mealContract.isRedeemed(1))} ${(await mealContract.isRedeemed(2))}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
