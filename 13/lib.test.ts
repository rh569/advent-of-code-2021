import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { part1, part2 } from "./lib.ts";

const testInput = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

Deno.test("part1", () => {
  const want = 17;
  const result = part1(testInput);

  assertEquals(result, want);
});

Deno.test("part1 proper", async () => {
  const want = 770;
  const input = await Deno.readTextFile("./input.txt");
  const result = part1(input);

  assertEquals(result, want);
});

Deno.test("part2", () => {
  const want = `#####
#...#
#...#
#...#
#####`;
  const result = part2(testInput);

  assertEquals(result, want);
});

Deno.test("part2 proper", async () => {
  const want = // EPUELPBR
    `####.###..#..#.####.#....###..###..###.
#....#..#.#..#.#....#....#..#.#..#.#..#
###..#..#.#..#.###..#....#..#.###..#..#
#....###..#..#.#....#....###..#..#.###.
#....#....#..#.#....#....#....#..#.#.#.
####.#.....##..####.####.#....###..#..#`;

  const input = await Deno.readTextFile("./input.txt");
  const result = part2(input);

  assertEquals(result, want);
});
