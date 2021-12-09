import { parseInput, part1, part2 } from "./lib.ts";

const rawInput = await Deno.readTextFile("./input.txt");

const caveMap = parseInput(rawInput);

const [ans, _] = part1(caveMap);
console.log(ans);
console.log(part2(caveMap));
