import { strictEqual } from 'assert';
import { createHash } from 'crypto';
import { getInput } from '../utils';

class Hasher {
    hashes: Record<string, string> = {}

    salt: string

    stretch: boolean

    constructor(salt: string, stretch = false) {
        this.salt = salt;
        this.stretch = stretch;
    }

    private getHash(index: number) {
        if (this.hashes[index] !== undefined) {
            return this.hashes[index];
        }

        let hash = createHash('md5').update(this.salt + index).digest('hex');

        if (this.stretch) {
            for (let i = 0; i < 2016; i += 1) {
                hash = createHash('md5').update(hash).digest('hex');
            }
        }

        this.hashes[index] = hash;

        return hash;
    }

    private getTripleOccurrenceChar(hash: string): string | undefined {
        for (let i = 0; i < hash.length - 2; i += 1) {
            if (
                hash[i + 1] === hash[i]
                && hash[i + 2] === hash[i]
            ) {
                return hash[i];
            }
        }

        return undefined;
    }

    getIndex() {
        const hashes: string[] = [];
        let counter = 0;

        while (hashes.length < 64) {
            const hash = this.getHash(counter);
            const tripleCharacter = this.getTripleOccurrenceChar(hash);

            counter += 1;

            if (tripleCharacter) {
                const nextHashes: string[] = [];
                const chars = tripleCharacter + tripleCharacter + tripleCharacter + tripleCharacter + tripleCharacter;

                for (let i = counter + 1; i < counter + 1000; i += 1) {
                    const internalHash = this.getHash(i);

                    if (internalHash.includes(chars)) {
                        nextHashes.push(internalHash);
                    }
                }

                if (nextHashes.length) {
                    hashes.push(hash);
                }
            }
        }

        return counter - 1;
    }
}

function part1(data: string[]): number {
    return (new Hasher(data[0])).getIndex();
}

function part2(data: string[]): number {
    return (new Hasher(data[0], true)).getIndex();
}

async function main() {
    const data = await getInput(__dirname);

    strictEqual((new Hasher('abc')).getIndex(), 22728);

    console.log('Part 1', part1(data));

    strictEqual((new Hasher('abc', true)).getIndex(), 22551);

    console.log('Part 2', part2(data));
}

main();
