import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { JavelynResponse } from "server/modules/leads/CreateLeadController";
import { container, inject, injectable } from "tsyringe";

type TRequest = {
  companyId: number;
};

export class GetRescuePanelDataController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const evaluationToAbsenceUseCase = container.resolve(
        GetRescuePanelDataUseCase
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
export class GetRescuePanelDataUseCase {
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
    const leadsWithoutAnswer = await this.prismaClient.lead.findMany({
      where: {
        companyId,
        statusTrashed: true,
        statusConverted: false,
        trashedReason: "SEM CONTATO/RESPOSTA",
      },
    });

    const activeDateTreshold = new Date();
    activeDateTreshold.setMonth(activeDateTreshold.getMonth() - 6);

    const inactiveClients = await this.prismaClient.client.findMany({
      where: {
        companyId,
        tickets: {
          every: {
            doneDate: {
              lt: activeDateTreshold,
            },
          },
        },
      },
    });

    const activeQuoteDateTreshold = new Date();
    activeQuoteDateTreshold.setMonth(activeQuoteDateTreshold.getMonth() - 1);

    const rescueQuotes = await this.prismaClient.quote.findMany({
      where: {
        companyId,
        createdAt: {
          lt: activeQuoteDateTreshold,
        },
        statusAccomplished: false,
      },
    });

    return {
      meta: {
        status: 200,
        message: "OK",
      },
      objects: {
        leadsWithoutAnswer,
        inactiveClients,
        rescueQuotes,
      },
    };
  }
}
