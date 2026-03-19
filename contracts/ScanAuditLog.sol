// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ScanAuditLog {
    struct ScanRecord {
        bytes32 scanHash;      // keccak256 of scan results
        string ipfsCid;        // IPFS CID of full report
        uint256 timestamp;
        string repoName;
        string prNumber;
        address submitter;
    }

    ScanRecord[] public scans;
    mapping(bytes32 => bool) public hashExists;

    event ScanLogged(
        bytes32 indexed scanHash,
        string repoName,
        string prNumber,
        uint256 timestamp
    );

    function logScan(
        bytes32 scanHash,
        string calldata ipfsCid,
        string calldata repoName,
        string calldata prNumber
    ) external {
        require(!hashExists[scanHash], "Scan already logged");
        
        scans.push(ScanRecord({
            scanHash: scanHash,
            ipfsCid: ipfsCid,
            timestamp: block.timestamp,
            repoName: repoName,
            prNumber: prNumber,
            submitter: msg.sender
        }));
        
        hashExists[scanHash] = true;
        emit ScanLogged(scanHash, repoName, prNumber, block.timestamp);
    }

    function verifyScan(bytes32 scanHash) external view returns (bool) {
        return hashExists[scanHash];
    }

    function getScanCount() external view returns (uint256) {
        return scans.length;
    }
}
