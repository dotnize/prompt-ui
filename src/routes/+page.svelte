<script lang="ts">
	import Preview from "$lib/components/Preview.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Github } from "@lucide/svelte";
	import { toast } from "svelte-sonner";
	import { Chat } from "@ai-sdk/svelte";

	let finished = $state(false);

	const chat = new Chat({
		onError: (e) => {
			console.error(e);
			toast.dismiss();
			toast.error("An error occurred while generating the UI. Please try again.");
		},
		onFinish: () => {
			toast.dismiss();
			finished = true;
			toast.success("UI generated successfully!");
		},
	});

	const result: string | undefined = $derived.by(() => {
		const message = chat.messages
			.find((msg) => msg.role === "assistant")
			?.parts.find((p) => p.type === "text")?.text;

		if (!message) {
			return undefined;
		}

		// Remove code block wrapping if present
		return message.replace(/^(```html|```)|```$/g, "");
	});

	function handleSubmit(e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		e.preventDefault();
		if (e.currentTarget.prompt.value.length < 12) {
			toast.warning("Prompt must be at least 12 characters long.");
			return;
		}
		chat.messages = [];
		finished = false;
		toast("Generating...");
		chat.sendMessage({ text: e.currentTarget.prompt.value, role: "user" });
	}
</script>

<div class="flex flex-col items-center gap-6">
	<div class="mx-4 flex max-w-xl flex-col gap-8">
		<div class="flex flex-col items-center gap-2 text-center">
			<h2 class="text-xl font-semibold">Generate UI from text prompts with AI and Tailwind CSS.</h2>
			<a
				href="https://github.com/dotnize/prompt-ui"
				title="dotnize/prompt-ui"
				target="_blank"
				class="text-muted-foreground flex items-center gap-1 text-xs hover:underline"
			>
				<Github class="h-4 w-4" />Source code on GitHub.
			</a>
		</div>

		<form method="POST" onsubmit={handleSubmit} class="flex flex-col gap-2">
			<Textarea
				name="prompt"
				id="prompt"
				minlength={12}
				maxlength={256}
				required
				placeholder="A colorful and stylish homepage for my thrift store business"
			/>
			<div class="flex justify-between">
				<label for="prompt" class="text-muted-foreground text-xs">
					Minimum of 12 characters.
				</label>
				<Button disabled={chat.status !== "ready"} type="submit"
					>{chat.status === "ready" ? "Generate" : "Generating..."}</Button
				>
			</div>
		</form>
	</div>
	{#if result}
		<Preview code={result} complete={finished} />
	{/if}
</div>
