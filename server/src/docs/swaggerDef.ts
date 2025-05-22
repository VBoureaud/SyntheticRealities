import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import config from '../config';

// Load components from YAML file
const componentsPath = path.join(__dirname, 'components.yml');
const components = yaml.load(fs.readFileSync(componentsPath, 'utf8'));

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'SyntheticRealities API',
        version: '1.0.0',
        description: 'API documentation for SyntheticRealities',
      },
      servers: [
        {
          url: `http://localhost:${config.port}`,
        },
      ],
      ...components, // Merge components from YAML
    },
    apis: ['./src/routes/**/*.ts'], // Path to the API docs
  };

  export default swaggerOptions;