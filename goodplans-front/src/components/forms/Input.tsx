/**
 * A reusable Input component that supports labels and error messages.
  * @param label - The label for the input field.
  * @param error - The error message to display below the input field.
 * @param props - Additional props to pass to the underlying input element.
*/

import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, ...props }: Props) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input {...props} className="input" />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
