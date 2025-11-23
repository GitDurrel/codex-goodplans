/**
 * A component to display form error messages.
 * @param message - The error message to display.
 * @return A paragraph element containing the error message styled in red.
 */

// import React from "react";

type Props = {
  message?: string;
};

export function FormError({ message }: Props) {
  if (!message) return null;

  return (
    <p style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
      {message}
    </p>
  );
}
