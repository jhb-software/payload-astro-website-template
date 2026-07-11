import assert from "node:assert/strict";
import { test } from "node:test";

import { parsePath } from "./preview.ts";

test("parsePath keeps Dutch unprefixed and recognizes localized routes", () => {
  assert.deepEqual(parsePath(["kamers", "kamer-1"]), {
    locale: "nl",
    segments: ["kamers", "kamer-1"],
  });
  assert.deepEqual(parsePath(["en", "rooms", "room-1"]), {
    locale: "en",
    segments: ["rooms", "room-1"],
  });
  assert.deepEqual(parsePath(["de"]), { locale: "de", segments: [] });
});
