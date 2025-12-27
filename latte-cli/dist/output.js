import chalk from "chalk";
import ora from "ora";
export class Output {
    constructor() {
        this.spinner = null;
    }
    success(message) {
        console.log(chalk.green("✓") + " " + message);
    }
    error(message) {
        console.log(chalk.red("✗") + " " + message);
    }
    info(message) {
        console.log(chalk.blue("ℹ") + " " + message);
    }
    warn(message) {
        console.log(chalk.yellow("⚠") + " " + message);
    }
    startSpinner(message) {
        this.spinner = ora(message).start();
    }
    succeedSpinner(message) {
        if (this.spinner) {
            this.spinner.succeed(message);
            this.spinner = null;
        }
    }
    failSpinner(message) {
        if (this.spinner) {
            this.spinner.fail(message);
            this.spinner = null;
        }
    }
    stopSpinner() {
        if (this.spinner) {
            this.spinner.stop();
            this.spinner = null;
        }
    }
    header(message) {
        console.log("\n" + chalk.bold.cyan(message) + "\n");
    }
    packageTree(packages) {
        console.log(chalk.bold("\nPackages:"));
        packages.forEach((pkg, index) => {
            const isLast = index === packages.length - 1;
            const prefix = isLast ? "└─" : "├─";
            const devTag = pkg.dev ? chalk.gray(" (dev)") : "";
            console.log(`${prefix} ${chalk.cyan(pkg.name)} ${chalk.gray(pkg.version)}${devTag}`);
        });
    }
    paymentInfo(data) {
        console.log(chalk.bold.yellow("\n💰 Payment Required\n"));
        console.log(`${chalk.bold("Package:")} ${chalk.cyan(data.packageName)}`);
        console.log(`${chalk.bold("Amount:")} ${chalk.green(data.amount)} ${data.token}`);
        console.log(`${chalk.bold("Network:")} ${data.network}`);
        console.log(`${chalk.bold("Address:")} ${chalk.gray(data.address)}\n`);
    }
    donationPrompt(data) {
        console.log(chalk.bold.blue("\n💝 Optional Donation\n"));
        console.log(`The package ${chalk.cyan(data.packageName)} accepts donations of ${chalk.green(data.amount)} ${data.token}`);
        console.log(chalk.gray("You can skip this and install anyway.\n"));
    }
}
export const output = new Output();
