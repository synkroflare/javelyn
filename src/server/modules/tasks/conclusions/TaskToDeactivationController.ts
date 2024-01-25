import { Lead, PrismaClient, Task } from "@prisma/client";
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
  client: {
    where: {};
    data: Lead;
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

export class TaskToTicketController {
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
    if (!data.task || (!data.lead && !data.client))
      throw new Error("Erro: dados insuficientes.");
    const task = this.client.task.update(data.task);
    const lead = data.lead ? this.client.lead.update(data.lead) : undefined;
    const client = data.client
      ? this.client.client.update(data.client)
      : undefined;

    if (lead) await this.client.$transaction([task, lead]);
    if (client) await this.client.$transaction([task, client]);

    return {
      meta: {
        message: "A tarefa foi finalizada e o cliente/lead foi desativado.",
        status: 200,
      },
      objects: [{ task }, { client }, { lead }],
    };
  }
}
