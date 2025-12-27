"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database");
const blockchain_1 = require("./blockchain");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize database and blockchain
const db = new database_1.DatabaseManager(process.env.DB_PATH || "./latte.db");
const blockchain = new blockchain_1.BlockchainManager(process.env.MANTLE_RPC_URL, parseInt(process.env.MANTLE_CHAIN_ID || "5000"));
// Health check
app.get("/", (_req, res) => {
    res.json({ ok: true, service: "Latte API", version: "1.0.0" });
});
// Get package rules
app.get("/packages/:name/rules", (req, res) => {
    try {
        const name = req.params.name;
        const rules = db.getPackageRule(name);
        if (!rules) {
            return res.json({
                price: 0,
                required: false,
            });
        }
        res.json({
            price: rules.price,
            required: rules.required,
            walletAddress: rules.walletAddress,
            chain: rules.chain,
            tokenSymbol: rules.tokenSymbol,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to fetch package rules",
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
// Set/update package rules
app.post("/packages", (req, res) => {
    try {
        const { name, price, required, walletAddress, chain, tokenSymbol } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Package name is required" });
        }
        if (price && (!walletAddress || !blockchain.isValidAddress(walletAddress))) {
            return res.status(400).json({ error: "Valid wallet address is required when setting a price" });
        }
        const rule = db.upsertPackageRule({
            name,
            price: price || 0,
            required: !!required,
            walletAddress: walletAddress || "",
            chain: chain || "Mantle",
            tokenSymbol: tokenSymbol || "USDT",
        });
        res.json({ ok: true, rules: rule });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to set package rules",
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
// Get all package rules
app.get("/packages", (_req, res) => {
    try {
        const packages = db.getAllPackageRules();
        res.json({ packages });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to fetch packages",
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
// Check payment status
app.get("/payments/status", (req, res) => {
    try {
        const pkg = req.query.pkg;
        const userId = req.query.userId;
        if (!pkg || !userId) {
            return res.status(400).json({ error: "pkg and userId query params required" });
        }
        const paid = db.getPaymentStatus(pkg, userId);
        res.json({ paid });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to check payment status",
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
// Mark payment as paid (for testing or manual confirmation)
app.post("/payments/mark-paid", (req, res) => {
    try {
        const { pkg, userId, amount, txHash } = req.body;
        if (!pkg || !userId) {
            return res.status(400).json({ error: "pkg and userId required" });
        }
        db.recordPayment({
            packageName: pkg,
            userId,
            amount: amount || 0,
            txHash,
            confirmed: true,
        });
        res.json({ ok: true });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to mark payment",
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
// Verify blockchain transaction
app.post("/payments/verify", async (req, res) => {
    try {
        const { pkg, userId, txHash } = req.body;
        if (!pkg || !userId || !txHash) {
            return res.status(400).json({ error: "pkg, userId, and txHash required" });
        }
        // Get package rules to verify amount and recipient
        const rules = db.getPackageRule(pkg);
        if (!rules) {
            return res.status(404).json({ error: "Package not found" });
        }
        // Get token address if it's a token payment
        const tokenAddress = rules.tokenSymbol !== "MNT"
            ? blockchain_1.BlockchainManager.getTokenAddress(rules.tokenSymbol, false)
            : undefined;
        // Verify the transaction on blockchain
        const verification = await blockchain.verifyTransaction(txHash, rules.walletAddress, rules.price, tokenAddress || undefined);
        if (verification.verified) {
            // Record the payment
            db.recordPayment({
                packageName: pkg,
                userId,
                amount: rules.price,
                txHash,
                confirmed: true,
            });
            res.json({
                ok: true,
                verified: true,
                confirmations: verification.confirmations,
            });
        }
        else {
            res.json({
                ok: false,
                verified: false,
                message: "Transaction could not be verified",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to verify payment",
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
// Get donation history for a package
app.get("/packages/:name/donations", (req, res) => {
    try {
        const name = req.params.name;
        const payments = db.getPaymentsByPackage(name);
        const total = db.getTotalDonations(name);
        res.json({
            package: name,
            totalDonations: total,
            donationCount: payments.length,
            donations: payments,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to fetch donations",
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
// Get platform statistics
app.get("/stats", (_req, res) => {
    try {
        const packages = db.getAllPackageRules();
        const totalPackages = packages.length;
        const packagesWithDonations = packages.filter((p) => p.price > 0).length;
        res.json({
            totalPackages,
            packagesWithDonations,
            packages: packages.map((p) => ({
                name: p.name,
                price: p.price,
                required: p.required,
                totalDonations: db.getTotalDonations(p.name),
            })),
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to fetch stats",
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
// Graceful shutdown
process.on("SIGINT", () => {
    console.log("\nShutting down gracefully...");
    db.close();
    process.exit(0);
});
process.on("SIGTERM", () => {
    console.log("\nShutting down gracefully...");
    db.close();
    process.exit(0);
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`🚀 Latte API listening on port ${port}`);
    console.log(`📊 Database: ${process.env.DB_PATH || "./latte.db"}`);
    console.log(`⛓️  Mantle Chain ID: ${process.env.MANTLE_CHAIN_ID || "5000"}`);
});
