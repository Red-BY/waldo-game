import { describe, expect, it } from "vitest";
import { validatePlayerName } from "./playerName.js";

describe("validatePlayerName", () => {
	it("accepts a normal name and trims surrounding whitespace", () => {
		expect(validatePlayerName("  Alice  ")).toEqual({ ok: true, name: "Alice" });
	});

	it("rejects names that are empty after trimming", () => {
		expect(validatePlayerName("   ").ok).toBe(false);
	});

	it("rejects non-string input", () => {
		expect(validatePlayerName(42).ok).toBe(false);
		expect(validatePlayerName(undefined).ok).toBe(false);
	});

	it("accepts exactly 20 characters and rejects 21", () => {
		expect(validatePlayerName("abcdefghijklmnopqrst")).toEqual({ ok: true, name: "abcdefghijklmnopqrst" });
		expect(validatePlayerName("abcdefghijklmnopqrstu").ok).toBe(false);
	});

	it("rejects profanity with a message asking for a different name", () => {
		expect(validatePlayerName("shit")).toEqual({ ok: false, error: "Please choose a different name" });
	});

	it("rejects obfuscated profanity", () => {
		expect(validatePlayerName("f.u.c.k").ok).toBe(false);
		expect(validatePlayerName("sh1t").ok).toBe(false);
		expect(validatePlayerName("f u c k").ok).toBe(false);
	});

	it("does not join multi-letter words when looking for spaced-out profanity", () => {
		expect(validatePlayerName("Pen Island")).toEqual({ ok: true, name: "Pen Island" });
		expect(validatePlayerName("J. R. Smith")).toEqual({ ok: true, name: "J. R. Smith" });
	});

	it("accepts innocent names that contain a profane substring", () => {
		expect(validatePlayerName("Scunthorpe")).toEqual({ ok: true, name: "Scunthorpe" });
		expect(validatePlayerName("Cassidy")).toEqual({ ok: true, name: "Cassidy" });
	});
});
