import { Evaluation, Lead, PrismaClient, Task } from "@prisma/client";
import { Request, Response } from "express";
import { container, inject, injectable } from "tsyringe";
import { JavelynResponse } from "../../../../server/modules/leads/CreateLeadController";

type TRequest = {
  task: {
    where: {};
    data: Task;
    include?: any;
    skip?: any;
    take?: any;
  };
  evaluation: {
    where: {};
    data: Evaluation;
    include?: any;
    skip?: any;
    take?: any;
  };
  newEvaluation: {
    data: Evaluation;
    include?: any;
    skip?: any;
    take?: any;
  };
  lead: {
    where: {};
    data: Lead;
    include?: any;
    skip?: any;
    take?: any;
  };
};

export class TaskToEvaluationRescheduleController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const taskToEvaluationUseCase = container.resolve(
        TaskToEvaluationUseCase
      );
      const taskToEvaluation = await taskToEvaluationUseCase.execute(data);

      return response.status(201).json(taskToEvaluation);
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
export class TaskToEvaluationUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    if (
      !data.task ||
      !data.evaluation ||
      !data.newEvaluation ||
      !data.newEvaluation.data.companyId
    )
      throw new Error("Erro: dados insuficientes.");
    const task = await this.client.task.update(data.task);
    const newEvaluation = await this.client.evaluation.create(
      data.newEvaluation
    );
    const lead = data.lead
      ? await this.client.lead.update(data.lead)
      : undefined;

    const { clientId, leadId } = newEvaluation;

    const updatedEvaluations = await this.client.evaluation.updateMany({
      where: {
        statusAbsent: true,
        rescheduledEvaluationId: null,
        clientId: clientId ?? undefined,
        leadId: leadId ?? undefined,
        companyId: newEvaluation.companyId,
      },
      data: {
        rescheduledEvaluationId: newEvaluation.id,
      },
    });

    return {
      meta: {
        message: "A tarefa foi convertida para uma nova avaliação.",
        status: 200,
      },
      objects: [{ task }, { evaluation: newEvaluation }, { lead }],
    };
  }
}
