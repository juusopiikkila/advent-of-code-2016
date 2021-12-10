import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

class Screen {
    w: number

    h: number

    pixels: string[][]

    instructions: string[]

    constructor(instructions: string[], w = 50, h = 6) {
        this.instructions = instructions;
        this.w = w;
        this.h = h;

        this.pixels = [];
        for (let y = 0; y < this.h; y += 1) {
            this.pixels[y] = (new Array(this.w)).fill('.');
        }
    }

    private run() {
        this.instructions.forEach((line) => {
            const rectMatches = line.match(/^rect ([0-9]+)x([0-9]+)$/);
            const rotateMatches = line.match(/^rotate (?:column|row) (x|y)=([0-9]+) by ([0-9]+)$/);

            if (rectMatches) {
                this.addRect(Number(rectMatches[1]), Number(rectMatches[2]));
            } else if (rotateMatches) {
                this.rotate(rotateMatches[1], Number(rotateMatches[2]), Number(rotateMatches[3]));
            }
        });
    }

    getPixelCount() {
        this.run();

        return this.pixels.reduce((acc, line) => acc + line.filter((char) => char === '#').length, 0);
    }

    printScreen() {
        this.run();

        this.pixels.forEach((line) => {
            console.log(line.join(''));
        });
    }

    private getY(index: number) {
        let newIndex = index + 1;

        if (newIndex < 1) {
            newIndex += this.h;
        } else if (index > this.h) {
            newIndex -= this.h;
        }

        return newIndex - 1;
    }

    private getX(index: number) {
        let newIndex = index + 1;

        if (newIndex < 1) {
            newIndex += this.w;
        } else if (index > this.w) {
            newIndex -= this.w;
        }

        return newIndex - 1;
    }

    private addRect(width: number, height: number) {
        // console.log('addRect', width, height);

        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                this.pixels[y][x] = '#';
            }
        }
    }

    private rotate(direction: string, index: number, by: number) {
        for (let b = 0; b < by; b += 1) {
            const clone: string[][] = JSON.parse(JSON.stringify(this.pixels));

            if (direction === 'x') {
                for (let y = 0; y < this.h; y += 1) {
                    this.pixels[y][index] = clone[this.getY(y - 1)][index];
                }
            } else if (direction === 'y') {
                for (let x = 0; x < this.w; x += 1) {
                    this.pixels[index][x] = clone[index][this.getX(x - 1)];
                }
            }
        }
    }
}

function part1(data: string[]): number {
    return (new Screen(data)).getPixelCount();
}

function part2(data: string[]) {
    (new Screen(data)).printScreen();
}

try {
    readFileToArray('./8/input.txt').then((data) => {
        const testData = [
            'rect 3x2',
            'rotate column x=1 by 1',
            'rotate row y=0 by 4',
            'rotate column x=1 by 1',
        ];

        strictEqual((new Screen(testData, 7, 3)).getPixelCount(), 6);

        console.log('Part 1', part1(data));

        console.log('Part 2');
        part2(data);
    });
} catch (err) {
    console.log(err);
}
