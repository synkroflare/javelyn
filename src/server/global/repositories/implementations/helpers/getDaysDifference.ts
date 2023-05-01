export const getDaysDifference = (datea: Date, dateb: Date) => {
  // calculate the time difference between the two dates
  if (typeof dateb === "string") {
    dateb = new Date(dateb)
  }
  const timeDiff: number = Math.abs(dateb.getTime() - datea.getTime())

  // calculate the number of days between the two dates
  const daysDiff: number = Math.ceil(timeDiff / (1000 * 3600 * 24))

  return daysDiff
}
