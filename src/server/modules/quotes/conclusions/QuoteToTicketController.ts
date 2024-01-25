import { Client, PrismaClient, Quote } from "@prisma/client";
import { Request, Response } from "express";
import { container, inject, injectable } from "tsyringe";
import { JavelynResponse } from "../../../../server/modules/leads/CreateLeadController";

type TRequest = {
  quotes: Quote[];
  ticket: {
    data: any;
    include?: any;
    skip?: any;
    take?: any;
  };
  lead: {
    where: {};
    data: {};
  };
  client: {
    where: {};
    create: Client;
    update: Client;
    include?: any;
    skip?: any;
    take?: any;
  };
  extra: {
    observation: string;
    userId: number;
    userName: string;
    companyId: number;
    taskDate: Date;
    returnTaskMap: Map<Date, any>;
  };
};

export class QuoteToTicketController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const taskToTicketUseCase = container.resolve(TaskToTicketUseCase);
      const taskToTicket = await taskToTicketUseCase.execute(data);

      return response.status(201).json(taskToTicket);
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
export class TaskToTicketUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    if (!data.quotes || !data.ticket || !data.client)
      throw new Error("Erro: dados insuficientes.");
    const quotes = await this.client.quote.findMany({
      where: {
        id: {
          in: data.quotes.map((quote) => quote.id),
        },
      },
      include: {
        tasks: true,
        client: true,
        lead: true,
      },
    });
    if (!quotes || quotes.length === 0)
      throw new Error("ERRO: não foi possível nenhum orçamento.");

    const prismaPromises: any[] = [];

    for (const quote of quotes) {
      if (quote.lead) {
        const updateLead = this.client.lead.update({
          where: {
            id: quote.lead.id,
          },
          data: {
            isConvertedToClient: true,
          },
        });
        prismaPromises.push(updateLead);
        break;
      }
    }

    const taskIds = quotes
      .map((quote) => quote.tasks.map((task) => task.id))
      .flat();

    const updateTasks = this.client.task.updateMany({
      where: {
        id: {
          in: taskIds,
        },
      },
      data: {
        statusHandled: true,
        handledAtDate: new Date(),
        conclusionCategory: "QUOTE-TO-TICKET",
        conclusion:
          "Esta tarefa foi finalizada automáticamente devido à venda realizada.",
      },
    });

    prismaPromises.push(updateTasks);

    const updateQuotes = this.client.quote.updateMany({
      where: {
        id: {
          in: data.quotes.map((quote) => quote.id),
        },
      },
      data: {
        statusAccomplished: true,
        statusAbsent: false,
      },
    });
    prismaPromises.push(updateQuotes);

    const client = await this.client.client.upsert(data.client);
    const ticket = await this.client.ticket.create({
      data: {
        ...data.ticket.data,
        clientName: client.name,
        clientId: client.id,
      },
      include: {
        procedures: true,
      },
    });

    const afterSellTask = this.client.task.create({
      data: {
        creatorId: data.extra.userId,
        companyId: data.extra.companyId,
        title: "PÓS-VENDA DE:" + client.name.toUpperCase(),
        body: data.extra.observation,
        category: "PÓS-VENDA",
        targetDate: new Date(data.extra.taskDate),
        targets: {
          connect: [{ id: client.id }],
        },
      },
    });
    prismaPromises.push(afterSellTask);

    for (const [key, procedures] of data.extra.returnTaskMap) {
      const returnTask = this.client.task.create({
        data: {
          companyId: data.extra.companyId,
          creatorId: data.extra.userId,
          title: "Retorno",
          body: `Esta task foi gerada automáticamente.
        No dia ${new Date().toLocaleDateString()}, ${
            client.name
          } comprou os seguintes procedimentos:
        ${procedures.map((p: any) => `${p.name}\n`)}
        Segundo recomendação de ${
          data.extra.userName
        }, deve-se entrar em contato para sugerir o retorno do cliente.      
        `,
          category: "RETORNO",
          targets: {
            connect: { id: client.id },
          },
          targetDate: new Date(key),
        },
      });

      prismaPromises.push(returnTask);
    }

    await this.client.$transaction(prismaPromises);

    return {
      meta: {
        message: "O orçamento foi convertido para um novo ticket de venda.",
        status: 200,
      },
      objects: [{ client }, { ticket }, { updateQuotes }],
    };
  }
}
