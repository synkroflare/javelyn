import { Company, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { container, inject, injectable } from "tsyringe";

type TUpdateCompanyData = {
  id: number;
  salesGoal: number;
};

export class UpdateCompanyController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;
      const updateUseCase = container.resolve(UpdateCompanyUseCase);
      const company = await updateUseCase.execute(data);

      const json = JSON.stringify(
        company,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      );

      return response.status(200).send(json);
    } catch (error: any) {
      return response.status(400).send(error.message);
    }
  }
}

@injectable()
export class UpdateCompanyUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute({
    id,
    salesGoal,
  }: TUpdateCompanyData): Promise<Company | null> {
    const company = await this.client.company.update({
      where: {
        id,
      },
      data: {
        salesGoal,
      },
    });
    return company;
  }
}
