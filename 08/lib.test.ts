import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import {
  digitOR,
  digitXOR,
  get3From5Segs,
  get5From5Segs,
  parseInput,
  part1,
  part2,
  toBin,
} from "./lib.ts";

const testInput =
  `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

Deno.test("part1", () => {
  const want = 26;
  const result = part1(parseInput(testInput));

  assertEquals(result, want);
});

Deno.test("part2", () => {
  const want = 61229;
  const result = part2(parseInput(testInput));

  assertEquals(result, want);
});

Deno.test("get 3 from 5 segs", () => {
  const want = toBin("abcdf");

  const segs = [
    toBin("abcdf"),
    toBin("bcdef"),
    toBin("acdfg"),
  ];

  const result = get3From5Segs(segs);

  assertEquals(result, want);
  assertEquals(segs.length, 2);
});

Deno.test("get 5 from 5 segs", () => {
  const want = toBin("abdfg");

  const segs = [
    toBin("abdfg"),
    toBin("acdeg"),
  ];

  const result = get5From5Segs(segs, toBin("abcdfg"));

  assertEquals(result, want);
  assertEquals(segs.length, 1);
});

Deno.test("digitXOR", () => {
  const want = toBin("a");
  const result = digitXOR(toBin("acf"), toBin("cf"));

  assertEquals(result, want);
});

Deno.test("digitOR", () => {
  const want = toBin("abdefg");
  const result = digitOR(toBin("abdfg"), toBin("e"));

  assertEquals(result, want);
});

Deno.test("compound OR", () => {
  const want = toBin("abcdfg");
  const result = digitOR(digitOR(toBin("acf"), toBin("bdcf")), toBin("acdfg"));

  assertEquals(result, want);
});
