const hre = require("hardhat");

async function main() {
  const MyContract = await hre.ethers.getContractFactory("test");
  const feeData = {gasLimit: 5000000}; //await provider.getFeeData();
  const myContract = await MyContract.deploy(feeData); // コントラクトをデプロイ

  await myContract.deployed();

  console.log("MyContract deployed to:", myContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });