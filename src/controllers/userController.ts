import { Response } from 'express'
import { UserService } from '../services/userService'
import { AuthRequest } from '../middlewares/auth'
import logger from '../utils/logger'

export class UserController {
  constructor(private userService: UserService) {
    this.getMe = this.getMe.bind(this)
  }

  async getMe(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id
      const user = await this.userService.getUserbyId(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      return res.status(200).json(user)
    } catch (error: unknown) {
      logger.error({ err: error }, '[UserController.getMe] Error')
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
