import { binaryArrayToDecimal } from "../util/number.ts";
import { BinaryArray } from "../util/types.ts";

/**
 * @param rawInput
 * @returns (0|1)[]
 */
export function parseInput(rawInput: string): BinaryArray[] {
  const lines = rawInput.split("\n");

  return lines.map((line) => line.split(""))
    .map((lineArr) => lineArr.map((bit) => parseInt(bit))) as BinaryArray[];
}

export function part1(binArrs: BinaryArray[]): number {
  const gammaRate = findGammaRate(binArrs);
  const epsilsonRate = findEpsilonRate(gammaRate);

  return binaryArrayToDecimal(gammaRate) * binaryArrayToDecimal(epsilsonRate);
}

export function part2(binArrs: BinaryArray[]): number {
  const o2Rate = findO2Rate(binArrs);
  const co2Rate = findCO2Rate(binArrs);

  return binaryArrayToDecimal(o2Rate) * binaryArrayToDecimal(co2Rate);
}

export function findO2Rate(arrs: BinaryArray[]): BinaryArray {
  const o2Criteria: ReportFilterPredicate = (
    index: number,
    setBits: number,
    unsetBits: number,
  ) => {
    return (arr) => {
      const keepBit = (setBits >= unsetBits) ? 1 : 0;
      return arr[index] === keepBit;
    };
  };

  return filterReportByCriteria(arrs.map((arr) => [...arr]), o2Criteria);
}

export function findCO2Rate(arrs: BinaryArray[]): BinaryArray {
  const co2Criteria: ReportFilterPredicate = (
    index: number,
    setBits: number,
    unsetBits: number,
  ) => {
    return (arr) => {
      const keepBit = (unsetBits <= setBits) ? 0 : 1;
      return arr[index] === keepBit;
    };
  };

  return filterReportByCriteria(arrs.map((arr) => [...arr]), co2Criteria);
}

type ReportFilterPredicate = (
  index: number,
  setBits: number,
  unsetBits: number,
) => (arr: BinaryArray) => boolean;

/**
 * Given the provided predicate maker, repeatedly iterate through the
 * given report arrays, filtering out those that don't meet the
 * predicate made in each loop
 *
 * @param report
 * @param makePredicate function to get an appropriate predicate
 * based on current bit position
 * @returns
 */
function filterReportByCriteria(
  report: BinaryArray[],
  makePredicate: ReportFilterPredicate,
): BinaryArray {
  let pos = 0;
  let bitsSet = 0;

  const limit = report.length + 1;

  while (report.length > 1) {
    if (pos > limit) {
      throw new Error("Report not being filtered! Aborting.");
    }

    report.forEach((arr) => {
      if (arr[pos] === 1) {
        bitsSet++;
      }
    });

    report = report.filter(
      makePredicate(pos, bitsSet, report.length - bitsSet),
    );

    pos++;
    bitsSet = 0;
  }

  return report.pop() ?? new Array(pos + 1).fill(0);
}

/**
 * Reduces the given array to a single item by keeping only the most common bit in
 * each position.
 *
 * Each bit from the input is iterated through once and a running total of
 * set bits is tracked separately
 *
 * @param arrs diagnostic report as an array of BinaryArrays
 * @returns gammaRate as a BinaryArray
 */
export function findGammaRate(arrs: BinaryArray[]): BinaryArray {
  const seenSetBits = new Array(arrs[0].length).fill(0);

  arrs.forEach((bitArr) => {
    bitArr.forEach((bit, index) => {
      if (bit) seenSetBits[index]++;
    });
  });

  const half = Math.floor(arrs.length / 2);
  return seenSetBits.map((count) => (count > half ? 1 : 0));
}

/**
 * Epsilon rate is simply the bitwise inversion of the gammaRate
 *
 * @param bin gammaRate
 * @returns epsilonRate as a BinaryArray
 */
export function findEpsilonRate(bin: BinaryArray): BinaryArray {
  return bin.map((bit) => bit === 0 ? 1 : 0);
}
