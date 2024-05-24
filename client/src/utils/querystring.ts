export const toQueryString = (obj: Record<string, unknown>) => {
  return stringify(obj).join('&');
};

const stringify = (obj: Record<string, unknown>): string[] => {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (value == null) return;
      if (typeof value === 'string' && value === '') return;
      if (Array.isArray(value) && !value.length) return;
      if (Array.isArray(value)) return `${key}=${value.join(',')}`;
      if (typeof value === 'object') return stringify(value as Record<string, unknown>);

      return `${key}=${encodeURIComponent(value.toString())}`;
    })
    .flat()
    .filter(Boolean) as string[];
};
