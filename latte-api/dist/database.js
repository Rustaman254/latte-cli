"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class DatabaseManager {
    constructor(dbPath = "./latte.db") {
        this.db = new better_sqlite3_1.default(dbPath);
        this.initialize();
    }
    initialize() {
        // Create packages table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        price REAL DEFAULT 0,
        required INTEGER DEFAULT 0,
        wallet_address TEXT,
        chain TEXT DEFAULT 'Mantle',
        token_symbol TEXT DEFAULT 'USDT',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Create payments table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        package_name TEXT NOT NULL,
        user_id TEXT NOT NULL,
        amount REAL NOT NULL,
        tx_hash TEXT,
        confirmed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(package_name, user_id, tx_hash)
      )
    `);
        // Create index for faster lookups
        this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_payments_lookup 
      ON payments(package_name, user_id, confirmed)
    `);
    }
    // Package operations
    upsertPackageRule(rule) {
        const stmt = this.db.prepare(`
      INSERT INTO packages (name, price, required, wallet_address, chain, token_symbol)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(name) DO UPDATE SET
        price = excluded.price,
        required = excluded.required,
        wallet_address = excluded.wallet_address,
        chain = excluded.chain,
        token_symbol = excluded.token_symbol
    `);
        stmt.run(rule.name, rule.price, rule.required ? 1 : 0, rule.walletAddress, rule.chain, rule.tokenSymbol);
        return this.getPackageRule(rule.name);
    }
    getPackageRule(name) {
        const stmt = this.db.prepare(`
      SELECT id, name, price, required, wallet_address as walletAddress, 
             chain, token_symbol as tokenSymbol
      FROM packages
      WHERE name = ?
    `);
        const row = stmt.get(name);
        if (!row)
            return null;
        return {
            id: row.id,
            name: row.name,
            price: row.price,
            required: row.required === 1,
            walletAddress: row.walletAddress,
            chain: row.chain,
            tokenSymbol: row.tokenSymbol,
        };
    }
    getAllPackageRules() {
        const stmt = this.db.prepare(`
      SELECT id, name, price, required, wallet_address as walletAddress,
             chain, token_symbol as tokenSymbol
      FROM packages
      ORDER BY name
    `);
        const rows = stmt.all();
        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            price: row.price,
            required: row.required === 1,
            walletAddress: row.walletAddress,
            chain: row.chain,
            tokenSymbol: row.tokenSymbol,
        }));
    }
    // Payment operations
    recordPayment(payment) {
        const stmt = this.db.prepare(`
      INSERT INTO payments (package_name, user_id, amount, tx_hash, confirmed)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(package_name, user_id, tx_hash) DO UPDATE SET
        confirmed = excluded.confirmed
    `);
        const info = stmt.run(payment.packageName, payment.userId, payment.amount, payment.txHash || null, payment.confirmed ? 1 : 0);
        return {
            id: info.lastInsertRowid,
            ...payment,
        };
    }
    markPaymentConfirmed(packageName, userId, txHash) {
        const stmt = this.db.prepare(`
      UPDATE payments
      SET confirmed = 1
      WHERE package_name = ? AND user_id = ?
      ${txHash ? "AND tx_hash = ?" : ""}
    `);
        const params = txHash ? [packageName, userId, txHash] : [packageName, userId];
        const info = stmt.run(...params);
        return info.changes > 0;
    }
    getPaymentStatus(packageName, userId) {
        const stmt = this.db.prepare(`
      SELECT confirmed
      FROM payments
      WHERE package_name = ? AND user_id = ? AND confirmed = 1
      LIMIT 1
    `);
        const row = stmt.get(packageName, userId);
        return row !== undefined;
    }
    getPaymentsByPackage(packageName) {
        const stmt = this.db.prepare(`
      SELECT id, package_name as packageName, user_id as userId,
             amount, tx_hash as txHash, confirmed, created_at as createdAt
      FROM payments
      WHERE package_name = ?
      ORDER BY created_at DESC
    `);
        const rows = stmt.all(packageName);
        return rows.map((row) => ({
            id: row.id,
            packageName: row.packageName,
            userId: row.userId,
            amount: row.amount,
            txHash: row.txHash,
            confirmed: row.confirmed === 1,
            createdAt: row.createdAt,
        }));
    }
    getTotalDonations(packageName) {
        const stmt = this.db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE package_name = ? AND confirmed = 1
    `);
        const row = stmt.get(packageName);
        return row.total;
    }
    close() {
        this.db.close();
    }
}
exports.DatabaseManager = DatabaseManager;
