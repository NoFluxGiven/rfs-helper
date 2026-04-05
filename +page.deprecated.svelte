<script lang="ts">
	import {
		
	} from '$lib/shoes/engine';
</script>

<main>
	<h1>Roll for Shoes Character Sheet</h1>
	<section>
		<h2>Character</h2>
		<p>XP: <strong>{$xp}</strong></p>
		<p>Skills:</p>
		<ul>
			{#each $skills as skill}
			<li>{skill.name} {skill.level}</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>Action</h2>
		<div>
			<label for="skill-select">Use Skill:</label>
			<select id="skill-select" bind:value={$selectedSkill}>
				{#each $skills as skill}
				<option value={skill.name}>{skill.name} {skill.level}</option>
				{/each}
			</select>
		</div>
		<div>
			<label for="action-name">Action Name (for advancement):</label>
			<input id="action-name" type="text" bind:value={$action} placeholder="Do Anything" />
		</div>
		<div>
			<label for="opp-roll">Opposing roll (0 for random):</label>
			<input id="opp-roll" type="number" min="0" bind:value={$opponentRoll} />
		</div>
		<div>
			<label for="use-xp">
				<input id="use-xp" type="checkbox" bind:checked={$useXpForAdvancement} />
				Spend 1 XP to turn one die into a 6 for this roll (advancement only)
			</label>
		</div>
		<button onclick={doRoll}>Roll</button>
	</section>

	<section>
		<h2>Roll Result</h2>
		<p>{$message}</p>
		<p>Dice: {$dice.join(', ')}</p>
		{#if $gainedSkill}
		<p><strong>{$gainedSkill}</strong></p>
		{/if}
	</section>

	<section>
		<h2>History</h2>
		<ul>
			{#each $history as entry}
			<li>{entry}</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		padding: 1rem;
	}
	section {
		padding: 0.8rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		margin-bottom: 1rem;
	}
	label {
		display: block;
		margin-bottom: 0.4rem;
	}
	input[type='text'], input[type='number'], select {
		padding: 0.4rem;
		font-size: 1rem;
		width: 100%;
		max-width: 100%;
		margin-bottom: 0.6rem;
	}
	button {
		padding: 0.6rem 1rem;
		font-size: 1rem;
		cursor: pointer;
	}
</style>
