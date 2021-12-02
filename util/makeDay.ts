if (Deno.args.length !== 1 || !isNumber(Deno.args[0])) {
    throw new Error("Must provide a single numeric argument for the number of the day, e.g. 5");
}

const dayNumber = parseInt(Deno.args[0]);
const dirName = mkdirName(dayNumber);

console.log(`Creating directory for day ${dayNumber}!`);

await Deno.mkdir(dirName);
await Deno.create(`${dirName}/input.txt`);
await Deno.create(`${dirName}/index.ts`);
await Deno.create(`${dirName}/lib.ts`);
await Deno.create(`${dirName}/lib.test.ts`);

// Adds leading zero to numbers less than 10
function mkdirName(n: number): string {
    if (n < 10) {
        return `0${n}`; 
    }

    return `${n}`;
}

function isNumber(s: unknown): boolean {
    let subject;
    
    if (typeof s === "number") {
        subject = s;
    } else if (typeof s === "string") {
        subject = parseInt(s);
    } else {
        return false;
    }
        
    return !isNaN(subject) && isFinite(subject);
}