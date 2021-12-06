export function parseInput(rawInput: string): number[] {
  return rawInput.split(",").map((s) => parseInt(s));
}

// Brute force looping
export function part1(startingFish: number[]): number {
  let fish = [...startingFish];

  let nextGeneration: number[] = [];
  let newFish: number[] = [];

  for (let i = 0; i < 80; i++) {
    nextGeneration = fish.map((fishAge) => {
      if (fishAge === 0) {
        newFish.push(8);
        return 6;
      } else {
        return fishAge - 1;
      }
    });

    fish = nextGeneration.concat(newFish);
    nextGeneration = [];
    newFish = [];
  }

  return fish.length;
}

// Number of fish in the example after 256 days > 26bn (~2^34)
// Not only is this incredibly slow to loop through, JS max array
// length is 2^32

// The full array allows us to maintain the order we counted and
// added the fish, but this is not useful information

// We can instead just track the total fish of each age
export function part2(fish: number[]): number {
  const ageMap = new Array(9).fill(0);

  fish.forEach((fishAge) => ageMap[fishAge] = ageMap[fishAge] + 1);

  for (let i = 0; i < 256; i++) {
    const zeroDayFish = ageMap[0];

    for (let j = 1; j < ageMap.length; j++) {
      ageMap[j - 1] = ageMap[j];
    }

    ageMap[8] = zeroDayFish;
    ageMap[6] = ageMap[6] + zeroDayFish;
  }

  return ageMap.reduce((acc, val) => acc + val);
}
