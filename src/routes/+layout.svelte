<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner";
	import "../app.css";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<title>prompt-ui</title>
	<meta name="description" content="Generate UI from text prompts with AI and Tailwind CSS." />
</svelte:head>

<ModeWatcher />
<Toaster richColors />

<header class="flex items-center justify-center gap-6 py-16">
	<h1 class="font-bold">prompt-ui</h1>
	<ThemeToggle />
</header>

<main class="flex items-center justify-center">
	{@render children()}
</main>
