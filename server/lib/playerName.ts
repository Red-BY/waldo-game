import { englishDataset, englishRecommendedTransformers, RegExpMatcher } from "obscenity";

// The client mirrors this in client/src/lib/playerName.ts for its input limit; keep them in sync.
export const MAX_PLAYER_NAME_LENGTH = 20;

const profanityMatcher = new RegExpMatcher({
	...englishDataset.build(),
	...englishRecommendedTransformers,
});

// "f.u.c.k" / "f u c k" -> "fuck", while leaving multi-letter words like "Pen Island" apart.
function joinSpacedOutLetters(name: string): string {
	return name.replace(/\b(?:\w[\s._*-]+)+\w\b/g, (run) => run.replace(/[\s._*-]+/g, ""));
}

export type PlayerNameResult = { ok: true; name: string } | { ok: false; error: string };

export function validatePlayerName(raw: unknown): PlayerNameResult {
	if (typeof raw !== "string") {
		return { ok: false, error: "Please enter a name" };
	}

	const name = raw.trim();
	const length = [...name].length;
	if (length === 0) {
		return { ok: false, error: "Please enter a name" };
	}
	if (length > MAX_PLAYER_NAME_LENGTH) {
		return { ok: false, error: `Name must be ${MAX_PLAYER_NAME_LENGTH} characters or fewer` };
	}
	if (profanityMatcher.hasMatch(name) || profanityMatcher.hasMatch(joinSpacedOutLetters(name))) {
		return { ok: false, error: "Please choose a different name" };
	}

	return { ok: true, name };
}
