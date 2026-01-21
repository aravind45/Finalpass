// Type definition fix for strict TypeScript
// Add this to a global.d.ts or vite-env.d.ts file

declare global {
    interface HeadersInit {
        [key: string]: string;
    }
}

export { };
