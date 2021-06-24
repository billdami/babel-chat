import React, { FC } from 'react';

import { DONATE_URL } from '../../constants/app';

import Anchor from '../Anchor';

interface DonateButtonProps {
  className?: string;
}

const DonateButton: FC<DonateButtonProps> = ({ className = '' }) => {
  return (
    <Anchor href={DONATE_URL} target="_blank" rel="noreferrer" className={className}>
      <img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png"
        alt="Buy Me A Coffee"
        className="h-7"
      />
    </Anchor>
  );
};

export default DonateButton;
