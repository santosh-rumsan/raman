export const getPreviewLinkForGoogleDocs = (url: string): string => {
  try {
    const driveRegex = /drive\.google\.com\/file\/d\/([^/]+)/;
    const docsRegex =
      /docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([^/]+)/;

    if (driveRegex.test(url)) {
      return url.replace(/\/view.*$/, '/preview');
    } else if (docsRegex.test(url)) {
      return url.replace(/\/edit.*$/, '/preview');
    }

    throw new Error('Invalid Google Drive or Docs link');
  } catch (error) {
    console.error('Error converting link:', error);
    return url; // Return original URL if conversion fails
  }
};
