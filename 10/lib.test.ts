import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { parseInput, part1, part2 } from "./lib.ts";

const testInput = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`;

Deno.test("part1", () => {
  const want = 26397;
  const [result, _] = part1(parseInput(testInput));

  assertEquals(result, want);
});

Deno.test("part1 proper", async () => {
  const want = 243939;
  const input = await Deno.readTextFile("./input.txt");
  const [result, _] = part1(parseInput(input));

  assertEquals(result, want);
});

Deno.test("part2", () => {
  const want = 288957;
  const result = part2(parseInput(testInput));

  assertEquals(result, want);
});

Deno.test("part2 proper", async () => {
  const want = 2421222841;
  const input = await Deno.readTextFile("./input.txt");
  const result = part2(parseInput(input));

  assertEquals(result, want);
});
