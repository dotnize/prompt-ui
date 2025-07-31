import type { Config } from "@sveltejs/adapter-vercel";
import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { GOOGLE_GENERATIVE_AI_API_KEY } from "$env/static/private";

import type { RequestHandler } from "./$types";

export const config: Config = {
	runtime: "edge",
};

const google = createGoogleGenerativeAI({
	apiKey: GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = google("gemini-2.5-flash-lite");

const persona =
	"You are a Tailwind CSS assistant focusing on modern & sleek website prototypes with accessible, eye-catching, and sophisticated UI designs. The user will describe the desired theme, layout, or design, and you will respond directly with a single HTML file styled with Tailwind using the Tailwind CDN. If images are necessary, use `https://placehold.co/<size>`. Use buttons instead of anchor elements and don't implement link navigation. Respond with raw HTML code only, no markdown or other text. Be creative and try to exceed the expectations of the user.";

export const POST: RequestHandler = async ({ request }) => {
	const { messages } = await request.json();

	if (!messages?.length) {
		return new Response("No prompt provided", { status: 400 });
	}
	const result = streamText({
		model,
		system: persona,
		messages: convertToModelMessages(messages),
		// maxOutputTokens: 1536,
	});

	return result.toUIMessageStreamResponse();
};
