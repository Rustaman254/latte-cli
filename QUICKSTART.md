# 🚀 Latte Package Manager - Quick Start Guide

## What is Latte?

Latte is a CLI package manager that combines the familiarity of npm with the beautiful UX of pnpm, plus a unique feature: **optional cryptocurrency donations** for package maintainers via the Mantle network.

## Installation

### Prerequisites

- Node.js 16+ and npm
- For payment features: Mantle network wallet

### Setup

```bash
# 1. Install CLI dependencies
cd latte-cli
npm install
npm run build

# 2. Install API dependencies
cd ../latte-api
npm install
npm run build

# 3. Start the API server
npm start
# API runs on http://localhost:4000
```

## Basic Usage

### Initialize a Project

```bash
cd your-project
latte init
```

### Add Packages

```bash
# Add a package
latte add express

# Add to devDependencies
latte add -D typescript
```

### Install All Dependencies

```bash
latte install
```

### Remove Packages

```bash
latte remove express
```

### List Packages

```bash
latte list
```

## Payment Features

### For Package Maintainers

Set up donations for your package:

```bash
latte set-price my-awesome-package \
  --price 5 \
  --wallet 0xYourMantleWalletAddress \
  --token USDT \
  --chain Mantle
```

Make payment required (optional):
```bash
latte set-price my-package \
  --price 10 \
  --wallet 0xYourAddress \
  --required
```

### For Package Users

When installing a package with donations:

1. **Optional Donation**: QR code shown, but installation proceeds immediately
2. **Required Payment**: Must scan QR and pay within 60 seconds

## API Usage

### Check Package Rules

```bash
curl http://localhost:4000/packages/express/rules
```

### Get Platform Stats

```bash
curl http://localhost:4000/stats
```

### Set Package Price (via API)

```bash
curl -X POST http://localhost:4000/packages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-package",
    "price": 5,
    "walletAddress": "0xYourAddress",
    "chain": "Mantle",
    "tokenSymbol": "USDT"
  }'
```

## Important Notes

### ⚠️ Token Addresses

The Mantle network token addresses in the code are **examples**. Before production use:

1. Get actual USDT contract address on Mantle: `0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE`
2. Get actual USDC contract address on Mantle: `0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9`
3. Update in [payment.ts](file:///home/masterchiefff/Documents/Pesabits/Latte/latte-cli/src/payment.ts) (lines 70-75)

### 🔐 Wallet Address Format

Wallet addresses must be:
- Valid Ethereum format (42 characters, starts with 0x)
- Properly checksummed
- Example: `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`

### 🌐 Network Configuration

Edit `latte-api/.env` for network settings:

**Mainnet** (default):
```env
MANTLE_CHAIN_ID=5000
MANTLE_RPC_URL=https://rpc.mantle.xyz
```

**Testnet** (for testing):
```env
MANTLE_CHAIN_ID=5001
MANTLE_RPC_URL=https://rpc.testnet.mantle.xyz
```

### 📁 Files Created

When using Latte, these files are created:

- `package.json` - Standard npm format
- `latte-lock.json` - Human-readable lock file
- `node_modules/` - Installed packages
- `latte.db` - API database (on server)

### 🔄 Compatibility

- ✅ Works with npm registry
- ✅ Standard package.json format
- ✅ Compatible with existing npm packages
- ⚠️ Lock file is Latte-specific (not compatible with npm/pnpm lock files)

## Troubleshooting

### API Not Running

```bash
cd latte-api
npm start
# Should see: 🚀 Latte API listening on port 4000
```

### CLI Command Not Found

```bash
cd latte-cli
npm run build
# Then use: node dist/index.js <command>
```

### Payment Not Confirming

1. Check API is running
2. Verify wallet address is correct
3. Ensure transaction was sent to correct address
4. Check Mantle network status

### Database Issues

```bash
# Reset database
cd latte-api
rm latte.db
npm start
# Database will be recreated
```

## Example Workflow

```bash
# 1. Start API
cd latte-api && npm start &

# 2. Create new project
mkdir my-app && cd my-app

# 3. Initialize
latte init

# 4. Add packages
latte add express
latte add -D typescript

# 5. Check what's installed
latte list

# 6. Install all dependencies
latte install

# 7. Remove a package
latte remove express
```

## Demo Script

Run the included demo:

```bash
./demo.sh
```

This will demonstrate:
- Project initialization
- Package installation
- Lock file creation
- Package removal

## Resources

- **Main README**: [README.md](file:///home/masterchiefff/Documents/Pesabits/Latte/README.md)
- **Implementation Details**: [walkthrough.md](file:///home/masterchiefff/.gemini/antigravity/brain/4baeac51-1f03-4220-9a5a-3f02defe79ce/walkthrough.md)
- **Mantle Network**: https://www.mantle.xyz/
- **API Docs**: See README.md section "API Endpoints"

## Support

For issues or questions:
1. Check the main README.md
2. Review the walkthrough.md for implementation details
3. Verify API is running on port 4000
4. Check environment variables are set correctly

---

**Happy brewing with Latte! ☕**
