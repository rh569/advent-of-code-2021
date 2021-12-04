import { parseInput } from "./lib.ts";
import { part1, part2 } from "./parts.ts";

const rawInput = await Deno.readTextFile("./input.txt");

const [draw, boards] = parseInput(rawInput);

console.log(part1(draw, boards));
console.log(part2(draw, boards));
