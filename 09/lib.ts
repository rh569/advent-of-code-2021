type MatrixIndex = {
  i: number;
  j: number;
};

export function parseInput(rawInput: string): number[][] {
  const lines = rawInput.split("\n");

  return lines.map((line) => line.split("").map((n) => parseInt(n)));
}

export function part1(caveMap: number[][]): [number, MatrixIndex[]] {
  const lowPoints: number[] = [];
  const lowPointPositions: MatrixIndex[] = [];

  for (let i = 0; i < caveMap.length; i++) {
    for (let j = 0; j < caveMap[i].length; j++) {
      let isLowPoint = true;
      const compare = getValidComparisons(
        i,
        j,
        caveMap.length,
        caveMap[i].length,
      );

      compare.i.forEach((comp) => {
        if (caveMap[i + comp][j] <= caveMap[i][j]) isLowPoint = false;
      });

      compare.j.forEach((comp) => {
        if (caveMap[i][j + comp] <= caveMap[i][j]) isLowPoint = false;
      });

      if (isLowPoint) {
        lowPoints.push(caveMap[i][j]);
        lowPointPositions.push({ i, j });
      }
    }
  }

  return [
    lowPoints.map((n) => n + 1).reduce((a, b) => a + b),
    lowPointPositions,
  ];
}

export function part2(caveMap: number[][]): number {
  const [_, lowPoints] = part1(caveMap);

  const basinSizes: number[] = [];

  lowPoints.forEach((point) => {
    basinSizes.push(calculateBasin(point, caveMap));
  });

  return basinSizes.sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a * b);
}

function calculateBasin(point: MatrixIndex, map: number[][]): number {
  let basinSize = 0;

  const checkedPoints: MatrixIndex[] = [];
  const pointsToCheck: MatrixIndex[] = [point];

  const iLen = map.length;
  const jLen = map[0].length;

  while (pointsToCheck.length > 0) {
    const pos = pointsToCheck.pop() as MatrixIndex;
    checkedPoints.push(pos);
    basinSize++;

    const compare = getValidComparisons(pos.i, pos.j, iLen, jLen);

    compare.i.forEach((comp) => {
      const newPos: MatrixIndex = { i: pos.i + comp, j: pos.j };
      if (
        !contains(checkedPoints, newPos) &&
        !contains(pointsToCheck, newPos) &&
        map[newPos.i][newPos.j] >= map[pos.i][pos.j] &&
        map[newPos.i][newPos.j] < 9
      ) {
        pointsToCheck.push(newPos);
      }
    });

    compare.j.forEach((comp) => {
      const newPos: MatrixIndex = { i: pos.i, j: pos.j + comp };
      if (
        !contains(checkedPoints, newPos) &&
        !contains(pointsToCheck, newPos) &&
        map[newPos.i][newPos.j] >= map[pos.i][pos.j] &&
        map[newPos.i][newPos.j] < 9
      ) {
        pointsToCheck.push(newPos);
      }
    });
  }

  return basinSize;
}

function contains(arr: MatrixIndex[], item: MatrixIndex): boolean {
  for (let i = 0; i < arr.length; i++) {
    if (item.i === arr[i].i && item.j === arr[i].j) {
      return true;
    }
  }

  return false;
}

function getValidComparisons(
  i: number,
  j: number,
  iLen: number,
  jLen: number,
): Record<"i" | "j", number[]> {
  const compare: Record<"i" | "j", number[]> = {
    i: [],
    j: [],
  };

  if (i !== 0) {
    compare.i.push(-1);
  }

  if (i !== iLen - 1) {
    compare.i.push(1);
  }

  if (j !== 0) {
    compare.j.push(-1);
  }

  if (j !== jLen - 1) {
    compare.j.push(1);
  }

  return compare;
}
