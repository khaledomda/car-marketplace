import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeText } from "./normalize";
import { toE164SA, isSaudiMobile } from "./phone";

test("arabic normalization unifies letter forms and digits", () => {
  assert.equal(normalizeText("أَمُوكْسِيل ٥٠٠ مجم"), "اموكسيل 500 مجم");
  assert.equal(normalizeText("بنادول  إكسترا"), "بنادول اكسترا");
  assert.equal(normalizeText("Panadol 500 MG"), "panadol 500mg");
});

test("saudi phone numbers", () => {
  assert.equal(toE164SA("0551234567"), "+966551234567");
  assert.equal(toE164SA("+966 14 822 1234"), "+966148221234");
  assert.equal(toE164SA("٠٥٥١٢٣٤٥٦٧"), "+966551234567");
  assert.ok(isSaudiMobile("+966551234567"));
  assert.ok(!isSaudiMobile("+966148221234"));
  assert.equal(toE164SA("123"), null);
});
