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
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routes/usuario")


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
app.get('/postagem/:slug', (req,res) => {
  const slug = req.params.slug
  Postagem.findOne({slug})
      .then(postagem => {
          if(postagem){
              const post = {
                  titulo: postagem.titulo,
                  data: postagem.data,
                  conteudo: postagem.conteudo
              }
              res.render('postagem/index', post)
          }else{
              req.flash("error_msg", "Essa postagem nao existe")
              res.redirect("/")
          }
      })
      .catch(err => {
          req.flash("error_msg", "Houve um erro interno")
          res.redirect("/")
      })
})


app.get('/', (req, res) => {
  Postagem.find().lean().populate("categoria").sort({data: 'desc'}).then((postagens) => {
      res.render("index", {postagens: postagens})
  }).catch((err) => {
      req.flash("error_msg", "Não foi possível carregar os posts")
      res.redirect("/404")
  })
})

  app.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categorias) => {
      res.render("categorias/index", {categorias: categorias})
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro interno ao listar as categorias")
      res.redirect("/")
    })
  })

  app.get("/categorias/:slug", (req,res) => {
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
      if(categoria){
        Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
          
          res.render("categorias/postagens", {postagens: postagens, categoria: categoria})

        }).catch((err) => {
          req.flash("error_msg", "Houve um erro ao listar os posts!")
          res.redirect("/")
        })
      }else{
        req.flash("error_msg","Esta categoria não existe")
        res.redirect("/")
      }
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro interno ao carregar a pagina desta caregoria")
      res.redirect("/")
    })
  })

    app.use('/admin', admin)
    app.use('/usuarios', usuarios)

// Outros
const PORT = 1111
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}!`);
});
