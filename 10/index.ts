import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function runBots(data: string[], high?: number, low?: number) {
    let instructions = [...data];
    const bots: Record<string, number[]> = {};
    const output: Record<string, number> = {};

    while (instructions.length) {
        const nextInstructions: string[] = [];

        for (let i = 0; i < instructions.length; i += 1) {
            const botMatches = instructions[i].match(/^value ([0-9]+) goes to bot ([0-9]+)$/);
            // eslint-disable-next-line max-len
            const giveMatches = instructions[i].match(/bot ([0-9]+) gives low to (bot|output) ([0-9]+) and high to (bot|output) ([0-9]+)$/);

            if (botMatches) {
                const botId = Number(botMatches[2]);

                if (!bots[botId]) {
                    bots[botId] = [];
                }

                bots[botId].push(Number(botMatches[1]));
                bots[botId].sort((a, b) => a - b);
            } else if (giveMatches) {
                const botId = Number(giveMatches[1]);
                const lowType = giveMatches[2];
                const lowId = Number(giveMatches[3]);
                const highType = giveMatches[4];
                const highId = Number(giveMatches[5]);

                if (!bots[botId]) {
                    bots[botId] = [];
                }

                if (bots[botId].length !== 2) {
                    nextInstructions.push(instructions[i]);

                    // eslint-disable-next-line no-continue
                    continue;
                }

                const [lowChip, highChip] = bots[botId];
                bots[botId] = [];

                if (lowChip === low && highChip === high) {
                    return botId;
                }

                if (lowType === 'bot') {
                    if (!bots[lowId]) {
                        bots[lowId] = [];
                    }

                    bots[lowId].push(lowChip);
                    bots[lowId].sort((a, b) => a - b);
                } else {
                    output[lowId] = lowChip;
                }

                if (highType === 'bot') {
                    if (!bots[highId]) {
                        bots[highId] = [];
                    }

                    bots[highId].push(highChip);
                    bots[highId].sort((a, b) => a - b);
                } else {
                    output[highId] = highChip;
                }
            } else {
                throw new Error('Welp');
            }
        }

        instructions = nextInstructions;
    }

    return output[0] * output[1] * output[2];
}

function part1(data: string[]): number | undefined {
    return runBots(data, 61, 17);
}

function part2(data: string[]): number {
    return runBots(data);
}

try {
    readFileToArray('./10/input.txt').then((data) => {
        const testData = [
            'value 5 goes to bot 2',
            'bot 2 gives low to bot 1 and high to bot 0',
            'value 3 goes to bot 1',
            'bot 1 gives low to output 1 and high to bot 0',
            'bot 0 gives low to output 2 and high to output 0',
            'value 2 goes to bot 2',
        ];

        strictEqual(runBots(testData, 5, 2), 2);

        console.log('Part 1', part1(data));

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
