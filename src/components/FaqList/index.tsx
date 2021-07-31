import React, { FC } from 'react';

import { Faqs } from '../../constants/faq';

interface FaqListProps {}

const FaqList: FC<FaqListProps> = () => {
  return (
    <div>
      {Faqs.map((faq) => (
        <div key={faq.slug}>
          <div>{faq.question}</div>
          <div>{faq.answer}</div>
        </div>
      ))}
    </div>
  );
};

export default FaqList;
