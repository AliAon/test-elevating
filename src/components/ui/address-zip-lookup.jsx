import React, { useEffect, useRef, useState, useCallback } from "react";
import InputField from "@/components/ui/input-field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  lookupAddressByPostalCode,
  COUNTRY_OPTIONS,
} from "@/helpers/addressLookup";
import { COUNTRY_META } from "@/helpers/allCountriesData";

const getISD = (countryName) => COUNTRY_META[countryName]?.isd ?? "";

const getStates = (countryName) => COUNTRY_META[countryName]?.states ?? [];

async function detectCountryFromCoords(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en", "User-Agent": "address-lookup-widget" },
  });
  if (!res.ok) throw new Error("Nominatim request failed");
  const data = await res.json();
  return data?.address?.country ?? null;
}

export default function AddressZipLookup({
  country,
  state,
  city,
  postalCode,
  isdCode,
  onChange,
  errors = {},
  touched = {},
  fieldNames = {
    country: "country",
    state: "state",
    city: "city",
    postalCode: "postal_code",
    isdCode: "isd_code",
  },
  labels = {
    country: "Country",
    state: "State",
    city: "City",
    postalCode: "ZIP Code",
    isdCode: "ISD Code",
  },
  autoDetectCountry = true,
}) {
  const [lookupStatus, setLookupStatus] = useState({
    loading: false,
    error: null,
  });
  const [geoStatus, setGeoStatus] = useState(null);
  const lastLookupRef = useRef({ country: null, postal: null });

  const pathname = window.location.pathname;

  useEffect(() => {
    const shouldAutoDetect =
      autoDetectCountry && pathname === "/admin/add-update-client" && !country;

    if (!shouldAutoDetect) return;

    if (!navigator.geolocation) {
      setGeoStatus("error");
      return;
    }

    setGeoStatus("detecting");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const detected = await detectCountryFromCoords(
            coords.latitude,
            coords.longitude,
          );
          if (!detected) throw new Error("No country returned");

          // Try to find an exact or case-insensitive match in COUNTRY_OPTIONS
          const match =
            COUNTRY_OPTIONS.find(
              (c) => c.toLowerCase() === detected.toLowerCase(),
            ) ?? detected;

          onChange(fieldNames.country, match);
          setGeoStatus("done");
        } catch {
          setGeoStatus("error");
        }
      },
      () => setGeoStatus("error"),
      { timeout: 8000 },
    );
  }, [pathname, autoDetectCountry, country]);

  useEffect(() => {
    if (!country) return;
    const isd = getISD(country);
    if (isd && isd !== isdCode) {
      onChange(fieldNames.isdCode, isd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleCountryChange = useCallback(
    (value) => {
      setLookupStatus((p) => ({ ...p, error: null }));
      // Reset state/city when country changes
      onChange(fieldNames.country, value);
      onChange(fieldNames.state, "");
      onChange(fieldNames.city, "");
      onChange(fieldNames.postalCode, "");
      lastLookupRef.current = { country: null, postal: null };
    },
    [onChange, fieldNames],
  );

  const handlePostalChange = useCallback(
    (e) => {
      setLookupStatus((p) => ({ ...p, error: null }));
      onChange(fieldNames.postalCode, e.target.value);
    },
    [onChange, fieldNames.postalCode],
  );

  // ── Postal code auto-lookup ──────────────────────────────────────────────
  useEffect(() => {
    const code = postalCode;
    if (!country || !code || String(code).trim().length < 3) return;

    const key = { country, postal: String(code).trim() };
    if (
      lastLookupRef.current.country === key.country &&
      lastLookupRef.current.postal === key.postal
    )
      return;

    let cancelled = false;
    setLookupStatus({ loading: true, error: null });

    lookupAddressByPostalCode(country, code)
      .then((res) => {
        if (cancelled) return;
        lastLookupRef.current = key;
        if (res.city) onChange(fieldNames.city, res.city);
        if (res.state) onChange(fieldNames.state, res.state);
        setLookupStatus({ loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setLookupStatus({
          loading: false,
          error: err.message || "Lookup failed",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [country, postalCode, fieldNames.city, fieldNames.state, onChange]);

  // ── Derived values ───────────────────────────────────────────────────────
  const stateOptions = getStates(country);
  const hasStateList = stateOptions.length > 0;

  // ── Error helpers ────────────────────────────────────────────────────────
  const countryError =
    touched[fieldNames.country] && errors[fieldNames.country];
  const stateError = touched[fieldNames.state] && errors[fieldNames.state];
  const cityError = touched[fieldNames.city] && errors[fieldNames.city];
  const postalError =
    touched[fieldNames.postalCode] && errors[fieldNames.postalCode];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-4 gap-3">
      {/* ── Country ────────────────────────────────────────────────────── */}
      <div className="w-full flex items-center justify-between bg-white rounded-lg gap-5 px-4 pt-2 pb-2">
        <div className="flex-1">
          <label className="text-sm text-text_secondary font-medium flex items-center gap-2">
            {labels.country}
            {geoStatus === "detecting" && (
              <span className="text-xs text-blue-400 font-normal animate-pulse">
                Detecting…
              </span>
            )}
          </label>
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger className="mt-1 h-8 bg-[#06060605] border-[#06060600] text-sm text-text_primary font-semibold">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {COUNTRY_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {countryError && (
            <p className="text-xs text-red-500 font-medium mt-1">
              {countryError}
            </p>
          )}
        </div>
      </div>

      {/* ── Postal / ZIP ────────────────────────────────────────────────── */}
      <InputField
        label={
          lookupStatus.loading
            ? `${labels.postalCode} (looking up…)`
            : labels.postalCode
        }
        placeholder="Enter ZIP / postal code"
        value={postalCode}
        name={fieldNames.postalCode}
        onChange={handlePostalChange}
        type="number"
        error={postalError || lookupStatus.error}
      />

      {/* ── State / Province ────────────────────────────────────────────── */}
      {hasStateList ? (
        <div className="w-full flex items-center justify-between bg-white rounded-lg gap-5 px-4 pt-2 pb-2">
          <div className="flex-1">
            <label className="text-sm text-text_secondary font-medium">
              {labels.state}
            </label>
            <Select
              value={state}
              onValueChange={(val) => onChange(fieldNames.state, val)}>
              <SelectTrigger className="mt-1 h-8 bg-[#06060605] border-[#06060600] text-sm text-text_primary font-semibold">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {stateOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {stateError && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {stateError}
              </p>
            )}
          </div>
        </div>
      ) : (
        <InputField
          label={labels.state}
          placeholder="Enter state / province"
          value={state}
          name={fieldNames.state}
          onChange={(e) => onChange(fieldNames.state, e.target.value)}
          error={stateError}
        />
      )}

      {/* ── City ────────────────────────────────────────────────────────── */}
      <InputField
        style={{ width: "200px" }}
        label={labels.city}
        placeholder="Enter city"
        value={city}
        name={fieldNames.city}
        onChange={(e) => onChange(fieldNames.city, e.target.value)}
        error={cityError}
      />
    </div>
  );
}
