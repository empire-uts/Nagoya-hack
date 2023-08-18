// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

import "hardhat/console.sol";

contract test {
    address public owner;

    struct File {
        bytes32 fileNameHash;
        bytes32 fileContentHash;
        uint256 timeStamp;
        address approver;
        bool isApprovedFlg;
    }

    //mapping(address => mapping(bytes32 => File[])) public fileRegistry;
    mapping(address => mapping(bytes32 => File[])) public fileRegistry;
    mapping(address => mapping(address => mapping(bytes32 => bool))) public approvalFlg;
    mapping(address => mapping(bytes32 => address[])) public approvalList;

    event FileRegistered(address indexed myAddress, address ownerAddress, File fileData, uint256 version, address approverAddress, bool flg);
    event ApprovalFlgSet(address indexed myAddress, address ownerAddress, bytes32 fileNameHash, bool flg);
    event ApproverFlgSet(address indexed myAddress, address ownerAddress, bytes32 fileNameHash, bool flg);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    //ファイルをオンチェーンに乗せる
    function addFile(bytes32 _fileNameHash, bytes32 _fileContentHash, address _ownerAddress, address approverAddress) public {
        require(msg.sender == _ownerAddress || approvalFlg[_ownerAddress][msg.sender][_fileNameHash] == true, "You do't have the permission to update this file.");

        File memory addData = File(_fileNameHash, _fileContentHash, block.timestamp, approverAddress, false);

        fileRegistry[_ownerAddress][_fileNameHash].push(addData);
        uint256 lastIndex = fileRegistry[_ownerAddress][_fileNameHash].length;

        emit FileRegistered(msg.sender, _ownerAddress, fileRegistry[_ownerAddress][_fileNameHash][lastIndex-1], lastIndex, fileRegistry[_ownerAddress][_fileNameHash][lastIndex-1].approver, fileRegistry[_ownerAddress][_fileNameHash][lastIndex-1].isApprovedFlg);
    }

    //ファイル更新権限変更
    function setApproval(address ApprovalAddress, bytes32 _fileNameHash, bool ApprovalFlg) public {
        
        uint256 lastIndex = approvalList[msg.sender][_fileNameHash].length;
        bool findFlg = false;

        for(uint256 i=0;i<lastIndex;i++){
            if(approvalList[msg.sender][_fileNameHash][i] == ApprovalAddress){
                findFlg = true;
                if(ApprovalFlg == false){
                    approvalList[msg.sender][_fileNameHash][i] = address(0);
                }
            }
        }

        if(findFlg == false && ApprovalFlg == true){
            approvalList[msg.sender][_fileNameHash].push(ApprovalAddress);
        }

        approvalFlg[msg.sender][ApprovalAddress][_fileNameHash] = ApprovalFlg;
        
        emit ApprovalFlgSet(msg.sender, ApprovalAddress, _fileNameHash, approvalFlg[msg.sender][ApprovalAddress][_fileNameHash]);
    }

    //ファイル承認処理
    function setApproverFlg(address _ownerAddress, bytes32 _fileNameHash) public {
        
        uint256 lastIndex = fileRegistry[_ownerAddress][_fileNameHash].length;
        require(lastIndex > 0, "does not exist");

        address _approver = fileRegistry[_ownerAddress][_fileNameHash][lastIndex-1].approver;
        require(_approver == msg.sender, "Approver is different");

        bool _isApprovedFlg = fileRegistry[_ownerAddress][_fileNameHash][lastIndex-1].isApprovedFlg;
        require(_isApprovedFlg == false, "You are already approved");

        fileRegistry[_ownerAddress][_fileNameHash][lastIndex-1].isApprovedFlg = true;
        
        emit ApprovalFlgSet(msg.sender, _ownerAddress, _fileNameHash, fileRegistry[_ownerAddress][_fileNameHash][lastIndex-1].isApprovedFlg);
    }


    //ファイルハッシュ確認
    function getFileHash(address _ownerAddress, bytes32 _fileNameHash, uint256 _fileVersion) public view returns (bytes32) {

        uint256 lastIndex = fileRegistry[_ownerAddress][_fileNameHash].length;
        require(_fileVersion >= 1 && _fileVersion <= lastIndex, "does not exist");

        return fileRegistry[_ownerAddress][_fileNameHash][_fileVersion-1].fileContentHash;
    }

    //現在の最新バージョン確認
    function getFileVersion(address _ownerAddress, bytes32 _fileNameHash) public view returns (uint256){
        return fileRegistry[_ownerAddress][_fileNameHash].length;
    }

    //ファイル履歴確認
    function getFileHistory(address _ownerAddress, bytes32 _fileNameHash) public view returns (File[] memory){
        return fileRegistry[_ownerAddress][_fileNameHash];
    }

    //承認リスト確認
    function getApprovalList(address _ownerAddress, bytes32 _fileNameHash) public view returns (address[] memory){
        return approvalList[_ownerAddress][_fileNameHash];
    }

    //ファイルの更新権限確認
    function isApproved(address _ownerAddress, bytes32 _fileNameHash) public view returns (bool) {
        return (_ownerAddress == msg.sender || approvalFlg[_ownerAddress][msg.sender][_fileNameHash]);
    }

    //オフチェーンとオンチェーンのファイル一致確認
    function verifyFileHash(address _ownerAddress, bytes32 _fileNameHash, bytes32 _inputFileContentHash) public view returns (bool) {
        
        uint256 lastIndex = fileRegistry[_ownerAddress][_fileNameHash].length;

        if(lastIndex == 0){
            return false;
        }
        else{
            return fileRegistry[_ownerAddress][_fileNameHash][lastIndex-1].fileContentHash == _inputFileContentHash;
        }
    }

}