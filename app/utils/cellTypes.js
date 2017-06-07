import React from 'react';
import ReactDOMServer from 'react-dom/server';

export const cellTypes = {
  text: 'String',
  numeric: 'Number',
  checkbox: 'Boolean',
  date: 'Date',
  imageURL: 'Image URL',
};

export const getCellTypeName = (type) => cellTypes[type];

export const imageURLRenderer = (instance, td, row, col, prop, value) => {
  const cell = td;

  if (value && (value.startsWith('http://') || value.startsWith('https://'))) {
    const img = ReactDOMServer.renderToString(<img src={value} alt={value} />);
    cell.innerHTML = img;
  } else {
    cell.innerText = value;
  }

  return cell;
};

export const getCellTypes = (type) => {
  switch (type) {
    case 'imageURL':
      return { renderer: imageURLRenderer };
    default:
      return { type };
  }
};
