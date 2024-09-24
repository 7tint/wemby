export const sum = (arr: number[]): number => {
  return arr.reduce((a, b) => a + b, 0);
};

export const shrinkNumber = (num: number): number => {
  return num / 7;
};
