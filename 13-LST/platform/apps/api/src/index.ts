import express from 'express'

const app = express()
const PORT = 8000

app.get("/", async (req, res): Promise<any> => {
  return res.json({
    message: "Working"
  })
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
