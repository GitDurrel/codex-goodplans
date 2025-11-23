/**
 * A custom hook to manage the state of a checkbox input.
 * It provides the current checked state, an onChange handler, a toggle function, and a setter function.
 * @param initial - The initial checked state of the checkbox.
 * @returns An object containing the checked state, onChange handler, toggle function, and setChecked function.
 */

import { useState } from "react";

export function useCheckbox(initial = false) {
  const [checked, setChecked] = useState(initial);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setChecked(e.target.checked); // 🔥 valeur vraie de la checkbox
  }

  function toggle() {
    setChecked((v) => !v);
  }

  return {
    checked,
    onChange,
    toggle,
    setChecked,
  };
}
