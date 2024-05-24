export const unique = <T, K extends keyof T>(array: readonly T[], key: K): T[] => {
  const valueMap = array.reduce(
    (acc, item) => {
      const k = (item as any)[key];

      if (acc[k]) {
        return acc;
      }

      return { ...acc, [k]: item };
    },
    {} as Record<string, T>,
  );

  return Object.values(valueMap);
};
