"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainManager = void 0;
const ethers_1 = require("ethers");
// ERC-20 ABI for token transfers (minimal interface)
const ERC20_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
];
class BlockchainManager {
    constructor(rpcUrl, chainId = 5000) {
        // Default to Mantle mainnet
        const defaultRpcUrl = chainId === 5000
            ? "https://rpc.mantle.xyz"
            : "https://rpc.testnet.mantle.xyz";
        this.provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl || defaultRpcUrl);
        this.chainId = chainId;
    }
    /**
     * Verify a transaction on the Mantle network
     */
    async verifyTransaction(txHash, expectedRecipient, expectedAmount, tokenAddress) {
        var _a;
        try {
            const tx = await this.provider.getTransaction(txHash);
            if (!tx) {
                return { verified: false };
            }
            // Wait for transaction to be mined
            const receipt = await tx.wait();
            if (!receipt) {
                return { verified: false };
            }
            // If it's a token transfer, verify the Transfer event
            if (tokenAddress) {
                return await this.verifyTokenTransfer(receipt, tokenAddress, expectedRecipient, expectedAmount);
            }
            // For native token transfers
            if (((_a = tx.to) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== expectedRecipient.toLowerCase()) {
                return { verified: false };
            }
            const amountInEther = parseFloat(ethers_1.ethers.formatEther(tx.value));
            return {
                verified: Math.abs(amountInEther - expectedAmount) < 0.0001,
                from: tx.from,
                to: tx.to,
                amount: amountInEther,
                blockNumber: receipt.blockNumber,
                confirmations: await this.getConfirmations(receipt.blockNumber),
            };
        }
        catch (error) {
            console.error("Transaction verification error:", error);
            return { verified: false };
        }
    }
    /**
     * Verify a token transfer (USDT, USDC, etc.)
     */
    async verifyTokenTransfer(receipt, tokenAddress, expectedRecipient, expectedAmount) {
        try {
            const tokenContract = new ethers_1.ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
            // Find Transfer event in the logs
            const transferEvents = receipt.logs
                .filter((log) => log.address.toLowerCase() === tokenAddress.toLowerCase())
                .map((log) => {
                try {
                    return tokenContract.interface.parseLog({
                        topics: log.topics,
                        data: log.data,
                    });
                }
                catch {
                    return null;
                }
            })
                .filter((event) => event !== null && event.name === "Transfer");
            if (transferEvents.length === 0) {
                return { verified: false };
            }
            const transferEvent = transferEvents[0];
            const to = transferEvent.args[1];
            const amount = transferEvent.args[2];
            // Most stablecoins use 6 decimals (USDT, USDC)
            const decimals = 6;
            const amountInTokens = parseFloat(ethers_1.ethers.formatUnits(amount, decimals));
            const verified = to.toLowerCase() === expectedRecipient.toLowerCase() &&
                Math.abs(amountInTokens - expectedAmount) < 0.01;
            return {
                verified,
                from: transferEvent.args[0],
                to,
                amount: amountInTokens,
                blockNumber: receipt.blockNumber,
                confirmations: await this.getConfirmations(receipt.blockNumber),
            };
        }
        catch (error) {
            console.error("Token transfer verification error:", error);
            return { verified: false };
        }
    }
    /**
     * Get number of confirmations for a block
     */
    async getConfirmations(blockNumber) {
        try {
            const currentBlock = await this.provider.getBlockNumber();
            return currentBlock - blockNumber + 1;
        }
        catch {
            return 0;
        }
    }
    /**
     * Get the current block number
     */
    async getCurrentBlock() {
        return await this.provider.getBlockNumber();
    }
    /**
     * Check if a wallet address is valid
     */
    isValidAddress(address) {
        return ethers_1.ethers.isAddress(address);
    }
    /**
     * Get token contract addresses for Mantle network
     */
    static getTokenAddress(symbol, testnet = false) {
        const addresses = {
            USDT: {
                mainnet: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
                testnet: "0x...", // Add testnet address when available
            },
            USDC: {
                mainnet: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
                testnet: "0x...", // Add testnet address when available
            },
        };
        const token = addresses[symbol.toUpperCase()];
        if (!token)
            return null;
        return testnet ? token.testnet : token.mainnet;
    }
}
exports.BlockchainManager = BlockchainManager;
