import { container } from "tsyringe"
import { IClientRepository } from "../../server/global/repositories/IClientRepository"
import { IEventRepository } from "../../server/global/repositories/IEventRepository"
import { IGroupRepository } from "../../server/global/repositories/IGroupRepository"
import { IListRepository } from "../../server/global/repositories/IListRepository"
import { ClientFunctionsRepository } from "../../server/global/repositories/implementations/ClientFunctionsRepository"
import { EventFunctionsRepository } from "../../server/global/repositories/implementations/EventFunctionsRepository"
import { GroupFunctionsRepository } from "../../server/global/repositories/implementations/GroupFunctionsRepository"
import { ListFunctionsRepository } from "../../server/global/repositories/implementations/ListFunctionsRepository"
import { ProcedureFunctionsRepository } from "../../server/global/repositories/implementations/ProcedureFunctionsRepository"
import { SpreadsheetFunctionsRepository } from "../../server/global/repositories/implementations/SpreadsheetFunctionsRepository"
import { TicketFunctionsRepository } from "../../server/global/repositories/implementations/TicketFunctionsRepository"
import { UserFunctionsRepository } from "../../server/global/repositories/implementations/UserFunctionsRepository"
import { ZapFunctionsRepository } from "../../server/global/repositories/implementations/ZapFunctionsRepository"
import { IProcedureRepository } from "../../server/global/repositories/IProcedureRepository"
import { ISpreadsheetRepository } from "../../server/global/repositories/ISpreadsheetRepository"
import { ITicketRepository } from "../../server/global/repositories/ITicketRepository"
import { IUserRepository } from "../../server/global/repositories/IUserRepository"
import { IZapRepository } from "../../server/global/repositories/IZapRepository"

export const handleRepositoriesContainers = () => {
  container.registerSingleton<ITicketRepository>(
    "TicketRepository",
    TicketFunctionsRepository
  )

  container.registerSingleton<IClientRepository>(
    "ClientRepository",
    ClientFunctionsRepository
  )

  container.registerSingleton<IUserRepository>(
    "UserRepository",
    UserFunctionsRepository
  )

  container.registerSingleton<IProcedureRepository>(
    "ProcedureRepository",
    ProcedureFunctionsRepository
  )

  container.registerSingleton<ISpreadsheetRepository>(
    "SpreadsheetRepository",
    SpreadsheetFunctionsRepository
  )

  container.registerSingleton<IZapRepository>(
    "ZapRepository",
    ZapFunctionsRepository
  )

  container.registerSingleton<IGroupRepository>(
    "GroupRepository",
    GroupFunctionsRepository
  )

  container.registerSingleton<IListRepository>(
    "ListRepository",
    ListFunctionsRepository
  )

  container.registerSingleton<IEventRepository>(
    "EventRepository",
    EventFunctionsRepository
  )
}
