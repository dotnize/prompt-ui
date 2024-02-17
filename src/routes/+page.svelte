<script lang="ts">
	import Preview from "$lib/components/Preview.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Github } from "lucide-svelte";
	import { toast } from "svelte-sonner";

	let status: "ready" | "cooldown" = "ready";
	let result: string;

	async function apiFetch(prompt: string) {
		const res = await fetch("/api", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ prompt }),
		});
		if (!res.ok) throw new Error("Returned non-200 status code.");
		return res.text();
	}

	async function submitPrompt(e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		status = "cooldown";

		if (e.currentTarget.prompt.value.length < 12) {
			toast.warning("Prompt must be at least 12 characters long.");
			status = "ready";
			return;
		}
		const req = apiFetch(e.currentTarget.prompt.value);
		toast.promise(req, {
			loading: "Generating...",
			success: (data) => {
				if (data.startsWith("```html") && data.endsWith("```")) {
					data = data.slice(7, -3);
				}
				result = data;
				setTimeout(() => {
					status = "ready";
				}, 8000);
				return "Generated!";
			},
			error: () => {
				setTimeout(() => {
					status = "ready";
				}, 4000);
				return "An error occurred while generating.";
			},
		});
	}
</script>

<div class="flex flex-col items-center gap-8">
	<div class="mx-4 flex max-w-lg flex-col gap-8">
		<div class="flex flex-col items-center gap-2 text-center">
			<h2 class="text-xl">Generate UI from text prompts with AI and Tailwind CSS.</h2>
			<a
				href="https://github.com/dotnize/prompt-ui"
				title="dotnize/prompt-ui"
				target="_blank"
				class="flex items-center gap-1 text-xs text-muted-foreground hover:underline"
			>
				<Github class="h-4 w-4" />Source code on GitHub.
			</a>
		</div>

		<form
			method="POST"
			action="/api"
			on:submit|preventDefault={submitPrompt}
			class="flex flex-col gap-2"
		>
			<Textarea
				name="prompt"
				id="prompt"
				minlength={12}
				maxlength={256}
				required
				placeholder="A homepage for my thrift store business"
			/>
			<div class="flex justify-between">
				<label for="prompt" class="text-xs text-muted-foreground">
					Minimum of 12 characters.
				</label>
				<Button disabled={status !== "ready"} type="submit">Generate</Button>
			</div>
		</form>
	</div>
	{#if result}
		<Preview code={result} />
	{/if}
</div>
