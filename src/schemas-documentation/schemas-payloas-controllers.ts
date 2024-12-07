export const registerUserSchemaSwagger = {
  type: 'object',
  properties: {
    name: { type: 'string', example: 'extra' },
    email: { type: 'string', format: 'email', example: 'extra@gmail.com' },
    password: { type: 'string', example: 'extra123' },
  },
  required: ['name', 'email', 'password'],
}

export const authenticateSchemaSwagger = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', example: 'extra@gmail.com' },
    password: { type: 'string', example: 'extra123' },
  },
  required: ['email', 'password'],
}

export const registerUrlSchemaSwagger = {
  type: 'object',
  properties: {
    url: { type: 'string', format: 'url', example: 'https://google.com.br' },
  },
  required: ['url'],
}

export const urlIdSchemaSwagger = {
  type: 'string',
  example: '"https://www.nova-url.com"',
}
