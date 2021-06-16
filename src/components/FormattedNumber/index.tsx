import React, { FC, useMemo } from 'react';

interface FormattedNumberProps {
  value?: number | string | null;
}

const fmt = new Intl.NumberFormat();

const FormattedNumber: FC<FormattedNumberProps> = ({ value }) => {
  const formattedValue = useMemo(() => fmt.format(value ? Number(value) : 0), [value]);
  return <>{formattedValue}</>;
};

export default FormattedNumber;
