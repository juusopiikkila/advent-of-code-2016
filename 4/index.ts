import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function isRealRoom(data: string): boolean {
    const matches = data.match(/^(.*?)-[0-9]+\[(.*?)\]$/);

    if (!matches) {
        throw new Error('No match');
    }

    const str = matches[1];
    const checksum = matches[2];
    const map: { char: string; count: number }[] = [];

    str.split('').filter((char) => char.match(/[a-z]/)).forEach((char) => {
        let item = map.find((i) => i.char === char);

        if (!item) {
            item = {
                char,
                count: 0,
            };

            map.push(item);
        }

        item.count += 1;
    });

    map.sort((a, b) => {
        if (a.count === b.count) {
            const chars = [a.char, b.char].sort();

            return a.char === chars[0] ? -1 : 1;
        }

        return b.count - a.count;
    });

    const mostCommon = map.reduce<string[]>((acc, i) => [...acc, i.char], []).slice(0, 5).join('');

    return mostCommon === checksum;
}

function getSectorId(data: string): number {
    const matches = data.match(/^.*?-([0-9]+)\[.*?\]$/);

    if (!matches) {
        throw new Error('No match');
    }

    return Number(matches[1]);
}

function getNextLetter(char: string, rounds: number): string {
    const dashes = '- '.split('');
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    return dashes.includes(char)
        ? dashes[(dashes.indexOf(char) + rounds) % dashes.length]
        : alphabet[(alphabet.indexOf(char) + rounds) % alphabet.length];
}

function decipher(data: string): string {
    const matches = data.match(/^(.*?)-([0-9]+)(\[.*?\])?$/);

    if (!matches) {
        throw new Error('No matches');
    }

    const str = matches[1].split('');
    const sectorId = Number(matches[2]);
    const newStr: string[] = [];

    str.forEach((char) => {
        newStr.push(getNextLetter(char, sectorId));
    });

    return newStr.join('');
}

function part1(data: string[]): number {
    return data.reduce((acc, line) => acc + (isRealRoom(line) ? getSectorId(line) : 0), 0);
}

function part2(data: string[]): number {
    for (let i = 0; i < data.length; i += 1) {
        if (isRealRoom(data[i])) {
            if (decipher(data[i]) === 'northpole-object-storage') {
                return getSectorId(data[i]);
            }
        }
    }

    return 0;
}

try {
    readFileToArray('./4/input.txt').then((data) => {
        strictEqual(isRealRoom('aaaaa-bbb-z-y-x-123[abxyz]'), true);
        strictEqual(isRealRoom('a-b-c-d-e-f-g-h-987[abcde]'), true);
        strictEqual(isRealRoom('not-a-real-room-404[oarel]'), true);
        strictEqual(isRealRoom('totally-real-room-200[decoy]'), false);

        console.log('Part 1', part1(data));

        strictEqual(decipher('qzmt-zixmtkozy-ivhz-343'), 'very encrypted name');

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
