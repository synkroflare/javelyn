import { container } from "tsyringe"
import winston from "winston"
const { createLogger, format, transports } = winston
const { combine, timestamp, printf } = format
import DailyRotateFile from "winston-daily-rotate-file"

const initLogger = () => {
  const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`
  })

  const logger = createLogger({
    level: "info", // Minimum level to log
    format: combine(timestamp(), logFormat),
    transports: [
      new DailyRotateFile({
        filename: "../logs/javelyn-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: false,
        maxFiles: "7d", // Retain logs for 7 days
      }),
    ],
  })

  container.registerInstance<winston.Logger>("Logger", logger)
}

export default initLogger
