import { getDaysDifference } from "./getDaysDifference"

type TActiveData = {
  isActive: boolean
  daysSinceLastTicket: number
  dayDiffs: number[]
}

export const verifyClientActiveStatus = (clientInfo: any, treshold: number) => {
  const tickets = clientInfo.tickets
  const todayDate = new Date()

  let outerDayDiff = 0
  const activeData: TActiveData = {
    isActive: false,
    daysSinceLastTicket: 99999,
    dayDiffs: [],
  }

  for (let i = 0; i < tickets.length; i++) {
    const dayDiff = getDaysDifference(todayDate, tickets[i].doneDate)
    if (dayDiff < treshold) activeData.isActive = true
    outerDayDiff = dayDiff
    activeData.dayDiffs.push(dayDiff)
  }

  return {
    isActive: activeData.isActive,
    daysSinceLastTicket: Math.min(...activeData.dayDiffs),
    rankName: getRankName(Math.min(...activeData.dayDiffs)),
  }
}

const getRankName = (dayDiff: number) => {
  if (dayDiff < 60) return "Master"
  if (dayDiff < 90) return "Premio"
  if (dayDiff < 120) return "Senior"
  if (dayDiff < 150) return "Padrão"
  return "Resgate"
}
