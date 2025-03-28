export const createLogger = (name: string) => {
  return (message: string) => {
    if (process.env.NODE_ENV !== "test") {
      console.log(`[${name}]: ${message}`);
    }
  };
};
