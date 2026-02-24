<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner";
	import "../app.css";

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

<header class="flex items-center justify-center gap-4 pt-16 pb-8 md:pt-32 2xl:pt-48">
	<h1 class="font-mono text-3xl font-bold md:text-4xl xl:text-6xl 2xl:text-7xl">prompt-ui</h1>
</header>

<main class="flex items-center justify-center">
	{@render children()}
</main>
