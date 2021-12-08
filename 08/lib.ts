import { isnt } from "../util/functional.ts";
import { countSetBits } from "../util/number.ts";

export type DisplayLine = {
  signal: number[];
  output: number[];
};

/**
 *      a a a        a a a        a a a        a a a
 *    b       c    b       c    b       c    b       c
 *    b       c    b       c    b       c    b       c
 *    b       c    b       c    b       c    b       c
 *      d d d        d d d        d d d        d d d
 *    e       f    e       f    e       f    e       f
 *    e       f    e       f    e       f    e       f
 *    e       f    e       f    e       f    e       f
 *      g g g        g g g        g g g        g g g
 */

export function parseInput(rawInput: string): DisplayLine[] {
  const lines = rawInput.split("\n").map((line) => line.split(" | "));

  return lines.map(([s, o]) => {
    return {
      signal: s.split(" ").map(toBin),
      output: o.split(" ").map(toBin),
    };
  });
}

export function part1(dLines: DisplayLine[]): number {
  let count = 0;

  dLines.forEach((dLine) => {
    const uniqueSegmentDigitLengths = [2, 3, 4, 7];

    dLine.output.forEach((digit) => {
      if (uniqueSegmentDigitLengths.includes(countSetBits(digit))) {
        count++;
      }
    });
  });

  return count;
}

export function part2(dLines: DisplayLine[]): number {
  let outputSum = 0;

  dLines.forEach((dLine) => {
    outputSum += decodeOutput(dLine);
  });

  return outputSum;
}

/**
 * Implemented decode algorithm
 *
 * 1, 4, 7, 8   from # segments
 * 3            from 5 segment digits
 * 9            from 3 OR 4 OR 7
 * e            from 8 XOR 9
 * 5            from 5 and 2 XOR 9
 * 2            from remaining 5 seg
 * 6            from 5 + e
 * 0
 *
 * The last couple of steps had the right idea that could have
 * been used from the beginning
 *
 * By carefully XORing the 5 and 6-segment signals with 1 and 4
 * and checking the number of remaining bits all the other digits
 * can be found
 */
function decodeOutput(dLine: DisplayLine): number {
  // Displayed digit to signal
  const digitMap = new Map<number, number>();
  // Displayed segment to segment in signal
  const segmentMap = new Map<number, number>();

  const fiveSegmentDigits: number[] = [];
  let sixSegmentDigits: number[] = [];

  // Read in signal
  dLine.signal.forEach((seg) => {
    switch (countSetBits(seg)) {
      case 2:
        digitMap.set(1, seg);
        break;
      case 3:
        digitMap.set(7, seg);
        break;
      case 4:
        digitMap.set(4, seg);
        break;
      case 7:
        digitMap.set(8, seg);
        break;
      case 5:
        fiveSegmentDigits.push(seg);
        break;
      case 6:
        sixSegmentDigits.push(seg);
    }
  });

  // Compute digitMap
  digitMap.set(3, get3From5Segs(fiveSegmentDigits));

  const nine = digitOR(
    digitOR(digitMap.get(3), digitMap.get(4)),
    digitMap.get(7),
  );
  digitMap.set(9, nine);
  sixSegmentDigits = sixSegmentDigits.filter(isnt(nine));

  segmentMap.set(toBin("e"), digitXOR(digitMap.get(8), digitMap.get(9)));

  digitMap.set(5, get5From5Segs(fiveSegmentDigits, digitMap.get(9)));
  digitMap.set(2, get2From5Segs(fiveSegmentDigits));

  const six = digitOR(digitMap.get(5), segmentMap.get(toBin("e")));
  digitMap.set(6, six);

  const zero = sixSegmentDigits.find((digit) => digit !== six);
  if (zero === undefined) throw new Error("No zero in six segs");
  digitMap.set(0, zero);

  if ([...digitMap].length !== 10) throw new Error("Missing a digit");

  // Map output
  let lineOutput = "";
  dLine.output.forEach((digit) => {
    digitMap.forEach((sig, num) => {
      if (digit === sig) {
        lineOutput += `${num}`;
      }
    });
  });

  return Number(lineOutput);
}

export function toBin(s: string): number {
  const segs = "abcdefg".split("");
  let bString = "0b";

  segs.forEach((c) => {
    bString += s.includes(c) ? "1" : "0";
  });

  return Number(bString);
}

// Works out which of the 5-segment digits is 3, based on the XORs between them
// 2 XOR 5 has 4 set bits, whereas 2 XOR 3 and 5 XOR 3 both leave 2 set bits
// Also removes 3 from the array by reference
export function get3From5Segs(segs: number[]): number {
  if (!(segs.length === 3)) {
    throw new Error(`Tried to get 3 from fiveSegs: ${segs}`);
  }

  for (let i = 0; i < 3; i++) {
    // Fun index manip to allow comparing the first and last elements
    if (countSetBits(segs[i] ^ segs[i == 2 ? 0 : i + 1]) === 4) {
      const three = i == 0 ? segs[2] : segs[i - 1];
      segs.splice(segs.findIndex((digit) => digit === three), 1);

      return three;
    }
  }

  throw new Error(`Illegal state. Could not find 3 in: ${segs}`);
}

// Assuming only 2 and 5 remain, returns 5 given 9
// Also removes 5 from the array by reference
export function get5From5Segs(segs: number[], nine?: number): number {
  if (nine === undefined) throw new Error("No 9 to compare with 5 and 2");

  if (countSetBits(digitXOR(nine, segs[0])) === 1) {
    return segs.splice(0, 1)[0];
  } else {
    return segs.splice(1, 1)[0];
  }
}

// Assuming 3 and 5 have been removed. Only 2 is left.
export function get2From5Segs(segs: number[]): number {
  const two = segs.pop();

  if (two === undefined) throw new Error("No 5 seg digits left!");

  return two;
}

// e.g. 7 - 1 = a
// e.g. 8 - 9 = e
export function digitXOR(a?: number, b?: number): number {
  if (a === undefined || b === undefined) {
    throw new Error(`Can't XOR ${a} and ${b}`);
  }

  return a ^ b;
}

// e.g. 5 + e = 6
export function digitOR(a?: number, b?: number): number {
  if (a === undefined || b === undefined) {
    throw new Error(`Can't OR ${a} and ${b}`);
  }

  return a | b;
}
