/**
 * A reusable Checkbox component that supports labels and error messages.
 * @param label - The label for the checkbox.
 * @param checked - The checked state of the checkbox.
 * @param onChange - The onChange handler for the checkbox.
 * @param error - The error message to display below the checkbox.
 * @param name - The name attribute for the checkbox input.
 * @param id - The id attribute for the checkbox input.
 * @return A Checkbox component.
 */

import React from "react";

type Props = {
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  name?: string;
  id?: string;
};

export function Checkbox({
  label,
  checked,
  onChange,
  error,
  name,
  id,
}: Props) {
  const inputId = id || name || "checkbox-" + Math.random().toString(36);

  return (
    <div className="checkbox-group" style={{ marginBottom: "12px" }}>
      <label
        htmlFor={inputId}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
      >
        <input
          id={inputId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ width: "16px", height: "16px" }}
        />
        {label && <span>{label}</span>}
      </label>

      {error && (
        <span
          style={{
            color: "red",
            fontSize: "13px",
            marginTop: "4px",
            display: "block",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
