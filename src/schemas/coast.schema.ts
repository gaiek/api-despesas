import { Category } from '../generated/prisma/enums'
import { periodEnum } from '../types/period'
import { z } from 'zod'

export const createCoastSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    category: z.nativeEnum(Category).optional(),
    amount: z.number(),
    date: z.coerce.date(),
  }),
})

export type CreateCoastDTO = z.infer<typeof createCoastSchema>['body']

export const updateCoastSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional(),
    amount: z.number().optional(),
    date: z.coerce.date().optional(),
    category: z.nativeEnum(Category).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
})

export type UpdateCoastBodyDTO = z.infer<typeof updateCoastSchema>['body']
export type UpdateCoastParamsDTO = z.infer<typeof updateCoastSchema>['params']

export const listCoastSchema = z.object({
  query: z
    .object({
      category: z.nativeEnum(Category).optional(),
      period: periodEnum.optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      pageSize: z
        .string()
        .regex(/^\d+$/)
        .transform(Number)
        .pipe(z.number().int().positive())
        .optional(),
      page: z
        .string()
        .regex(/^\d+$/)
        .transform(Number)
        .pipe(z.number().int().positive())
        .optional(),
    })
    .superRefine((query, ctx) => {
      if (query.period === 'CUSTOM') {
        if (!query.startDate || !query.endDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'startDate e endDate são obrigatórios quando period=CUSTOM',
            path: ['startDate'],
          })
        }
      }
      if (query.startDate && query.endDate && query.startDate > query.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'startDate não pode ser maior que endDate',
          path: ['startDate'],
        })
      }
    }),
})

export type ListCoastQueryDTO = z.infer<typeof listCoastSchema>['query']

export const getListCoastByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
})

export type GetCoastByIdParamsDTO = z.infer<typeof getListCoastByIdSchema>['params']

export const deleteCoastSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
})

export type DeleteCoastParamsDTO = z.infer<typeof deleteCoastSchema>['params']
