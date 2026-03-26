import logger from '../utils/logger'
import { Category } from '../generated/prisma/enums'
import { ListCoastQueryDTO } from '../schemas/coast.schema'
import { ICoastRepository } from '../repositories/coastRepository'
import { Period } from '../types/period'

export type CreateCoastParams = {
  title: string
  description?: string
  amount: number
  date: Date
  category?: Category
}

export type UpdateCoastParams = {
  title?: string
  description?: string
  amount?: number
  date?: Date
  category?: Category
}

export type ListCoastParams = {
  category?: Category
  period?: Period
  startDate?: Date
  endDate?: Date
  page?: number
  pageSize?: number
}

export class CoastService {
  constructor(private coastRepository: ICoastRepository) {}

  async create(userId: string, data: CreateCoastParams): Promise<ListCoastQueryDTO> {
    return this.coastRepository.create({
      ...data,
      category: data.category ?? Category.OTHERS,
      userId,
    })
  }

  async getById(userId: string, id: string): Promise<ListCoastQueryDTO | null> {
    const coast = await this.coastRepository.findByIdAndUser(id, userId)
    if (!coast) {
      logger.info({ id, userId }, 'Coast not found')
      return null
    }
    return coast
  }

  async list(userId: string, params: ListCoastParams): Promise<ListCoastQueryDTO[]> {
    let queryStartDate = params.startDate
    let queryEndDate = params.endDate

    if (params.period && params.period !== 'CUSTOM') {
      const now = new Date()
      queryEndDate = now
      queryStartDate = new Date()

      switch (params.period) {
        case 'WEEK':
          queryStartDate.setDate(now.getDate() - 7)
          break
        case 'MONTH':
          queryStartDate.setMonth(now.getMonth() - 1)
          break
        case 'THREE_MONTHS':
          queryStartDate.setMonth(now.getMonth() - 3)
          break
      }
    }

    return this.coastRepository.listByUser(userId, {
      category: params.category,
      startDate: queryStartDate,
      endDate: queryEndDate,
      page: params.page,
      pageSize: params.pageSize,
    })
  }

  async update(
    userId: string,
    id: string,
    data: UpdateCoastParams,
  ): Promise<ListCoastQueryDTO | null> {
    const updated = await this.coastRepository.updateByIdAndUser(id, userId, data)
    if (!updated) {
      logger.info({ id, userId }, 'Coast not found for update')
      return null
    }
    return updated
  }

  async delete(userId: string, id: string): Promise<boolean> {
    return this.coastRepository.deleteByIdAndUser(id, userId)
  }
}
