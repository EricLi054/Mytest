export const wait = async (waitTime: number) =>
  await new Promise((resolve) => setTimeout(resolve, waitTime))
