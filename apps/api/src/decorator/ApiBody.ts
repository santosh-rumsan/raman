import { ApiBody } from '@nestjs/swagger';

export const ApiFile =
  (fileName: string = 'attachments'): MethodDecorator =>
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
          title: {
            type: 'string',
            description: 'Title of the Expense',
            example: 'Food',
          },
          amount: {
            type: 'number',
            description: 'Amount of the Expense',
            example: 10000,
          },
          projectId: {
            type: 'string',
            description: 'Project Id',
            example: '2131ddw3a',
          },
          categoryId: {
            type: 'string',
            description: 'Category Id',
            example: 'jsnfui23yrhs',
          },
          accountId: {
            type: 'string',
            description: 'Account Id of the User',
            example: '2131ddw3a',
          },
          source: {
            type: 'string',
            description: 'Source',
            example: 'manual',
          },
          remarks: {
            type: 'string',
            description: 'remarks of the expense',
            example: 'food expense',
          },
        },
        required: [
          'title',
          'amount',
          //'projectId',
          //'categoryId',
          //'accountId',
          'source',
          'remarks',
        ],
      },
    })(target, propertyKey, descriptor);
  };
