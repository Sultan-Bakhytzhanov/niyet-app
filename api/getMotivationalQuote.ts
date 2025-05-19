const API_URL = 'https://api.anthropic.com/v1/messages'; // или актуальный endpoint Anthropic

export async function getMotivationalQuote(language: string = 'en') {
	const key = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
	// let languageName = 'English';
	// if (language === 'ru') languageName = 'Russian';
	// if (language === 'kk') languageName = 'Kazakh';

	const systemPrompt = `
You are a creative assistant who generates unique, short, and inspiring motivational quotes for users looking to improve their lives.
For each request, create a new quote that is positive, interesting, and not a cliché. Do NOT repeat previous quotes.
The author of the quote must always be a well-known, recognizable figure — either a real historical person (e.g., Steve Jobs, Napoleon, Albert Einstein, Abai, Abulkhair Khan, Nursultan Nazarbayev) or a famous fictional character (e.g., Homer Simpson, Yoda).
If the user requests the quote in Kazakh, reply in Kazakh and use Kazakh or international authors.
Respond ONLY in JSON format like this: {"quote": "...", "author": "..."}. If the user requests the quote in Kazakh, always reply in Kazakh language, even if you have to invent or translate the quote yourself. The quote and the author name must be in Kazakh letters. Never use Russian or English for the quote if Kazakh is requested. If you invent a quote, make sure it matches the style and character of the author you choose.`;

	try {
		const randomizer = Math.floor(Math.random() * 1000000);
		const languageName =
			language === 'kz' ? 'Kazakh' : language === 'ru' ? 'Russian' : 'English';
		const userPrompt =
			language === 'kz'
				? `Write only in Kazakh language! Please generate a motivational quote and author name in Kazakh. Both quote and author must be in Kazakh. For example, use famous Kazakh or international figure, but reply only in Kazakh. Don't use only Abai. When choosing the author for a quote, do not use the same author as in the previous request. Rotate authors between different well-known real or fictional figures.
				Translate everything to Kazakh if needed. Randomizer: ${randomizer}`
				: `Please give me a motivational quote with a recognizable author in ${languageName}. Randomizer: ${randomizer}`;

		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'X-API-Key': key!,
				'anthropic-version': '2023-06-01',
			},
			body: JSON.stringify({
				model: 'claude-3-haiku-20240307',
				max_tokens: 120,
				system: systemPrompt,
				messages: [
					{
						role: 'user',
						content: userPrompt,
					},
				],
			}),
		});

		if (!response.ok) {
			throw new Error(`API Error: ${response.status}`);
		}

		const data = await response.json();
		const raw = data.content[0].text.trim();
		const jsonMatch = raw.match(/\{[\s\S]*\}/);

		if (jsonMatch) {
			const parsed = JSON.parse(jsonMatch[0]);
			return {
				quote: parsed.quote,
				author: parsed.author,
			};
		}
		throw new Error('No JSON found in Claude response!');
	} catch (error) {
		console.error('Anthropic API Error:', error);
		// Запасная цитата на нужном языке
		if (language === 'ru') {
			return {
				quote:
					'Каждый маленький шаг — это прогресс. Твои намерения формируют твою реальность.',
				author: 'Народная мудрость',
			};
		}
		if (language === 'kz') {
			return {
				quote: 'Кішкентай қадам да – алға жылжу. Ниетің – болашағың.',
				author: 'Халық даналығы',
			};
		}
		return {
			quote:
				'Every small step forward is progress. Your intentions shape your reality.',
			author: 'Daily Wisdom',
		};
	}
}
