/**
 * A reusable PasswordInput component that allows users to toggle password visibility.
 * @param label - The label for the password input field.
 * @param error - The error message to display below the input field.
 * @param props - Additional props to pass to the underlying input element.
 * @return A PasswordInput component.
 */

import React, { useState } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function PasswordInput({ label, error, ...props }: Props) {
  const [visible, setVisible] = useState(false);
  const id = props.id || props.name || "pwd-" + Math.random().toString(36);

  return (
    <div style={{ marginBottom: "16px" }}>
      {label && <label htmlFor={id}>{label}</label>}

      <div style={{ position: "relative" }}>
        <input
          {...props}
          id={id}
          type={visible ? "text" : "password"}
          style={{ width: "100%", paddingRight: "40px" }}
        />

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          {visible ? "🙈" : "👁️"}
        </button>
      </div>

      {error && (
        <span
          style={{ color: "red", fontSize: "13px", marginTop: "4px" }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
