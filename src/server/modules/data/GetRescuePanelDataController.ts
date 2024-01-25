import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { container, inject, injectable } from "tsyringe";
import { JavelynResponse } from "../../../server/modules/leads/CreateLeadController";

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

    const rescueLeads = await this.prismaClient.lead.findMany({
      where: {
        companyId,
        statusRescue: true,
        statusTrashed: false,
        isConvertedToClient: false,
      },
      select: {
        id: true,
        trashedReason: true,
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
    const leadsOther = rescueLeads.filter((l) => l.trashedReason === "OUTRO");

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
      select: {
        id: true,
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
        statusTrashed: false,
      },
      select: {
        id: true,
      },
    });

    return {
      meta: {
        status: 200,
        message: "OK",
      },
      objects: {
        leads: {
          withoutAnswer: leadsWithoutAnswer.length,
          withoutInterest: leadsWithoutInterest.length,
          counter: leadsCounter.length,
          problem: leadsProblem.length,
          other: leadsOther.length,
          all: rescueLeads.length,
        },
        inactiveClients: inactiveClients.length,
        rescueQuotes: rescueQuotes.length,
      },
    };
  }
}
