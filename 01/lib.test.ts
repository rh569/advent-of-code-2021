import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";

import { part1, part2 } from "./lib.ts";

const testDepths = [
  199,
  200,
  208,
  210,
  200,
  207,
  240,
  269,
  260,
  263,
];

Deno.test("part1 example data", () => {
  assertEquals(part1(testDepths), 7);
});

Deno.test("part2 example data", () => {
  assertEquals(part2(testDepths), 5);
});
