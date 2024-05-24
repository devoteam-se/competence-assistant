import { Select, SelectProps } from '@mantine/core';

interface Props extends Omit<SelectProps, 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

const NumberSelect = ({ value, onChange, ...rest }: Props) => (
  <Select {...rest} value={value.toString()} onChange={(it) => onChange(Number(it) || 0)} />
);

export default NumberSelect;
