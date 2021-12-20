type Octopus = {
  pos: number[];
  energy: number;
  neighbours: Octopus[];
  flashed: boolean;
};

type SimulationReport = {
  flashes: number;
  state?: number[][];
};

class UnforgivingMap<K, V> extends Map<K, V> {
  constructor() {
    super();
  }

  unforgivingGet = (key: K): V => {
    const value = this.get(key);

    if (value === undefined) {
      throw new Error(`Key ${key} does not exist in ${this}`);
    }

    return value;
  };
}

export function parseInput(rawInput: string): UnforgivingMap<string, Octopus> {
  const lines = rawInput.split("\n");
  const octopuses = new UnforgivingMap<string, Octopus>();

  lines.forEach((line, lineIndex) => {
    line.split("").forEach((energy, energyIndex) => {
      const pos = [energyIndex, lineIndex];

      octopuses.set(JSON.stringify(pos), {
        pos,
        energy: parseInt(energy),
        neighbours: [],
        flashed: false,
      });
    });
  });

  const neighbourOffsets = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];

  // Link the octopuses
  octopuses.forEach((octo, key) => {
    const pos = JSON.parse(key) as number[];

    neighbourOffsets.forEach((offset) => {
      const nPos = [pos[0] + offset[0], pos[1] + offset[1]];

      if (nPos[0] < 0 || nPos[1] < 0 || nPos[0] > 9 || nPos[1] > 9) {
        return;
      }

      octo.neighbours.push(octopuses.unforgivingGet(JSON.stringify(nPos)));
    });
  });

  return octopuses;
}

// How many total flashes in 100 steps?
export function part1(octopuses: UnforgivingMap<string, Octopus>): number {
  let flashes = 0;

  for (let step = 0; step < 100; step++) {
    const { flashes: newFlashes } = simulate(octopuses);
    flashes += newFlashes;
  }

  return flashes;
}

// At what step do all flashes synchronise?
export function part2(octopuses: UnforgivingMap<string, Octopus>): number {
  let step = 1;

  while (step <= 10000) {
    const { flashes } = simulate(octopuses);

    if (flashes === 100) {
      return step;
    }

    step++;
  }

  throw new Error("Failed to synchronise in 10000 steps");
}

/**
 * Simulates one step returning the number of flashes
 * @param octopuses
 */
export function simulate(
  octopuses: UnforgivingMap<string, Octopus>,
  record = false,
): SimulationReport {
  let flashes = 0;

  // Set up
  octopuses.forEach((octo) => {
    octo.energy += 1;
  });

  // Flash
  octopuses.forEach((octo) => {
    flashAndCheck(octo);
  });

  // Reset
  octopuses.forEach((octo) => {
    if (octo.flashed) {
      flashes++;
      octo.energy = 0;
      octo.flashed = false;
    }
  });

  return {
    flashes,
    state: record ? toEnergyMap(octopuses) : undefined,
  };
}

/**
 * Check to see if this octo can still flash this step
 * and whether it should
 *
 * If it does, inrease the energy of its neighbours and recurse
 * @param octo
 * @returns
 */
function flashAndCheck(octo: Octopus): void {
  if (octo.flashed) return;

  if (octo.energy > 9) {
    octo.flashed = true;

    octo.neighbours.forEach((neighbour) => {
      neighbour.energy += 1;
      flashAndCheck(neighbour);
    });
  }
}

export function toEnergyMap(
  octos: UnforgivingMap<string, Octopus>,
): number[][] {
  let energyMap = new Array(10).fill(null);
  energyMap = energyMap.map((_) => new Array(10).fill("x"));

  octos.forEach((octo) => {
    energyMap[octo.pos[1]][octo.pos[0]] = octo.energy <= 9 ? octo.energy : "X";
  });

  return energyMap;
}
