import { readFile } from 'fs/promises';
import { js as EasyStar } from 'easystarjs';

export interface Coord {
    x: number
    y: number
}

export async function readFileToArray(path: string): Promise<string[]> {
    const data = await readFile(path);
    return data.toString().split('\n').slice(0, -1);
}

export async function getInput(day: string): Promise<string[]> {
    return readFileToArray(`${day}/input.txt`);
}

export function generateMap(width: number, height: number, fill: number): number[][] {
    const map = new Array(height);

    for (let i = 0; i < height; i += 1) {
        map[i] = Array(width).fill(fill);
    }

    return map;
}

export async function findPath(map: number[][], from: Coord, to: Coord): Promise<Coord[]> {
    return new Promise((resolve) => {
        const easystar = new EasyStar();

        easystar.setGrid(map);
        easystar.setAcceptableTiles([0]);
        easystar.enableDiagonals();

        easystar.findPath(from.x, from.y, to.x, to.y, (path) => {
            resolve(path);
        });

        easystar.calculate();
    });
}
