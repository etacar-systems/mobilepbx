import { forwardRef, InputHTMLAttributes } from "react";

import classNames from "./input.module.scss";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: "email" | "password" | "text";
  label?: string;
  labelPosition?: "top" | "left";
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
  (
    { label, type, error, id, name, labelPosition, disabled, value, onChange },
    ref
  ) => {
    return (
      <div data-position={labelPosition} className={classNames.input}>
        {label && (
          <label className={classNames.input__label} htmlFor={id || name}>
            {label}
          </label>
        )}
        <div className={classNames.input__form}>
          <input
            className={classNames.input__field}
            id={id || name}
            name={name}
            ref={ref}
            type={type}
            disabled={disabled}
            value={value}
            onChange={onChange}
          />
          {error && <p className={classNames.input__error}>{error}</p>}
        </div>
      </div>
    );
  }
);

// customer-form-control modal-select
