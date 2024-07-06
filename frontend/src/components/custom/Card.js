import React from 'react';

function Card({ number, title }) {
  return(
<div className="bg-black shadow-red p-4 rounded-lg flex flex-col items-center justify-center">
    <span className="text-red-600 text-5xl font-bold">{number}</span>
    <span className="text-white text-lg">{title}</span>
</div>
  );
}

export default Card;