import { ApiBody } from '@nestjs/swagger';
export const InvoiceFile =
  (fileName: string = 'receipt'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
          amount: {
            type: 'number',
            description: 'Amount of the Expense',
            example: 10000,
          },
          projectId: {
            type: 'string',
            description: 'Project Id',
            example: 'cm4cxce8m0001h1ngsrbcgu4m',
          },
          categoryId: {
            type: 'string',
            description: 'Category Id',
            example: 'cm4cx64qk0005qp1mc7tak2io',
          },
          description: {
            type: 'string',
            description: 'Description of invoice',
            example: 'food expense',
          },
          userId: {
            type: 'string',
            description: 'User Id',
            example: 'cm4cx64px0002qp1mh85t02f0',
          },
          invoiceType: {
            type: 'string',
            description: 'Invoice type',
            example: 'VAT',
          },
          status: {
            type: 'string',
            description: 'Status type',
            example: 'PENDING',
          },
          vatAmount: {
            type: 'number',
            description: 'Vat amount',
            example: '1000',
          },

          date: {
            type: 'string',
            description: 'Recorded Date',
            example: '2024-12-08',
          },
        },
        required: ['amount', 'userId', 'projectId', 'categoryId'],
      },
    })(target, propertyKey, descriptor);
  };
