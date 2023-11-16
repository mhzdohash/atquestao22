const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/beautystore",
{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    serverSelectionTimeoutMS : 20000
});

const UsuarioSchema = new mongoose.Schema({
    email : {type : String, required : true},
    senha : {type : String}
});

const ProdutoBelezaSchema = new mongoose.Schema({
    id_produtobeleza : {type : String, required : true},
    descricao : {type : String},
    marca : {type : String},
    data_fabricacao : {type : Date},
    quantidade_estoque : {type : Number}
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);
const ProdutoBeleza = mongoose.model("ProdutoBeleza", ProdutoBelezaSchema);

app.post("/cadastrousuario", async(req, res)=>{
    const email = req.body.email;
    const senha = req.body.senha;

if(email == null || senha == null){
    return res.status(400).json({error : "Preencha todos os campos"})
}

const emailExiste = await Usuario.findOne({email : email})

if(emailExiste){
    return res.status(400).json({error : "O e-mail cadastrado já existe"})
}

const usuario = new Usuario({
    email : email,
    senha : senha
})

try{
    const newUsuario = await usuario.save()
    res.json({error : null, msg : "Cadastro OK", usuarioId : newUsuario._id});
} catch(error){
    res.status(400).json({error});
}
});

app.post("/produtobeleza", async(req, res)=>{
    const id_produtobeleza = req.body.id_produtobeleza;
    const descricao = req.body.descricao;
    const marca = req.body.marca;
    const data_fabricacao = req.body.data_fabricacao;
    const quantidade_estoque = req.body.quantidade_estoque

if(id_produtobeleza == null || descricao == null || marca == null || data_fabricacao == null || quantidade_estoque == null){
    return res.status(400).json({error : "Preencha todos os campos"})
}

if(quantidade_estoque > 30){
    return res.status(400).json({error: "A quantidade do estoque alcançou o limite"});
}else if(quantidade_estoque <= 0){
    return res.status(400).json({error: "O valor digitado é negativo, bote um valor positivo menor ou igual a 30"});
}

const produtobeleza = new ProdutoBeleza({
    id_produtobeleza : id_produtobeleza,
    descricao : descricao,
    marca : marca,
    data_fabricacao : data_fabricacao,
    quantidade_estoque : quantidade_estoque
})

    try{
        const newProdutoBeleza = await produtobeleza.save()
        res.json({error : null, msg : "Produtos Cadastrados"});
    } catch(error){
        res.status(400).json({error});
    }
});

app.get("/produtobeleza", async(req, res)=>{
    res.sendFile(__dirname +"/produtobeleza.html");
})

app.get("/cadastrousuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrousuario.html");
})

app.get("/index", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})

app.listen(port, ()=>{
    console.log(`O servidor está rodando na porta ${port}`);
});