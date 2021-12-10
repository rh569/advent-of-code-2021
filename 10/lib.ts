export function parseInput(rawInput: string): string[] {
  return rawInput.split("\n");
}

export function part1(lines: string[]): [number, string[]] {
  let score = 0;

  const incompleteLines = lines.filter((line) => {
    const lineScore = getCorruptLineScore(line);

    if (lineScore === 0) {
      return true;
    } else {
      score += lineScore;
      return false;
    }
  });

  return [score, incompleteLines];
}

export function part2(lines: string[]): number {
  const [_, incompleteLines] = part1(lines);
  const scores: number[] = [];

  incompleteLines.forEach((line) => {
    scores.push(getIncompleteLineScore(line));
  });

  return scores.sort((a, b) => a - b)[(scores.length - 1) / 2];
}

function getIncompleteLineScore(line: string): number {
  const openerStack: string[] = [];

  const chars = line.split("");

  // set up the stack
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (isOpener(char)) {
      openerStack.push(char);
      continue;
    }

    openerStack.pop();
  }

  let score = 0;

  for (let i = openerStack.length - 1; i >= 0; i--) {
    score *= 5;
    score += getCompleteScore(openerStack[i]);
  }

  return score;
}

/**
 * Returns line score which will be 0 if not corrupt
 * @param line
 */
function getCorruptLineScore(line: string): number {
  const openerStack: string[] = [];

  const chars = line.split("");

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (isOpener(char)) {
      openerStack.push(char);
      continue;
    }

    if (openerStack.length === 0) {
      return getScore(char);
    }

    if (
      openerStack[openerStack.length - 1] !==
        fromCloser[char as keyof typeof fromCloser]
    ) {
      return getScore(char);
    } else {
      openerStack.pop();
    }
  }

  return 0;
}

function getCompleteScore(c: string): number {
  if (c === "(") return 1;
  if (c === "[") return 2;
  if (c === "{") return 3;
  return 4;
}

function getScore(c: string): number {
  if (c === ")") return 3;
  if (c === "]") return 57;
  if (c === "}") return 1197;
  return 25137;
}

function isOpener(c: string): boolean {
  return c === "<" || c === "(" || c === "{" || c === "[";
}

const fromCloser = {
  ">": "<",
  ")": "(",
  "]": "[",
  "}": "{",
} as const;
