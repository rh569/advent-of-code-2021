import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { parseInput } from "./lib.ts";

export const testInput =
  `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;

Deno.test("parse input", () => {
  const toBn = (n: number) => ({ value: n, called: false });

  const want = [
    [
      7,
      4,
      9,
      5,
      11,
      17,
      23,
      2,
      0,
      14,
      21,
      24,
      10,
      16,
      13,
      6,
      15,
      25,
      12,
      22,
      18,
      20,
      8,
      19,
      3,
      26,
      1,
    ],
    [
      [
        [22, 13, 17, 11, 0].map(toBn),
        [8, 2, 23, 4, 24].map(toBn),
        [21, 9, 14, 16, 7].map(toBn),
        [6, 10, 3, 18, 5].map(toBn),
        [1, 12, 20, 15, 19].map(toBn),
      ],
      [
        [3, 15, 0, 2, 22].map(toBn),
        [9, 18, 13, 17, 5].map(toBn),
        [19, 8, 7, 25, 23].map(toBn),
        [20, 11, 10, 24, 4].map(toBn),
        [14, 21, 16, 12, 6].map(toBn),
      ],
      [
        [14, 21, 17, 24, 4].map(toBn),
        [10, 16, 15, 9, 19].map(toBn),
        [18, 8, 23, 26, 20].map(toBn),
        [22, 11, 13, 6, 5].map(toBn),
        [2, 0, 12, 3, 7].map(toBn),
      ],
    ],
  ];

  const result = parseInput(testInput);

  assertEquals(result, want);
});
