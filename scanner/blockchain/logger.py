import os
import logging
from web3 import Web3
from eth_account import Account

logger = logging.getLogger("blockchain_logger")

def write_scan_hash_to_polygon(scan_hash: str, ipfs_cid: str, repo_name: str, pr_number: str) -> str:
    """
    Writes the scan details to Polygon Amoy utilizing the DevShield smart contract.
    Returns the transaction hash.
    """
    rpc_url = os.getenv("POLYGON_AMOY_RPC_URL", "")
    contract_address = os.getenv("CONTRACT_ADDRESS", "")
    private_key = os.getenv("DEPLOYER_PRIVATE_KEY", "")

    if not rpc_url or not contract_address or not private_key:
        logger.warning("Blockchain credentials missing. Skipping on-chain logging.")
        return ""

    try:
        w3 = Web3(Web3.HTTPProvider(rpc_url))
        if not w3.is_connected():
            logger.error("Failed to connect to Polygon Amoy Network")
            return ""

        account = Account.from_key(private_key)
        
        # Minimal ABI required to call logScan
        abi = [
            {
                "inputs": [
                    {"internalType": "bytes32", "name": "scanHash", "type": "bytes32"},
                    {"internalType": "string", "name": "ipfsCid", "type": "string"},
                    {"internalType": "string", "name": "repoName", "type": "string"},
                    {"internalType": "string", "name": "prNumber", "type": "string"}
                ],
                "name": "logScan",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]

        contract = w3.eth.contract(address=contract_address, abi=abi)
             
        # Add 0x prefix if missing for bytes32
        bytes32_hash = scan_hash if scan_hash.startswith("0x") else "0x" + scan_hash

        tx = contract.functions.logScan(
            Web3.to_bytes(hexstr=bytes32_hash),
            ipfs_cid,
            repo_name,
            str(pr_number)
        ).build_transaction({
            'from': account.address,
            'nonce': w3.eth.get_transaction_count(account.address),
            'gas': 2000000,
            'gasPrice': w3.eth.gas_price
        })

        # Sign and send transaction
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key)
        # In newer web3py it returns bytes
        tx_hash_bytes = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash_bytes, timeout=120)
        
        logger.info(f"Successfully logged scan to Polygon. TX Hash: {receipt.transactionHash.hex()}")
        return receipt.transactionHash.hex()

    except Exception as e:
        logger.error(f"Blockchain logging failed: {e}")
        return ""
