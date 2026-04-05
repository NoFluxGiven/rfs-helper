import type { TraitItem } from "./trait";

export class Roll {
    static d6(n: number = 1, traits: TraitItem[] = []): number[] {
        return Array.from({ length: n }, () => Math.floor(Math.random() * 6) + 1 + traits.reduce((bonus, trait) => bonus + trait.level, 0));
    }

    static isSuccess(rolls: number[], target: number): boolean {
        const total = rolls.reduce((a, b) => a + b, 0);
        return total > target;
    }

    static isLevelUp(rolls: number[], target: number): boolean {
        if (rolls.every((r) => r === 6)) {
            return true;
        }
        return false;
    }

}