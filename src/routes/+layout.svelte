<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner";
	import "../app.css";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<title>prompt-ui</title>
	<meta
		name="description"
		content="An oversimplified UI generator for creating web pages from text prompts with Gemini and Tailwind CSS."
	/>
</svelte:head>

<ModeWatcher />
<Toaster richColors />

<header class="flex items-center justify-center gap-4 py-16">
	<h1 class="font-bold">prompt-ui</h1>
	<ThemeToggle />
</header>

<main class="flex items-center justify-center">
	{@render children()}
</main>
