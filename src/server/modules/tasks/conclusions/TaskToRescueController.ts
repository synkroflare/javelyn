import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { container, inject, injectable } from "tsyringe";
import { JavelynResponse } from "../../../../server/modules/leads/CreateLeadController";

type TRequest = {
  targetType: "client" | "lead" | undefined;
  targetId: number;
  taskId: number;
  observation: string;
  reason: string;
};

export class TaskToRescueController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const taskToRescueUseCase = container.resolve(TaskToRescueUseCase);
      const taskToRescue = await taskToRescueUseCase.execute(data);

      return response.status(201).json(taskToRescue);
    } catch (error: any) {
      return response.status(400).send({
        meta: {
          message: error.message,
          status: 400,
        },
        objects: null,
      });
    }
  }
}

@injectable()
export class TaskToRescueUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute({
    observation,
    reason,
    targetId,
    targetType,
    taskId,
  }: TRequest): Promise<JavelynResponse> {
    if (!observation || !reason || !targetId || !targetType || !taskId)
      throw new Error("Erro: dados insuficientes.");

    if (targetType === "client") {
    } else {
      await this.client.lead.update({
        where: {
          id: targetId,
        },
        data: {
          statusRescue: true,
          trashedReason: reason,
          observation,
        },
      });
    }

    await this.client.task.update({
      where: {
        id: taskId,
      },
      data: {
        statusHandled: true,
        conclusion: reason,
        conclusionCategory: "TASK-TO-RESCUE",
      },
    });

    return {
      meta: {
        message:
          "A tarefa foi finalizada e o cliente/lead foi enviado para resgate.",
        status: 200,
      },
      objects: [],
    };
  }
}
