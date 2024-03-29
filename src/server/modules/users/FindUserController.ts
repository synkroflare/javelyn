import { User } from "@prisma/client";
import { Request, Response } from "express";
import { container, inject, injectable } from "tsyringe";
import { IUserRepository } from "../../global/repositories/IUserRepository";

type TRequest = {
  id?: number;
  companyId: number;
};

export class FindUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const findUserUseCase = container.resolve(FindUserUseCase);
      const findUser = await findUserUseCase.execute(data);

      return response.status(201).json(findUser);
    } catch (error: any) {
      return response.status(400).send(error.message);
    }
  }
}

@injectable()
export class FindUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(data: TRequest): Promise<User[] | void> {
    const findUser = await this.userRepository.find(data);
    return findUser;
  }
}
