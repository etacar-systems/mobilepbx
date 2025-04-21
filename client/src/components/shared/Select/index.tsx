import { ChangeEvent } from "react";
import { Form } from "react-bootstrap";

interface ISelectProps {
  options: Array<{
    key?: string;
    value: string | number;
    label: string | number;
  }>;
  value?: string | number;
  onChange?: (value: string) => void;
}

export const Select = ({
  options,
  value,
  onChange: onChangeExternal,
}: ISelectProps) => {
  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChangeExternal && onChangeExternal(event.target.value);
  };

  return (
    <Form.Select onChange={onChange} value={value}>
      {options.map((option) => (
        <option key={option.key || option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
};
