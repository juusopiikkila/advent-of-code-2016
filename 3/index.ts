import { chunk } from 'lodash';
import { readFileToArray } from '../utils';

function getValidTriangleCount(data: string[]): number {
    return data
        .map((line) => line.trim().match(/^([0-9]+).*?([0-9]+).*?([0-9]+)$/)?.slice(1, 4).map(Number) || [])
        .filter((triangle): triangle is [number, number, number] => triangle.length === 3)
        .filter((triangle) => (
            triangle[0] + triangle[1] > triangle[2]
            && triangle[0] + triangle[2] > triangle[1]
            && triangle[1] + triangle[2] > triangle[0]
        ))
        .length;
}

function getValidTriangleCountByColumn(data: string[]): number {
    const rows = data
        .map((line) => line.trim().match(/^([0-9]+).*?([0-9]+).*?([0-9]+)$/)?.slice(1, 4).map(Number) || [])
        .filter((triangle): triangle is [number, number, number] => triangle.length === 3);

    let columnRows: [number, number, number][] = [];

    chunk(rows, 3).forEach((c) => {
        const chunkRows: [number, number, number][] = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];

        for (let i = 0; i < 3; i += 1) {
            chunkRows[i][0] = c[0][i];
            chunkRows[i][1] = c[1][i];
            chunkRows[i][2] = c[2][i];
        }

        columnRows = [
            ...columnRows,
            ...chunkRows,
        ];
    });

    return columnRows.filter((triangle) => (
        triangle[0] + triangle[1] > triangle[2]
        && triangle[0] + triangle[2] > triangle[1]
        && triangle[1] + triangle[2] > triangle[0]
    )).length;
}

function part1(data: string[]): number {
    return getValidTriangleCount(data);
}

function part2(data: string[]): number {
    return getValidTriangleCountByColumn(data);
}

try {
    readFileToArray('./3/input.txt').then((data) => {
        console.log('Part 1', part1(data));

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
