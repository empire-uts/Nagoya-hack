const hre = require("hardhat");

async function main() {
  const MyContract = await hre.ethers.getContractFactory("test");
  const myContract = await MyContract.deploy(); // コントラクトをデプロイ

  await myContract.deployed();

  console.log("MyContract deployed to:", myContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });