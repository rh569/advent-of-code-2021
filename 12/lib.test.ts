import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { part1, part2 } from "./lib.ts";

const testInput1 = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

const testInput2 = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;

const testInput3 = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;

Deno.test("part1 ex1", () => {
  const want = 10;
  const result = part1(testInput1);

  assertEquals(result, want);
});

Deno.test("part1 ex2", () => {
  const want = 19;
  const result = part1(testInput2);

  assertEquals(result, want);
});

Deno.test("part1 ex3", () => {
  const want = 226;
  const result = part1(testInput3);

  assertEquals(result, want);
});

Deno.test("part1 proper", async () => {
  const want = 3856;
  const input = await Deno.readTextFile("./input.txt");
  const result = part1(input);

  assertEquals(result, want);
});

Deno.test("part2 ex1", () => {
  const want = 36;
  const result = part2(testInput1);

  assertEquals(result, want);
});

Deno.test("part2 ex2", () => {
  const want = 103;
  const result = part2(testInput2);

  assertEquals(result, want);
});

Deno.test("part2 ex3", () => {
  const want = 3509;
  const result = part2(testInput3);

  assertEquals(result, want);
});

Deno.test("part2 proper", async () => {
  const want = 116692;
  const input = await Deno.readTextFile("./input.txt");
  const result = part2(input);

  assertEquals(result, want);
});
