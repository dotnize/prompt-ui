import { OPENAI_API_KEY } from "$env/static/private";
import type { Config } from "@sveltejs/adapter-vercel";
import OpenAI from "openai";
import type { RequestHandler } from "./$types";

export const config: Config = {
	runtime: "edge",
};

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const persona =
	"You are a TailwindCSS developer with expertise in minimal website and UI design. The user will describe the desired layout and design, and you will respond directly with a single HTML file styled with TailwindCSS. If images are necessary, use an empty image with an alt text. HTML code only, no any other text response.";

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (!body.prompt) {
		return new Response("No prompt provided", { status: 400 });
	}
	const gen = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: [
			{ role: "system", content: persona },
			{ role: "user", content: body.prompt },
		],
		max_tokens: 2048,
	});

	const result = gen.choices[0].message.content;
	return new Response(result);
};
