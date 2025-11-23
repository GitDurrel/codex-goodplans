/**
 * A custom hook to manage the state of a password input field.
 * It provides the current value, an onChange handler, a setter function,
 * the visibility state, and a function to toggle password visibility.
 * @param initial - The initial value of the password input field.
 * @returns An object containing the value, onChange handler, setValue function,
 *          visibility state, and toggleVisibility function.
 */

import { useState } from "react";

export function usePassword(initial = "") {
  const [value, setValue] = useState(initial);
  const [visible, setVisible] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function toggleVisibility() {
    setVisible((v) => !v);
  }

  return {
    value,
    onChange,
    setValue,
    visible,
    toggleVisibility,
  };
}
