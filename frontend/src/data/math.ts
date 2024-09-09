export const sum = (arr: number[]): number => {
  return arr.reduce((a, b) => a + b, 0);
};

export const mean = (arr: number[]): number => {
  return sum(arr) / arr.length;
};

export const std = (arr: number[]): number => {
  const m = mean(arr);
  return Math.sqrt(mean(arr.map((x) => Math.pow(x - m, 2))));
};

export const absmin = (a: number, b: number): number => {
  return Math.abs(a) < Math.abs(b) ? a : b;
};
