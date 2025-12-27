import { execSync } from "node:child_process";
import pacote from "pacote";
import semver from "semver";
import { PackageManager } from "./package-manager.js";
import { LockfileManager } from "./lockfile.js";
import { output } from "./output.js";
export class Installer {
    constructor(cwd = process.cwd()) {
        this.cwd = cwd;
        this.packageManager = new PackageManager(cwd);
        this.lockfileManager = new LockfileManager(cwd);
    }
    async fetchPackageMetadata(packageName, versionSpec) {
        var _a, _b;
        try {
            const spec = versionSpec ? `${packageName}@${versionSpec}` : packageName;
            const manifest = await pacote.manifest(spec);
            return {
                name: manifest.name,
                version: manifest.version,
                dependencies: manifest.dependencies,
                dist: {
                    tarball: ((_a = manifest.dist) === null || _a === void 0 ? void 0 : _a.tarball) || "",
                    integrity: (_b = manifest.dist) === null || _b === void 0 ? void 0 : _b.integrity,
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch metadata for ${packageName}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async installPackage(packageName, versionSpec, dev = false) {
        output.startSpinner(`Resolving ${packageName}...`);
        try {
            // Fetch package metadata
            const metadata = await this.fetchPackageMetadata(packageName, versionSpec);
            output.stopSpinner();
            output.info(`Found ${metadata.name}@${metadata.version}`);
            // Install using npm (leverages npm's robust installation)
            output.startSpinner(`Installing ${metadata.name}@${metadata.version}...`);
            const installSpec = `${metadata.name}@${metadata.version}`;
            const devFlag = dev ? "--save-dev" : "--save";
            try {
                execSync(`npm install ${devFlag} ${installSpec}`, {
                    cwd: this.cwd,
                    stdio: "pipe",
                });
            }
            catch (error) {
                output.failSpinner(`Failed to install ${metadata.name}`);
                throw new Error(`npm install failed: ${error instanceof Error ? error.message : String(error)}`);
            }
            output.succeedSpinner(`Installed ${metadata.name}@${metadata.version}`);
            // Update package.json
            this.packageManager.addDependency(metadata.name, `^${metadata.version}`, dev);
            // Update lockfile
            this.lockfileManager.addPackage(metadata.name, metadata.version, metadata.dist.tarball, metadata.dependencies, dev);
            output.success(`Added ${metadata.name}@${metadata.version} to ${dev ? "devDependencies" : "dependencies"}`);
        }
        catch (error) {
            output.stopSpinner();
            throw error;
        }
    }
    async installAll() {
        var _a;
        const dependencies = this.packageManager.getDependencies(true);
        const depNames = Object.keys(dependencies);
        if (depNames.length === 0) {
            output.info("No dependencies to install");
            return;
        }
        output.header(`Installing ${depNames.length} package(s)...`);
        // Use npm install to install all dependencies
        output.startSpinner("Installing dependencies...");
        try {
            execSync("npm install", {
                cwd: this.cwd,
                stdio: "pipe",
            });
            output.succeedSpinner("All dependencies installed");
            // Update lockfile for all packages
            for (const [name, versionSpec] of Object.entries(dependencies)) {
                try {
                    const metadata = await this.fetchPackageMetadata(name, versionSpec);
                    const isDev = ((_a = this.packageManager.read().devDependencies) === null || _a === void 0 ? void 0 : _a[name]) !== undefined;
                    this.lockfileManager.addPackage(metadata.name, metadata.version, metadata.dist.tarball, metadata.dependencies, isDev);
                }
                catch (error) {
                    output.warn(`Could not update lockfile for ${name}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
            output.success("Lockfile updated");
        }
        catch (error) {
            output.failSpinner("Installation failed");
            throw new Error(`Failed to install dependencies: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async removePackage(packageName) {
        if (!this.packageManager.hasDependency(packageName)) {
            output.warn(`${packageName} is not in dependencies`);
            return;
        }
        output.startSpinner(`Removing ${packageName}...`);
        try {
            // Get current version before removing
            const deps = this.packageManager.getDependencies(true);
            const currentVersion = deps[packageName];
            // Remove using npm
            execSync(`npm uninstall ${packageName}`, {
                cwd: this.cwd,
                stdio: "pipe",
            });
            // Update package.json
            this.packageManager.removeDependency(packageName);
            // Update lockfile
            if (currentVersion) {
                const cleanVersion = semver.clean(currentVersion) || currentVersion.replace(/^[\^~]/, "");
                this.lockfileManager.removePackage(packageName, cleanVersion);
            }
            output.succeedSpinner(`Removed ${packageName}`);
            output.success(`${packageName} has been removed`);
        }
        catch (error) {
            output.failSpinner(`Failed to remove ${packageName}`);
            throw new Error(`Failed to remove package: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    listPackages() {
        const pkg = this.packageManager.read();
        const packages = [];
        if (pkg.dependencies) {
            Object.entries(pkg.dependencies).forEach(([name, version]) => {
                packages.push({ name, version, dev: false });
            });
        }
        if (pkg.devDependencies) {
            Object.entries(pkg.devDependencies).forEach(([name, version]) => {
                packages.push({ name, version, dev: true });
            });
        }
        if (packages.length === 0) {
            output.info("No packages installed");
            return;
        }
        output.packageTree(packages);
    }
}
