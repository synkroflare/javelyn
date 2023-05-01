import { PrismaClient } from "@prisma/client"
import { inject, injectable } from "tsyringe"
import { ISpreadsheetRepository } from "../ISpreadsheetRepository"

@injectable()
export class SpreadsheetFunctionsRepository implements ISpreadsheetRepository {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}
  async import(data: any): Promise<any> {
    try {
      for (let i = 0; i < data.length; i++) {
        const ticket1 = data[i]
        const checkTicket = await this.client.ticket.findFirst({
          where: {
            salesCode: ticket1["Cod. Venda"],
            companyId: ticket1.CompanyId,
          },
        })
        if (checkTicket) {
          console.log(
            "ticket with sales code: " +
              ticket1["Cod. Venda"] +
              " already exists."
          )
          continue
        }
        console.log("creating: ", ticket1.Cliente, i)
        const date = new Date(data[i].Data)
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset())

        let findClient = await this.client.client.findFirst({
          where: {
            name: ticket1.Cliente,
            companyId: ticket1.CompanyId,
          },
        })

        if (!findClient) {
          findClient = await this.client.client.create({
            data: {
              name: ticket1.Cliente,
              companyId: ticket1.CompanyId,
            },
          })
        }

        const procedureName1PreFix = data[i].Serviços[0]
        const procedureName1 = procedureName1PreFix
          .slice(0, procedureName1PreFix.indexOf("R$"))
          .trim()

        const connectArray: any = []

        for (let i = 0; i < ticket1.Serviços.length; i++) {
          const findProcedure = await this.client.procedure.findFirst({
            where: {
              name: ticket1.Serviços[i],
              companyId: ticket1.CompanyId,
            },
          })

          const newProcedure = findProcedure
            ? findProcedure
            : await this.client.procedure.create({
                data: {
                  name: ticket1.Serviços[i],
                  companyId: ticket1.CompanyId,
                },
              })

          connectArray.push({ name: ticket1.Serviços[i] })
        }

        const newTicket = await this.client.ticket.create({
          data: {
            type: "REALIZADO",
            companyId: ticket1.CompanyId,
            clientName: ticket1.Cliente,
            clientId: findClient.id,
            clientCPF: findClient.CPF,
            salesCode: ticket1["Cod. Venda"],
            salesmanName: ticket1.Vendedor,
            pa: ticket1.PA,
            salesChannel: ticket1["Canal de Vendas"],
            value: ticket1.Valor,
            procedureNames: [procedureName1],
            procedures: {
              connect: connectArray,
            },
            doneDate: date,
          },
        })

        const fixedTicketValor = Number(
          ticket1.Valor.toString().replace("R$", "").trim()
        )

        await this.client.client.update({
          where: {
            name: ticket1.Cliente,
            companyId: ticket1.CompanyId,
          },
          data: {
            totalSpent: findClient?.totalSpent + fixedTicketValor,
          },
        })
      }
    } catch (error: any) {
      console.log(error.message)
      return error.message
    }
    return { teta: "teta" }
  }

  async importx(inputData: any): Promise<any> {
    try {
      const usedClients: string[] = []
      const data = inputData.data

      for (let i = 0; i < data.length; i++) {
        const client = await this.client.client.findFirst({
          where: {
            name: data[i].Nome,
          },
        })
        if (!client) {
          /*      console.error("Could not find client for " + data[i].Nome) */
          continue
        }

        if (usedClients.includes(client.name)) {
          console.log(client.name + "already in")
          continue
        }

        usedClients.push(client.name)

        const updateData: any = {}

        if (data[i].Telefone) updateData.phone = Number(data[i].Telefone)
        if (data[i].Celular) updateData.phone = Number(data[i].Celular)
        if (data[i].Whatsapp) updateData.phone = Number(data[i].Whatsapp)
        if (data[i].Idade) updateData.age = Number(data[i].Idade)
        if (data[i].Email) updateData.mail = data[i].Email
        if (data[i].Aniversario) {
          const getbday = new Date(data[i].Aniversario)
          updateData.birthday = getbday
          updateData.birthdayDay = getbday.getDate()
          updateData.birthdayMonth = getbday.getMonth() + 1
          updateData.birthdayYear = getbday.getFullYear()
          for (let i2 = 0; i2 < 100; i2++) {
            const bday = new Date(data[i].Aniversario)
            bday.setFullYear(2023 + i2)

            const newEvent = {
              name: `Aniversário de ${data[i].Nome}`,
              type: "BIRTHDAY",
              date: bday,
              dateDay: bday.getDate(),
              dateMonth: bday.getMonth() + 1,
              dateYear: bday.getFullYear(),
              companyId: inputData.companyId,
              targets: { connect: { id: client.id } },
            }
            const event = this.client.event.create({
              data: newEvent,
            })

            if (data[i].Nome === "ANA PAULA SANCHES CERQUEIRA") {
              console.log(i2)
              console.log("iterating for " + data[i].Nome + " in " + i2)
            }

            continue
          }
        }

        try {
          const updateClient = await this.client.client.update({
            where: {
              name: client.name,
            },
            data: updateData,
          })
        } catch (e: any) {
          console.log(updateData.phone)
          continue
        }
      }
      return {
        clientsCount: usedClients.length,
        status: "success",
      }
    } catch (e: any) {
      return e.message
    }
  }
}
