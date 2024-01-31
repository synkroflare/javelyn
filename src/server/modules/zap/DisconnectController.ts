import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Socket } from "socket.io";
import { container, inject, injectable } from "tsyringe";
import { Client } from "whatsapp-web.js";
import { JavelynResponse } from "../leads/CreateLeadController";

export class DisconnectController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const disconnectUseCase = container.resolve(DisconnectUseCase);
      const disconnect = await disconnectUseCase.execute(data);

      return response.status(201).json(disconnect);
    } catch (error: any) {
      return response.status(400).send(error.message);
    }
  }
}

@injectable()
export class DisconnectUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse> {
    if (!data?.where?.id) throw new Error("ERRO: Dados insuficientes.");
    console.log(`#${data.where.id} is disconecting from javelyn-zap`);
    const user = await this.client.user.findFirst({
      where: {
        id: data.where.id,
      },
      include: {
        company: true,
      },
    });

    if (!user) throw new Error("ERRO: não foi possível encontrar 'user'.");

    if (!container.isRegistered("zapClient-" + user.id))
      return {
        meta: {
          status: 200,
          message: "Não está conectado.",
        },
        objects: null,
      };

    const zapClient = container.resolve<Client | string>(
      "zapClient-" + user.id
    );
    if (typeof zapClient === "string")
      return {
        meta: {
          status: 200,
          message: "Não está conectado.",
        },
        objects: null,
      };

    const state = await zapClient.getState();

    if (!zapClient.pupBrowser)
      return {
        meta: {
          status: 200,
          message: "Não está conectado.",
        },
        objects: null,
      };

    if (state === "CONNECTED") {
      console.log("h1");
      await zapClient.pupBrowser.close();
    } else {
      console.log("h2");
      zapClient.removeAllListeners();
      zapClient.pupBrowser.close();
    }

    await this.client.$transaction([
      this.client.company.update({
        where: {
          id: user.company.id,
        },
        data: {
          whatsappFreeSlots: {
            increment: 1,
          },
        },
      }),
      this.client.user.update({
        where: {
          id: user.id,
        },
        data: {
          zapStatus: "disconnected",
        },
      }),
    ]);

    container.registerInstance("zapClient-" + user.id, "disconnected");
    const socket = container.resolve<Socket>("SocketServer");
    socket.to(`ws-solo-room-${user.id}`).emit("client-disconnected");

    return {
      meta: {
        status: 200,
        message: "Foi desconectado.",
      },
      objects: null,
    };
  }
}
