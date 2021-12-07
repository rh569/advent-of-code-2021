export function parseInput(rawInput: string): number[] {
  return rawInput.split(",").map((s) => parseInt(s));
}

export function part1(crabPositions: number[]): number {
  return calculateMinimumFuel(crabPositions, "fixed");
  // const meanPosition = Math.round(
  //   crabPositions.reduce((a, b) => a + b) / crabPositions.length,
  // );
  // const startingPositions = new Map<number, number>();

  // crabPositions.forEach((crab) => {
  //   startingPositions.set(crab, (startingPositions.get(crab) ?? 0) + 1);
  // });

  // const positionsByFreq: number[][] = [];

  // for (const [pos, freq] of startingPositions) {
  //   positionsByFreq.push([freq, pos]);
  // }

  // // sort desc by freq
  // positionsByFreq.sort((a, b) => {
  //   return b[0] - a[0];
  // });
}

export function part2(crabPositions: number[]): number {
  return calculateMinimumFuel(crabPositions, "linear");
}

function calculateMinimumFuel(
  crabPositions: number[],
  fuelRate: "fixed" | "linear",
): number {
  let minFuel = null;

  for (let i = 0; i < crabPositions.length; i++) {
    const fuel = calculateFuelToPosition(crabPositions, i + 1, fuelRate);

    minFuel = minFuel === null ? fuel : Math.min(fuel, minFuel);
  }

  return minFuel ?? -1;
}

function calculateFuelToPosition(
  crabPositions: number[],
  target: number,
  fuelRate: "fixed" | "linear",
) {
  let fuel = 0;

  crabPositions.forEach((pos) => {
    if (fuelRate === "fixed") {
      fuel += Math.abs(target - pos);
    } else {
      fuel += calculateFuelForMove(pos, target);
    }
  });

  return fuel;
}

function calculateFuelForMove(pos: number, target: number): number {
  let start = Math.min(pos, target);
  const end = Math.max(pos, target);
  let fuel = 0;
  let fuelIncrement = 1;

  while (start < end) {
    fuel += fuelIncrement;
    fuelIncrement++;
    start++;
  }

  return fuel;
}
