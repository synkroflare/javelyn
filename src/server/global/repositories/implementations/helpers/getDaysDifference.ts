export const getDaysDifference = (inputDateA: Date, inputDateB: Date) => {
  let datea: Date | undefined = inputDateA
  let dateb: Date | undefined = inputDateB

  // calculate the time difference between the two dates
  if (typeof dateb === "string") {
    dateb = new Date(dateb)
  }
  if (typeof datea === "string") {
    datea = new Date(datea)
  }

  if (!datea || !dateb) return 9999
  const timeDiff: number = Math.abs(dateb.getTime() - datea.getTime())

  // calculate the number of days between the two dates
  const daysDiff: number = Math.ceil(timeDiff / (1000 * 3600 * 24))

  return daysDiff
}
