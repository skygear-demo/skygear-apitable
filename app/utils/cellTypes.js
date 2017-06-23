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

export const imageURLRenderer = (allowEmpty) => (instance, td, row, col, prop, value) => {
  const cell = td;

  if (value && (value.startsWith('http://') || value.startsWith('https://'))) {
    const img = ReactDOMServer.renderToString(<img src={value} alt={value} style={{ maxWidth: 200, maxHeight: 200 }} />);
    cell.innerHTML = img;
  } else {
    cell.innerText = value;
    if (!allowEmpty && !instance.isEmptyRow(row)) {
      cell.className = 'htInvalid';
    }
  }

  return cell;
};

export const getCellTypes = (type, allowEmpty) => {
  switch (type) {
    case 'imageURL':
      return { renderer: imageURLRenderer(allowEmpty) };
    case 'numeric':
      return { type, format: '0.##' };
    default:
      return { type };
  }
};
