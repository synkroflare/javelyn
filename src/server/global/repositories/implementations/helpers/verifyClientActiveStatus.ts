import { getDaysDifference } from "./getDaysDifference"

export const verifyClientActiveStatus = (clientInfo: any, treshold: number) => {
  const tickets = clientInfo.tickets
  const todayDate = new Date()

  let outerDayDiff = 0

  for (let i = 0; i < tickets.length; i++) {
    const dayDiff = getDaysDifference(todayDate, tickets[i].doneDate)
    if (dayDiff < treshold) {
      return {
        isActive: true,
        daysSinceLastTicket: dayDiff,
      }
    }
    outerDayDiff = dayDiff
  }
  return {
    isActive: false,
    daysSinceLastTicket: outerDayDiff,
  }
}
