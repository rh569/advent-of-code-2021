import { SFN } from "./SnailfishNumber.ts";

function parseInput(rawInput: string): SFN[] {
  const lines = rawInput.split("\n");

  return lines.map((s) => SFN.fromString(s));
}

export function part1(input: string): number {
  const numberList = parseInput(input);

  return successiveSum(numberList).magnitude();
}

// Woo 9 seconds to run, what a result!
// Glad to see the back of this one
export function part2(input: string): number {
  let maxMagnitude = Number.MIN_SAFE_INTEGER;

  let numberList = parseInput(input);

  for (let i = 0; i < numberList.length; i++) {
    for (let j = 0; j < numberList.length; j++) {
      if (i === j) continue;

      maxMagnitude = Math.max(maxMagnitude, SFN.add(numberList[i], numberList[j]).magnitude());
      numberList = parseInput(input);
      maxMagnitude = Math.max(maxMagnitude, SFN.add(numberList[j], numberList[i]).magnitude());
      numberList = parseInput(input);
    }
  }

  return maxMagnitude;
}

function successiveSum(numList: SFN[]): SFN {
  let total: SFN | null = null;

  while (numList.length > 0) {
    const rhs = numList.shift();
    if (rhs === undefined) throw new Error("No number found in list");

    total = (total === null) ? rhs : SFN.add(total, rhs);
  }

  if (total === null) throw new Error("");

  return total;
}
