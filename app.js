// Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require("mongoose")
const session =require("express-session")
const flash = require("connect-flash")
require("./models/Postagem")
const Postagem = mongoose.model("postagens")

// Configurações
  // sessao
    app.use(session({
      secret: "cursodenode",
      resave: true,
      saveUninitialized: true
    }))
    app.use(flash())
  // middleware
    app.use((req,res,next)=>{
      res.locals.success_msg = req.flash("success_msg")
      res.locals.error_msg = req.flash("error_msg")
      next()
    })

    //body parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    // handlebars
    //app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    //app.set('view engine', 'handlebars');
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // configurando o mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://127.0.0.1/api")
      .then(() => {
        console.log("Servidor conectado!")
      })
      .catch((err) => {
        console.log("Houve um erro ao se conectar ao mongoDB: " + err)
      })
    // public
        app.use(express.static(path.join(__dirname, "public")))

        app.use((req, res, next) => {
          console.log("Middleware")
          next()
        })

// Rotas
app.get('/', (req, res) => {
  Postagem.find().lean().populate("categoria").sort({data: 'desc'}).then((postagens) => {
      res.render("index", {postagens: postagens})
  }).catch((err) => {
      req.flash("error_msg", "Não foi possível carregar os posts")
      res.redirect("/404")
  })
})

    app.get('/posts', (req, res) => {
      res.send("Lista Posts")
    })

    app.use('/admin', admin)

// Outros
const PORT = 1111
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}!`);
});
