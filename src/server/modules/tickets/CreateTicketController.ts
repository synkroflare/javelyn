import { Client, Prisma, PrismaClient, Quote, Task } from "@prisma/client";
import { Request, Response } from "express";
import { container, inject, injectable } from "tsyringe";
import { JavelynResponse } from "../leads/CreateLeadController";

type TCreateTicketParams = {
  id: number;
  isLead: boolean;
  companyId: number;
  doneDate: number;
  creatorUserId: number;
  proceduresIds: number[];
  proceduresData:
    | {
        id: number;
        name: string;
        value: number;
        returnDate?: Date;
      }[]
    | any;
  value: number;
  quoteIds: number[];
  evaluationId?: number;
  taskId?: number;
  salesChannel: string;
};

export class CreateTicketController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const createTicketUseCase = container.resolve(CreateTicketUseCase);
      const createTicket = await createTicketUseCase.execute(data);

      return response.status(201).json(createTicket);
    } catch (error: any) {
      return response.status(400).send({
        meta: {
          status: 200,
          message: error.message,
        },
        objects: null,
      });
    }
  }
}

@injectable()
export class CreateTicketUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute({
    companyId,
    creatorUserId,
    taskId,
    doneDate,
    id,
    isLead,
    evaluationId,
    proceduresData,
    proceduresIds,
    quoteIds,
    value,
    salesChannel,
  }: TCreateTicketParams): Promise<JavelynResponse> {
    let client: Client | null;

    if (isLead) {
      const lead = await this.client.lead.findUnique({
        where: {
          id,
        },
      });
      if (!lead) throw new Error("Lead not found");
      const clientPromise = this.client.client.upsert({
        where: {
          companyId_name: {
            companyId: companyId,
            name: lead.name,
          },
        },
        update: {},
        create: {
          name: lead.name,
          companyId: lead.companyId,
          responsibleUserId: lead.creatorId,
          CPF: lead.CPF,
          phone: lead.phone,
          mail: lead.mail,
          age: lead.age,
          zipCode: lead.zipCode,
          houseNumber: lead.houseNumber,
          profession: lead.profession,
          birthday: lead.birthday,
        },
      });
      const leadPromise = this.client.lead.update({
        where: {
          id,
        },
        data: {
          isConvertedToClient: true,
        },
      });

      const [createdClient, _] = await this.client.$transaction([
        clientPromise,
        leadPromise,
      ]);
      client = createdClient;
    } else {
      client = await this.client.client.findUnique({
        where: {
          id,
        },
      });
    }

    if (!client) throw new Error(`No client found`);

    const createTicket = await this.client.ticket.create({
      data: {
        creatorUserId,
        companyId,
        value,
        procedures: {
          connect: proceduresIds.map((id) => {
            return {
              id,
            };
          }),
        },
        proceduresData,
        doneDate: new Date(doneDate),
        clientName: client.name,
        type: "",
        salesChannel,
      },
    });

    if (evaluationId) {
      await this.client.evaluation.update({
        where: {
          id: evaluationId,
        },
        data: {
          statusAccomplished: true,
          handledAtDate: new Date(),
          conclusionCategory: "EVALUATION-TO-TICKET",
        },
      });
    }

    if (taskId) {
      await this.client.task.update({
        where: {
          id: taskId,
        },
        data: {
          statusHandled: true,
          handledAtDate: new Date(),
          conclusionCategory: "TASK-TO-TICKET",
        },
      });
    }

    const quotePromises: Prisma.Prisma__QuoteClient<Quote, never>[] = [];

    for (const quoteId of quoteIds) {
      const quotePromise = this.client.quote.update({
        where: {
          id: quoteId,
        },
        data: {
          handledAtDate: new Date(),
          statusAccomplished: true,
          tasks: {
            updateMany: {
              where: {},
              data: {
                statusHandled: true,
                conclusion:
                  "Tarefa finalizada automaticamente devido ao registro de uma venda.",
                conclusionCategory: "QUOTE-TO-TICKET",
              },
            },
          },
        },
      });
      quotePromises.push(quotePromise);
    }

    await this.client.$transaction(quotePromises);

    const returnTaskMap = new Map<Date, any>([]);
    for (const procedure of proceduresData) {
      if (!procedure.returnDate) continue;
      returnTaskMap.set(
        procedure.returnDate,
        [
          [
            ...(returnTaskMap.get(procedure.returnDate) ?? []),
            {
              name: procedure.name,
            },
          ],
        ].flat()
      );
    }

    const taskCreatePromises: Prisma.Prisma__TaskClient<Task, never>[] = [];
    for (const [key, procedures] of returnTaskMap) {
      const taskCreate = this.client.task.create({
        data: {
          companyId: companyId,
          creatorId: creatorUserId,
          title: "Retorno",
          body: `Esta task foi gerada automáticamente.
        No dia ${new Date().toLocaleDateString()}, ${
            client.name
          } comprou os seguintes procedimentos:
        ${procedures.map((p: any) => `${p.name}\n`)}
        Deve-se entrar em contato para sugerir o retorno do cliente.      
        `,
          category: "RETORNO",
          targets: {
            connect: { id: client.id },
          },
          targetDate: new Date(key),
        },
      });
      taskCreatePromises.push(taskCreate);
    }

    const returnTasks = await this.client.$transaction(taskCreatePromises);

    return {
      meta: {
        status: 200,
        message: "Ticket criado com sucesso!",
      },
      objects: [createTicket],
    };
  }
}
