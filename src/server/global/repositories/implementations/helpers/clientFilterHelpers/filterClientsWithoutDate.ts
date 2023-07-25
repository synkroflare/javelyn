import { Client, PrismaClient, Procedure } from "@prisma/client"

export async function filterClientsWithoutDate(
  inputData: any,
  prismaClient: PrismaClient
): Promise<Client[] | void> {
  const usedFilterOperators: any = {}

  const data = inputData.filters

  const filtersData: any = {
    OR: [],
    AND: [],
  }

  const specialFiltersNames = ["totalSpent", "findByProcedure"]

  const specialFilters: any = {
    ticketCount: {
      enabled: false,
      value: null,
    },
    procedureCount: {
      enabled: false,
      value: null,
    },

    javelynThrowCount: {},
    totalSpent: {},
  }

  const dateFilters: any = {
    daysDiff: [],
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i].value && data[i].type && data[i].comparator) {
      if (data[i].type === "daysDiff") {
        const filter = {
          enabled: true,
          comparator: data[i].comparator,
          value: Number(data[i].value),
        }
        dateFilters.daysDiff.push(filter)
        continue
      }
      if (specialFiltersNames.includes(data[i].type)) {
        specialFilters[data[i].type] = {}
        specialFilters[data[i].type].enabled = true
        specialFilters[data[i].type].comparator = data[i].comparator
        specialFilters[data[i].type].value = Number(data[i].value)
        specialFilters[data[i].type].stringValue = data[i].value
        usedFilterOperators[data[i].type] = true
        continue
      }

      if (data[i].type === "ticketCount") {
        specialFilters.ticketCount.enabled = true
        specialFilters.ticketCount.comparator = data[i].comparator
        specialFilters.ticketCount.value = Number(data[i].value)
        usedFilterOperators[data[i].type] = true
        continue
      }

      if (data[i].type === "procedureCount") {
        specialFilters.procedureCount.enabled = true
        specialFilters.procedureCount.comparator = data[i].comparator
        specialFilters.procedureCount.value = Number(data[i].value)
        usedFilterOperators[data[i].type] = true
        continue
      }

      if (data[i].type === "javelynThrowCount") {
        specialFilters.javelynThrowCount.enabled = true
        specialFilters.javelynThrowCount.comparator = data[i].comparator
        specialFilters.javelynThrowCount.value = Number(data[i].value)
        usedFilterOperators[data[i].type] = true
        continue
      }

      if (data[i].type === "findByProcedureReturn") {
        switch (usedFilterOperators[data[i].type]) {
          case true:
            console.log("h")
            filtersData.OR.push({
              tickets: {
                some: {
                  proceduresAvailableToReturn: {
                    some: {
                      name: {
                        [data[i].comparator]: data[i].value,
                      },
                    },
                  },
                },
              },
            })
            delete filtersData.AND[data[i].type]
            break
          case false:
            filtersData.AND.push({
              tickets: {
                some: {
                  proceduresAvailableToReturn: {
                    some: {
                      name: {
                        [data[i].comparator]: data[i].value,
                      },
                    },
                  },
                },
              },
            })
            break
          default:
            filtersData.AND.push({
              tickets: {
                some: {
                  proceduresAvailableToReturn: {
                    some: {
                      name: {
                        [data[i].comparator]: data[i].value,
                      },
                    },
                  },
                },
              },
            })
            break
        }
        usedFilterOperators[data[i].type] = true
        continue
      }

      if (data[i].type === "procedureType") {
        switch (usedFilterOperators[data[i].type]) {
          case true:
            filtersData.OR.push({
              [data[i].type]: {
                [data[i].comparator]: data[i].value,
              },
            })
            delete filtersData.AND[data[i].type]
            break
          case false:
            filtersData.AND.push({
              [data[i].type]: {
                [data[i].comparator]: data[i].value,
              },
            })
            break
          default:
            filtersData.AND.push({
              [data[i].type]: {
                [data[i].comparator]: data[i].value,
              },
            })
            break
        }
        usedFilterOperators[data[i].type] = true
        continue
      }
      if (
        data[i].type === "statusActive" ||
        data[i].type === "statusAvailableToReturn"
      ) {
        switch (usedFilterOperators[data[i].type]) {
          case true:
            filtersData.OR.push({
              [data[i].type]: {
                [data[i].comparator]: data[i].value === "true" ? true : false,
              },
            })
            delete filtersData.AND[data[i].type]
            break
          case false:
            filtersData.AND.push({
              [data[i].type]: {
                [data[i].comparator]: data[i].value === "true" ? true : false,
              },
            })
            break
          default:
            filtersData.AND.push({
              [data[i].type]: {
                [data[i].comparator]: data[i].value === "true" ? true : false,
              },
            })
            break
        }
        usedFilterOperators[data[i].type] = true
        continue
      }

      if (data[i].type === "rankName") {
        switch (usedFilterOperators[data[i].type]) {
          case true:
            filtersData.OR.push({
              [data[i].type]: {
                [data[i].comparator]: data[i].value.toString(),
              },
            })
            delete filtersData.AND[data[i].type]
            break
          case false:
            filtersData.AND.push({
              [data[i].type]: {
                [data[i].comparator]: data[i].value.toString(),
              },
            })
            break
          default:
            filtersData.AND.push({
              [data[i].type]: {
                [data[i].comparator]: data[i].value.toString(),
              },
            })
            break
        }
        usedFilterOperators[data[i].type] = true
        continue
      }

      if (data[i].type === "name") {
        switch (usedFilterOperators[data[i].type]) {
          case true:
            filtersData.OR.push({
              [data[i].type]: {
                contains: data[i].value.toString(),
              },
            })
            delete filtersData.AND[data[i].type]
            break
          case false:
            filtersData.AND.push({
              [data[i].type]: {
                contains: data[i].value.toString(),
              },
            })
            break
          default:
            filtersData.AND.push({
              [data[i].type]: {
                contains: data[i].value.toString(),
              },
            })
            break
        }
        usedFilterOperators[data[i].type] = true
        continue
      }

      if (data[i].type === "procedureType") {
        switch (usedFilterOperators[data[i].type]) {
          case true:
            filtersData.OR.push({
              tickets: {
                [data[i].type === "equals" ? "some" : "none"]: {
                  procedures: {
                    some: {
                      type: data[i].value.toString(),
                    },
                  },
                },
              },
            })
            delete filtersData.AND[data[i].type]
            break
          case false:
            filtersData.AND.push({
              tickets: {
                [data[i].type === "equals" ? "some" : "none"]: {
                  procedures: {
                    some: {
                      type: data[i].value.toString(),
                    },
                  },
                },
              },
            })
            break
          default:
            filtersData.AND.push({
              tickets: {
                [data[i].type === "equals" ? "some" : "none"]: {
                  procedures: {
                    some: {
                      type: data[i].value.toString(),
                    },
                  },
                },
              },
            })
            break
        }
        usedFilterOperators[data[i].type] = true
        continue
      }

      if (usedFilterOperators[data[i].type]) {
        filtersData.OR.push({
          [data[i].type]: {
            [data[i].comparator]: Number(data[i].value),
          },
        })
        delete filtersData.AND[data[i].type]
      } else {
        filtersData.AND.push({
          [data[i].type]: {
            [data[i].comparator]: Number(data[i].value),
          },
        })
      }

      usedFilterOperators[data[i].type] = true
    }
  }

  if (filtersData.OR.length === 0) {
    delete filtersData.OR
  }

  if (filtersData.AND.length === 0) {
    delete filtersData.AND
  }

  const formatedData = {
    ...filtersData,
    companyId: inputData.companyId,
    statusTrashed: false,
  }

  const dateCheck = (i: number) => {
    if (!dateFilters.daysDiff[i] || !dateFilters.daysDiff[i].value) return null
    const date = new Date()
    date.setDate(date.getDate() - dateFilters.daysDiff[i].value)
    return date
  }

  const dateComparatorFix = (i: number) => {
    if (!dateFilters.daysDiff[i] || !dateFilters.daysDiff[i].comparator) return
    if (dateFilters.daysDiff[i].comparator === "lt") return "gt"
    if (dateFilters.daysDiff[i].comparator === "gt") return "lt"
    return dateFilters.daysDiff[i].comparator
  }

  const ticketWhereData: any = {
    doneDate: {},
  }

  if (dateFilters.daysDiff[0] && dateFilters.daysDiff[0].enabled) {
    ticketWhereData.doneDate[dateComparatorFix(0)] = dateCheck(0)
  }

  if (dateFilters.daysDiff[1] && dateFilters.daysDiff[1].enabled) {
    ticketWhereData.doneDate[dateComparatorFix(1)] = dateCheck(1)
  }

  console.log({ ticketWhereData })

  let clients = await prismaClient.client.findMany({
    where: formatedData,
    include: {
      tickets: {
        where: ticketWhereData,
        include: {
          procedures: true,
          proceduresAvailableToReturn: true,
        },
      },
      responsibleUser: true,
    },
  })

  if (specialFilters.ticketCount.enabled) {
    switch (specialFilters.ticketCount.comparator) {
      case "equals":
        clients = clients.filter(
          (c) => c.tickets.length === specialFilters.ticketCount.value
        )
        break
      case "not":
        clients = clients.filter(
          (c) => c.tickets.length !== specialFilters.ticketCount.value
        )
        break
      case "gt":
        clients = clients.filter(
          (c) => c.tickets.length > specialFilters.ticketCount.value
        )
        break
      case "lt":
        clients = clients.filter(
          (c) => c.tickets.length < specialFilters.ticketCount.value
        )
        break
    }
  }

  if (specialFilters.procedureCount.enabled) {
    switch (specialFilters.procedureCount.comparator) {
      case "equals":
        clients = clients.filter(
          (c) =>
            c.tickets
              .map((t) => t.procedures.length)
              .reduce((partialSum, a) => partialSum + a, 0) ==
            specialFilters.procedureCount.value
        )
        break
      case "not":
        clients = clients.filter(
          (c) =>
            c.tickets
              .map((t) => t.procedures.length)
              .reduce((partialSum, a) => partialSum + a, 0) !=
            specialFilters.procedureCount.value
        )
        break
      case "gt":
        clients = clients.filter(
          (c) =>
            c.tickets
              .map((t) => t.procedures.length)
              .reduce((partialSum, a) => partialSum + a, 0) >
            specialFilters.procedureCount.value
        )
        break
      case "lt":
        clients = clients.filter(
          (c) =>
            c.tickets
              .map((t) => t.procedures.length)
              .reduce((partialSum, a) => partialSum + a, 0) <
            specialFilters.procedureCount.value
        )
        break
    }
  }

  if (specialFilters.javelynThrowCount.enabled) {
    switch (specialFilters.javelynThrowCount.comparator) {
      case "equals":
        clients = clients.filter(
          (c) =>
            c.javelynContactAttemptsDates.length ===
            specialFilters.javelynThrowCount.value
        )
        break
      case "not":
        clients = clients.filter(
          (c) =>
            c.javelynContactAttemptsDates.length !==
            specialFilters.javelynThrowCount.value
        )
        break
      case "gt":
        clients = clients.filter(
          (c) =>
            c.javelynContactAttemptsDates.length >
            specialFilters.javelynThrowCount.value
        )
        break
      case "lt":
        clients = clients.filter(
          (c) =>
            c.javelynContactAttemptsDates.length <
            specialFilters.javelynThrowCount.value
        )
        break
    }
  }

  if (specialFilters.totalSpent.enabled) {
    if (specialFilters.totalSpent.comparator === "gt") {
      clients = clients.filter((client) => {
        const ticketValues = client.tickets.map((t) => {
          if (typeof t.value === "number") return t.value
        })
        const sum = ticketValues.reduce(
          (total: number, num: number) => total + num,
          0
        )

        if (sum && sum > specialFilters.totalSpent.value) return client
      })
    }
    if (specialFilters.totalSpent.comparator === "lt") {
      clients = clients.filter((client) => {
        const ticketValues = client.tickets.map((t) => {
          if (typeof t.value === "number") return t.value
        })
        const sum = ticketValues.reduce(
          (total: number, num: number) => total + num,
          0
        )

        if (sum && sum < specialFilters.totalSpent.value) return client
      })
    }
  }

  if (specialFilters.findByProcedure?.enabled) {
    if (specialFilters.findByProcedure?.comparator === "equals") {
      clients = clients.filter((client) => {
        const ticketProcedures = client.tickets.map((t) => {
          return t.procedures
        })

        const procedureNames = ([] as Procedure[])
          .concat(...ticketProcedures)
          .map((p) => p.name)

        if (procedureNames.includes(specialFilters.findByProcedure.stringValue))
          return client
      })
    }
    if (specialFilters.findByProcedure?.comparator === "not") {
      clients = clients.filter((client) => {
        const ticketProcedures = client.tickets.map((t) => {
          return t.procedures
        })

        const procedureNames = ([] as Procedure[])
          .concat(...ticketProcedures)
          .map((p) => p.name)

        if (
          !procedureNames.includes(specialFilters.findByProcedure.stringValue)
        )
          return client
      })
    }
  }

  if (specialFilters.procedureType?.enabled) {
    if (specialFilters.procedureType?.comparator === "equals") {
      clients = clients.filter((client) => {
        const ticketProcedures = client.tickets.map((t) => {
          return t.procedures
        })

        const procedureTypes = ([] as Procedure[])
          .concat(...ticketProcedures)
          .map((p) => p.type)

        if (procedureTypes.includes(specialFilters.procedureType.stringValue))
          return client
      })
    }
    if (specialFilters.procedureType?.comparator === "not") {
      clients = clients.filter((client) => {
        const ticketProcedures = client.tickets.map((t) => {
          return t.procedures
        })

        const procedureTypes = ([] as Procedure[])
          .concat(...ticketProcedures)
          .map((p) => p.type)

        if (!procedureTypes.includes(specialFilters.procedureType.stringValue))
          return client
      })
    }
  }

  console.log(formatedData)

  return clients
}
