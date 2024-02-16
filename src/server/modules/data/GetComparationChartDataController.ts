import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { container, inject, injectable } from "tsyringe";
import { JavelynResponse } from "../leads/CreateLeadController";

type TRequest = {
  companyId: number;
  startDate: Date;
  endDate: Date;
  select: {
    leads: boolean;
    tickets: boolean;
    evaluations: boolean;
  };
};

export class GetComparationChartDataController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const chartDataUseCase = container.resolve(
        GetComparationChartDataUseCase
      );
      const chartData = await chartDataUseCase.execute(data);

      return response.status(201).json(chartData);
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
export class GetComparationChartDataUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly prismaClient: PrismaClient
  ) {}

  async execute({
    companyId,
    startDate,
    endDate,
    select,
  }: TRequest): Promise<JavelynResponse> {
    if (!companyId || !startDate || !endDate)
      return {
        meta: {
          message: "Parâmetros inválidos.",
          status: 400,
        },
        objects: null,
      };

    const leads = select.leads
      ? await this.prismaClient.lead.findMany({
          where: {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
          select: {
            id: true,
            createdAt: true,
          },
        })
      : null;

    const tickets = select.tickets
      ? await this.prismaClient.ticket.findMany({
          where: {
            doneDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
          select: {
            id: true,
            doneDate: true,
            value: true,
          },
        })
      : null;

    const evaluations = select.evaluations
      ? await this.prismaClient.evaluation.findMany({
          where: {
            targetDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
          select: {
            id: true,
            createdAt: true,
          },
        })
      : null;

    return {
      meta: {
        message: "Dados obtidos.",
        status: 200,
      },
      objects: {
        leads,
        tickets,
        evaluations,
      },
    };
  }
}
