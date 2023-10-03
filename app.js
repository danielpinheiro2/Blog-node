// Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require("mongoose")
// Configurações
    //body parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    // handlebars
    //app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    //app.set('view engine', 'handlebars');
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    // mongoose


    // configurando o mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://127.0.0.1/blogapp")
      .then(() => {
        console.log("Servidor conectado!")
      })
      .catch((err) => {
        console.log("Houve um erro ao se conectar ao mongoDB: " + err)
      })
    // public
        app.use(express.static(path.join(__dirname, "public")))


// Rotas
    app.use('/admin', admin)
// Outros
const PORT = 1111
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}!`);
});
