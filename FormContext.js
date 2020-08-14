import React, { useState, useEffect } from "react";
const FormContext = React.createContext();

export { FormContext };

export default function Form({ validationSchema, onSubmit, children }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  function updateForm(name, value) {
    setForm({ ...form, [name]: value });
  }

  async function validateForm() {
    let formErrors = await Promise.all(
      Object.entries(validationSchema).map(async ([field, validation]) => {
        const error = await validation
          .validate(form[field])
          .then(console.log)
          .catch((error) => {
            return error.message;
          });
        return [field, error];
      })
    );

    formErrors = formErrors.filter(([, error]) => error);
    setErrors(Object.fromEntries(formErrors));
    return formErrors.length === 0;
  }

  async function submitForm() {
    setShowErrors(true);
    const isValid = await validateForm();
    console.log({ isValid });
    if (isValid) {
      onSubmit(form);
    }
  }

  useEffect(() => {
    if (showErrors) {
      validateForm();
    }
  }, [form, showErrors]);

  useEffect(() => {
    const fields = Object.fromEntries(
      Object.entries(validationSchema).map(([field, { value }]) => [
        field,
        value ? value : null,
      ])
    );
    setForm(fields);
  }, []);

  return (
    <FormContext.Provider
      value={{
        form,
        updateForm,
        errors,
        setShowErrors,
        submitForm,
        showErrors,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
