function parseInput(
  rawInput: string,
): [[number, number][], [string, number][]] {
  const blocks = rawInput.split("\n\n");

  const dots = blocks[0].split("\n").map((line) =>
    line.split(",").map((n) => parseInt(n)) as [number, number]
  );
  const instructions = blocks[1].split("\n").map((ins) =>
    ins.replace("fold along ", "")
      .split("=")
      .map((x, idx) => idx === 0 ? x : parseInt(x)) as [string, number]
  );

  return [dots, instructions];
}

type DotsList = [number, number][];

export function part1(input: string): number {
  let [dots, instructions] = parseInput(input);

  dots = fold(dots, instructions[0][0], instructions[0][1]);

  return dots.length;
}

export function part2(input: string): string {
  let [dots, instructions] = parseInput(input);

  instructions.forEach((ins) => {
    dots = fold(dots, ins[0], ins[1]);
  });

  return printDots(dots);
}

function fold(dots: DotsList, axis: string, value: number): DotsList {
  const foldedDots: DotsList = [];

  dots.forEach(([x, y]) => {
    const dot: [number, number] = [x, y];

    if (axis === "y") {
      if (y > value) {
        dot[1] = y - 2 * (y - value);
      }
    } else {
      if (x > value) {
        dot[0] = x - 2 * (x - value);
      }
    }

    if (!contains(foldedDots, dot)) {
      foldedDots.push(dot);
    }
  });

  return foldedDots;
}

function contains(dots: DotsList, dot: [number, number]): boolean {
  for (let i = 0; i < dots.length; i++) {
    if (dots[i][0] === dot[0] && dots[i][1] === dot[1]) {
      return true;
    }
  }

  return false;
}

function printDots(dots: DotsList): string {
  let maxX = 0, maxY = 0;

  for (const dot of dots) {
    maxX = Math.max(maxX, dot[0]);
    maxY = Math.max(maxY, dot[1]);
  }

  const dotGrid: string[][] = new Array(maxY + 1).fill(null).map((_) =>
    new Array(maxX + 1).fill(".")
  );

  for (const dot of dots) {
    dotGrid[dot[1]][dot[0]] = "#";
  }

  let gridStr = "";

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      gridStr += dotGrid[y][x];
    }

    if (y !== maxY) gridStr += "\n";
  }

  return gridStr;
}
