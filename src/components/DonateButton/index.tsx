import React, { FC } from 'react';

import Anchor from '../Anchor';

interface DonateButtonProps {}

const DonateButton: FC<DonateButtonProps> = () => {
  return (
    <Anchor href="https://www.buymeacoffee.com/babelchat" target="_blank" rel="noreferrer">
      <img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png"
        alt="Buy Me A Coffee"
        className="h-7"
      />
    </Anchor>
  );
};

export default DonateButton;
