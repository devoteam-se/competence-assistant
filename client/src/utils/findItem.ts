export const findDataByKeyAndId = <T extends { id: string }, K extends keyof T>(
  arr: T[] | undefined,
  value: K,
  id: string,
) => {
  const selectedItem = findItemById(arr, id);
  return selectedItem ? selectedItem[value] : undefined;
};

export const findItemById = <T extends { id: string }>(arr: T[] | undefined, id: string) => {
  return arr?.find((item) => item['id'] === id);
};
