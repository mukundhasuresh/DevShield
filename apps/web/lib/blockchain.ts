import { ethers } from "ethers";

// Minimal ABI just for reading data from ScanAuditLog.sol
// Used on the front-end to verify the scan hash immutability
const ScanAuditLogABI = [
  "function verifyScan(bytes32 scanHash) external view returns (bool)",
  "function getScanCount() external view returns (uint256)",
  "function hashExists(bytes32) public view returns (bool)",
  "function scans(uint256) public view returns (bytes32 scanHash, string ipfsCid, uint256 timestamp, string repoName, string prNumber, address submitter)"
];

export function getBlockchainContract() {
  const rpcUrl = process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL || process.env.POLYGON_AMOY_RPC_URL;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS;

  if (!rpcUrl || !contractAddress) {
    console.warn("Missing blockchain environment variables. Verification will fail if called.");
    return null;
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return new ethers.Contract(contractAddress, ScanAuditLogABI, provider);
}

// Function triggered on the client side UI to verify on-chain integrity
export async function verifyScanOnChain(scanHash: string): Promise<boolean> {
  const contract = getBlockchainContract();
  if (!contract) return false;
  
  try {
    return await contract.verifyScan(scanHash);
  } catch (err) {
    console.error("Blockchain verification error:", err);
    return false;
  }
}
