import React, { FC } from 'react';

import { Faqs } from '../../constants/faq';

interface FaqListProps {}

const FaqList: FC<FaqListProps> = () => {
  return (
    <div>
      {Faqs.map((faq) => (
        <div key={faq.slug} className="mb-5">
          <h4 className="font-bold mb-1">{faq.question}</h4>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FaqList;
