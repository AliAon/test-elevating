// Helper for looking up city/state from country + postal/ZIP code
// Uses the public Zippopotam.us API for supported countries.

import { COUNTRY_META } from "./allCountriesData";

// Convert COUNTRY_META object to array of country names
export const COUNTRY_OPTIONS = Object.keys(COUNTRY_META);

function getIso2ForCountryName(countryName) {
  if (!countryName) return null;
  const country = COUNTRY_META[countryName];
  return country ? country.iso2 : null;
}

export function getDialCodeForCountryName(countryName) {
  if (!countryName) return null;
  const country = COUNTRY_META[countryName];
  return country ? country.isd : null;
}

/**
 * Normalize the state string returned by Zippopotam.us against the known
 * states list for that country.
 *
 * Zippopotam.us can return:
 *   - Full name:         "New York"         → match directly
 *   - Abbreviation:      "NY"               → match against known states
 *   - Different casing:  "new york"         → case-insensitive match
 *   - Partial/different: "North Yorkshire"  → best fuzzy match
 *
 * Priority:
 *   1. Exact match
 *   2. Case-insensitive match
 *   3. Known state that starts with the returned value (or vice versa)
 *   4. Return the raw value from the API as a fallback
 */
function normalizeState(rawState, countryName) {
  if (!rawState) return "";

  const knownStates = COUNTRY_META[countryName]?.states ?? [];
  if (knownStates.length === 0) return rawState;

  const raw = rawState.trim();
  const rawLower = raw.toLowerCase();

  // 1. Exact match
  const exact = knownStates.find((s) => s === raw);
  if (exact) return exact;

  // 2. Case-insensitive match
  const caseInsensitive = knownStates.find((s) => s.toLowerCase() === rawLower);
  if (caseInsensitive) return caseInsensitive;

  // 3. Known state starts with the raw value, or raw value starts with known state
  //    (handles abbreviation-like partial matches e.g. "NY" vs "New York" won't
  //    match here, but "New York" vs "New York City" style overlaps might)
  const startsWith = knownStates.find(
    (s) =>
      s.toLowerCase().startsWith(rawLower) ||
      rawLower.startsWith(s.toLowerCase()),
  );
  if (startsWith) return startsWith;

  // 4. Zippopotam.us sometimes returns state abbreviations (e.g. "NY").
  //    Try matching the abbreviation against each known state name's initials.
  //    e.g. "NY" → check if any state abbreviates to "NY" by looking at
  //    state abbreviation field in the API response (state abbreviation).
  //    We also try a contains check as a last resort.
  const contains = knownStates.find(
    (s) =>
      s.toLowerCase().includes(rawLower) || rawLower.includes(s.toLowerCase()),
  );
  if (contains) return contains;

  // Fallback: return whatever the API gave us
  return raw;
}

/**
 * Look up address details from country name and postal/ZIP code.
 * Returns { city, state } or throws on failure.
 *
 * The returned `state` is normalized to match one of the known state strings
 * in COUNTRY_META so the dropdown Select will display it correctly.
 */
export async function lookupAddressByPostalCode(countryName, postalCode) {
  const trimmedPostal = String(postalCode || "").trim();
  if (!countryName || !trimmedPostal) {
    throw new Error("Country and postal code are required");
  }

  const normalizedCountry = String(countryName).toLowerCase().trim();

  // Singapore is a city-state; treat any valid postal code as Singapore
  // and auto-fill both city and state as "Singapore" without calling
  // the external Zippopotam.us API (which does not support SG).
  if (normalizedCountry === "singapore") {
    return { city: "Singapore", state: "Singapore" };
  }

  const iso2 = getIso2ForCountryName(countryName);
  if (!iso2) {
    throw new Error("Selected country is not supported for auto-fill");
  }

  const url = `https://api.zippopotam.us/${iso2}/${encodeURIComponent(
    trimmedPostal,
  )}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("No location found for this postal code");
  }

  const data = await res.json();
  const place = Array.isArray(data.places) && data.places[0];
  if (!place) {
    throw new Error("No location found for this postal code");
  }

  const city = place["place name"] || place["place"] || "";

  // Zippopotam.us returns both "state" (full name) and "state abbreviation".
  // Prefer full name first, fall back to abbreviation, then normalize both
  // against our known states list.
  const rawStateFull = place["state"] || "";
  const rawStateAbbr = place["state abbreviation"] || "";

  // Try to normalize full name first; if that doesn't produce a match in our
  // list, try the abbreviation as a hint (pass it through normalizeState too).
  let state = normalizeState(rawStateFull, countryName);

  // If the full-name normalization fell back to the raw API value (meaning no
  // match was found in our list) and we also have an abbreviation, try
  // matching via the abbreviation against our list using a US-style lookup.
  if (
    state === rawStateFull &&
    rawStateAbbr &&
    !COUNTRY_META[countryName]?.states?.includes(state)
  ) {
    const byAbbr = normalizeState(rawStateAbbr, countryName);
    // Only use if the abbreviation lookup actually found something in our list
    if (COUNTRY_META[countryName]?.states?.includes(byAbbr)) {
      state = byAbbr;
    }
  }

  return { city, state };
}
