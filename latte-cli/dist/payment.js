import axios from "axios";
import qrcode from "qrcode-terminal";
import { output } from "./output.js";
export class PaymentHandler {
    constructor(apiBase = process.env.LATTE_API_BASE || "http://localhost:4000") {
        this.apiBase = apiBase;
    }
    async fetchPaymentRules(packageName) {
        try {
            const url = `${this.apiBase}/packages/${encodeURIComponent(packageName)}/rules`;
            const response = await axios.get(url);
            if (response.data.price > 0) {
                return {
                    packageName,
                    price: response.data.price,
                    required: response.data.required || false,
                    walletAddress: response.data.walletAddress || "",
                    chain: response.data.chain || "Mantle",
                    tokenSymbol: response.data.tokenSymbol || "USDT",
                };
            }
            return null;
        }
        catch (error) {
            // If package not found in API, no payment required
            return null;
        }
    }
    async handlePayment(config, userId = "anonymous") {
        if (config.required) {
            return await this.handleRequiredPayment(config, userId);
        }
        else {
            return await this.handleOptionalDonation(config, userId);
        }
    }
    async handleRequiredPayment(config, userId) {
        output.paymentInfo({
            packageName: config.packageName,
            amount: config.price,
            token: config.tokenSymbol,
            network: config.chain,
            address: config.walletAddress,
        });
        // Generate payment URI for Mantle network
        const paymentUri = this.generatePaymentUri(config);
        console.log("Scan this QR code with your wallet:\n");
        qrcode.generate(paymentUri, { small: true });
        output.info("Waiting for payment confirmation (up to 60 seconds)...\n");
        const confirmed = await this.waitForPaymentConfirmation(config.packageName, userId, 60);
        if (!confirmed) {
            output.error("Payment not confirmed in time");
            return false;
        }
        output.success("Payment confirmed!");
        return true;
    }
    async handleOptionalDonation(config, userId) {
        output.donationPrompt({
            packageName: config.packageName,
            amount: config.price,
            token: config.tokenSymbol,
        });
        // Show QR code but don't wait for payment
        const paymentUri = this.generatePaymentUri(config);
        console.log("Scan to donate:\n");
        qrcode.generate(paymentUri, { small: true });
        console.log("");
        // Don't block installation for optional donations
        return true;
    }
    generatePaymentUri(config) {
        // Generate EIP-681 compatible payment URI for Mantle network
        // Format: ethereum:<address>@<chainId>?value=<amount>&token=<tokenAddress>
        // Mantle Mainnet Chain ID: 5000
        // Mantle Testnet Chain ID: 5001
        const chainId = config.chain.toLowerCase().includes("testnet") ? 5001 : 5000;
        // For stablecoins, we need the token contract address
        // These are placeholder addresses - should be configured properly
        const tokenAddresses = {
            USDT: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE", // Mantle USDT (example)
            USDC: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9", // Mantle USDC (example)
        };
        const tokenAddress = tokenAddresses[config.tokenSymbol] || tokenAddresses.USDT;
        // Convert amount to wei (assuming 6 decimals for USDT/USDC)
        const decimals = 6;
        const amountInSmallestUnit = Math.floor(config.price * Math.pow(10, decimals));
        return `ethereum:${config.walletAddress}@${chainId}?value=${amountInSmallestUnit}&token=${tokenAddress}`;
    }
    async waitForPaymentConfirmation(packageName, userId, timeoutSeconds = 60) {
        const maxAttempts = Math.floor(timeoutSeconds / 2);
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const response = await axios.get(`${this.apiBase}/payments/status`, {
                    params: { pkg: packageName, userId },
                });
                if (response.data.paid) {
                    return true;
                }
            }
            catch (error) {
                // Continue polling even if there's an error
            }
            // Wait 2 seconds before next check
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        return false;
    }
    async setPackagePrice(packageName, price, walletAddress, options = {}) {
        try {
            const response = await axios.post(`${this.apiBase}/packages`, {
                name: packageName,
                price,
                required: options.required || false,
                walletAddress,
                chain: options.chain || "Mantle",
                tokenSymbol: options.token || "USDT",
            });
            output.success("Package pricing configured:");
            console.log(JSON.stringify(response.data.rules, null, 2));
        }
        catch (error) {
            throw new Error(`Failed to set package price: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
