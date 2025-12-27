import fs from "node:fs";
import path from "node:path";
export class PackageManager {
    constructor(cwd = process.cwd()) {
        this.packageJsonPath = path.join(cwd, "package.json");
    }
    exists() {
        return fs.existsSync(this.packageJsonPath);
    }
    read() {
        if (!this.exists()) {
            return {};
        }
        const content = fs.readFileSync(this.packageJsonPath, "utf-8");
        return JSON.parse(content);
    }
    write(data) {
        fs.writeFileSync(this.packageJsonPath, JSON.stringify(data, null, 2) + "\n");
    }
    create(options) {
        const pkg = {
            name: options.name || path.basename(process.cwd()),
            version: options.version || "1.0.0",
            description: options.description || "",
            main: "index.js",
            scripts: {
                test: 'echo "Error: no test specified" && exit 1',
            },
            keywords: [],
            author: options.author || "",
            license: "ISC",
            dependencies: {},
            devDependencies: {},
        };
        this.write(pkg);
        return pkg;
    }
    addDependency(name, version, dev = false) {
        const pkg = this.read();
        if (!pkg.dependencies) {
            pkg.dependencies = {};
        }
        if (!pkg.devDependencies) {
            pkg.devDependencies = {};
        }
        if (dev) {
            pkg.devDependencies[name] = version;
            // Remove from regular dependencies if it was there
            delete pkg.dependencies[name];
        }
        else {
            pkg.dependencies[name] = version;
            // Remove from dev dependencies if it was there
            delete pkg.devDependencies[name];
        }
        this.write(pkg);
    }
    removeDependency(name) {
        const pkg = this.read();
        if (pkg.dependencies) {
            delete pkg.dependencies[name];
        }
        if (pkg.devDependencies) {
            delete pkg.devDependencies[name];
        }
        this.write(pkg);
    }
    getDependencies(includeDev = false) {
        const pkg = this.read();
        const deps = { ...(pkg.dependencies || {}) };
        if (includeDev && pkg.devDependencies) {
            Object.assign(deps, pkg.devDependencies);
        }
        return deps;
    }
    hasDependency(name) {
        const pkg = this.read();
        return !!((pkg.dependencies && pkg.dependencies[name]) ||
            (pkg.devDependencies && pkg.devDependencies[name]));
    }
}
