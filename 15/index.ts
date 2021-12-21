import { strictEqual } from 'assert';
import { getInput } from '../utils';

class Disc {
    private positions: number

    currentPosition: number

    constructor(data: string) {
        const matches = data.match(/^Disc #[0-9]+ has ([0-9]+) positions; at time=0, it is at position ([0-9]+).$/);

        if (!matches) {
            throw new Error('No matches');
        }

        this.positions = Number(matches[1]);
        this.currentPosition = Number(matches[2]);
    }

    getPositionAtTime(time: number) {
        return (this.currentPosition + time) % this.positions;
    }
}

class Sculpture {
    discs: Disc[]

    constructor(data: string[]) {
        this.discs = data.map((line) => new Disc(line));
    }

    private areDisksAligned(time: number) {
        return this.discs.reduce((acc, disc, index) => acc + disc.getPositionAtTime(time + index + 1), 0) === 0;
    }

    getPosition() {
        let time = 0;

        while (!this.areDisksAligned(time)) {
            time += 1;
        }

        return time;
    }
}

function part1(data: string[]): number {
    return (new Sculpture(data)).getPosition();
}

function part2(data: string[]): number {
    return (new Sculpture([...data, 'Disc #0 has 11 positions; at time=0, it is at position 0.'])).getPosition();
}

async function main() {
    const data = await getInput(__dirname);
    const testData = [
        'Disc #1 has 5 positions; at time=0, it is at position 4.',
        'Disc #2 has 2 positions; at time=0, it is at position 1.',
    ];

    strictEqual((new Sculpture(testData)).getPosition(), 5);

    console.log('Part 1', part1(data));

    console.log('Part 2', part2(data));
}

main();
