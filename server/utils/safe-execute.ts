type SafeResult<T> =
  | { ok: true; output: T; duration: number }
  | { ok: false; error: string; duration: number };

export async function safeExecute<T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<SafeResult<T>> {
  const startedAt = Date.now();
  try {
    const result = await withTimeout(fn(), timeoutMs);
    return { ok: true, output: result, duration: Date.now() - startedAt };
  } catch (error) {
    return {
      ok: false,
      error: serializeError(error),
      duration: Date.now() - startedAt,
    };
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;
  const timeout = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Step timed out"));
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return "Unknown error";
}
