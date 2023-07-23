export const logHandler = async (req: any) => {
  if (req.method === "OPTIONS") return

  const newLine = `{
    baseUrl: ${req.baseUrl},
    originalUrl: ${req.originalUrl},
    method: ${req.method},
    body: ${JSON.stringify(req.body)},
    date: ${new Date().toString()},
  },`

  console.log(newLine)
}
