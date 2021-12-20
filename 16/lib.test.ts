import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { BinaryArray } from "../util/types.ts";
import { getLiteralDecimal, part1, part2 } from "./lib.ts";

const testInput1 = `D2FE28`;
const testInput2 = `8A004A801A8002F478`;
const testInput3 = `620080001611562C8802118E34`;
const testInput4 = `C0015000016115A2E0802F182340`;
const testInput5 = `A0016C880162017C3686B18A3D4780`;

Deno.test("getLiteralDecimal", () => {
  const want = 2021;
  const result = getLiteralDecimal(
    "101111111000101000".split("").map((n) => parseInt(n)) as BinaryArray,
  );

  assertEquals(result, want);
});

Deno.test("part1 ex1", () => {
  const want = 6;
  const result = part1(testInput1);

  assertEquals(result, want);
});

Deno.test("part1 ex2", () => {
  const want = 16;
  const result = part1(testInput2);

  assertEquals(result, want);
});

Deno.test("part1 ex3", () => {
  const want = 12;
  const result = part1(testInput3);

  assertEquals(result, want);
});

Deno.test("part1 ex4", () => {
  const want = 23;
  const result = part1(testInput4);

  assertEquals(result, want);
});

Deno.test("part1 ex5", () => {
  const want = 31;
  const result = part1(testInput5);

  assertEquals(result, want);
});

Deno.test("part1 proper", async () => {
  const want = 923;
  const input = await Deno.readTextFile("./input.txt");
  const result = part1(input);

  assertEquals(result, want);
});

const testInput10 = `C200B40A82`;
const testInput11 = `04005AC33890`;
const testInput12 = `880086C3E88112`;
const testInput13 = `CE00C43D881120`;
const testInput14 = `D8005AC2A8F0`;
const testInput15 = `9C0141080250320F1802104A08`;

Deno.test("part2 ex 10", () => {
  const want = 3;
  const result = part2(testInput10);

  assertEquals(result, want);
});

Deno.test("part2 ex 11", () => {
  const want = 54;
  const result = part2(testInput11);

  assertEquals(result, want);
});

Deno.test("part2 ex 12", () => {
  const want = 7;
  const result = part2(testInput12);

  assertEquals(result, want);
});

Deno.test("part2 ex 13", () => {
  const want = 9;
  const result = part2(testInput13);

  assertEquals(result, want);
});

Deno.test("part2 ex 14", () => {
  const want = 1;
  const result = part2(testInput14);

  assertEquals(result, want);
});

Deno.test("part2 ex 15", () => {
  const want = 1;
  const result = part2(testInput15);

  assertEquals(result, want);
});

Deno.test("part2 proper", async () => {
  const want = 258888628940;

  const input = await Deno.readTextFile("./input.txt");
  const result = part2(input);

  assertEquals(result, want);
});
