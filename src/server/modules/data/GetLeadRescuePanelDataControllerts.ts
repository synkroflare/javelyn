import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { container, inject, injectable } from "tsyringe";
import { JavelynResponse } from "../leads/CreateLeadController";

type TRequest = {
  companyId: number;
};

export class GetLeadRescuePanelDataController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const evaluationToAbsenceUseCase = container.resolve(
        GetLeadRescuePanelDataUseCase
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
export class GetLeadRescuePanelDataUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly prismaClient: PrismaClient
  ) {}

  async execute({ companyId }: TRequest): Promise<JavelynResponse> {
    if (!companyId)
      return {
        meta: {
          status: 401,
          message: "Dados fornecidos são insuficientes.",
        },
        objects: [],
      };
    const rescueLeads = await this.prismaClient.lead.findMany({
      where: {
        companyId,
        statusRescue: true,
        statusTrashed: false,
        isConvertedToClient: false,
      },
      include: {
        targetedTasks: true,
        creator: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    const leadsWithoutAnswer = rescueLeads.filter(
      (l) => l.trashedReason === "SEM CONTATO/RESPOSTA"
    );
    const leadsWithoutInterest = rescueLeads.filter(
      (l) => l.trashedReason === "SEM INTERESSE"
    );
    const leadsCounter = rescueLeads.filter(
      (l) => l.trashedReason === "CONTRAINDICACAO"
    );
    const leadsProblem = rescueLeads.filter(
      (l) => l.trashedReason === "LEAD PROBLEMATICO"
    );
    const others = rescueLeads.filter((l) => l.trashedReason === "OUTRO");

    const leadsWithoutTask = await this.prismaClient.lead.findMany({
      where: {
        companyId,
        isConvertedToClient: false,
        statusTrashed: false,
        OR: [
          {
            targetedTasks: {
              none: {
                id: {
                  gt: 0,
                },
              },
            },
          },
          {
            targetedTasks: {
              every: {
                statusHandled: true,
              },
            },
          },
        ],
      },
      include: {
        targetedTasks: true,
        creator: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return {
      meta: {
        status: 200,
        message: "OK",
      },
      objects: {
        leadsWithoutAnswer,
        leadsWithoutInterest,
        leadsCounter,
        leadsProblem,
        others,
        all: rescueLeads,

        leadsWithoutTask,
      },
    };
  }
}
