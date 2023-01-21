// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpStatus,
// } from '@nestjs/common';
// import { Response } from 'express';
// import * as moment from 'moment';
// import { EntityNotFoundError, QueryFailedError } from 'typeorm';

// import APIError from '../exceptions/api.exception';

// @Catch(QueryFailedError, EntityNotFoundError)
// export class TypeOrmExceptionFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     let message = exception.message;
//     let code = exception.name;
//     let statusCode = HttpStatus.BAD_REQUEST;

//     switch (exception.constructor) {
//       case QueryFailedError:
//         if ((exception as QueryFailedError).message.includes('UNIQUE')) {
//           const field = (exception as QueryFailedError).message.split('.')[1];

//           message = `The ${field} already exists`;
//           code = `${field}-exists`;
//           statusCode = HttpStatus.CONFLICT;
//         }
//         break;
//       case EntityNotFoundError:
//         console.log(exception);
//         break;
//       default:
//         console.log(exception);
//         break;
//     }

//     response.status(HttpStatus.BAD_REQUEST).json({
//       statusCode,
//       code,
//       message,
//       timestamp: moment().valueOf(),
//     });
//   }
// }
