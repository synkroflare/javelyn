import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import {
  IZapRepository,
  THandleConnectionData,
} from "../../global/repositories/IZapRepository"

export class HandleConnectionController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const handleConnectionUseCase = container.resolve(HandleConnectionUseCase)
      const handleConnection = await handleConnectionUseCase.execute(data)

      return response.status(201).json(handleConnection)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class HandleConnectionUseCase {
  constructor(
    @inject("ZapRepository")
    private zapRepository: IZapRepository
  ) {}

  async execute(
    data: THandleConnectionData
  ): Promise<{ isConnected: boolean; qrCode: string }> {
    const handleConnection = await this.zapRepository.handleConnection(data)
    return handleConnection
  }
}
