// const app = require('./server')

// const port = process.env.PORT || 5000

// app.listen(port, () => {
//     console.log(`server runing in http://localhost:${port}`)
// })

{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/zeronewatch-api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
  
