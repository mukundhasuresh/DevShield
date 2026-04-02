const hre = require("hardhat");

async function main() {
  console.log("Deploying ScanAuditLog contract to Polygon Amoy...");
  
  const ScanAuditLog = await hre.ethers.getContractFactory("ScanAuditLog");
  const contract = await ScanAuditLog.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  console.log(`✅ ScanAuditLog deployed successfully to: ${address}`);
  console.log(`Add this address to CONTRACT_ADDRESS environment variable.`);
}

main().catch((error) => {
  console.error("Error deploying contract:", error);
  process.exitCode = 1;
});
