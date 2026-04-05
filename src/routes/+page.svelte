<script lang="ts">
    import { fade } from "svelte/transition";
    import Skill from "$lib/components/skill.svelte";
    import Editable from "$lib/components/editable.svelte";
    import { loadSheet, saveSheet } from "$lib/shoes/engine";
    import { SkillItem } from "$lib/shoes/skill";

    let sheet = $state(loadSheet());

    $effect(() => {
        saveSheet(sheet);
    });

    let notifications = $state<{ id: number, type: string, message: string }[]>([]);
    let nextId = $state(0);
    let confirmClear = $state(false);

    const showNotification = (type: string, message: string) => {
        const id = nextId++;
        notifications = [...notifications, { id, type, message }];
        setTimeout(() => {
            notifications = notifications.filter(n => n.id !== id);
        }, 3000);
    };

    const clearSheet = () => {
        if (confirmClear) {
            // Reset sheet to initial
            sheet = {
                name: "Test Character",
                briefdesc: "",
                notes: "",
                xp: 0,
                skills: [
                    new SkillItem("Do Anything", 1)
                ],
                traits: []
            };
            confirmClear = false;
            showNotification('info', 'Sheet cleared!');
			saveSheet(sheet);
        } else {
            confirmClear = true;
            setTimeout(() => confirmClear = false, 5000); // Reset after 5 seconds
        }
    };
</script>

<main class="min-h-screen bg-gray-100 py-8">
	<div class="max-w-4xl mx-auto px-4">
		<!-- Notifications at the top -->
		<div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
			{#each notifications as notification}
				<div
					transition:fade
					class="px-4 py-2 rounded-md shadow-lg text-white text-center {notification.type === 'success' ? 'bg-green-500' : notification.type === 'failure' ? 'bg-red-500' : 'bg-yellow-500'}"
				>
					{notification.message}
				</div>
			{/each}
		</div>

		<h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Roll for Shoes Character Sheet</h1>
		<section class="bg-white shadow-lg rounded-lg p-6 mb-6">
			<h2 class="text-2xl font-semibold text-gray-700 mb-4">Character</h2>
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-600 mb-1">Name:</label>
					<Editable bind:value={sheet.name} />
				</div>
				<div class="flex items-center justify-between">
					<p class="text-lg text-gray-600">XP: <strong class="text-xl text-blue-600">{sheet.xp}</strong></p>
				</div>
			</div>
		</section>
		<section class="bg-white shadow-lg rounded-lg p-6">
			<h2 class="text-2xl font-semibold text-gray-700 mb-4">Skills</h2>
			<ul class="space-y-2">
				{#each sheet.skills as skill}
				<li class="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors">
					<Skill bind:sheet {skill} {showNotification} />
				</li>
				{/each}
			</ul>
		</section>
	</div>

	<!-- Clear Sheet Button -->
	<button
		onclick={clearSheet}
		class="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-full shadow-lg transition-colors text-sm font-medium z-20"
		class:opacity-75={confirmClear}
	>
		{confirmClear ? 'Confirm Clear' : 'Clear Sheet'}
	</button>
</main>