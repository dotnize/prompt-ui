import type { Config } from "@sveltejs/adapter-vercel";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { GOOGLE_GENERATIVE_AI_API_KEY } from "$env/static/private";

import type { RequestHandler } from "./$types";

export const config: Config = {
	runtime: "edge",
};

const google = createGoogleGenerativeAI({
	apiKey: GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = google("gemini-2.0-flash-lite");

const persona =
	"You are a Tailwind CSS developer focusing on website and UI design. The user will describe the desired theme, layout, or design, and you will respond directly with a single HTML file styled with TailwindCSS. If images are necessary, use placehold.co/<size>. Respond with raw HTML code only, no markdown or other text.";

export const POST: RequestHandler = async ({ request }) => {
	const { messages } = await request.json();

	if (!messages?.length) {
		return new Response("No prompt provided", { status: 400 });
	}
	const result = streamText({
		model,
		messages: [{ role: "system", content: persona }, ...messages],
		// maxTokens: 1536,
	});

	return result.toDataStreamResponse();
};
