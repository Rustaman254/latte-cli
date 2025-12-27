import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

let rl: ReturnType<typeof createInterface> | null = null;

function getRL(): ReturnType<typeof createInterface> {
  if (!rl) {
    rl = createInterface({ input, output });
  }
  return rl;
}

export async function ask(
  question: string,
  defaultValue?: string
): Promise<string> {
  try {
    const readline = getRL();
    const suffix = defaultValue ? ` (${defaultValue})` : "";
    const answer = await readline.question(`${question}${suffix}: `);
    return answer.trim() || (defaultValue ?? "");
  } catch (err: unknown) {
    // Handle EOF when input is piped
    if (
      err instanceof Error &&
      (err.message.includes("readline was closed") || (err as NodeJS.ErrnoException).code === "ERR_USE_AFTER_CLOSE")
    ) {
      return defaultValue ?? "";
    }
    throw err;
  }
}

export async function closeReadline(): Promise<void> {
  if (rl) {
    try {
      rl.close();
    } catch {
      // Already closed
    }
    rl = null;
  }
}
