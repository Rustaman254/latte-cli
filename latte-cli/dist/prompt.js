import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
let rl = null;
function getRL() {
    if (!rl) {
        rl = createInterface({ input, output });
    }
    return rl;
}
export async function ask(question, defaultValue) {
    try {
        const readline = getRL();
        const suffix = defaultValue ? ` (${defaultValue})` : "";
        const answer = await readline.question(`${question}${suffix}: `);
        return answer.trim() || (defaultValue !== null && defaultValue !== void 0 ? defaultValue : "");
    }
    catch (err) {
        // Handle EOF when input is piped
        if (err instanceof Error &&
            (err.message.includes("readline was closed") || err.code === "ERR_USE_AFTER_CLOSE")) {
            return defaultValue !== null && defaultValue !== void 0 ? defaultValue : "";
        }
        throw err;
    }
}
export async function closeReadline() {
    if (rl) {
        try {
            rl.close();
        }
        catch {
            // Already closed
        }
        rl = null;
    }
}
