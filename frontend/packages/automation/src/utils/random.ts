/** https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle */
export const randomShuffle = <T>(arr: T[]): T[] => {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line security/detect-object-injection, @typescript-eslint/no-non-null-assertion
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }

  return copy;
};

export const randomSlice = <T>(arr: T[], length: number): T[] => {
  if (length >= arr.length) {
    return [...arr];
  }

  const start = Math.floor(Math.random() * (arr.length - length + 1));

  return arr.slice(start, start + length);
};

export const randomElement = <T>(arr: T[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
