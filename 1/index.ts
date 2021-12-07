import { strictEqual } from 'assert';
import { distManhattan } from '@thi.ng/vectors';
import { findPath, generateMap, readFileToArray } from '../utils';

class Map {
    direction = 0;

    size = 500;

    offset: number;

    x: number;

    y: number;

    history: string[] = [];

    constructor() {
        this.offset = this.size / 2;
        this.x = this.offset;
        this.y = this.offset;
        this.history.push(`${this.x}-${this.y}`);
    }

    async walk(data: string, keepHistory = false): Promise<number> {
        const steps: [string, number][] = data.split(',').map((str) => {
            const step = str.trim();

            return [
                step.slice(0, 1),
                Number(step.slice(1)),
            ];
        });

        for (let i = 0; i < steps.length; i += 1) {
            const [turn, distance] = steps[i];

            if (turn === 'R') {
                this.direction += 1;

                if (this.direction > 3) {
                    this.direction = 0;
                }
            } else if (turn === 'L') {
                this.direction -= 1;

                if (this.direction < 0) {
                    this.direction = 3;
                }
            }

            const oldCoords = [this.x, this.y];

            if (this.direction === 0) {
                this.y -= distance;
            } else if (this.direction === 1) {
                this.x += distance;
            } else if (this.direction === 2) {
                this.y += distance;
            } else if (this.direction === 3) {
                this.x -= distance;
            }

            if (keepHistory) {
                const newCoords = [this.x, this.y];
                const map = generateMap(this.size, this.size, 0);

                // eslint-disable-next-line no-await-in-loop
                const path = (await findPath(
                    map,
                    { x: oldCoords[0], y: oldCoords[1] },
                    { x: newCoords[0], y: newCoords[1] },
                )).slice(1);

                for (let j = 0; j < path.length; j += 1) {
                    if (this.history.includes(`${path[j].x}-${path[j].y}`)) {
                        return distManhattan([this.offset, this.offset], [path[j].x, path[j].y]);
                    }
                }

                this.history = [
                    ...this.history,
                    ...path.map((coord) => `${coord.x}-${coord.y}`),
                ];
            }
        }

        return distManhattan([this.offset, this.offset], [this.x, this.y]);
    }
}

async function part1(data: string[]): Promise<number> {
    return (new Map()).walk(data[0]);
}

async function part2(data: string[]): Promise<number> {
    return (new Map()).walk(data[0], true);
}

try {
    readFileToArray('./1/input.txt').then(async (data) => {
        strictEqual(await (new Map()).walk('R2, L3'), 5);
        strictEqual(await (new Map()).walk('R2, R2, R2'), 2);
        strictEqual(await (new Map()).walk('R5, L5, R5, R3'), 12);

        console.log('Part 1', await part1(data));

        strictEqual(await (new Map()).walk('R8, R4, R4, R8', true), 4);

        console.log('Part 2', await part2(data));
    });
} catch (err) {
    console.log(err);
}
