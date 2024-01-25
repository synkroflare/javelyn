import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { container, inject, injectable } from "tsyringe";
import { JavelynResponse } from "../leads/CreateLeadController";

type TRequest = {
  companyId: number;
};

export class GetQuoteRescuePanelDataController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const evaluationToAbsenceUseCase = container.resolve(
        GetQuoteRescuePanelDataUseCase
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
export class GetQuoteRescuePanelDataUseCase {
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

    const activeQuoteDateTreshold = new Date();
    activeQuoteDateTreshold.setMonth(activeQuoteDateTreshold.getMonth() - 1);
    const expiredQuotes = await this.prismaClient.quote.findMany({
      where: {
        companyId,
        createdAt: {
          lt: activeQuoteDateTreshold,
        },
        statusAccomplished: false,
        statusTrashed: false,
      },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
        client: {
          select: {
            name: true,
          },
        },
        lead: {
          select: {
            name: true,
          },
        },
      },
    });

    const quotesWithoutTasks = await this.prismaClient.quote.findMany({
      where: {
        companyId,
        statusAccomplished: false,
        statusTrashed: false,
        OR: [
          {
            tasks: {
              none: {
                id: {
                  gt: 0,
                },
              },
            },
          },
          {
            tasks: {
              every: {
                statusHandled: true,
              },
            },
          },
        ],
      },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
        client: {
          select: {
            name: true,
          },
        },
        lead: {
          select: {
            name: true,
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
        expiredQuotes,
        quotesWithoutTasks,
      },
    };
  }
}
