# ☕ Latte Package Manager

Latte is a modern CLI package manager designed to feel familiar yet fresh. It combines the reliability of npm with the polished user experience of pnpm, and introduces a unique way to support open source: **direct cryptocurrency donations** on the Mantle network.

Whether you're a developer who wants to support your favorite packages or a maintainer looking for a new revenue stream, Latte makes it seamless.

## Why Latte?

- **Familiar**: If you know npm, you know Latte. It works with the same registry and `package.json` format.
- **Beautiful**: We believe dev tools should look good. Enjoy pnpm-style colored output and smooth progress indicators.
- **Transparent**: Our human-readable `latte-lock.json` makes dependency management clear and audit-friendly.
- **Sustain Open Source**: Optional or required payments via Mantle network stablecoins unlock new ways to fund development.
- **Verified**: Every transaction is verified on-chain, ensuring funds go exactly where they should.

## Getting Started

### Installation

You can set up the CLI and API separately. Here is how to get the CLI running on your machine:

```bash
cd latte-cli
npm install
npm run build
npm link
```

For the backend API, which handles the blockchain verification:

```bash
cd latte-api
npm install
cp .env.example .env
npm run build
```

Then simply start the API server:

```bash
cd latte-api
npm run dev
```

The API will be available at `http://localhost:4000`.

## Using the CLI

### Initialize a Project

Start a new project in your current directory. This will guide you through creating a `package.json`.

```bash
latte init
```

### Adding Packages

Add a package to your project just like you would with other managers. Latte will automatically check if the package has any donation preferences.

```bash
latte add express
```

Need it for development only?

```bash
latte add -D typescript
```

If you want to track payments or donations for your user account:

```bash
latte add lodash --user user@example.com
```

**What happens next?**
Latte checks the package rules. If there's a donation option (or requirement), you'll see a QR code right in your terminal.
1. Scan it with your wallet.
2. Once the payment is confirmed on-chain, the installation proceeds automatically.
3. Your `package.json` and `latte-lock.json` are updated.

### Installing Dependencies

When you pull a project, install everything listed in `package.json` with one command:

```bash
latte install
```

### Managing Packages

Remove what you don't need:

```bash
latte remove express
```

See what you have installed:

```bash
latte list
```

### Setting Up Donations (For Maintainers)

If you maintain a package, you can set up donation rules. You can ask for a specific amount in USDT on the Mantle network.

```bash
latte set-price my-package \
  --price 5 \
  --wallet 0xYourWalletAddress \
  --token USDT \
  --chain Mantle
```

You can even make the payment mandatory if you wish:

```bash
latte set-price my-package --price 10 --wallet 0x... --required
```

## How It Works

### The Lock File
We use `latte-lock.json` to keep track of exactly what version of each package is installed. Unlike some other lock files, ours is designed to be easy for humans to read and understand.

### Blockchain Integration
Latte integrates directly with the Mantle network. It supports both Mainnet (Chain ID 5000) and Testnet (Chain ID 5001). We currently support USDT, USDC, and native MNT tokens.

When a payment is made, the Latte API listens for the transaction on the blockchain. Once verified, it signals the CLI to proceed with the installation.

## API Reference

The backend API is simple and RESTful.

- **GET** `/packages/:name/rules` - See donation rules for a package.
- **POST** `/packages` - Set rules for your package.
- **GET** `/payments/status` - Check if a payment has gone through.
- **POST** `/payments/verify` - Verify a transaction hash.
- **GET** `/stats` - See platform-wide statistics.

## Contributing

We love contributions! Whether it's adding support for more networks, improving the CLI output, or fixing bugs, please feel free to open a Pull Request.

## License

ISC

---

*Made with ☕ and ❤️ for the Open Source community.*
