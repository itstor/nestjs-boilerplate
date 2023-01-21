import { RedocOptions } from 'nestjs-redoc';

export const redocOptions: RedocOptions = {
  title: 'NestJS Starter Docs',
  logo: {
    backgroundColor: '#F0F0F0',
    altText: 'NestJS Starter',
  },
  sortPropsAlphabetically: true,
  hideDownloadButton: false,
  hideHostname: false,
  redocVersion: 'latest',
};
