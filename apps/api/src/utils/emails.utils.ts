import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const sendEmail = async (payload: {
  address: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  const url = process.env.RS_CONNECT_URL || 'https://connect.rumsan.net/api/v1';

  return axios.post(
    `${url}/broadcasts`,
    {
      transport: process.env.RS_CONNECT_EMAIL,
      message: {
        content: payload.html || payload.text,
        meta: {
          subject: payload.subject,
        },
      },
      addresses: [payload.address],
      trigger: 'IMMEDIATE',
    },
    {
      headers: {
        'app-id': process.env.RS_CONNECT_APP_ID,
      },
    },
  );
};

export function replacePlaceholders(template, data) {
  return template.replace(/{{(\w+)}}/g, (match, key) => {
    return key in data ? data[key] : match;
  });
}

/**
 * Replaces placeholders in a template and returns both HTML and plain text versions.
 * @param {string} filePath - The path to the HTML template file.
 * @param {Object} data - The object containing the replacement values.
 * @returns {Object} - An object containing `html` and `text` versions of the template.
 */
export function loadTemplateAndReplacePlaceholders(
  filePath: string,
  data: object,
): { html: string; text: string } {
  // Read the HTML template from the file
  const template = fs.readFileSync(path.resolve(filePath), 'utf-8');

  // Replace placeholders in the template
  const html = template.replace(/{{(.*?)}}/g, (match, key) => {
    return key.trim() in data ? data[key.trim()] : match;
  });

  // Convert the HTML to plain text
  const text = html
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '') // Remove styles
    .replace(/<br\s*\/?>/gi, '\r\n') // Convert <br> tags to line breaks
    .replace(/<\/(h[1-6]|p|div|tr)>/gi, '\r\n') // Add line breaks after block elements
    .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
    .replace(/\n{2,}/g, '\r\n') // Collapse multiple line breaks
    .trim(); // Trim leading/trailing spaces

  return { html, text };
}
