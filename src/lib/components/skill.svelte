<script lang="ts">
    import { fade } from "svelte/transition";
    import type { Sheet } from "$lib/shoes/sheet.type";
    import { SkillItem } from "$lib/shoes/skill";
    import { Roll } from "$lib/shoes/roll";

    interface Props {
        skill: SkillItem;
        sheet: Sheet;
        showNotification: (type: string, message: string) => void;
    }

    let { skill, sheet, showNotification }: Props = $props()

    let rolling = $state(false);
    let rollResult = $state<{ dice: number[], total: number, isSuccess: boolean, dc: number } | null>(null);
    let showXpPrompt = $state(false);
    let animatedDice = $state<number[]>([]);

    const learnSkill = () => {
        // Show a prompt for the skill name
        const newName = prompt("Enter new skill name (or leave blank to keep current):", skill.name);
        if (newName === null) return; // User cancelled
        // Add the new skill level to the sheet
        const newSkill = skill.levelUp(newName);
        sheet.skills.push( newSkill );
    }

    const rollSkill = () => {
        // Prompt for DC
        const dcString = prompt("Enter difficulty (DC) for this roll:", "4");
        if (dcString === null) return; // User cancelled
        const dc = parseInt(dcString);
        if (isNaN(dc) || dc < 1) {
            alert("Invalid DC. Please enter a positive integer.");
            return;
        }

        // Start rolling animation
        rolling = true;
        rollResult = null;
        showXpPrompt = false;
        animatedDice = Array(skill.level).fill(1);

        const interval = setInterval(() => {
            animatedDice = animatedDice.map(() => Math.floor(Math.random() * 6) + 1);
        }, 50);

        // Simulate roll after animation
        setTimeout(() => {
            clearInterval(interval);
            const result = skill.roll(dc);
            rolling = false;
            rollResult = result;

            if (result.isSuccess) {
                showNotification('success', `Success! Rolled ${result.total} (${result.dice.join(", ")}) against DC ${result.dc}.`);
            } else {
                showNotification('failure', `Failure. +1 XP. Rolled ${result.total} (${result.dice.join(", ")}) against DC ${result.dc}.`);
                sheet.xp += 1;
            }

            if (Roll.isLevelUp(result.dice)) {
                showNotification('success', `Level up! You can now advance this skill.`);
                learnSkill();
            }

            // Prompt for using XP for advancement IF they have enough XP to change all dice to 6s
            if (sheet.xp >= result.dice.length) {
                showXpPrompt = true;
            }
        }, 1500); // 1.5 second animation
    }

    const useXp = () => {
        if (rollResult) {
            sheet.xp -= rollResult.dice.length;
            learnSkill();
            showXpPrompt = false;
        }
    }

    const dismissXp = () => {
        showXpPrompt = false;
    }
</script>

<div class="flex items-center justify-between">
    <div class="flex items-center space-x-2">
        <span class="text-lg font-medium text-gray-800">SKILL: {skill.name}</span>
        <span class="text-xl text-blue-600">{skill.level}</span>
        {#if showXpPrompt}
            <div transition:fade class="flex items-center space-x-2 bg-yellow-100 p-2 rounded">
                <span class="text-sm">Use {rollResult?.dice.length} XP for advancement?</span>
                <button onclick={useXp} class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">Yes</button>
                <button onclick={dismissXp} class="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs">No</button>
            </div>
        {/if}
    </div>
    <div class="flex space-x-2 items-center">
        {#if rolling}
            <div class="flex space-x-1">
                {#each animatedDice as die}
                    <div class="w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-sm font-bold animate-pulse">
                        {die}
                    </div>
                {/each}
            </div>
        {:else if rollResult}
            <div class="flex space-x-1">
                {#each rollResult.dice as die}
                    <div class="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center text-sm font-bold {die === 6 ? 'bg-green-100 border-green-500' : ''}">
                        {die}
                    </div>
                {/each}
            </div>
            <span class="text-sm text-gray-600 ml-2">Total: {rollResult.total} (DC: {rollResult.dc})</span>
        {/if}
        <button onclick={() => learnSkill()} class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors">+</button>
        <button onclick={() => rollSkill()} class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors" disabled={rolling}>R</button>
    </div>
</div>