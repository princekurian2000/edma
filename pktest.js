import { ethers } from "ethers";

// Connect to Ethereum mainnet via Infura
const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/af996ba806304ad680a3497aa541cfbb"
);

// Function to generate a random wallet and check its balance
async function generateAndCheckBalance(counter) {
  // 1️⃣ Generate random wallet
  const wallet = ethers.Wallet.createRandom();

  console.log(`\n=== Wallet #${counter} ===`);
  console.log("Mnemonic:", wallet.mnemonic?.phrase);
  console.log("Private Key:", wallet.privateKey);
  console.log("Address:", wallet.address);

  try {
    // 2️⃣ Get balance in wei and convert to ether
    const balanceWei = await provider.getBalance(wallet.address);
    const balanceEth = ethers.utils.formatEther(balanceWei);

    console.log("Balance:", balanceEth, "ETH");
  } catch (err) {
    console.error("Error fetching balance:", err.message);
  }
}

// Run repeatedly — every second (for demo)
let counter = 1;
const interval = setInterval(async () => {
  await generateAndCheckBalance(counter++);
  if (counter > 5) {
    // stop after 5 wallets
    clearInterval(interval);
  }
}, 1000);
