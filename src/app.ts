import express from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import routes from './routes/routes'

const app = express()

const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'API de Despesas',
      version: '1.0.0',
      description: 'API para gerenciar despesas',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        CreateUserDTO: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
          required: ['name', 'email', 'password'],
        },
        LoginUserDTO: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
          required: ['email', 'password'],
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
          },
          required: ['id', 'name', 'email'],
        },
        Coast: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            amount: { type: 'number' },
            date: { type: 'string', format: 'date-time' },
            category: {
              type: 'string',
              enum: [
                'FOOD',
                'HEALTH',
                'HYGIENE',
                'RENTAL',
                'INTERNET',
                'WATER',
                'ENERGY',
                'ENTERTAINMENT',
                'OTHERS',
              ],
            },
            userId: { type: 'string', format: 'uuid' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: [
            'id',
            'title',
            'amount',
            'date',
            'category',
            'userId',
            'created_at',
            'updated_at',
          ],
        },
        CreateCoastDTO: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 2 },
            description: { type: 'string' },
            category: {
              type: 'string',
              enum: [
                'FOOD',
                'HEALTH',
                'HYGIENE',
                'RENTAL',
                'INTERNET',
                'WATER',
                'ENERGY',
                'ENTERTAINMENT',
                'OTHERS',
              ],
            },
            amount: { type: 'number' },
            date: { type: 'string', format: 'date-time' },
          },
          required: ['title', 'amount', 'date'],
        },
        UpdateCoastDTO: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 2 },
            description: { type: 'string' },
            amount: { type: 'number' },
            date: { type: 'string', format: 'date-time' },
            category: {
              type: 'string',
              enum: [
                'FOOD',
                'HEALTH',
                'HYGIENE',
                'RENTAL',
                'INTERNET',
                'WATER',
                'ENERGY',
                'ENTERTAINMENT',
                'OTHERS',
              ],
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
          required: ['message'],
        },
      },
    },
  },
  apis: ['./src/routes/routes.ts'],
}

app.use(express.json())

const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(routes)

export default app
