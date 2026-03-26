import { Response } from 'express'
import { CoastService } from '../services/coastService'
import { AuthRequest } from '../middlewares/auth'
import {
  CreateCoastDTO,
  UpdateCoastBodyDTO,
  ListCoastQueryDTO,
  GetCoastByIdParamsDTO,
  DeleteCoastParamsDTO,
} from '../schemas/coast.schema'
import logger from '../utils/logger'

export class CoastController {
  constructor(private coastService: CoastService) {
    this.createCoast = this.createCoast.bind(this)
    this.listCoasts = this.listCoasts.bind(this)
    this.getCoastById = this.getCoastById.bind(this)
    this.updateCoast = this.updateCoast.bind(this)
    this.deleteCoast = this.deleteCoast.bind(this)
  }

  async createCoast(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ message: 'Unauthorized' })

      const data = req.body as CreateCoastDTO
      const coast = await this.coastService.create(userId, data)

      return res.status(201).json(coast)
    } catch (error: unknown) {
      logger.error({ error }, '[CoastController.createCoast] Error')
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async listCoasts(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ message: 'Unauthorized' })

      const query = req.query as unknown as ListCoastQueryDTO

      const coasts = await this.coastService.list(userId, {
        category: query.category,
        period: query.period,
        startDate: query.startDate,
        endDate: query.endDate,
        page: query.page,
        pageSize: query.pageSize,
      })

      return res.status(200).json(coasts)
    } catch (error: unknown) {
      logger.error({ error }, '[CoastController.listCoasts] Error')
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async getCoastById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ message: 'Unauthorized' })

      const { id } = req.params as GetCoastByIdParamsDTO
      const coast = await this.coastService.getById(userId, id)

      if (!coast) {
        return res.status(404).json({ message: 'Coast not found' })
      }

      return res.status(200).json(coast)
    } catch (error: unknown) {
      logger.error({ error }, '[CoastController.getCoastById] Error')
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async updateCoast(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ message: 'Unauthorized' })

      const { id } = req.params as GetCoastByIdParamsDTO
      const data = req.body as UpdateCoastBodyDTO

      const updated = await this.coastService.update(userId, id, data)
      if (!updated) {
        return res.status(404).json({ message: 'Coast not found' })
      }

      return res.status(200).json(updated)
    } catch (error: unknown) {
      logger.error({ error }, '[CoastController.updateCoast] Error')
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async deleteCoast(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ message: 'Unauthorized' })

      const { id } = req.params as DeleteCoastParamsDTO
      const deleted = await this.coastService.delete(userId, id)

      if (!deleted) {
        return res.status(404).json({ message: 'Coast not found' })
      }

      return res.status(204).send()
    } catch (error: unknown) {
      logger.error({ error }, '[CoastController.deleteCoast] Error')
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
