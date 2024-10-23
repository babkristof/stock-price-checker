import swaggerJsDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Stock Price Checker API',
    version: '1.0.0',
    description: 'A simple API to fetch stock data and calculate moving averages',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsDoc(options);

export const generateOpenApiSpec = () => {
  const outputPath = path.resolve(__dirname, '../../docs/openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));
  console.log(`OpenAPI spec written to ${outputPath}`);
};

generateOpenApiSpec();