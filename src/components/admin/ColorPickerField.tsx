"use client";

import React from "react";
import { useField, FieldLabel, FieldDescription } from "@payloadcms/ui";

type Props = {
  path: string;
  field?: {
    label?: string;
    required?: boolean;
    admin?: { description?: string };
  };
};

const HEX6 = /^#[0-9a-fA-F]{6}$/;
const HEX8 = /^#[0-9a-fA-F]{8}$/;

const ColorPickerField: React.FC<Props> = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path });
  const text = value ?? "";

  // Native <input type="color"> only understands #RRGGBB.
  // For #RRGGBBAA, rgba(), oklch(), etc. fall back to a neutral swatch.
  const isHex = HEX6.test(text) || HEX8.test(text);
  const swatchColor = HEX6.test(text)
    ? text
    : HEX8.test(text)
    ? text.slice(0, 7)
    : "#000000";

  const label = field?.label;
  const description = field?.admin?.description;

  return (
    <div className="field-type">
      {label && (
        <FieldLabel
          htmlFor={`field-${path}`}
          label={label}
          required={field?.required}
        />
      )}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "stretch",
        }}
      >
        <label
          style={{
            position: "relative",
            display: "inline-flex",
            width: 44,
            height: 38,
            borderRadius: 4,
            border: "1px solid var(--theme-elevation-150)",
            background: isHex
              ? swatchColor
              : "repeating-conic-gradient(var(--theme-elevation-100) 0% 25%, var(--theme-elevation-50) 0% 50%) 50% / 12px 12px",
            cursor: "pointer",
            overflow: "hidden",
            flex: "0 0 44px",
          }}
          aria-label="Open color picker"
        >
          <input
            type="color"
            value={swatchColor}
            onChange={(e) => setValue(e.target.value)}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: "pointer",
              border: 0,
              padding: 0,
            }}
          />
        </label>
        <input
          id={`field-${path}`}
          type="text"
          value={text}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#050824, rgba(0,0,0,.5), oklch(...)"
          style={{
            flex: 1,
            padding: "0 0.75rem",
            background: "var(--theme-input-bg)",
            border: "1px solid var(--theme-elevation-150)",
            borderRadius: 4,
            color: "var(--theme-text)",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "0.875rem",
            height: 38,
          }}
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            style={{
              padding: "0 0.75rem",
              background: "transparent",
              border: "1px solid var(--theme-elevation-150)",
              borderRadius: 4,
              color: "var(--theme-text)",
              cursor: "pointer",
              fontSize: "0.85rem",
              height: 38,
            }}
            title="Reset to default"
          >
            Clear
          </button>
        )}
      </div>
      {description && <FieldDescription path={path} description={description} />}
    </div>
  );
};

export default ColorPickerField;
