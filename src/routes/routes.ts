import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import { UserController } from '../controllers/userController'
import { UserService } from '../services/userService'
import { CoastRepository } from '../repositories/coastRepository'
import { CoastService } from '../services/coastService'
import { CoastController } from '../controllers/coastController'
import { authenticate } from '../middlewares/auth'
import { validate } from '../middlewares/validate'
import { createUserSchema, loginUserSchema } from '../schemas/user.schema'
import {
  createCoastSchema,
  updateCoastSchema,
  listCoastSchema,
  getListCoastByIdSchema,
  deleteCoastSchema,
} from '../schemas/coast.schema'
const userService = new UserService()
const authController = new AuthController(userService)
const userController = new UserController(userService)

const coastRepository = new CoastRepository()
const coastService = new CoastService(coastRepository)
const coastController = new CoastController(coastService)

const routes = Router()

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Retorna as informações do usuário autenticado
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sucesso. Retorna as informações do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
routes.get('/me', authenticate, userController.getMe)

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDTO'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       409:
 *         description: Email já em uso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
routes.post('/auth/register', validate(createUserSchema), authController.register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login de um usuário existente
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserDTO'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
routes.post('/auth/login', validate(loginUserSchema), authController.login)

/**
 * @swagger
 * /coasts:
 *   post:
 *     summary: Cria uma nova despesa
 *     tags:
 *       - Coast
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCoastDTO'
 *           examples:
 *             food:
 *               summary: Categoria FOOD
 *               value:
 *                 title: "Mercado"
 *                 description: "Compras da semana"
 *                 category: "FOOD"
 *                 amount: 120.5
 *                 date: "2026-03-26T12:00:00.000Z"
 *             health:
 *               summary: Categoria HEALTH
 *               value:
 *                 title: "Farmacia"
 *                 description: "Remedios"
 *                 category: "HEALTH"
 *                 amount: 89.9
 *                 date: "2026-03-26T12:00:00.000Z"
 *             hygiene:
 *               summary: Categoria HYGIENE
 *               value:
 *                 title: "Higiene"
 *                 description: "Itens pessoais"
 *                 category: "HYGIENE"
 *                 amount: 45
 *                 date: "2026-03-26T12:00:00.000Z"
 *             rental:
 *               summary: Categoria RENTAL
 *               value:
 *                 title: "Aluguel"
 *                 description: "Apartamento"
 *                 category: "RENTAL"
 *                 amount: 900
 *                 date: "2026-03-26T12:00:00.000Z"
 *             internet:
 *               summary: Categoria INTERNET
 *               value:
 *                 title: "Internet"
 *                 description: "Plano mensal"
 *                 category: "INTERNET"
 *                 amount: 99.9
 *                 date: "2026-03-26T12:00:00.000Z"
 *             water:
 *               summary: Categoria WATER
 *               value:
 *                 title: "Conta de agua"
 *                 description: "Mensal"
 *                 category: "WATER"
 *                 amount: 60
 *                 date: "2026-03-26T12:00:00.000Z"
 *             energy:
 *               summary: Categoria ENERGY
 *               value:
 *                 title: "Conta de luz"
 *                 description: "Mensal"
 *                 category: "ENERGY"
 *                 amount: 150
 *                 date: "2026-03-26T12:00:00.000Z"
 *             entertainment:
 *               summary: Categoria ENTERTAINMENT
 *               value:
 *                 title: "Cinema"
 *                 description: "Lazer"
 *                 category: "ENTERTAINMENT"
 *                 amount: 70
 *                 date: "2026-03-26T12:00:00.000Z"
 *             others:
 *               summary: Categoria OTHERS
 *               value:
 *                 title: "Outros"
 *                 description: "Despesa diversa"
 *                 category: "OTHERS"
 *                 amount: 30
 *                 date: "2026-03-26T12:00:00.000Z"
 *     responses:
 *       201:
 *         description: Despesa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coast'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
routes.post('/coasts', authenticate, validate(createCoastSchema), coastController.createCoast)

/**
 * @swagger
 * /coasts:
 *   get:
 *     summary: Lista despesas do usuário com filtros e paginação
 *     tags:
 *       - Coast
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [FOOD, HEALTH, HYGIENE, RENTAL, INTERNET, WATER, ENERGY, ENTERTAINMENT, OTHERS]
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [WEEK, MONTH, THREE_MONTHS, CUSTOM]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coast'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
routes.get('/coasts', authenticate, validate(listCoastSchema), coastController.listCoasts)

/**
 * @swagger
 * /coasts/{id}:
 *   get:
 *     summary: Retorna uma despesa pelo ID
 *     tags:
 *       - Coast
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Despesa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coast'
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Despesa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
routes.get(
  '/coasts/:id',
  authenticate,
  validate(getListCoastByIdSchema),
  coastController.getCoastById,
)

/**
 * @swagger
 * /coasts/{id}:
 *   put:
 *     summary: Atualiza uma despesa
 *     tags:
 *       - Coast
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCoastDTO'
 *     responses:
 *       200:
 *         description: Despesa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coast'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Despesa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
routes.put('/coasts/:id', authenticate, validate(updateCoastSchema), coastController.updateCoast)

/**
 * @swagger
 * /coasts/{id}:
 *   delete:
 *     summary: Remove uma despesa
 *     tags:
 *       - Coast
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Despesa removida com sucesso
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Despesa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
routes.delete('/coasts/:id', authenticate, validate(deleteCoastSchema), coastController.deleteCoast)

export default routes
