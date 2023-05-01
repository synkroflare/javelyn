import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import {
  IZapRepository,
  TSendMessageData,
} from "../../global/repositories/IZapRepository"

export class SendMessageController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const sendMessageUseCase = container.resolve(SendMessageUseCase)
      const sendMessage = await sendMessageUseCase.execute(data)

      return response.status(201).json(sendMessage)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class SendMessageUseCase {
  constructor(
    @inject("ZapRepository")
    private zapRepository: IZapRepository
  ) {}

  async execute(data: TSendMessageData): Promise<string> {
    const sendMessage = await this.zapRepository.sendMessage(data)
    return sendMessage
  }
}
