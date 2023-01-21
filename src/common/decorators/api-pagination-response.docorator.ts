import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiPaginationResponse = <Model extends Type<any>>({
  type,
  description,
}: {
  type: Model;
  description: string;
}) => {
  return applyDecorators(
    ApiOkResponse({
      description,
      content: {
        'application/json': {
          schema: {
            allOf: [
              {
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(type) },
                  },
                },
              },
            ],
          },
        },
      },
      schema: {
        allOf: [
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              },
              meta: {
                type: 'any',
                default: {
                  totalItems: 2,
                  itemCount: 2,
                  itemsPerPage: 2,
                  totalPages: 1,
                  currentPage: 1,
                },
              },
            },
          },
        ],
      },
    }),
  );
};
