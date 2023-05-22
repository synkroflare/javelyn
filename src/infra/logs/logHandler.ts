import fs from "fs"

export const logHandler = async (req: any) => {
  if (req.method === "OPTIONS") return

  const filePath = "./src/infra/logs/logArchives/log1.txt"
  const newLine = `{
    baseUrl: ${req.baseUrl},
    originalUrl: ${req.originalUrl},
    method: ${req.method},
    body: ${JSON.stringify(req.body)},
    date: ${new Date().toString()},
  },`

  fs.appendFile(filePath, newLine + "\n", (err) => {
    if (err) {
      console.error("Error writing to file:", err)
      return
    }

    console.log("New log created.")
  })
}
