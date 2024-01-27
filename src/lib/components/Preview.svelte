<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import { Switch } from "$lib/components/ui/switch";

	import { Copy } from "lucide-svelte";
	import { toast } from "svelte-sonner";

	import Highlight from "svelte-highlight";
	import xml from "svelte-highlight/languages/xml";
	import theme from "svelte-highlight/styles/hybrid";

	export let code: string;

	let showCode = false;

	function copyCode() {
		if ("clipboard" in navigator) {
			navigator.clipboard.writeText(code);
		} else {
			document.execCommand("copy", true, code);
		}
		toast.success("Copied to clipboard.");
	}
</script>

<svelte:head>
	{@html theme}
</svelte:head>

<div class="flex h-screen w-screen flex-col items-center p-2 sm:p-8 md:p-16 lg:px-24">
	<div class="mx-4 flex w-full max-w-lg items-center justify-between pb-4">
		<div class="flex items-center gap-2">
			<Switch
				checked={showCode}
				onCheckedChange={(val) => {
					showCode = val;
				}}
				id="toggle-code"
			/>
			<Label class="text-lg" for="toggle-code">Show code</Label>
		</div>
		<Button variant="outline" on:click={copyCode}>
			<Copy class="mr-2 h-4 w-4" />
			Copy to clipboard
		</Button>
	</div>
	{#if showCode}
		<div class="h-full w-full overflow-auto">
			<Highlight class="h-full w-full rounded-md" language={xml} {code} />
		</div>
	{:else}
		<iframe class="h-full w-full" title="Preview" srcdoc={code} />
	{/if}
</div>
