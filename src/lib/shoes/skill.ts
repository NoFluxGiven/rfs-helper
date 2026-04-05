import { Roll } from "./roll";
import type { TraitItem } from "./trait";

interface RollResult {
	dice: number[];
	total: number;
	isSuccess: boolean;
	isLevelUp: boolean;
	isManual: boolean;
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

	roll(dc: number = -1, traits: TraitItem[] = []): RollResult{
		const results = Roll.d6(this.level, traits);

		const isSuccess = Roll.isSuccess(results, dc);
		const isLevelUp = Roll.isLevelUp(results, dc);
		const isManual = dc === -1;
		const total = results.reduce((a, b) => a + b, 0);

		return { dice: results, total, isSuccess, isLevelUp, isManual, dc };
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
