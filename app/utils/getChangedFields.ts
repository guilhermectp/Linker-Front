export function getChangedFields<T extends Record<string, unknown>>(
  original: T,
  current: T,
): Partial<T> {
  return Object.keys(current).reduce((acc, key) => {
    const k = key as keyof T;
    const originalVal = original[k];
    const currentVal = current[k];

    if (
      typeof currentVal === "object" &&
      currentVal !== null &&
      !Array.isArray(currentVal)
    ) {
      const nested = getChangedFields(
        (originalVal ?? {}) as Record<string, unknown>,
        currentVal as Record<string, unknown>,
      );
      if (Object.keys(nested).length > 0) {
        acc[k] = nested as T[keyof T];
      }
    } else if (currentVal !== originalVal) {
      acc[k] = currentVal;
    }

    return acc;
  }, {} as Partial<T>);
}
