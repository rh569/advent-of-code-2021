export type BoardNumber = {
  value: number;
  called: boolean;
};

export function parseInput(raw: string): [number[], BoardNumber[][][]] {
  const blocks = raw.split("\n\n");

  const [rawDraw] = blocks.splice(0, 1);

  const draw = rawDraw.split(",").map((n) => parseInt(n));
  const boards = blocks.map((board) => {
    board = board.replaceAll("  ", " "); // remove pretty formatting of single digits
    return board.split("\n")
      .map((line) =>
        line.split(" ").filter((s) => s.length).map((n) => parseInt(n)).map((
          bn,
        ) => ({ value: bn, called: false }))
      );
  });

  return [draw, boards];
}

export function sumBoards(board: BoardNumber[][]): number {
  let sum = 0;

  board.forEach((row) => {
    row.forEach((num) => {
      if (!num.called) sum += num.value;
    });
  });

  return sum;
}
