const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get('/', (req,res) => {
    res.render("admin/index")
})

router.get('/a', (req,res) => {
    res.send("Página principal do painel ADM")
})

router.get('/posts', (req,res) => {
    res.send("Página de posts")
})

router.get('/categorias', (req,res) => {
    res.render("admin/categorias")
})

router.get('/categorias/add', (req,res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req,res) => {
    const novaCategoria ={
        nome: req.body.nome,
        slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(() => {
        
        console.log("categoria salva com sucesso!")
    }).catch((err) => {
        console.log("Erro ao salvar categoria!")
    })
})
module.exports = router