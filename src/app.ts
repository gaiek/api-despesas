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
        CreateExpenseDTO: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            amount: { type: 'number' },
            date: { type: 'string', format: 'date-time' },
            category: { type: 'string' },
          },
          required: ['title', 'amount', 'date'],
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
