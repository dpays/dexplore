export const postUrlParser = (url) => {

  const parseDSite = (url) => {
    const r = /^https?:\/\/(.*)\/(.*)\/(@[\w\.\d-]+)\/(.*)/i;
    const match = url.match(r);
    if (match && match.length === 5) {
      return {
        'author': match[3].replace('@', ''),
        'permlink': match[4]
      }
    }

    return null;
  };

  const parseDSocial = (url) => {
    const r = /^https?:\/\/(.*)\/(@[\w\.\d-]+)\/(.*)/i;
    const match = url.match(r);
    if (match && match.length === 4) {
      return {
        'author': match[2].replace('@', ''),
        'permlink': match[3]
      }
    }

    return null;
  };

  if (url.startsWith('https://dsite.io')) {
    return parseDSite(url);
  }

  if (url.startsWith('https://dsocial.io')) {
    return parseDSocial(url);
  }

  // For non url's like @dweb/freedom-series-part-3-the-dweb
  const match = url.match(/^(@[\w\.\d-]+)\/(.*)/);
  if (match && match.length === 3) {
    return {
      'author': match[1].replace('@', ''),
      'permlink': match[2]
    }
  }

  return null;
};
