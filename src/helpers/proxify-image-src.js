export const proxifyImageSrc = (url) => {
  if (!url) {
    return '';
  }

  const prefix = 'https://dsiteimages.com/0x0/';

  if (url.startsWith(prefix)) return url;

  return `${prefix}${url}`;
};
