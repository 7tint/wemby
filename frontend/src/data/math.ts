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

export const calculateStatPercentiles = (arr: number[]): number[] => {
  // array in ascending order
  const sortedArr = [...arr]
    .sort((a, b) => a - b)
    .splice(arr.length - 200, arr.length);

  function getPercentile(p: number): number {
    const index = p * (sortedArr.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    // linear interpolation between lower and upper values
    return sortedArr[lower] + weight * (sortedArr[upper] - sortedArr[lower]);
  }

  const percentiles = [
    getPercentile(0.2),
    getPercentile(0.4),
    getPercentile(0.6),
    getPercentile(0.8),
  ];

  return percentiles;
};
