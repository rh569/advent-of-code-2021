import { BoardNumber, sumBoards } from "./lib.ts";

type BoardStats = {
  rowHits: number[];
  colHits: number[];
};

export function part1(drawOrder: number[], boards: BoardNumber[][][]): number {
  let lastFound: number | null = null;
  let winningBoardIndex: number | null = null;

  // Uses fact that board size is fixed at 5x5
  const foundPerBoard: BoardStats[] = new Array(boards.length).fill(0).map(
    (_) => ({
      rowHits: new Array(5).fill(0),
      colHits: new Array(5).fill(0),
    }),
  );

  for (const draw of drawOrder) {
    if (winningBoardIndex !== null) break;
    boards.forEach((board, boardIndex) => {
      if (winningBoardIndex !== null) return;
      board.forEach((row, rowIndex) => {
        if (winningBoardIndex !== null) return;
        row.forEach((num, colIndex) => {
          if (winningBoardIndex !== null) return;

          if (num.value === draw) {
            // found a number
            lastFound = draw;
            num.called = true;

            foundPerBoard[boardIndex].rowHits[rowIndex]++;
            foundPerBoard[boardIndex].colHits[colIndex]++;

            // win condition, break
            if (
              foundPerBoard[boardIndex].rowHits[rowIndex] === 5 ||
              foundPerBoard[boardIndex].colHits[colIndex] === 5
            ) {
              winningBoardIndex = boardIndex;
            }
          }
        });
      });
    });
  }

  if (lastFound === null || winningBoardIndex == null) {
    throw new Error("No win condition met");
  }

  return (lastFound) * sumBoards(boards[winningBoardIndex]);
}

export function part2(drawOrder: number[], boards: BoardNumber[][][]): number {
  let lastFound: number | null = null;
  let boardsInPlay = boards.length;
  const wonBoards: number[] = [];

  // Uses fact that board size is fixed at 5x5
  const foundPerBoard: BoardStats[] = new Array(boards.length).fill(0).map(
    (_) => ({
      rowHits: new Array(5).fill(0),
      colHits: new Array(5).fill(0),
    }),
  );

  for (const draw of drawOrder) {
    if (boardsInPlay === 0) break;
    boards.forEach((board, boardIndex) => {
      if (boardsInPlay === 0 || wonBoards.includes(boardIndex)) return;
      board.forEach((row, rowIndex) => {
        if (boardsInPlay === 0) return;
        row.forEach((num, colIndex) => {
          if (boardsInPlay === 0) return;

          if (num.value === draw) {
            // found a number
            lastFound = draw;
            num.called = true;

            foundPerBoard[boardIndex].rowHits[rowIndex]++;
            foundPerBoard[boardIndex].colHits[colIndex]++;

            // win condition, break
            if (
              foundPerBoard[boardIndex].rowHits[rowIndex] === 5 ||
              foundPerBoard[boardIndex].colHits[colIndex] === 5
            ) {
              wonBoards.push(boardIndex);
              boardsInPlay--;
            }
          }
        });
      });
    });
  }

  if (lastFound === null || boardsInPlay > 0) {
    throw new Error("No win condition met");
  }

  return (lastFound) * sumBoards(boards[wonBoards.pop() ?? -1]);
}
