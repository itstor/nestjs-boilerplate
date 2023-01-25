import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule } from 'nestjs-redoc';

import { redocOptions } from '@/lib/config/configs/redoc.config';

//!STARTERCONFIG - Change this to your own config

export async function setupSwagger(app: INestApplication, path: string) {
  const config = new DocumentBuilder()
    .setTitle('NestJS Starter Docs')
    .setDescription('The NestJS Starter API description')
    .setContact(
      'Itstor',
      'https://www.github.com/itsor',
      'ahmdthoriq5@gmail.com',
    )
    .addServer(`http://localhost:8080`, 'Local Server')
    .setVersion('1.0')
    .addBearerAuth(undefined, 'Access Token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  await RedocModule.setup(path, app, document, redocOptions);
}
