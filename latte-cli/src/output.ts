import chalk from "chalk";
import ora, { Ora } from "ora";

export class Output {
  private spinner: Ora | null = null;

  success(message: string): void {
    console.log(chalk.green("✓") + " " + message);
  }

  error(message: string): void {
    console.log(chalk.red("✗") + " " + message);
  }

  info(message: string): void {
    console.log(chalk.blue("ℹ") + " " + message);
  }

  warn(message: string): void {
    console.log(chalk.yellow("⚠") + " " + message);
  }

  startSpinner(message: string): void {
    this.spinner = ora(message).start();
  }

  succeedSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.succeed(message);
      this.spinner = null;
    }
  }

  failSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.fail(message);
      this.spinner = null;
    }
  }

  stopSpinner(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }

  header(message: string): void {
    console.log("\n" + chalk.bold.cyan(message) + "\n");
  }

  packageTree(packages: Array<{ name: string; version: string; dev?: boolean }>): void {
    console.log(chalk.bold("\nPackages:"));
    packages.forEach((pkg, index) => {
      const isLast = index === packages.length - 1;
      const prefix = isLast ? "└─" : "├─";
      const devTag = pkg.dev ? chalk.gray(" (dev)") : "";
      console.log(
        `${prefix} ${chalk.cyan(pkg.name)} ${chalk.gray(pkg.version)}${devTag}`
      );
    });
  }

  paymentInfo(data: {
    packageName: string;
    amount: number;
    token: string;
    network: string;
    address: string;
  }): void {
    console.log(chalk.bold.yellow("\n💰 Payment Required\n"));
    console.log(`${chalk.bold("Package:")} ${chalk.cyan(data.packageName)}`);
    console.log(`${chalk.bold("Amount:")} ${chalk.green(data.amount)} ${data.token}`);
    console.log(`${chalk.bold("Network:")} ${data.network}`);
    console.log(`${chalk.bold("Address:")} ${chalk.gray(data.address)}\n`);
  }

  donationPrompt(data: {
    packageName: string;
    amount: number;
    token: string;
  }): void {
    console.log(chalk.bold.blue("\n💝 Optional Donation\n"));
    console.log(
      `The package ${chalk.cyan(data.packageName)} accepts donations of ${chalk.green(
        data.amount
      )} ${data.token}`
    );
    console.log(chalk.gray("You can skip this and install anyway.\n"));
  }
}

export const output = new Output();
