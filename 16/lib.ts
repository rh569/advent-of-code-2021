import { BinaryArray } from "../util/types.ts";

function parseInput(rawInput: string): BinaryArray {
  return rawInput.split("")
    .map((char) => Number(`0x${char}`))
    .map((num) => num.toString(2))
    .map((bitStr) => bitStr.length === 4 ? bitStr : padNibble(bitStr))
    .flatMap((nibble) => nibble.split(""))
    .map((bitStr) => parseInt(bitStr)) as BinaryArray;
}

function padNibble(bitStr: string): string {
  while (bitStr.length < 4) {
    bitStr = `0${bitStr}`;
  }

  return bitStr;
}

export function part1(input: string): number {
  const transmissionBits = parseInput(input);

  const rootPacket = decodePacket(transmissionBits);

  return sumVersions(rootPacket);
}

export function part2(input: string): number {
  const transmissionBits = parseInput(input);

  const rootPacket = decodePacket(transmissionBits);

  return calculatePacket(rootPacket);
}

type Packet = {
  version: number;
  typeID: number;
  lengthID?: number;
  subpacketLength?: number;
  subpackets?: Packet[];
  value?: number;
};

function decodePacket(bits: BinaryArray): Packet {
  const p: Packet = {
    version: getNBitHeaderDecimal(bits, 3),
    typeID: getNBitHeaderDecimal(bits, 3),
  };

  // Literal Value Packet
  if (p.typeID === 4) {
    p.value = getLiteralDecimal(bits);

    return p;
  }

  // Operator Packet
  p.lengthID = getNBitHeaderDecimal(bits, 1);

  if (p.lengthID !== undefined && p.lengthID === 0) {
    p.subpacketLength = getNBitHeaderDecimal(bits, 15);

    if (p.subpacketLength !== undefined) {
      p.subpackets = getSubpacketsInNBits(bits, p.subpacketLength);
    }

    return p;
  }

  if (p.lengthID !== undefined && p.lengthID === 1) {
    p.subpacketLength = getNBitHeaderDecimal(bits, 11);

    if (p.subpacketLength !== undefined) {
      p.subpackets = getNSubpackets(bits, p.subpacketLength);
    }

    return p;
  }

  throw new Error("Illegal state");
}

function getNBitHeaderDecimal(bits: BinaryArray, numberOfBits: number): number {
  if (bits.length < numberOfBits) {
    throw new Error(`Cannot get ${numberOfBits} from ${bits.length}`);
  }

  return Number("0b".concat(bits.splice(0, numberOfBits).join("")));
}

export function getLiteralDecimal(bits: BinaryArray): number {
  let bitStr = "";

  // Only continue reading if 5-bit chunk starts with 1
  while (getNBitHeaderDecimal(bits, 1) === 1) {
    bitStr += bits.splice(0, 4).join("");
  }

  bitStr += bits.splice(0, 4).join("");

  return Number(`0b${bitStr}`);
}

function getSubpacketsInNBits(
  bits: BinaryArray,
  numberOfBits: number,
): Packet[] {
  const subpacketBits = bits.splice(0, numberOfBits);

  const subpackets: Packet[] = [];

  // Caution: may need to deal with trailing zeroes here
  while (subpacketBits.length > 0) {
    subpackets.push(decodePacket(subpacketBits));
  }

  return subpackets;
}

function getNSubpackets(bits: BinaryArray, numberOfPackets: number): Packet[] {
  const subpackets: Packet[] = [];

  while (numberOfPackets > 0) {
    subpackets.push(decodePacket(bits));
    numberOfPackets--;
  }

  return subpackets;
}

function sumVersions(p: Packet): number {
  let sum = p.version;

  if (p.subpackets !== undefined) {
    for (const subP of p.subpackets) {
      sum += sumVersions(subP);
    }
  }

  return sum;
}

function calculatePacket(p: Packet): number {
  if (p.value !== undefined) return p.value;

  if (p.subpackets === undefined) {
    throw new Error("Illegal state: Non type 4 packet has no subs");
  }

  switch (p.typeID) {
    case 0:
      return sumSubpackets(p.subpackets);
    case 1:
      return multiplySubpackets(p.subpackets);
    case 2:
      return minimumSubpacket(p.subpackets);
    case 3:
      return maximumSubpacket(p.subpackets);
    case 5:
      return compareSubpackets(p.subpackets) === "gt" ? 1 : 0;
    case 6:
      return compareSubpackets(p.subpackets) === "lt" ? 1 : 0;
    case 7:
      return compareSubpackets(p.subpackets) === "eq" ? 1 : 0;
  }

  throw new Error("Illegal state: Unknown typeID" + p.typeID);
}

function sumSubpackets(subpackets: Packet[]): number {
  let sum = 0;

  for (const p of subpackets) {
    sum += calculatePacket(p);
  }

  return sum;
}

function multiplySubpackets(subpackets: Packet[]): number {
  let product = 1;

  for (const p of subpackets) {
    product *= calculatePacket(p);
  }

  return product;
}

function minimumSubpacket(subpackets: Packet[]): number {
  let min = Number.MAX_SAFE_INTEGER;

  for (const p of subpackets) {
    min = Math.min(min, calculatePacket(p));
  }

  return min;
}

function maximumSubpacket(subpackets: Packet[]): number {
  let max = 0;

  for (const p of subpackets) {
    max = Math.max(max, calculatePacket(p));
  }

  return max;
}

function compareSubpackets(subpackets: Packet[]): "gt" | "lt" | "eq" {
  const v1 = calculatePacket(subpackets[0]);
  const v2 = calculatePacket(subpackets[1]);

  if (v1 > v2) return "gt";
  if (v1 < v2) return "lt";
  return "eq";
}
