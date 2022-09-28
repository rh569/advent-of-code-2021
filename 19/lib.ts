export type Pos = [number, number, number];

type Scanner = {
  id: number;
  beacons: Pos[];
};

type OrientationLabelledScanner = Scanner & {
  orientation: number;
}

const ID_REGEXP = /([0-9]+)/g;

function parseInput(rawInput: string): Scanner[] {
  const blocks = rawInput.split("\n\n");

  const scanners: Scanner[] = [];

  blocks.forEach((block) => {
    const lines = block.split("\n");
    const id = parseInt(lines.shift()?.match(ID_REGEXP)?.shift() ?? "");

    if (isNaN(id)) throw new Error("Failed to parse ID of scanner");

    const scanner: Scanner = {
      id,
      beacons: [],
    };

    lines.forEach((line) => {
      const pos: Pos = line.split(",").map((s) => parseInt(s)) as Pos;
      scanner.beacons.push(pos);
    });

    scanners.push(scanner);
  });

  return scanners;
}

export function part1(input: string): number {
  const scanners = parseInput(input);
  const orientationLabelledScanners = generateAllScannerOrientations(scanners);

  const scannersByIndexAndOrientation = new Map<string, OrientationLabelledScanner>();

  orientationLabelledScanners.forEach(s => {
    scannersByIndexAndOrientation.set(`${s.id}_${s.orientation}`, s);
  });

  // for every scanner
  for (let i = 0; i < scanners.length; i++) {

    if (i > 0) throw new Error("halt");

    // and every orientation of that scanner
    for (let j = 0; j < 24; j++) {
      
      // compare to all orientations of all other scanners
      for (let k = i + 1; k < scanners.length; k++) {
        for (let l = 0; l < 24; l++) {

          const ols1 = scannersByIndexAndOrientation.get(`${i}_${j}`);
          const ols2 = scannersByIndexAndOrientation.get(`${k}_${l}`);

          console.log(`Comparing. ID: ${ols1?.id}, O: ${ols1?.orientation} + ID: ${ols2?.id}, O: ${ols2?.orientation}`);

          const matchingBeacons = getMatchingBeacons(ols1, ols2);

          if (matchingBeacons >= 12) {
            console.log(`Found a match. ID: ${ols1?.id}, O: ${ols1?.orientation} + ID: ${ols2?.id}, O: ${ols2?.orientation}`);
          }
        }
      }
    }
  }

  return -1;
}

export function part2(input: string): number {
  const scanners = parseInput(input);

  return -1;
}

function getMatchingBeacons(a?: OrientationLabelledScanner, b?: OrientationLabelledScanner): number {
  if (a === undefined || b === undefined) throw new Error("Cannot compare undefined scanners");

  const offsetCounts = new Map<string, number>();

  for (let i = 0; i < a.beacons.length; i++) {
    for (let j = 0; j < b.beacons.length; j++) {

      // AB = b - a
      const offset: Pos = subtract(b.beacons[j], a.beacons[i]);
      const offsetStr = `${offset[0]},${offset[1]},${offset[2]}`;

      offsetCounts.set(offsetStr, (offsetCounts.get(offsetStr) ?? 0) + 1);
    }
  }

  let highestMatches = 0;

  console.log(offsetCounts);

  offsetCounts.forEach(count => highestMatches = Math.max(highestMatches, count));

  return highestMatches;
}

function generateAllScannerOrientations(scanners: Scanner[]): OrientationLabelledScanner[] {
  const allScanners: OrientationLabelledScanner[] = [];

  scanners.forEach(scanner => {
    // [[a1, a2, a3, ...], [b1, b2, b3, ...], ...]
    const orientedBeacons: Pos[][] = [];

    scanner.beacons.forEach(beacon => {
      orientedBeacons.push(generateAllPermutations(beacon));
    });

    for(let i = 0; i < orientedBeacons[0].length; i++) {
      const orientedScanner: OrientationLabelledScanner = {
        id: scanner.id,
        orientation: i,
        beacons: orientedBeacons.map(bs => bs[i])
      };

      allScanners.push(orientedScanner);
    }
  });

  return allScanners;
}

export function generateAllPermutations(pos: Pos): Pos[] {
  const permutations: Pos[] = [];

  let currentPos = [...pos] as Pos;

  // First 16 perms
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      permutations.push(currentPos);
      currentPos = rotateY(currentPos);
    }

    currentPos = rotateZ(currentPos);
  }
  
  currentPos = rotateX(currentPos);
  
  for (let j = 0; j < 4; j++) {
    permutations.push(currentPos);
    currentPos = rotateY(currentPos);
  }

  currentPos = rotateX(rotateX(currentPos));

  for (let j = 0; j < 4; j++) {
    permutations.push(currentPos);
    currentPos = rotateY(currentPos);
  }

  return permutations;
}

/**
 * Rotates the position 90 deg about the x axis
 * Returns a new array
 * @param pos
 */
export function rotateX(pos: Pos): Pos {
  const R = [
    [1, 0, 0],
    [0, 0, -1],
    [0, 1, 0],
  ];

  return product(R, pos);
}

/**
 * Rotates the position 90 deg about the y axis
 * Returns a new array
 * @param pos
 */
export function rotateY(pos: Pos): Pos {
  const R = [
    [0, 0, 1],
    [0, 1, 0],
    [-1, 0, 0],
  ];

  return product(R, pos);
}

/**
 * Rotates the position 90 deg about the z axis
 * Returns a new array
 * @param pos
 */
export function rotateZ(pos: Pos): Pos {
  const R = [
    [0, -1, 0],
    [1, 0, 0],
    [0, 0, 1],
  ];

  return product(R, pos);
}

/**
 * Applies the 3d matrix product R x pos
 * Returns a new array
 *
 * @param R
 * @param pos
 */
function product(R: number[][], pos: Pos): Pos {
  const prod: Pos = [0, 0, 0];

  for (let i = 0; i < 3; i++) {
    prod[i] = R[i][0] * pos[0] + R[i][1] * pos[1] + R[i][2] * pos[2];

    // Get rid of -0
    if (prod[i] === 0) prod[i] = 0;
  }

  return prod;
}

// Returns a - b as a new array
function subtract(a?: Pos, b?: Pos): Pos {
  if (a === undefined || b === undefined) throw new Error("Cannot subtract undefined scanners");

  return [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2]
  ];
}

// Returns a + b as a new array
function add(a?: Pos, b?: Pos): Pos {
  if (a === undefined || b === undefined) throw new Error("Cannot add undefined scanners");

  return [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2]
  ];
}

function matches(a?: Pos, b?: Pos): boolean {
  if (a === undefined || b === undefined) throw new Error("Cannot compare undefined positions");

  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}