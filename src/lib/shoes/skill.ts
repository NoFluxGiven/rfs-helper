import { Roll } from "./roll";
import type { TraitItem } from "./trait";

interface RollResult {
	dice: number[];
	total: number;
	isSuccess: boolean;
	isLevelUp: boolean;
	forceValue: number;
	dc: number;
}

/**
 * Skills allow the player to get better at certain activities. As skills "level up", they get more specific.
 */
export class SkillItem {
	constructor(public name: string, public level: number) {}

	levelUp(newName: string = this.name): SkillItem {
		return new SkillItem(newName, this.level + 1);
	}

	roll(dc: number = -1, traits: TraitItem[] = [], forceValue=-1): RollResult{
		let results = Roll.d6(this.level, traits);

		if (forceValue > 0) {
			results = results.map(x => forceValue);
		}

		const isSuccess = Roll.isSuccess(results, dc);
		const isLevelUp = Roll.isLevelUp(results);
		const total = results.reduce((a, b) => a + b, 0);

		return { dice: results, total, isSuccess, isLevelUp, forceValue, dc };
	}

	toString() {
		return `${this.name} (Level ${this.level})`;
	}

	toJSON() {
		return {
			name: this.name,
			level: this.level,
		};
	}
}
