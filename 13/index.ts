import { strictEqual } from 'assert';
import {
    Coord,
    findPath,
    generateMap,
    getInput,
} from '../utils';

class Floor {
    targetX: number

    targetY: number

    data: number

    constructor(data: number, targetX: number, targetY: number) {
        this.targetX = targetX;
        this.targetY = targetY;
        this.data = data;
    }

    private buildMap() {
        const map = generateMap(this.targetX * 2, this.targetY * 2, 0);

        for (let y = 0; y < map.length; y += 1) {
            for (let x = 0; x < map[0].length; x += 1) {
                const res = ((x * x + 3 * x + 2 * x * y + y + y * y) + this.data)
                    .toString(2)
                    .split('')
                    .filter((char) => char === '1')
                    .length % 2;

                if (res === 1) {
                    map[y][x] = 1;
                }
            }
        }

        return map;
    }

    async findPath(): Promise<Coord[]> {
        const map = this.buildMap();
        const path = await findPath(
            map,
            { x: 1, y: 1 },
            { x: this.targetX, y: this.targetY },
            { acceptableTiles: [0] },
        );

        return path ? path.slice(1) : [];
    }

    async getPossibleLocations(): Promise<Coord[]> {
        const map = this.buildMap();
        const locations: Coord[] = [];

        for (let y = 0; y < map.length; y += 1) {
            for (let x = 0; x < map[0].length; x += 1) {
                if (map[y][x] === 1) {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                // eslint-disable-next-line no-await-in-loop
                const path = await findPath(
                    map,
                    { x: 1, y: 1 },
                    { x, y },
                    { acceptableTiles: [0] },
                );

                if (path && path.length <= 51) {
                    locations.push(path[path.length - 1]);
                }
            }
        }

        return locations;
    }
}

async function part1(data: string[]): Promise<number> {
    return (await (new Floor(Number(data[0]), 31, 39)).findPath()).length;
}

async function part2(data: string[]): Promise<number> {
    return (await (new Floor(Number(data[0]), 31, 39)).getPossibleLocations()).length;
}

async function main() {
    const data = await getInput(__dirname);

    strictEqual((await (new Floor(10, 7, 4)).findPath()).length, 11);

    console.log('Part 1', await part1(data));

    console.log('Part 2', await part2(data));
}

main();
