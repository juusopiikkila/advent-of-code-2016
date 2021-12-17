import { strictEqual } from 'assert';
import { getInput } from '../utils';

class Processor {
    instructions: string[]

    register: Record<string, number>

    constructor(data: string[], register = {}) {
        this.instructions = data;
        this.register = {
            ...{
                a: 0,
                b: 0,
                c: 0,
                d: 0,
            },
            ...register,
        };
    }

    run() {
        for (let i = 0; i < this.instructions.length; i += 1) {
            const matches = this.instructions[i].match(/^([a-z]+) ([0-9a-z]+)(?: ([0-9a-z-]+))?$/);
            if (!matches) {
                throw new Error('No matches');
            }

            const type = matches[1];

            if (type === 'cpy') {
                const value = matches[2];
                const registry = matches[3];

                if (Number.isNaN(Number(value))) {
                    this.register[registry] = this.register[value];
                } else {
                    this.register[registry] = Number(value);
                }
            } else if (type === 'inc') {
                const registry = matches[2];

                this.register[registry] += 1;
            } else if (type === 'dec') {
                const registry = matches[2];

                this.register[registry] -= 1;
            } else if (type === 'jnz') {
                const registry = matches[2];
                const value = Number(matches[3]);

                if (this.register[registry] !== 0) {
                    i += value;
                    i -= 1;
                }
            }
        }

        return this.register.a;
    }
}

function part1(data: string[]): number {
    return (new Processor(data)).run();
}

function part2(data: string[]): number {
    return (new Processor(data, { c: 1 })).run();
}

async function main() {
    const data = await getInput(__dirname);
    const testData = [
        'cpy 41 a',
        'inc a',
        'inc a',
        'dec a',
        'jnz a 2',
        'dec a',
    ];

    strictEqual((new Processor(testData)).run(), 42);

    console.log('Part 1', part1(data));

    console.log('Part 2', part2(data));
}

main();
