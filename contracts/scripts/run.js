const main = async () => {

    const [file_owner, randomPerson1, randomPerson2, randomPerson3] = await hre.ethers.getSigners();

    // コントラクトコンパイル
    const TestContract = await ethers.getContractFactory('test');
    console.log('Compiling contract...');
    
    // コントラクトデプロイ
    console.log('Deploying contract...');
    const contract = await TestContract.deploy();
    await contract.deployed();
    console.log('Contract deployed to:', contract.address);
    
    // コントラクトアドレス取得
    const owner = await contract.owner();
    console.log('Contract owner:', owner);

    // FileRegistry
    const fileNameHash = ethers.utils.formatBytes32String('exampleFileName');
    const fileContentHash = ethers.utils.formatBytes32String('exampleFileContent');
    const fileNameHashDummy = ethers.utils.formatBytes32String('exampleFileNameDummy');
    const fileContentHashDummy = ethers.utils.formatBytes32String('exampleFileContentDummy');

    await contract.addFile(fileNameHash, fileContentHash);
    console.log('File added to registry.');

    // getFileHash
    const fetchedFileHash = await contract.getFileHash(owner, fileNameHash);
    console.log('Fetched file hash:', fetchedFileHash);

    // Verify the file hash
    const isVerified = await contract.verifyFileHash(owner, fileNameHash, fileContentHashDummy);
    console.log('File hash verified:', isVerified);

};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();