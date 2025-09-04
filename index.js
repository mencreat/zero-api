// const app = require('./server')

// const port = process.env.PORT || 5000

// app.listen(port, () => {
//     console.log(`server runing in http://localhost:${port}`)
// })

{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "app.js"
    },
    {
      "src": "/(.*)",
      "dest": "app.js"
    }
  ]
}
  
