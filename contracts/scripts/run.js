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

    //add file
    await contract.addFile(fileNameHash, fileContentHash, file_owner.address, owner);
    console.log('File added to registry.');

    // getFileVersion
    let retV = await contract.getFileVersion(owner, fileNameHash);
    let retV2 = retV.toNumber();
    console.log('Fetched file version:', retV2);
    
    //get file history
    let retFileHis = await contract.getFileHistory(owner, fileNameHash);
    console.log("File History: ", retFileHis);

    //ファイル承認
    await contract.setApproverFlg(owner, fileNameHash);
    console.log('File added to registry.');
    
    //get file history
    retFileHis = await contract.getFileHistory(owner, fileNameHash);
    console.log("File History: ", retFileHis);


    //set approval
    await contract.setApproval(randomPerson1.address, fileNameHash, true);
    console.log('Approval added.');


    await contract.addFile(fileNameHash, fileContentHashDummy, file_owner.address, owner);
    console.log('File added to registry.');

    retFileHis = await contract.getFileHistory(owner, fileNameHash);
    console.log("File History: ", retFileHis);

    //ファイル承認
    await contract.setApproverFlg(owner, fileNameHash);
    console.log('aaaaaaaaaaaaaaaaaaaa File added to registry.');
    
    retFileHis = await contract.getFileHistory(owner, fileNameHash);
    console.log("File History: ", retFileHis);

    //get file version
    retV = await contract.getFileVersion(owner, fileNameHash);
    retV2 = retV.toNumber();
    console.log('Fetched file version:', retV2);

    //get file history
    retFileHis = await contract.getFileHistory(owner, fileNameHash);
    console.log("File History: ", retFileHis);

    //get approval list
    let retApplist = await contract.getApprovalList(owner, fileNameHash);
    console.log("Approval List: ", retApplist);

    //isApproved ??
    let retFlg = await contract.isApproved(owner, fileNameHash);
    console.log("isApproved: ", retFlg, owner);

    retFlg = await contract.isApproved(randomPerson1.address, fileNameHash);
    console.log("isApproved: ", retFlg, randomPerson1.address);

    retFlg = await contract.isApproved(randomPerson2.address, fileNameHash);
    console.log("isApproved: ", retFlg, randomPerson2.address);


    // Verify the file hash
    retFlg = await contract.verifyFileHash(owner, fileNameHash, fileContentHash);
    console.log('File hash verified:', retFlg);

    retFlg = await contract.verifyFileHash(owner, fileNameHash, fileContentHash);
    console.log('File hash verified:', retFlg);

    retFlg = await contract.verifyFileHash(owner, fileNameHash, fileContentHash);
    console.log('File hash verified:', retFlg);


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