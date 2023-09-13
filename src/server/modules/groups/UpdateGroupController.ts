import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { JavelynResponse } from "../leads/CreateLeadController"

export class UpdateGroupController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateGroupUseCase = container.resolve(UpdateGroupUseCase)
      const updateGroup = await updateGroupUseCase.execute(data)

      const jsonData = JSON.stringify(
        updateGroup,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonData)
    } catch (error: any) {
      return response.status(400).send({
        meta: {
          status: 400,
          message: error.message,
        },
        objects: null,
      })
    }
  }
}

@injectable()
export class UpdateGroupUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse> {
    const updateGroup = await this.client.group.update(data)
    return {
      meta: {
        status: 200,
        message: "Grupo atualizado com sucesso.",
      },
      objects: [updateGroup],
    }
  }
}
