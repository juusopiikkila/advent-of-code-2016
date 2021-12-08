import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function getCorrectedString(data: string[], useLeastCommon = false): string {
    const string: string[] = [];

    for (let i = 0; i < data[0].length; i += 1) {
        const map: { char: string; count: number }[] = [];

        data.forEach((line) => {
            let item = map.find((itm) => itm.char === line[i]);

            if (!item) {
                item = {
                    char: line[i],
                    count: 0,
                };

                map.push(item);
            }

            item.count += 1;
        });

        map.sort((a, b) => b.count - a.count);

        string.push(map[useLeastCommon ? map.length - 1 : 0].char);
    }

    return string.join('');
}

function part1(data: string[]): string {
    return getCorrectedString(data);
}

function part2(data: string[]): string {
    return getCorrectedString(data, true);
}

try {
    readFileToArray('./6/input.txt').then((data) => {
        const testData = [
            'eedadn',
            'drvtee',
            'eandsr',
            'raavrd',
            'atevrs',
            'tsrnev',
            'sdttsa',
            'rasrtv',
            'nssdts',
            'ntnada',
            'svetve',
            'tesnvt',
            'vntsnd',
            'vrdear',
            'dvrsen',
            'enarar',
        ];

        strictEqual(getCorrectedString(testData), 'easter');

        console.log('Part 1', part1(data));

        strictEqual(getCorrectedString(testData, true), 'advent');

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
