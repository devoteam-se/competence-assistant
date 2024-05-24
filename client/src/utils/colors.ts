export const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const getTextColor = (backgroundColor: string) => {
  const rgb = hexToRgb(backgroundColor);

  if (!rgb) {
    return '#000000';
  }
  const { r, g, b } = rgb;

  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#3C3C3A' : '#ffffff';
};
