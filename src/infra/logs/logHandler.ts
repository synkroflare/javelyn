export const logHandler = async (req: any) => {
  if (req.method === "OPTIONS") return

  const newLine = `{
    originalUrl: ${req.originalUrl},
    method: ${req.method},
    body: ${JSON.stringify(req.body)},
    query:  ${JSON.stringify(req.query)},
    date: ${new Date().toString()},
  },`

  console.log(newLine)
}
