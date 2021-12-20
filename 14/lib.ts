function parseInput(rawInput: string) {
  const blocks = rawInput.split("\n\n");

  const polymer = blocks[0];

  const rules = blocks[1].split("\n").map((ins) =>
    ins.split(" -> ") as [string, string]
  );

  const rulesMap = new Map<string, string>();

  rules.forEach((rule) => {
    rulesMap.set(rule[0], rule[1]);
  });

  return {
    polymer,
    rulesMap,
  };
}

// Naive approach tracking entire polymer
export function part1(input: string): number {
  let { polymer, rulesMap } = parseInput(input);

  for (let i = 0; i < 10; i++) {
    polymer = polymerise(polymer, rulesMap);
  }

  const counts = countBases(polymer);

  return counts[counts.length - 1] - counts[0];
}

function polymerise(polymer: string, rulesMap: Map<string, string>): string {
  for (let i = 0; i < polymer.length - 1; i += 2) {
    const pair = polymer.substring(i, i + 2);

    polymer = `${polymer.slice(0, i + 1)}${rulesMap.get(pair) ?? "█"}${
      polymer.slice(i + 1)
    }`;
  }

  return polymer;
}

function countBases(polymer: string): number[] {
  const basesMap = new Map<string, number>();

  const baseArray = polymer.split("");

  baseArray.forEach((base) => {
    basesMap.set(base, (basesMap.get(base) ?? 0) + 1);
  });

  return [...basesMap.values()].sort((a, b) => a - b);
}

// Faster approach, only keeping track of counts of each pair occurring in the polymer
export function part2(input: string): number {
  const { polymer, rulesMap } = parseInput(input);

  // Initialise a map to count all pairs in the polymer at each step
  let pairsCounts = new Map<string, number>();

  // Populate the counts map with the pairs from the starting polymer
  const startingBases = polymer.split("");

  for (let i = 0; i < startingBases.length - 1; i++) {
    const pair = `${startingBases[i]}${startingBases[i + 1]}`;

    pairsCounts.set(pair, (pairsCounts.get(pair) ?? 0) + 1);
  }

  // Do polymerisation
  for (let i = 0; i < 40; i++) {
    const newCounts = new Map<string, number>();

    pairsCounts.forEach((count, pair) => {
      if (count === 0) return;

      // Work out new bases and increment
      const newLeftPair = pair.split("")[0] + rulesMap.get(pair);
      newCounts.set(newLeftPair, (newCounts.get(newLeftPair) ?? 0) + count);

      const newRightPair = rulesMap.get(pair) + pair.split("")[1];
      newCounts.set(newRightPair, (newCounts.get(newRightPair) ?? 0) + count);
    });

    pairsCounts = newCounts;
  }

  // Convert pair counts to base counts
  const baseCounts = new Map<string, number>();

  pairsCounts.forEach((count, pair) => {
    const bases = pair.split("");

    baseCounts.set(bases[0], (baseCounts.get(bases[0]) ?? 0) + count);
    baseCounts.set(bases[1], (baseCounts.get(bases[1]) ?? 0) + count);
  });

  // Remove double counting
  baseCounts.forEach((count, base) => {
    baseCounts.set(base, Math.floor(count / 2));
  });

  // Account for the start and end bases
  const startBase = polymer.substring(0, 1);
  const endBase = polymer.substring(polymer.length - 1);

  baseCounts.set(startBase, (baseCounts.get(startBase) ?? 0) + 1);
  baseCounts.set(endBase, (baseCounts.get(endBase) ?? 0) + 1);

  const sortedCounts = [...baseCounts.values()].sort((a, b) => a - b);

  return sortedCounts[sortedCounts.length - 1] - sortedCounts[0];
}
