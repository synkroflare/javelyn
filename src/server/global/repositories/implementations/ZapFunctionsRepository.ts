import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
import { container, inject, injectable } from "tsyringe";
import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js";
import { IZapRepository, THandleConnectionData } from "../IZapRepository";

@injectable()
export class ZapFunctionsRepository implements IZapRepository {
  constructor(
    @inject("PrismaClient")
    private readonly prismaClient: PrismaClient
  ) {}

  async sendMessage(formData: any): Promise<string> {
    const data = JSON.parse(formData.data);
    try {
      const zapClient = container.resolve<Client>("zapClient-" + data.userId);
      const status = await zapClient.getState();
      if (status === null) {
        return "No connection";
      }

      if (!data.clientsData || data.clientsData.length === 0) {
        if (data.phoneNumbers) {
          for (let i = 0; i < data.phoneNumbers.length; i++) {
            if (data.phoneNumbers[i].toString().length < 8) {
              console.log("Invalid phone number: " + data.phoneNumbers[i]);
              continue;
            }

            if (formData.file) {
              const imageBuffer = Buffer.from(formData.file.buffer, "base64");
              const media = new MessageMedia(
                formData.file.mimetype,
                imageBuffer.toString("base64")
              );

              await zapClient.sendMessage(
                `55${data.phoneNumbers[i].toString().trim()}@c.us`,
                data.message,
                {
                  media,
                }
              );
              console.log(
                "Sending message with no cdata to: " + data.phoneNumbers[i]
              );
              await new Promise((resolve) => setTimeout(resolve, 1000)); ///// WAITS FOR 1 SECOND TO PREVENT WHATSAPP BUG FOR SENDING TOO MANY MSGS
            } else {
              await zapClient.sendMessage(
                `55${data.phoneNumbers[i].toString().trim()}@c.us`,
                data.message
              );
              console.log(
                "Sending message with no cdata to: " + data.phoneNumbers[i]
              );
              await new Promise((resolve) => setTimeout(resolve, 1000)); ///// WAITS FOR 1 SECOND TO PREVENT WHATSAPP BUG FOR SENDING TOO MANY MSGS
            }
          }
          return "Messages sent successfully, without client data.";
        }
        return "No client data provided.";
      }

      const imageBuffer = formData.file
        ? Buffer.from(formData.file.buffer, "base64")
        : null;
      const media = imageBuffer
        ? new MessageMedia(
            formData.file.mimetype,
            imageBuffer.toString("base64")
          )
        : null;

      for (let i = 0; i < data.clientsData.length; i++) {
        if (
          !data.clientsData[i].phone ||
          typeof data.clientsData[i].phone !== "string"
        ) {
          console.log(
            "No phone provided for client: " + data.clientsData[i].name
          );
          continue;
        }
        const name = data.clientsData[i].name.split(" ")[0].toLowerCase();
        const formatedName = name.charAt(0).toUpperCase() + name.slice(1);
        const format1 = data.message.replace("$[NOME]", formatedName);
        const format2 = format1.replace(
          "$[LINK CADASTRO]",
          "http://localhost:3000/register?id=" +
            data.clientsData[i].id +
            "&uuid=" +
            data.clientsData[i].uuid
        );

        if (data.clientsData[i].phone!.length < 8) {
          console.log("Invalid phone number: " + data.phoneNumbers[i]);
          continue;
        }

        if (data.clientsData[i].phone) {
          if (media)
            await zapClient.sendMessage(
              `55${data.phoneNumbers[i].toString().trim()}@c.us`,
              data.message,
              {
                media,
              }
            );
          else
            await zapClient.sendMessage(
              `55${data.clientsData[i].phone?.toString().trim()}@c.us`,
              format1
            );
          console.log("Sending message to: " + data.clientsData[i].phone);
        }

        try {
          await this.prismaClient.throw.create({
            data: {
              companyId: data.companyId,
              targetsIds: [data.clientsData[i].id],
              creatorId: data.userId,
              body: data.message,
            },
          });
        } catch (e: any) {
          console.log(e.message);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)); ///// WAITS FOR 1 SECOND TO PREVENT WHATSAPP BUG FOR SENDING TOO MANY MSGS
      }

      const clientIds = data.clientsData.map((client) => client.id);
      const todayDate = new Date();

      await this.prismaClient.client.updateMany({
        where: {
          id: {
            in: clientIds,
          },
        },
        data: {
          javelynContactAttemptsDates: {
            push: todayDate,
          },
        },
      });

      return "messages sent successfully";
    } catch (error: any) {
      console.log(error);
      return error.message;
    }
  }

  async handleConnection(
    data: THandleConnectionData
  ): Promise<{ isConnected: boolean; qrCode: string; message?: string }> {
    const user = await this.prismaClient.user.findUnique({
      where: {
        id: data.userId,
      },
      include: {
        company: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!user)
      return {
        isConnected: false,
        qrCode: "",
      };

    if (user.company.whatsappFreeSlots === 0)
      return {
        isConnected: false,
        qrCode: "",
        message: `Todas as vagas de conexão ao whatsapp estão ocupadas nessa unidade.`,
      };

    const check = container.isRegistered<Client | string>(
      "zapClient-" + user.id
    );
    const clientCheck = check
      ? container.resolve("zapClient-" + user.id)
      : undefined;

    if (!check || clientCheck === "disconnected") {
      const client = new Client({
        authStrategy: new LocalAuth({ clientId: "zapClient-" + user.id }),
        puppeteer: {
          args: ["--no-sandbox"],
          headless: true,
        },
      });
      container.registerInstance<Client>("zapClient-" + user.id, client);
      console.log(
        `client created and registered for user: #${user.id} ${user.name}`
      );
      client.initialize();
      console.log(`client initialized for user:  #${user.id} ${user.name}`);

      const io = container.resolve<Server>("SocketServer");

      io.to(`ws-room-${user.companyId}`).emit("client-initialized", {
        id: user.id,
        info: client.info,
      });

      client.on("loading_screen", (percent, message) => {
        console.log(
          "zapClient-" + user.id + " LOADING SCREEN",
          percent,
          message
        );
        io.to(`ws-room-${user.companyId}`).emit("client-loading_screen", {
          id: user.id,
          percent,
          message,
        });
      });
      client.on("authenticated", () => {
        console.log("zapClient-" + user.id + " AUTHENTICATED");
        io.to(`ws-room-${user.companyId}`).emit("client-authenticated", {
          id: user.id,
        });
      });
      client.on("auth_failure", (msg) => {
        console.error("zapClient-" + user.id + " AUTHENTICATION FAILURE", msg);
      });
      client.on("ready", async () => {
        console.log("zapClient-" + user.id + " READY");
        await this.prismaClient.user.update({
          where: {
            id: user.id,
          },
          data: {
            zapStatus: "connected",
          },
        });
        await this.prismaClient.company.update({
          where: {
            id: user.company.id,
          },
          data: {
            whatsappFreeSlots: {
              decrement: 1,
            },
          },
        });
        io.to(`ws-solo-room-${user.id}`).emit("client-ready", {
          name: client?.info.pushname,
          phone: client?.info.me.user,
        });
      });

      client.on("disconnected", async () => {
        container.registerInstance<string>(
          "zapClient-" + user.id,
          "disconnected"
        );
        console.log("zapClient-" + user.id + " disconnected.");

        io.to(`ws-solo-room-${user.id}`).emit("client-disconnected");

        await this.prismaClient.company.update({
          where: {
            id: user.company.id,
          },
          data: {
            whatsappFreeSlots: {
              increment: 1,
            },
          },
        });
      });

      console.log(`getting qrcode for user:  #${user.id} ${user.name}`);
      io.to(`ws-solo-room-${user.id}`).emit("client-waiting-qr");

      const qrCode: string = await new Promise((resolve, reject) => {
        client.on("qr", async (qr) => {
          console.log("zapClient-" + user.id + " qr on nmeth");
          io.to(`ws-solo-room-${user.id}`).emit("client-qr-acquired", {
            id: user.id,
            qr,
          });
          await this.prismaClient.user.update({
            where: {
              id: data.userId,
            },
            data: {
              zapQrcode: qr,
            },
          });
          resolve(qr);
        });
      });

      return {
        isConnected: false,
        qrCode,
      };
    }

    return {
      isConnected: true,
      qrCode: user.zapQrcode,
    };
  }
}
