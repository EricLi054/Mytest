// utils/formatDate.ts
export const formatDate = (input: string | Date): string => {
  const date = input instanceof Date ? input : new Date(input);
  const month = date.toLocaleString("default", { month: "short" }); // 'Nov'
  const year = date.getFullYear(); // 2024
  return `${month} ${year}`;
};
