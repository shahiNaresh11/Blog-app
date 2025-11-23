import { useState } from 'react';
import * as Yup from 'yup';

export const useFormValidation = (initialValues, validationSchema) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = async (valuesToValidate) => {
    try {
      await validationSchema.validate(valuesToValidate, { abortEarly: false });
      return {};
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      return newErrors;
    }
  };

  const validateField = async (name, value) => {
    try {
      const fieldSchema = validationSchema.fields[name];
      if (fieldSchema) {
        await fieldSchema.validate(value);
        return '';
      }
    } catch (err) {
      return err.message;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateField(name, value).then((error) => {
        setErrors((prev) => ({ ...prev, [name]: error }));
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value).then((error) => {
      setErrors((prev) => ({ ...prev, [name]: error }));
    });
  };

  const handleSubmit = (callback) => async (e) => {
    e.preventDefault();
    
    const newErrors = await validateForm(values);
    setErrors(newErrors);
    setTouched(
      Object.keys(validationSchema.fields).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );

    if (Object.keys(newErrors).length === 0) {
      callback(values);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  };
};

export const validators = {
  required: (value) => (!value ? 'This field is required' : ''),
  email: (value) =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
      ? 'Invalid email address'
      : '',
  minLength: (min) => (value) =>
    value && value.length < min ? `Must be at least ${min} characters` : '',
  maxLength: (max) => (value) =>
    value && value.length > max ? `Must be at most ${max} characters` : '',
};
