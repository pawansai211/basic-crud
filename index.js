let express = require('express')

let fs = require('fs')

let port =5000;
//let jsonServer = require('json-server')

let bodyparser = require('body-parser')
const res = require('express/lib/response')

let app = express()

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

//const jsonServerMiddleware = jsonServer.router("api.json")

//app.use('/api',jsonServerMiddleware)

app.set('view engine','ejs')

app.get('/',(req,res) => {
    res.redirect('/users')
})


app.get('/users',(req,res) => {
    const users = JSON.parse(fs.readFileSync("api.json")).users
    res.render('listUsers',{data:users})
})

app.post('/users',(req,res) => {
    const users = JSON.parse(fs.readFileSync("api.json")).users

    let user = {
        id:Date.now(),
        name:req.body.name,
        age:req.body.age,
        country:req.body.country
    }

    users.push(user)
    fs.writeFileSync('api.json',JSON.stringify({users}))
    res.redirect('/users')
})

app.get("/delUser/:id", (req, res) => {
    const users = JSON.parse(fs.readFileSync("api.json")).users;
    const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id))
    if(userIndex === -1) return res.status(404).send("User not found")
    users.splice(userIndex, 1)
    fs.writeFileSync("api.json",JSON.stringify({ users }))
    res.redirect('/users')
})



app.get('/editUsers/:id',(req, res) => {
    const users = JSON.parse(fs.readFileSync("api.json")).users;
    const user = users.find((u) => u.id === parseInt(req.params.id));
    res.render('editUser',{data:users,userData:user})
})

app.post('/editUser/:id',(req,res) => {
    const users = JSON.parse(fs.readFileSync("api.json")).users
    const user = users.find((u) => u.id === parseInt(req.params.id))
    if (!user) return res.status(404).send("User not found")
    Object.assign(user, req.body)
    fs.writeFileSync("api.json",JSON.stringify({ users }))
    res.redirect('/users')
})

app.listen(5000,() => {
    console.log(`app running at http://localhost:${port}`)
})
