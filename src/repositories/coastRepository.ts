import { prismaClient } from '../lib/database'
import { Category } from '../generated/prisma/enums'
import { ListCoastQueryDTO } from '../schemas/coast.schema'

export type CreateCoastInput = {
  title: string
  description?: string
  amount: number
  date: Date
  category?: Category
  userId: string
}

export type UpdateCoastInput = {
  title?: string
  description?: string
  amount?: number
  date?: Date
  category?: Category
}

export type ListCoastFilters = {
  category?: Category
  startDate?: Date
  endDate?: Date
  page?: number
  pageSize?: number
}

export interface ICoastRepository {
  create(data: CreateCoastInput): Promise<ListCoastQueryDTO>
  findByIdAndUser(id: string, userId: string): Promise<ListCoastQueryDTO | null>
  listByUser(userId: string, filters: ListCoastFilters): Promise<ListCoastQueryDTO[]>
  updateByIdAndUser(
    id: string,
    userId: string,
    data: UpdateCoastInput,
  ): Promise<ListCoastQueryDTO | null>
  deleteByIdAndUser(id: string, userId: string): Promise<boolean>
}

export class CoastRepository implements ICoastRepository {
  async create(data: CreateCoastInput): Promise<ListCoastQueryDTO> {
    return prismaClient.coast.create({
      data: {
        title: data.title,
        description: data.description,
        amount: data.amount,
        date: data.date,
        category: data.category ?? Category.OTHERS,
        userId: data.userId,
      },
    })
  }

  async findByIdAndUser(id: string, userId: string): Promise<ListCoastQueryDTO | null> {
    return prismaClient.coast.findFirst({
      where: { id, userId },
    })
  }

  async listByUser(userId: string, filters: ListCoastFilters): Promise<ListCoastQueryDTO[]> {
    const where: { userId: string; category?: Category; date?: { gte?: Date; lte?: Date } } = {
      userId,
    }

    if (filters.category) where.category = filters.category
    if (filters.startDate || filters.endDate) {
      where.date = {}
      if (filters.startDate) where.date.gte = filters.startDate
      if (filters.endDate) where.date.lte = filters.endDate
    }

    const take = filters.pageSize ?? 10
    const page = filters.page ?? 1
    const skip = (page - 1) * take

    return prismaClient.coast.findMany({
      where,
      orderBy: { date: 'desc' },
      take,
      skip,
    })
  }

  async updateByIdAndUser(
    id: string,
    userId: string,
    data: UpdateCoastInput,
  ): Promise<ListCoastQueryDTO | null> {
    const found = await prismaClient.coast.findFirst({ where: { id, userId } })
    if (!found) return null

    return prismaClient.coast.update({
      where: { id },
      data,
    })
  }

  async deleteByIdAndUser(id: string, userId: string): Promise<boolean> {
    const found = await prismaClient.coast.findFirst({ where: { id, userId } })
    if (!found) return false

    await prismaClient.coast.delete({ where: { id } })
    return true
  }
}
