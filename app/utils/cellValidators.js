export const nonNullValidator = (value, callback) => {
  if (!value || value === '') {
    callback(false);
  } else {
    callback(true);
  }
};

export const imageURLValidator = (allowEmpty) => (value, callback) => {
  if (!allowEmpty && (!value || value === '')) {
    callback(false);
  }

  if (value) {
    if (value.startsWith('http://') || value.startsWith('https://')) {
      callback(true);
    } else {
      callback(false);
    }
  }
};

export const getCellValidators = (type, allowEmpty) => {
  switch (type) {
    case 'text':
      return allowEmpty ? {} : { validator: nonNullValidator };
    case 'imageURL':
      return { validator: imageURLValidator(allowEmpty) };
    default:
      return {};
  }
};
