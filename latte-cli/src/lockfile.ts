import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export interface LockfilePackage {
    version: string;
    resolved: string;
    integrity: string;
    dependencies?: Record<string, string>;
    dev?: boolean;
}

export interface Lockfile {
    lockfileVersion: string;
    packages: Record<string, LockfilePackage>;
}

export class LockfileManager {
    private lockfilePath: string;

    constructor(cwd: string = process.cwd()) {
        this.lockfilePath = path.join(cwd, "latte-lock.json");
    }

    exists(): boolean {
        return fs.existsSync(this.lockfilePath);
    }

    read(): Lockfile {
        if (!this.exists()) {
            return {
                lockfileVersion: "1.0",
                packages: {},
            };
        }

        const content = fs.readFileSync(this.lockfilePath, "utf-8");
        return JSON.parse(content);
    }

    write(lockfile: Lockfile): void {
        // Format in a human-readable way with proper indentation
        const formatted = this.formatLockfile(lockfile);
        fs.writeFileSync(this.lockfilePath, formatted);
    }

    private formatLockfile(lockfile: Lockfile): string {
        // Custom formatting for better readability (similar to pnpm)
        let output = "{\n";
        output += `  "lockfileVersion": "${lockfile.lockfileVersion}",\n`;
        output += '  "packages": {\n';

        const packageKeys = Object.keys(lockfile.packages).sort();
        packageKeys.forEach((key, index) => {
            const pkg = lockfile.packages[key];
            const isLast = index === packageKeys.length - 1;

            output += `    "${key}": {\n`;
            output += `      "version": "${pkg.version}",\n`;
            output += `      "resolved": "${pkg.resolved}",\n`;
            output += `      "integrity": "${pkg.integrity}"`;

            if (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) {
                output += ",\n      \"dependencies\": {\n";
                const depKeys = Object.keys(pkg.dependencies).sort();
                depKeys.forEach((depKey, depIndex) => {
                    const depIsLast = depIndex === depKeys.length - 1;
                    output += `        "${depKey}": "${pkg.dependencies![depKey]}"`;
                    if (!depIsLast) output += ",";
                    output += "\n";
                });
                output += "      }";
            }

            if (pkg.dev) {
                output += ',\n      "dev": true';
            }

            output += "\n    }";
            if (!isLast) output += ",";
            output += "\n";
        });

        output += "  }\n";
        output += "}\n";

        return output;
    }

    addPackage(
        name: string,
        version: string,
        resolved: string,
        dependencies?: Record<string, string>,
        dev?: boolean
    ): void {
        const lockfile = this.read();
        const key = `${name}@${version}`;

        // Generate integrity hash from resolved URL (simplified)
        const integrity = this.generateIntegrity(resolved);

        lockfile.packages[key] = {
            version,
            resolved,
            integrity,
            dependencies,
            dev,
        };

        this.write(lockfile);
    }

    removePackage(name: string, version: string): void {
        const lockfile = this.read();
        const key = `${name}@${version}`;

        delete lockfile.packages[key];
        this.write(lockfile);
    }

    getPackage(name: string, version: string): LockfilePackage | undefined {
        const lockfile = this.read();
        const key = `${name}@${version}`;
        return lockfile.packages[key];
    }

    hasPackage(name: string, version: string): boolean {
        return this.getPackage(name, version) !== undefined;
    }

    private generateIntegrity(resolved: string): string {
        // Generate a SHA-512 hash (simplified version)
        // In production, this should be the actual package tarball hash
        const hash = crypto.createHash("sha512").update(resolved).digest("base64");
        return `sha512-${hash}`;
    }

    getAllPackages(): Record<string, LockfilePackage> {
        const lockfile = this.read();
        return lockfile.packages;
    }

    clear(): void {
        const lockfile: Lockfile = {
            lockfileVersion: "1.0",
            packages: {},
        };
        this.write(lockfile);
    }
}
