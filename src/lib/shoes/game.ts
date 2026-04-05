import { writable, get } from 'svelte/store';
import type { Skill } from './skill';

export const skills = writable<Skill[]>([{ name: 'Do Anything', level: 1 }]);
export const selectedSkill = writable('Do Anything');
export const action = writable('Do Anything');
export const opponentRoll = writable(0);
export const xp = writable(0);
export const useXpForAdvancement = writable(false);
export const dice = writable<number[]>([]);
export const lastSum = writable(0);
export const opponentValue = writable(0);
export const success = writable(false);
export const message = writable('');
export const gainedSkill = writable('');
export const history = writable<string[]>([]);

export function rollDice(count: number, useXp: boolean, currentXp: number): { rolls: number[]; xpUsed: number } {
	const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
	let xpUsed = 0;

	if (useXp && currentXp > 0) {
		const nonSixIndex = rolls.findIndex((v) => v !== 6);
		if (nonSixIndex >= 0) {
			rolls[nonSixIndex] = 6;
			xpUsed = 1;
		}
	}

	return { rolls, xpUsed };
}

export function doRoll() {
	const skillList = get(skills);
	const chosenSkill = skillList.find((s) => s.name === get(selectedSkill));
	if (!chosenSkill) {
		message.set('Selected skill not found.');
		return;
	}

	const rollCount = chosenSkill.level;
	const { rolls, xpUsed } = rollDice(rollCount, get(useXpForAdvancement), get(xp));
	dice.set(rolls);
	lastSum.set(rolls.reduce((a, b) => a + b, 0));

	const opp = get(opponentRoll) > 0 ? get(opponentRoll) : Math.floor(Math.random() * (rollCount * 6 - 1 + 1)) + 1;
	opponentValue.set(opp);

	const total = rolls.reduce((a, b) => a + b, 0);
	const didSucceed = total > opp;
	success.set(didSucceed);

	if (xpUsed > 0) {
		xp.update((v) => v - xpUsed);
	}

	if (!didSucceed) {
		xp.update((v) => v + 1);
	}

	let resultText = didSucceed ? 'Success' : 'Fail';
	resultText += `: ${chosenSkill.name} ${chosenSkill.level} rolled ${total} vs ${opp}.`;
	resultText += didSucceed ? ' The thing happens.' : ' You get 1 XP.';
	message.set(resultText);

	const allSix = rolls.length > 0 && rolls.every((d) => d === 6);
	if (allSix) {
		const targetName = get(action).trim() || 'Do Anything';
		const existingSkill = skillList.find((s) => s.name.toLowerCase() === targetName.toLowerCase());
		const newLevel = chosenSkill.level + 1;

		if (existingSkill) {
			const nextLevel = Math.max(existingSkill.level, newLevel);
			skills.set(skillList.map((s) => (s.name.toLowerCase() === existingSkill.name.toLowerCase() ? { ...s, level: nextLevel } : s)));
			gainedSkill.set(`Advancement: ${existingSkill.name} is now level ${nextLevel}!`);
		} else {
			skills.set([...skillList, { name: targetName, level: newLevel }]);
			gainedSkill.set(`Advancement: gained skill '${targetName}' at level ${newLevel}!`);
		}
	} else {
		gainedSkill.set('');
	}

	history.update((h) => [
		`${new Date().toLocaleTimeString()}: ${resultText}${get(gainedSkill) ? ' ' + get(gainedSkill) : ''}`,
		...h,
	].slice(0, 10));
}
