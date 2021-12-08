import { strictEqual } from 'assert';
import md5 from 'fast-md5';
import { readFileToArray } from '../utils';

function getPassword(data: string, strong = false): string {
    const password: string[] = new Array(8).fill('');
    let filledCount = 0;
    let counter = 0;

    while (filledCount < 8) {
        const hash = md5(data + counter);

        if (hash.substr(0, 5) === '00000') {
            if (strong && password[Number(hash[5])] === '') {
                const index = Number(hash[5]);
                const char = hash[6];

                password[index] = char;
                filledCount += 1;
            } else if (!strong) {
                const char = hash[5];

                password[filledCount] = char;
                filledCount += 1;
            }
        }

        counter += 1;
    }

    return password.join('');
}

function part1(data: string[]): string {
    return getPassword(data[0]);
}

function part2(data: string[]): string {
    return getPassword(data[0], true);
}

try {
    readFileToArray('./5/input.txt').then((data) => {
        strictEqual(getPassword('abc'), '18f47a30');

        console.log('Part 1', part1(data));

        strictEqual(getPassword('abc', true), '05ace8e3');

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
