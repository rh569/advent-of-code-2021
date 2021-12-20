import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { part1, part2 } from "./lib.ts";

const testInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

Deno.test("part1", () => {
  const want = 1588;
  const result = part1(testInput);

  assertEquals(result, want);
});

Deno.test("part1 proper", async () => {
  const want = 3213;
  const input = await Deno.readTextFile("./input.txt");
  const result = part1(input);

  assertEquals(result, want);
});

Deno.test("part2", () => {
  const want = 2188189693529;
  const result = part2(testInput);

  assertEquals(result, want);
});

Deno.test("part2 proper", async () => {
  const want = 3711743744429;

  const input = await Deno.readTextFile("./input.txt");
  const result = part2(input);

  assertEquals(result, want);
});
