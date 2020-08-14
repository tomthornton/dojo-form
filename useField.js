import { useContext } from "react";
import { FormContext } from "./FormContext";

export default function useField(name) {
  const { form, updateForm, errors } = useContext(FormContext);

  function updateField(value) {
    updateForm(name, value);
  }

  return {
    value: form[name],
    update: updateField,
    error: errors[name],
  };
}
