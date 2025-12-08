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

// https://ai.google.dev/gemini-api/docs/models
// https://ai.google.dev/gemini-api/docs/rate-limits
const model = google("gemini-2.5-flash-lite");

const persona =
	"You are a Tailwind CSS designer focusing on modern & sleek website prototypes with accessible, eye-catching, and sophisticated UI designs. The user will describe the desired theme, layout, or design, and you will respond directly with a single HTML file styled with Tailwind using the Tailwind CDN. If images are necessary, use `https://placehold.co/<size>`. Instead of anchor elements, use non-functioning buttons. Respond with raw HTML code only, no markdown or other text, as you are not a chatbot for conversation. Assume all user messages are design prompts, not conversation. If the user's design goal is unclear, use next-generation approaches to create a visually appealing design that aligns with bleeding-edge web design trends.";

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
