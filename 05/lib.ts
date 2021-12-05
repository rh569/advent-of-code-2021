export type Vector2 = {
  x: number;
  y: number;
};

export type LineSegment = {
  start: Vector2;
  end: Vector2;
  isCardinal: boolean;
};

export function parseInput(rawInput: string): LineSegment[] {
  const lineParts = rawInput.split("\n")
    .map((line) => line.split(" -> "));

  return lineParts.map(([start, end]) => {
    const [x1, y1] = start.split(",").map((s) => parseInt(s));
    const [x2, y2] = end.split(",").map((s) => parseInt(s));

    return {
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      isCardinal: (x1 === x2 || y1 === y2),
    };
  });
}

export function part1(lineSegments: LineSegment[]): number {
  const vents = new Map<string, number>();

  for (let i = 0; i < lineSegments.length; i++) {
    if (!lineSegments[i].isCardinal) continue;
    markVents(vents, lineSegments[i]);
  }

  return countOverlappingVents(vents);
}

export function part2(lineSegments: LineSegment[]): number {
  const vents = new Map<string, number>();

  for (let i = 0; i < lineSegments.length; i++) {
    markVents(vents, lineSegments[i]);
  }

  return countOverlappingVents(vents);
}

// Now supports diagonals!
function markVents(vents: Map<string, number>, segment: LineSegment): void {
  const segmentPoints = getLinePoints(segment);

  for (const point of segmentPoints) {
    const pos = JSON.stringify(point);
    vents.set(pos, (vents.get(pos) ?? 0) + 1);
  }
}

// Went through about 4 iterations for this logic
// Finally got somewhere I was happy with
// The original for loops wouldn't cut it due to the x or y values increasing or decreasing depending on direction
// which was fine for part1 as I just switched start and end, but doesn't work for diagonals
function getLinePoints(segment: LineSegment): Vector2[] {
  const points: Vector2[] = [];

  const pos = { ...segment.start };
  const end = { ...segment.end };

  const stepToTarget = (
    pos: Vector2,
    target: Vector2,
    component: keyof Vector2,
  ): void => {
    if (pos[component] < target[component]) {
      pos[component]++;
    }

    if (pos[component] > target[component]) {
      pos[component]--;
    }
  };

  // Will walk through the segment, stopping when pos == end
  while (pos.x !== end.x || pos.y !== end.y) {
    points.push({ x: pos.x, y: pos.y });
    stepToTarget(pos, end, "x");
    stepToTarget(pos, end, "y");
  }

  points.push(end);

  return points;
}

function countOverlappingVents(vents: Map<string, number>): number {
  let count = 0;

  // printVents(vents);

  for (const [_, plumes] of vents) {
    if (plumes > 1) count++;
  }

  return count;
}

// Prints the vents to match the puzzle description
// Used to help debug the test cases
function printVents(vents: Map<string, number>): void {
  let largestX = 0;
  let largestY = 0;

  for (const [pos, _] of vents) {
    const vec = JSON.parse(pos) as Vector2;
    if (vec.x > largestX) largestX = vec.x;
    if (vec.y > largestY) largestY = vec.y;
  }

  // Print
  console.info("");

  for (let j = 0; j <= largestY; j++) {
    let line = "";

    for (let i = 0; i <= largestX; i++) {
      const pos = JSON.stringify({ x: i, y: j });
      if (vents.has(pos)) {
        line += `${vents.get(pos)}`;
      } else {
        line += ".";
      }
    }

    console.info(line);
  }
}
