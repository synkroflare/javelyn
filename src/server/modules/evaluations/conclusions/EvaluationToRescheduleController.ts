import { Evaluation, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { JavelynResponse } from "server/modules/leads/CreateLeadController";
import { container, inject, injectable } from "tsyringe";

type TRequest = {
  oldEvaluation: {
    where: Evaluation;
    data: Evaluation;
    include?: any;
    skip?: any;
    take?: any;
  };
  newEvaluation: {
    where: Evaluation;
    data: Evaluation;
    include?: any;
    skip?: any;
    take?: any;
  };
};

export class EvaluationToRescheduleController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const evaluationToRescheduleUseCase = container.resolve(
        EvaluationToRescheduleUseCase
      );
      const evaluationToReschedule =
        await evaluationToRescheduleUseCase.execute(data);

      return response.status(201).json(evaluationToReschedule);
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
export class EvaluationToRescheduleUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    if (!data.newEvaluation || !data.oldEvaluation)
      throw new Error("Erro: dados insuficientes.");

    const newEvaluation = await this.client.evaluation.create({
      data: data.newEvaluation.data,
    });

    const oldEvaluation = await this.client.evaluation.update({
      where: {
        id: data.oldEvaluation.where.id,
      },
      data: {
        handledAtDate: new Date(),
        statusAbsent: true,
        conclusionCategory: "EVALUATION-TO-RESCHEDULE",
        rescheduledEvaluation: {
          connect: {
            id: newEvaluation.id,
          },
        },
      },
    });

    const cancelAbsenceTasks = await this.client.task.updateMany({
      where: {
        OR: [
          {
            leadTargets: {
              some: {
                id: newEvaluation.leadId ?? 0,
              },
            },
          },
          {
            targets: {
              some: {
                id: newEvaluation.clientId ?? 0,
              },
            },
          },
        ],
        category: "FALTA",
      },
      data: {
        statusHandled: true,
        handledAtDate: new Date(),
        conclusionCategory: "TASK-TO-RESCHEDULE",
      },
    });

    return {
      meta: {
        message: "A avaliação foi convertida para uma nova avaliação.",
        status: 200,
      },
      objects: [],
    };
  }
}
