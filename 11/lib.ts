type Octopus = {
  pos: number[];
  energy: number;
  neighbours: Octopus[];
  flashed: boolean;
};

class UnforgivingMap <K, V> extends Map<K, V> {
    constructor() {
        super();
    }

    unforgivingGet = (key: K): V => {
        const value = this.get(key);

        if (value === undefined) {
            throw new Error(`Key ${key} does not exist in ${this}`);
        }

        return value;
    }
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
  ]

  // Link the octopuses
  octopuses.forEach((octo, key) => {
    const pos = JSON.parse(key) as number[];

    neighbourOffsets.forEach(offset => {
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
    flashes += simulate(octopuses);
  }

  return flashes;
}

// At what step do all flashes synchronise?
export function part2(octopuses: UnforgivingMap<string, Octopus>): number {
  let step = 1;
  
  while (step <= 10000) {
    if(simulate(octopuses) === 100) {
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
function simulate(octopuses: UnforgivingMap<string, Octopus>): number {
  let flashes = 0;
  
  // Set up
  octopuses.forEach(octo => {
    octo.energy += 1;
  });

  // Flash
  octopuses.forEach(octo => {
    flashAndCheck(octo);
  });

  // Reset
  octopuses.forEach(octo => {
    if (octo.flashed) {
      flashes++;
      octo.energy = 0;
      octo.flashed = false;
    }
  });

  return flashes;
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

    octo.neighbours.forEach(neighbour => {
      neighbour.energy += 1;
      flashAndCheck(neighbour);
    })
  }
}

function _printOctos(octos: UnforgivingMap<string, Octopus>): void {

  let out = new Array(10).fill(null);
  out = out.map(_ => new Array(10).fill("x"));

  octos.forEach(octo => {
    out[octo.pos[1]][octo.pos[0]] = octo.energy <= 9 ? octo.energy : "X";
  })

  console.log(out.map(line => line.join("")).join("\n"));
}