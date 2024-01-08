import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import fs from "fs";
import { rimraf } from "rimraf";
import { container, inject, injectable } from "tsyringe";
import { Client } from "whatsapp-web.js";
import { JavelynResponse } from "../leads/CreateLeadController";

export class ShutdownConnectionsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const shutdownConnectionUseCase = container.resolve(
        ShutdownConnectionsUseCase
      );
      const shutdownConnection = await shutdownConnectionUseCase.execute(data);

      return response.status(201).json(shutdownConnection);
    } catch (error: any) {
      return response.status(400).send(error.message);
    }
  }
}

@injectable()
export class ShutdownConnectionsUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse> {
    if (!data?.where?.id)
      return {
        meta: {
          status: 400,
          message: "ERRO: Dados insuficientes.",
        },
        objects: null,
      };
    const company = await this.client.company.findFirst({
      where: {
        id: data.where.id,
      },
      include: {
        users: true,
      },
    });

    if (!company)
      return {
        meta: {
          status: 400,
          message: "ERRO: não foi possível encontrar 'company'.",
        },
        objects: null,
      };

    for (const user of company.users) {
      const directoryPath =
        "/home/ec2-user/javelyn/.wwebjs_auth/session-zapClient-" + user.id;

      if (fs.existsSync(directoryPath)) {
        try {
          await rimraf(directoryPath, {});
        } catch (err) {
          console.error("Erro ao excluir a pasta:", err);
        }
      }

      if (!container.isRegistered("zapClient-" + user.id)) continue;
      const zapClient = container.resolve<Client>("zapClient-" + user.id);
      console.log({ zapClient });
      if (zapClient.pupBrowser) {
        console.log("shutting down pupbrowser for zapClient-" + user.id);
        await zapClient.pupBrowser.close();
      } else if (zapClient.pupPage) {
        console.log("shutting down puppage for zapClient-" + user.id);
        await zapClient.pupPage.close();
      } else {
        console.log("no pup. skipping for zapClient-" + user.id);
      }

      container.registerInstance<string>(
        "zapClient-" + user.id,
        "disconnected"
      );
    }

    await this.client.company.update({
      where: {
        id: company.id,
      },
      data: {
        whatsappFreeSlots: company.whatsappSlots,
        users: {
          updateMany: {
            where: {},
            data: {
              zapStatus: "disconnected",
            },
          },
        },
      },
    });

    return {
      meta: {
        status: 200,
        message: "Todas as conexões foram encerradas.",
      },
      objects: null,
    };
  }
}
