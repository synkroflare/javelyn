import { Request } from "express"

export const logHandler = async (req: Request) => {
  if (req.method === "OPTIONS") return

  const newLine = `{
    originalUrl: ${req.originalUrl?.split("?")[0]},
    method: ${req.method},
    body: ${JSON.stringify(req.body)},
    query:  ${JSON.stringify(req.query)},
    date: ${new Date().toString()},
    ip: ${req.ip}
    origin: ${req.get("Origin")}
  },`

  console.log(newLine)
}
