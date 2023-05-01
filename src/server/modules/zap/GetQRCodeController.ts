import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import {
  IZapRepository,
  TGetQRCodeData,
} from "../../global/repositories/IZapRepository"

export class GetQRCodeController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const getQRCodeUseCase = container.resolve(GetQRCodeUseCase)
      const getQRCode = await getQRCodeUseCase.execute(data)

      return response.status(201).json(getQRCode)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class GetQRCodeUseCase {
  constructor(
    @inject("ZapRepository")
    private zapRepository: IZapRepository
  ) {}

  async execute(data: TGetQRCodeData): Promise<string> {
    const getQRCode = await this.zapRepository.getQRCode(data)
    return getQRCode
  }
}
