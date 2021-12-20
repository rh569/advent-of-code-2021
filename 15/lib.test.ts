import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { part1, part2 } from "./lib.ts";

const testInput = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

Deno.test("part1", () => {
  const want = 40;
  const result = part1(testInput);

  assertEquals(result, want);
});

Deno.test("part1 proper", async () => {
  const want = 589;
  const input = await Deno.readTextFile("./input.txt");
  const result = part1(input);

  assertEquals(result, want);
});

Deno.test("part2", () => {
  const want = 315;
  const result = part2(testInput);

  assertEquals(result, want);
});

Deno.test("part2 proper", async () => {
  const want = 2885;

  const input = await Deno.readTextFile("./input.txt");
  const result = part2(input);

  assertEquals(result, want);
});
