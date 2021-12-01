/**
 * Returns the number of times the depth values increase from one index to the next
 *
 * @param depths list of depth values
 * @returns number of increments
 */
export function part1(depths: number[]): number {
  let increments = 0;

  depths.forEach((depth, index, arr) => {
    if (index === 0) return;

    if (depth > arr[index - 1]) {
      increments++;
    }
  });

  return increments;
}

/**
 * Returns the number of times a rolling sum of 3 depths increases from one set of 3
 * to the next
 *
 * Keeps track of a simple rolling sum instead of maintaining smaller array(s)
 *
 * @param depths list of depth values
 * @returns number of increments
 */
export function part2(depths: number[]): number {
  let increments = 0;
  let movingSum = 0;

  depths.forEach((value, index, arr) => {
    if (index <= 2) {
      // increase sum until we have our first window of three
      movingSum += value;
    } else {
      // remove the oldest value and add the current one
      const newSum = movingSum - arr[index - 3] + value;

      if (newSum > movingSum) increments++;

      movingSum = newSum;
    }
  });

  return increments;
}
