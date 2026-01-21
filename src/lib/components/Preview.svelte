<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs";
	import { Button } from "$lib/components/ui/button";
	import { toast } from "svelte-sonner";
	import { Copy, Download } from "@lucide/svelte";
	import Highlight, { LineNumbers } from "svelte-highlight";
	import xml from "svelte-highlight/languages/xml";
	import theme from "svelte-highlight/styles/hybrid";

	interface Props {
		code: string;
		complete: boolean;
	}
	let { code, complete }: Props = $props();

	function copyCode() {
		if ("clipboard" in navigator) {
			navigator.clipboard.writeText(code);
		} else {
			document.execCommand("copy", true, code);
		}
		toast.success("Copied to clipboard.");
	}

	let value = $state<"code" | "preview">("code");

	$effect(() => {
		if (complete === false) {
			value = "code";
		} else {
			value = "preview";
		}
	});
</script>

<svelte:head>
	{@html theme}
</svelte:head>

<Tabs.Root bind:value class="h-screen w-full max-w-[96vw] min-w-[96vw] py-2 sm:py-8">
	<div class="flex items-center gap-2">
		<Tabs.List>
			<Tabs.Trigger value="code" class="px-4">Code</Tabs.Trigger>
			<Tabs.Trigger
				value="preview"
				disabled={!complete}
				class="px-4"
				title={complete ? undefined : "UI is still generating..."}>Preview</Tabs.Trigger
			>
		</Tabs.List>
		<div class="flex items-center">
			<Button
				class="rounded-r-none"
				variant="outline"
				size="icon"
				onclick={copyCode}
				disabled={!complete}
				title="Copy to clipboard"
			>
				<Copy class="h-4 w-4" />
				<span class="sr-only">Copy to clipboard</span>
			</Button>
			<Button
				class="rounded-l-none"
				variant="outline"
				size="icon"
				href={`data:text/html;charset=utf-8,${encodeURIComponent(code)}`}
				download={`prompt-ui-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)}.html`}
				disabled={!complete}
				title="Download HTML"
			>
				<Download class="h-4 w-4" />
				<span class="sr-only">Download HTML</span>
			</Button>
		</div>
	</div>
	<Tabs.Content value="preview">
		<iframe class="h-full w-full rounded-lg pb-8" title="Preview" srcdoc={code}></iframe>
	</Tabs.Content>
	<Tabs.Content value="code">
		<Highlight language={xml} {code} let:highlighted>
			<LineNumbers
				{highlighted}
				wrapLines
				hideBorder
				class="h-full max-h-[90vh] w-full overflow-auto rounded-lg"
			/>
		</Highlight>
	</Tabs.Content>
</Tabs.Root>
