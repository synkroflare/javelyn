import { Client, Evaluation, Lead, PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { container, inject, injectable } from "tsyringe";
import { JavelynResponse } from "../../../../server/modules/leads/CreateLeadController";

type TRequest = {
  evaluation: {
    data: Evaluation & {
      lead?: Lead;
      client?: Client;
      creator?: User;
    };
    include?: any;
    skip?: any;
    take?: any;
  };
};

export class EvaluationToAbsenceController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const evaluationToAbsenceUseCase = container.resolve(
        EvaluationToAbsenceUseCase
      );
      const evaluationToAbsence = await evaluationToAbsenceUseCase.execute(
        data
      );

      return response.status(201).json(evaluationToAbsence);
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
export class EvaluationToAbsenceUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    if (!data.evaluation || !data.evaluation?.data?.id)
      throw new Error("Erro: dados insuficientes.");

    const evaluation =
      (data.evaluation.data.lead || data.evaluation.data.client) &&
      data.evaluation.data.creator
        ? data.evaluation.data
        : await this.client.evaluation.findUnique({
            where: {
              id: data.evaluation.data.id,
            },
            include: {
              client: {
                select: {
                  name: true,
                  responsibleUserId: true,
                },
              },
              lead: {
                select: {
                  name: true,
                  creatorId: true,
                },
              },
              creator: {
                select: {
                  name: true,
                },
              },
            },
          });
    if (!evaluation)
      return {
        meta: {
          message: "ERRO: Não foi possível encontrar a avaliação.",
          status: 400,
        },
        objects: null,
      };
    const targetId = evaluation.leadId ?? evaluation.clientId;

    if (!targetId)
      return {
        meta: {
          message: "ERRO: Não foi possível encontrar o ID do cliente/lead.",
          status: 400,
        },
        objects: null,
      };

    const targetName = evaluation.lead?.name ?? evaluation.client?.name;
    const targetType = evaluation.lead ? "leadTargets" : "targets";

    const taskDate = new Date();
    taskDate.setDate(taskDate.getDate() + 1);

    const targetUpdate = evaluation.lead
      ? this.client.lead.updateMany({
          where: {
            id: targetId,
          },
          data: {
            absences: {
              increment: 1,
            },
            leadStatus: "LEAD",
          },
        })
      : this.client.client.updateMany({
          where: {
            id: targetId,
          },
          data: {
            absences: {
              increment: 1,
            },
          },
        });

    const prismaOps = await this.client.$transaction([
      this.client.evaluation.update({
        where: {
          id: evaluation.id,
        },
        data: {
          handledAtDate: new Date(),
          statusAbsent: true,
        },
      }),
      targetUpdate,
      this.client.task.create({
        data: {
          companyId: evaluation.companyId,
          targetDate: taskDate,
          category: "FALTA",
          title: `Resgate de falta de avaliação`,
          body: `Esta task foi gerada automaticamente. \n\n ${targetName} faltou à uma avaliação marcada por ${
            evaluation.creator?.name
          } para ${evaluation.targetDate?.toLocaleString("pt-BR")}`,
          creatorId:
            evaluation.lead?.creatorId ??
            evaluation.client?.responsibleUserId ??
            evaluation.creatorId,
          [targetType]: {
            connect: {
              id: targetId,
            },
          },
        },
      }),
    ]);

    return {
      meta: {
        message:
          "A avaliação foi convertida para uma falta. Uma nova tarefa de falta foi gerada para amanhã.",
        status: 200,
      },
      objects: prismaOps,
    };
  }
}
