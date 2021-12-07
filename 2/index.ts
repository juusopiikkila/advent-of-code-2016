import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

class Keypad {
    instructions: string[][];

    useHardMap: boolean;

    x: number;

    y: number;

    map: string[][];

    constructor(data: string[], useHardMap = false) {
        this.instructions = data.map((line) => line.split(''));
        this.useHardMap = useHardMap;

        if (this.useHardMap) {
            this.x = 0;
            this.y = 2;
        } else {
            this.x = 1;
            this.y = 1;
        }

        this.map = this.useHardMap ? [
            ['@', '@', '1', '@', '@'],
            ['@', '2', '3', '4', '@'],
            ['5', '6', '7', '8', '9'],
            ['@', 'A', 'B', 'C', '@'],
            ['@', '@', 'D', '@', '@'],
        ] : [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
        ];
    }

    tileExists(x: number, y: number): boolean {
        const tile = this.map[y]?.[x];

        return !!tile && tile !== '@';
    }

    getCode() {
        const buttons: string[] = [];

        this.instructions.forEach((instruction) => {
            instruction.forEach((dir) => {
                if (dir === 'U' && this.tileExists(this.x, this.y - 1)) {
                    this.y -= 1;
                } else if (dir === 'R' && this.tileExists(this.x + 1, this.y)) {
                    this.x += 1;
                } else if (dir === 'D' && this.tileExists(this.x, this.y + 1)) {
                    this.y += 1;
                } else if (dir === 'L' && this.tileExists(this.x - 1, this.y)) {
                    this.x -= 1;
                }
            });

            buttons.push(this.map[this.y][this.x] || '0');
        });

        return buttons.join('');
    }
}

function part1(data: string[]): string {
    return (new Keypad(data)).getCode();
}

function part2(data: string[]): string {
    return (new Keypad(data, true)).getCode();
}

try {
    readFileToArray('./2/input.txt').then((data) => {
        const testData = [
            'ULL',
            'RRDDD',
            'LURDL',
            'UUUUD',
        ];

        strictEqual((new Keypad(testData)).getCode(), '1985');

        console.log('Part 1', part1(data));

        strictEqual((new Keypad(testData, true)).getCode(), '5DB3');

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
