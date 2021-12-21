import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { part1, part2 } from "./lib.ts";

const testInput = `target area: x=20..30, y=-10..-5`;

Deno.test("part1", () => {
  const want = 45;
  const result = part1(testInput);

  assertEquals(result, want);
});

Deno.test("part1 proper", async () => {
  const want = 5995;
  const input = await Deno.readTextFile("./input.txt");
  const result = part1(input);

  assertEquals(result, want);
});

Deno.test("part2", () => {
  const want = 112;
  const result = part2(testInput);

  assertEquals(result, want);
});

Deno.test("part2 proper", async () => {
  const want = 3202;

  const input = await Deno.readTextFile("./input.txt");
  const result = part2(input);

  assertEquals(result, want);
});
