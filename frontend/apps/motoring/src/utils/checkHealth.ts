import type { Result } from "@racwa/types";

export function checkHealth<T extends Record<string, boolean>>(
  services: T,
): Result<{ error: { deadServices: (keyof T)[] } }> {
  const deadServices = Object.entries(services).reduce<(keyof T)[]>((dead, [service, isAlive]) => {
    if (!isAlive) {
      return [...dead, service];
    }
    return dead;
  }, []);

  return deadServices.length === 0 ? { success: true } : { success: false, deadServices };
}
