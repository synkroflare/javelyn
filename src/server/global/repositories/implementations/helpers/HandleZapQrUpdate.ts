import { PrismaClient } from "@prisma/client"
import { container, inject, injectable } from "tsyringe"

export class HandleZapQrUpdateController {
  async handle(companyId: number, qrcode: string) {
    console.log("here")
    const handleZapQrUpdateUseCase = container.resolve(HandleZapQrUpdateUseCase)
    const updateQr = await handleZapQrUpdateUseCase.execute(companyId, qrcode)
  }
}

@injectable()
export class HandleZapQrUpdateUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute(companyId: number, qrcode: string): Promise<string> {
    console.log("executing")
    if (!qrcode) {
      console.error("no qr provided")
      return "Error: no qr provided."
    }
    const registeredQrcode = await this.client.company.update({
      where: {
        id: companyId,
      },
      data: {
        zapQrcode: qrcode,
      },
    })
    return "qr code registered successfully"
  }
}
