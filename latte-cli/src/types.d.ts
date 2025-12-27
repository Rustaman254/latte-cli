// Type declarations for modules without @types packages
declare module "pacote" {
    export interface Manifest {
        name: string;
        version: string;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        dist?: {
            tarball: string;
            integrity?: string;
        };
        [key: string]: any;
    }

    export function manifest(spec: string, opts?: any): Promise<Manifest>;
    export function extract(spec: string, dest: string, opts?: any): Promise<void>;
    export function tarball(spec: string, opts?: any): Promise<Buffer>;
}
