/**
 * A custom hook to manage the state of an input field.
 * It provides the current value, an onChange handler, and a setter function.
 * @param initial - The initial value of the input field.
 * @returns An object containing the value, onChange handler, and setValue function.
 */

import { useState } from "react";

export function useInput(initial = "") {
  const [value, setValue] = useState(initial);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return { value, onChange, setValue };
}
