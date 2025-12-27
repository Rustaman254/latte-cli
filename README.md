# ☕ Latte Package Manager

A modern CLI package manager that works like npm with pnpm-style UX, featuring **optional cryptocurrency donations** on the Mantle network.

## 🌟 Features

- **npm-compatible**: Works with the npm registry and existing npm packages
- **Beautiful CLI**: pnpm-style colored output and progress indicators
- **Lock file**: Human-readable `latte-lock.json` for dependency management
- **Crypto donations**: Optional or required payments via Mantle network stablecoins
- **Blockchain verified**: On-chain transaction verification
- **Package.json compatible**: Standard npm package.json format

## 📦 Project Structure

```
Latte/
├── latte-cli/          # CLI package manager
│   ├── src/
│   │   ├── index.ts           # Main CLI entry point
│   │   ├── installer.ts       # Package installation logic
│   │   ├── lockfile.ts        # Lock file management
│   │   ├── package-manager.ts # package.json operations
│   │   ├── payment.ts         # Mantle network payments
│   │   ├── output.ts          # Formatted console output
│   │   └── prompt.ts          # User input handling
│   └── package.json
│
└── latte-api/          # Backend API
    ├── src/
    │   ├── index.ts           # API server
    │   ├── database.ts        # SQLite database
    │   └── blockchain.ts      # Mantle blockchain integration
    └── package.json
```

## 🚀 Quick Start

### Installation

#### CLI Setup

```bash
cd latte-cli
npm install
npm run build

# Link globally (optional)
npm link
```

#### API Setup

```bash
cd latte-api
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

npm run build
```

### Running the API

```bash
cd latte-api
npm run dev
```

The API will start on `http://localhost:4000`

## 📖 CLI Usage

### Initialize a Project

```bash
latte init
```

Creates a `package.json` in the current directory.

### Add Packages

```bash
# Add a package
latte add express

# Add to devDependencies
latte add -D typescript

# Specify user ID for payment tracking
latte add lodash --user user@example.com
```

This will:
1. Check for payment requirements
2. Show QR code if payment needed
3. Install the package from npm
4. Update `package.json`
5. Update `latte-lock.json`

### Install All Dependencies

```bash
latte install
# or
latte i
```

Installs all dependencies from `package.json`.

### Remove Packages

```bash
latte remove express
# or
latte rm express
```

### List Installed Packages

```bash
latte list
# or
latte ls
```

### Set Package Donation Rules

```bash
latte set-price <package> \
  --price 5 \
  --wallet 0xYourWalletAddress \
  --token USDT \
  --chain Mantle \
  --required  # Optional: make payment mandatory
```

Example:

```bash
latte set-price my-awesome-package \
  --price 2.5 \
  --wallet 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb \
  --token USDT \
  --chain Mantle
```

## 🔐 Payment Flow

### Optional Donation

When a package has an optional donation:

1. User runs `latte add package-name`
2. CLI shows donation information and QR code
3. User can scan to donate (optional)
4. Package installs regardless

### Required Payment

When a package requires payment:

1. User runs `latte add package-name`
2. CLI shows payment information and QR code
3. User must scan and pay
4. CLI waits for payment confirmation (60s)
5. Package installs after payment confirmed

## 🗂️ Lock File Format

The `latte-lock.json` file is human-readable and tracks all dependencies:

```json
{
  "lockfileVersion": "1.0",
  "packages": {
    "express@4.18.2": {
      "version": "4.18.2",
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      "integrity": "sha512-...",
      "dependencies": {
        "accepts": "~1.3.8",
        "array-flatten": "1.1.1"
      }
    }
  }
}
```

## 🌐 API Endpoints

### Package Rules

#### Get Package Rules
```http
GET /packages/:name/rules
```

Response:
```json
{
  "price": 5.0,
  "required": false,
  "walletAddress": "0x...",
  "chain": "Mantle",
  "tokenSymbol": "USDT"
}
```

#### Set Package Rules
```http
POST /packages
Content-Type: application/json

{
  "name": "package-name",
  "price": 5.0,
  "required": false,
  "walletAddress": "0x...",
  "chain": "Mantle",
  "tokenSymbol": "USDT"
}
```

#### List All Packages
```http
GET /packages
```

### Payments

#### Check Payment Status
```http
GET /payments/status?pkg=package-name&userId=user@example.com
```

Response:
```json
{
  "paid": true
}
```

#### Verify Blockchain Transaction
```http
POST /payments/verify
Content-Type: application/json

{
  "pkg": "package-name",
  "userId": "user@example.com",
  "txHash": "0x..."
}
```

#### Manual Payment Confirmation (Testing)
```http
POST /payments/mark-paid
Content-Type: application/json

{
  "pkg": "package-name",
  "userId": "user@example.com",
  "amount": 5.0,
  "txHash": "0x..."
}
```

### Statistics

#### Get Donation History
```http
GET /packages/:name/donations
```

#### Get Platform Stats
```http
GET /stats
```

## ⛓️ Mantle Network Integration

### Supported Networks

- **Mainnet**: Chain ID 5000
- **Testnet**: Chain ID 5001

### Supported Tokens

- **USDT**: Tether USD
- **USDC**: USD Coin
- **MNT**: Native Mantle token

### Configuration

Edit `latte-api/.env`:

```env
MANTLE_CHAIN_ID=5000
MANTLE_RPC_URL=https://rpc.mantle.xyz
```

For testnet:
```env
MANTLE_CHAIN_ID=5001
MANTLE_RPC_URL=https://rpc.testnet.mantle.xyz
```

## 🧪 Testing

### Test the CLI

```bash
# Create a test directory
mkdir test-project
cd test-project

# Initialize
latte init

# Add a package
latte add lodash

# Check files created
ls -la
# Should see: package.json, latte-lock.json, node_modules/

# List packages
latte list

# Remove package
latte remove lodash
```

### Test Payment Flow

```bash
# Set up a test package with donation
latte set-price test-package \
  --price 1 \
  --wallet 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb \
  --chain Mantle \
  --token USDT

# Try installing (will show QR code)
latte add test-package --user test@example.com
```

### Test API

```bash
# Start the API
cd latte-api
npm run dev

# In another terminal, test endpoints
curl http://localhost:4000/

# Get package rules
curl http://localhost:4000/packages/express/rules

# Set package price
curl -X POST http://localhost:4000/packages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-package",
    "price": 5,
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "chain": "Mantle",
    "tokenSymbol": "USDT"
  }'

# Check payment status
curl "http://localhost:4000/payments/status?pkg=my-package&userId=user@example.com"

# Get stats
curl http://localhost:4000/stats
```

## 🎨 CLI Output Examples

### Adding a Package

```
🎯 Adding express

ℹ Found express@4.18.2
⠹ Installing express@4.18.2...
✓ Installed express@4.18.2
✓ Added express@4.18.2 to dependencies

✨ express has been added to your project!
```

### With Optional Donation

```
💝 Optional Donation

The package express accepts donations of 2.5 USDT
You can skip this and install anyway.

Scan to donate:

█████████████████████████████
█████████████████████████████
```

### With Required Payment

```
💰 Payment Required

Package: express
Amount: 5 USDT
Network: Mantle
Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

Scan this QR code with your wallet:

█████████████████████████████
█████████████████████████████

ℹ Waiting for payment confirmation (up to 60 seconds)...
```

## 🛠️ Development

### CLI Development

```bash
cd latte-cli
npm run start  # Run with ts-node
npm run build  # Build TypeScript
```

### API Development

```bash
cd latte-api
npm run dev    # Run with ts-node (auto-reload)
npm run build  # Build TypeScript
npm start      # Run built version
```

## 📝 Environment Variables

### CLI

```bash
# API endpoint
export LATTE_API_BASE=http://localhost:4000
```

### API

See `.env.example` for all available options.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 🔗 Links

- [Mantle Network](https://www.mantle.xyz/)
- [npm Registry](https://www.npmjs.com/)
- [pnpm](https://pnpm.io/)

## ⚠️ Important Notes

1. **Token Addresses**: The Mantle network token addresses in the code are examples. Update them with actual contract addresses for production use.

2. **Security**: Never commit `.env` files with sensitive information. Always use `.env.example` as a template.

3. **Testing**: Always test payment flows on testnet before using mainnet.

4. **Lock File**: Commit `latte-lock.json` to version control to ensure consistent installations across environments.

5. **Database**: The SQLite database (`latte.db`) stores all package rules and payment records. Back it up regularly in production.

## 🎯 Roadmap

- [ ] Add support for more blockchain networks
- [ ] Implement caching for faster installations
- [ ] Add workspace support (monorepos)
- [ ] Create web dashboard for package statistics
- [ ] Add automatic transaction verification
- [ ] Support for multiple payment methods
- [ ] Package signing and verification
- [ ] Offline mode support

---

Made with ☕ and ❤️
