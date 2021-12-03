/**
 * @param rawInput
 * @returns (0|1)[]
 */
export function parseInput(rawInput: string): BinaryArray[] {
  const lines = rawInput.split("\n");

  return lines.map((line) => line.split(""))
    .map((lineArr) => lineArr.map((bit) => parseInt(bit))) as BinaryArray[];
}

type BinaryArray = (0|1)[];

export function part1(binArrs: BinaryArray[]): number {
 
    const gammaRate = findGammaRate(binArrs);
    const epsilsonRate = findEpsilonRate(gammaRate);

    return toDec(gammaRate) * toDec(epsilsonRate);
}

export function part2(binArrs: BinaryArray[]): number {

    const o2Rate = findO2Rate(binArrs);
    const co2Rate = findCO2Rate(binArrs);

    return toDec(o2Rate) * toDec(co2Rate);
}

export function findO2Rate(arrs: BinaryArray[]): BinaryArray {
    let o2Report = arrs.map(arr => [...arr]);
    let pos = 0;
    let bitsSet = 0;

    while (o2Report.length > 1) {

        o2Report.forEach((arr) => {
            if (arr[pos] === 1) {
                bitsSet++;
            }
        });
        
        // Combination of >= and ceil gives the correct bias to 1 in a tie
        if (bitsSet >= Math.ceil(o2Report.length / 2)) {
            o2Report = o2Report.filter(arr => arr[pos] === 1);
        } else {
            o2Report = o2Report.filter(arr => arr[pos] === 0);
        }

        pos++;
        bitsSet = 0;
    }

    return o2Report.pop() ?? new Array(pos + 1).fill(0);
}

export function findCO2Rate(arrs: BinaryArray[]): BinaryArray {
    let co2Report = arrs.map(arr => [...arr]);
    let pos = 0;
    let bitsSet = 0;

    while (co2Report.length > 1) {
        co2Report.forEach((arr) => {
            if (arr[pos] === 1) {
                bitsSet++;
            }
        });
        
        // Combination of >= and ceil gives the correct bias to 1 in a tie
        if (bitsSet >= Math.ceil(co2Report.length / 2)) {
            co2Report = co2Report.filter(arr => arr[pos] === 0);
        } else {
            co2Report = co2Report.filter(arr => arr[pos] === 1);
        }

        pos++;
        bitsSet = 0;
    }

    return co2Report.pop() ?? new Array(pos + 1).fill(0);
}

export function findGammaRate(arrs: BinaryArray[]): BinaryArray {
    const seenSetBits = new Array(arrs[0].length).fill(0);

    arrs.forEach((bitArr) => {
        bitArr.forEach((bit, index) => {
            if (bit) seenSetBits[index]++;
        });
    });

    const half = Math.floor(arrs.length / 2);
    return seenSetBits.map(count => (count > half ? 1 : 0));
}

export function findEpsilonRate(bin: BinaryArray): BinaryArray {
    return bin.map(bit => bit === 0 ? 1 : 0);
}

export function toDec(bin: BinaryArray): number {
    let dec = 0;

    bin.forEach((bit, index) => {
        if (bit) {
            dec += Math.pow(2, bin.length - index - 1);
        }
    });


    return dec;
}
