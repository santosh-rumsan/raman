import axios from 'axios';
export declare const sendEmail: (payload: {
    address: string;
    subject: string;
    text: string;
    html?: string;
}) => Promise<axios.AxiosResponse<any, any>>;
export declare function replacePlaceholders(template: any, data: any): any;
/**
 * Replaces placeholders in a template and returns both HTML and plain text versions.
 * @param {string} filePath - The path to the HTML template file.
 * @param {Object} data - The object containing the replacement values.
 * @returns {Object} - An object containing `html` and `text` versions of the template.
 */
export declare function loadTemplateAndReplacePlaceholders(filePath: string, data: object): {
    html: string;
    text: string;
};
//# sourceMappingURL=emails.utils.d.ts.map