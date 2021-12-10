import { strictEqual } from 'assert';
import { intersection } from 'lodash';
import { readFileToArray } from '../utils';

function getBits(data: string, isSsl: boolean): string[] {
    const arr = data.split('');
    const bits: string[] = [];

    if (isSsl) {
        for (let i = 1; i < arr.length - 1; i += 1) {
            if (arr[i] !== arr[i - 1] && arr[i - 1] === arr[i + 1]) {
                bits.push(arr.join('').substr(i - 1, 3));
            }
        }
    } else {
        for (let i = 1; i < arr.length - 2; i += 1) {
            const currentPart = `${arr[i - 1]}${arr[i]}`;
            const nextPart = arr.slice(i + 1, i + 3).reverse().join('');

            if (currentPart[0] !== currentPart[1] && currentPart === nextPart) {
                bits.push(arr.join('').substr(i - 2, 4));
            }
        }
    }

    return bits;
}

function invertBit(data: string, isSsl: boolean): string {
    if (isSsl) {
        const side = data[0];
        const middle = data[1];

        return middle + side + middle;
    }

    const side = data[0];
    const middle = data[1];

    return middle + side + side + middle;
}

function isSupported(data: string, isSsl = false): boolean {
    const bracketsData: string[] = [];
    const outsideData: string[] = [];

    data.split('[').forEach((part) => {
        if (part.includes(']')) {
            const arr = part.split(']');

            bracketsData.push(arr[0]);
            outsideData.push(arr[1]);
        } else {
            outsideData.push(part);
        }
    });

    let bracketsBits: string[] = [];

    for (let i = 0; i < bracketsData.length; i += 1) {
        const bits = getBits(bracketsData[i], isSsl);

        bracketsBits = [
            ...bracketsBits,
            ...bits,
        ];

        if (!isSsl && bits.length) {
            return false;
        }
    }

    let outsideBits: string[] = [];

    for (let i = 0; i < outsideData.length; i += 1) {
        const bits = getBits(outsideData[i], isSsl);

        outsideBits = [
            ...outsideBits,
            ...bits,
        ];

        if (!isSsl && bits.length) {
            return true;
        }
    }

    if (isSsl && bracketsBits.length && outsideBits.length) {
        bracketsBits = bracketsBits.map((bit) => invertBit(bit, isSsl));

        return intersection(outsideBits, bracketsBits).length > 0;
    }

    return false;
}

function part1(data: string[]): number {
    return data.reduce((acc, line) => acc + (isSupported(line) ? 1 : 0), 0);
}

function part2(data: string[]): number {
    return data.reduce((acc, line) => acc + (isSupported(line, true) ? 1 : 0), 0);
}

try {
    readFileToArray('./7/input.txt').then((data) => {
        strictEqual(isSupported('abba[mnop]qrst'), true);
        strictEqual(isSupported('abcd[bddb]xyyx'), false);
        strictEqual(isSupported('aaaa[qwer]tyui'), false);
        strictEqual(isSupported('ioxxoj[asdfgh]zxcvbn'), true);

        console.log('Part 1', part1(data));

        strictEqual(isSupported('aba[bab]xyz', true), true);
        strictEqual(isSupported('xyx[xyx]xyx', true), false);
        strictEqual(isSupported('aaa[kek]eke', true), true);
        strictEqual(isSupported('zazbz[bzb]cdb', true), true);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
