import fs from "node:fs";
import path from "node:path";

export interface PackageJson {
    name?: string;
    version?: string;
    description?: string;
    main?: string;
    scripts?: Record<string, string>;
    keywords?: string[];
    author?: string;
    license?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    [key: string]: any;
}

export class PackageManager {
    private packageJsonPath: string;

    constructor(cwd: string = process.cwd()) {
        this.packageJsonPath = path.join(cwd, "package.json");
    }

    exists(): boolean {
        return fs.existsSync(this.packageJsonPath);
    }

    read(): PackageJson {
        if (!this.exists()) {
            return {};
        }
        const content = fs.readFileSync(this.packageJsonPath, "utf-8");
        return JSON.parse(content);
    }

    write(data: PackageJson): void {
        fs.writeFileSync(this.packageJsonPath, JSON.stringify(data, null, 2) + "\n");
    }

    create(options: {
        name?: string;
        version?: string;
        description?: string;
        author?: string;
    }): PackageJson {
        const pkg: PackageJson = {
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

    addDependency(name: string, version: string, dev: boolean = false): void {
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
        } else {
            pkg.dependencies[name] = version;
            // Remove from dev dependencies if it was there
            delete pkg.devDependencies[name];
        }

        this.write(pkg);
    }

    removeDependency(name: string): void {
        const pkg = this.read();

        if (pkg.dependencies) {
            delete pkg.dependencies[name];
        }
        if (pkg.devDependencies) {
            delete pkg.devDependencies[name];
        }

        this.write(pkg);
    }

    getDependencies(includeDev: boolean = false): Record<string, string> {
        const pkg = this.read();
        const deps = { ...(pkg.dependencies || {}) };

        if (includeDev && pkg.devDependencies) {
            Object.assign(deps, pkg.devDependencies);
        }

        return deps;
    }

    hasDependency(name: string): boolean {
        const pkg = this.read();
        return !!(
            (pkg.dependencies && pkg.dependencies[name]) ||
            (pkg.devDependencies && pkg.devDependencies[name])
        );
    }
}
