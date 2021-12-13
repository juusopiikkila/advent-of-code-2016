import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function decompress(data: string, deep = false): number[] {
    const weights = (new Array(data.length)).fill(0);

    for (let i = 0; i < data.length; i += 1) {
        const str = data.slice(i);
        const matchData = str.match(/^\(([0-9]+)x([0-9]+)\)/);

        if (!matchData) {
            weights[i] = 1;
        } else {
            const matchLength = matchData[0].length;
            const length = Number(matchData[1]);
            const repeat = Number(matchData[2]);
            const dataSlice = data.slice(i + matchLength, i + matchLength + length);
            const slice = weights.slice(i + matchLength, i + matchLength + length);

            weights.splice(i + matchLength, length, ...slice.map((num) => num + repeat));

            if (deep) {
                const deepWeights = decompress(dataSlice, true);

                deepWeights.forEach((w, index) => {
                    weights[i + matchLength + index] = w * repeat;
                });
            }

            i += matchLength + length - 1;
        }
    }

    return weights;
}

function getDecompressedLength(data: string, deep = false) {
    return decompress(data, deep).reduce((acc, num) => acc + num, 0);
}

function part1(data: string[]): number {
    return getDecompressedLength(data[0]);
}

function part2(data: string[]): number {
    return getDecompressedLength(data[0], true);
}

try {
    readFileToArray('./9/input.txt').then((data) => {
        strictEqual(getDecompressedLength('ADVENT'), 6);
        strictEqual(getDecompressedLength('A(1x5)BC'), 7);
        strictEqual(getDecompressedLength('(3x3)XYZ'), 9);
        strictEqual(getDecompressedLength('A(2x2)BCD(2x2)EFG'), 11);
        strictEqual(getDecompressedLength('(6x1)(1x3)A'), 6);
        strictEqual(getDecompressedLength('X(8x2)(3x3)ABCY'), 18);

        console.log('Part 1', part1(data));

        strictEqual(getDecompressedLength('(3x3)XYZ', true), 9);
        strictEqual(getDecompressedLength('X(8x2)(3x3)ABCY', true), 20);
        strictEqual(getDecompressedLength('(27x12)(20x12)(13x14)(7x10)(1x12)A', true), 241920);
        strictEqual(getDecompressedLength('(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN', true), 445);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
