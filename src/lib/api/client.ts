export const delay = (ms: number = 200) =>
  new Promise((resolve) => setTimeout(resolve, ms));
