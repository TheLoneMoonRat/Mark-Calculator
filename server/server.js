const express = require('express')
const app = express()
term1a = [82, 74, 82, 79, 95]
term1b = []
term1a = [2, 2, 2, 2, 2]
app.get("/api", (req, res) => {
    res.json({ "users": term1a })
})

app.listen(5000, () => { console.log("Server started at port 5000") })