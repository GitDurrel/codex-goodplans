/**
 * A custom hook to manage the state of a form field.
 * It supports both text inputs and checkboxes.
 * @param initial - The initial value of the form field.
 * @returns An object containing the value, onChange handler, and setValue function.
 */

import { useState } from "react";

export function useFormField<T = string>(initial: T) {
  const [value, setValue] = useState<T>(initial);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const newValue = (input.type === "checkbox"
      ? (input.checked as unknown as T)
      : (input.value as unknown as T));

    setValue(newValue);
  }

  return { value, onChange, setValue };
}
