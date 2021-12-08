export type DisplayLine = {
  signal: number[];
  output: number[];
};

export function parseInput(rawInput: string): DisplayLine[] {
  const lines = rawInput.split("\n").map((line) => line.split(" | "));

  return lines.map(([s, o]) => {
    return {
      signal: s.split(" ").map(alphabetise).map(toBin),
      output: o.split(" ").map(alphabetise).map(toBin),
    };
  });
}

function alphabetise(s: string): string {
  return s.split("").sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0)).join("");
}

export function toBin(s: string): number {
  const segs = "abcdefg".split("");
  let bString = "0b";

  segs.forEach((c) => {
    bString += s.includes(c) ? "1" : "0";
  });

  return Number(bString);
}

function setBits(n: number) {
  return n.toString(2).split("").filter((s) => s === "1").length;
}

const uniqueSegmentDigitLengths = [2, 3, 4, 7];

export function part1(dLines: DisplayLine[]): number {
  let count = 0;

  dLines.forEach((dLine) => {
    dLine.output.forEach((digit) => {
      if (uniqueSegmentDigitLengths.includes(setBits(digit))) {
        count++;
      }
    });
  });

  return count;
}

// ----

/**
 * Algo.
 *
 * 1, 4, 7, 8   from #seg
 * a            from 7 - 1
 * 3            from 5 segs that differs by 4 to both other 5 segs
 * 9            from 3 + 4 + 7
 * e            from 8 - 9
 * 5            from 5 seg contained in 9
 * 2            from remaining 5 seg
 * 6            from 5 + e
 * 0
 */

export function part2(dLines: DisplayLine[]): number {
  let outputSum = 0;

  dLines.forEach((dLine) => {
    // console.log(dLine);
    const digitMap = new Map<number, number>();
    const trueSegs = new Map<number, number>();

    const fiveSegs: number[] = [];
    let sixSegs: number[] = [];

    // Read in signal
    dLine.signal.forEach((seg) => {
      switch (setBits(seg)) {
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
          fiveSegs.push(seg);
          break;
        case 6:
          sixSegs.push(seg);
      }
    });

    // Compute digitMap
    trueSegs.set(toBin("a"), digitXOR(digitMap.get(7), digitMap.get(1)));

    digitMap.set(3, get3From5Segs(fiveSegs));

    const nine = digitOR(
      digitOR(digitMap.get(3), digitMap.get(4)),
      digitMap.get(7),
    );
    digitMap.set(9, nine);
    sixSegs = sixSegs.filter((digit) => digit !== nine);

    trueSegs.set(toBin("e"), digitXOR(digitMap.get(8), digitMap.get(9)));

    digitMap.set(5, get5From5Segs(fiveSegs, digitMap.get(9)));
    digitMap.set(2, get2From5Segs(fiveSegs));

    const six = digitOR(digitMap.get(5), trueSegs.get(toBin("e")));
    digitMap.set(6, six);

    const zero = sixSegs.find((digit) => digit !== six);
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
    outputSum += Number(lineOutput);
  });

  return outputSum;
}

// Works out which of the 5 segment digits is 3 based on the XORs between them
// 2 XOR 5 has 4 set bits, whereas 2 XOR 3 and 5 XOR 3 both leave 2 set bits
// removes 3 from the array
export function get3From5Segs(segs: number[]): number {
  if (!(segs.length === 3)) {
    throw new Error(`Tried to get 3 from fiveSegs: ${segs}`);
  }

  for (let i = 0; i < 3; i++) {
    if (setBits(segs[i] ^ segs[i == 2 ? 0 : i + 1]) === 4) {
      const three = i == 0 ? segs[2] : segs[i - 1];
      segs.splice(segs.findIndex((digit) => digit === three), 1);

      return three;
    }
  }

  throw new Error(`Illegal state. Could not find 3 in: ${segs}`);
}

// Assuming only 2 and 5 remain, returns 5 given 9
// Removes 5 from the array
export function get5From5Segs(segs: number[], nine?: number): number {
  if (nine === undefined) throw new Error("No 9 to compare with 5 and 2");

  if (setBits(digitXOR(nine, segs[0])) === 1) {
    return segs.splice(0, 1)[0];
  } else {
    return segs.splice(1, 1)[0];
  }
}

export function get2From5Segs(segs: number[]): number {
  const two = segs.pop();

  if (two === undefined) throw new Error("No 5 seg digits left!");

  return two;
}

// e.g. 7 - 1 = a
// e.g. 8 - 9 = e
export function digitXOR(a = 0, b = 0): number {
  return a ^ b;
}

// e.g. 5 + e = 6
export function digitOR(a = 0, b = 0): number {
  return a | b;
}
