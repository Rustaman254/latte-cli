#!/usr/bin/env node
import { Command } from "commander";
import path from "node:path";
import { ask, closeReadline } from "./prompt.js";
import { PackageManager } from "./package-manager.js";
import { Installer } from "./installer.js";
import { PaymentHandler } from "./payment.js";
import { output } from "./output.js";

const program = new Command();

program
  .name("latte")
  .description("Latte package manager - npm with optional crypto donations")
  .version("1.0.0");

// latte init
program
  .command("init")
  .description("Initialize a new Latte project")
  .action(async () => {
    try {
      const cwd = process.cwd();
      const packageManager = new PackageManager(cwd);

      if (packageManager.exists()) {
        output.warn("package.json already exists in this directory");
        return;
      }

      output.header("Initializing Latte project");

      const name = await ask("Package name", path.basename(cwd));
      const version = await ask("Version", "1.0.0");
      const description = await ask("Description");
      const author = await ask("Author");

      packageManager.create({ name, version, description, author });

      output.success("Created package.json");
      console.log(JSON.stringify(packageManager.read(), null, 2));

      await closeReadline();
    } catch (error) {
      output.error(
        `Initialization failed: ${error instanceof Error ? error.message : String(error)
        }`
      );
      process.exit(1);
    }
  });

// latte add <pkg>
program
  .command("add")
  .argument("<package>", "Package name to install")
  .option("-D, --dev", "Add to devDependencies")
  .option("--user <userId>", "User identifier for payment tracking", "anonymous")
  .description("Add a package to your project")
  .action(async (packageName: string, options: { dev?: boolean; user?: string }) => {
    try {
      const cwd = process.cwd();
      const packageManager = new PackageManager(cwd);
      const installer = new Installer(cwd);
      const paymentHandler = new PaymentHandler();

      // Create package.json if it doesn't exist
      if (!packageManager.exists()) {
        output.info("No package.json found, creating one...");
        packageManager.create({ name: path.basename(cwd) });
      }

      output.header(`Adding ${packageName}`);

      // Check for payment requirements
      const paymentConfig = await paymentHandler.fetchPaymentRules(packageName);

      if (paymentConfig) {
        const paymentSuccess = await paymentHandler.handlePayment(
          paymentConfig,
          options.user || "anonymous"
        );

        if (paymentConfig.required && !paymentSuccess) {
          output.error("Payment required but not confirmed. Installation aborted.");
          process.exit(1);
        }
      }

      // Install the package
      await installer.installPackage(packageName, undefined, options.dev || false);

      output.success(`\n✨ ${packageName} has been added to your project!`);
    } catch (error) {
      output.error(
        `Failed to add package: ${error instanceof Error ? error.message : String(error)
        }`
      );
      process.exit(1);
    }
  });

// latte install
program
  .command("install")
  .alias("i")
  .description("Install all dependencies from package.json")
  .action(async () => {
    try {
      const cwd = process.cwd();
      const packageManager = new PackageManager(cwd);
      const installer = new Installer(cwd);

      if (!packageManager.exists()) {
        output.error("No package.json found. Run 'latte init' first.");
        process.exit(1);
      }

      output.header("Installing dependencies");

      await installer.installAll();

      output.success("\n✨ All dependencies installed!");
    } catch (error) {
      output.error(
        `Installation failed: ${error instanceof Error ? error.message : String(error)
        }`
      );
      process.exit(1);
    }
  });

// latte remove <pkg>
program
  .command("remove")
  .argument("<package>", "Package name to remove")
  .alias("rm")
  .description("Remove a package from your project")
  .action(async (packageName: string) => {
    try {
      const cwd = process.cwd();
      const packageManager = new PackageManager(cwd);
      const installer = new Installer(cwd);

      if (!packageManager.exists()) {
        output.error("No package.json found");
        process.exit(1);
      }

      output.header(`Removing ${packageName}`);

      await installer.removePackage(packageName);

      output.success(`\n✨ ${packageName} has been removed!`);
    } catch (error) {
      output.error(
        `Failed to remove package: ${error instanceof Error ? error.message : String(error)
        }`
      );
      process.exit(1);
    }
  });

// latte list
program
  .command("list")
  .alias("ls")
  .description("List installed packages")
  .action(() => {
    try {
      const cwd = process.cwd();
      const packageManager = new PackageManager(cwd);
      const installer = new Installer(cwd);

      if (!packageManager.exists()) {
        output.error("No package.json found");
        process.exit(1);
      }

      output.header("Installed packages");
      installer.listPackages();
    } catch (error) {
      output.error(
        `Failed to list packages: ${error instanceof Error ? error.message : String(error)
        }`
      );
      process.exit(1);
    }
  });

// latte set-price
program
  .command("set-price")
  .argument("<package>", "Package name")
  .requiredOption("--price <amount>", "Price amount", parseFloat)
  .requiredOption("--wallet <address>", "Wallet address to receive payments")
  .option("--required", "Make payment mandatory", false)
  .option("--chain <chain>", "Blockchain network", "Mantle")
  .option("--token <symbol>", "Token symbol", "USDT")
  .description("Set donation/payment rules for a package")
  .action(
    async (
      packageName: string,
      options: {
        price: number;
        wallet: string;
        required?: boolean;
        chain?: string;
        token?: string;
      }
    ) => {
      try {
        const paymentHandler = new PaymentHandler();

        output.header(`Setting price for ${packageName}`);

        await paymentHandler.setPackagePrice(packageName, options.price, options.wallet, {
          required: options.required,
          chain: options.chain,
          token: options.token,
        });

        output.success("\n✨ Package pricing configured!");
      } catch (error) {
        output.error(
          `Failed to set price: ${error instanceof Error ? error.message : String(error)
          }`
        );
        process.exit(1);
      }
    }
  );

program.parse(process.argv);
