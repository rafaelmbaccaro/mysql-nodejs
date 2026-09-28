const express = require('express');
const mysql = require('mysql2');
const app = express();

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'biblioteca'
});

// Conecta ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados MySQL:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL com sucesso!');
});

// Middlewares do Express
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rota POST para cadastrar o usuário no Banco de Dados
app.post('/acesso-usuario', (req, res) => {
    const nome = req.body.username;
    const senha = req.body.password;
    
    const nome_login = req.body.usernameLogin;
    const senha_login = req.body.passwordLogin;

    if(nome){
    //previne o sql injection e facilita manipulação dos valores
    const sql = 'INSERT INTO usuario (nome_usuario, senha) VALUES (?, ?)';
    
    db.query(sql, [nome, senha], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco:', err);
            return res.status(500).send('Erro ao cadastrar no banco de dados.');
        }

        console.log(`Usuário "${nome}" salvo com sucesso no banco de dados com ID: ${result.insertId}!`);
        res.send(`<h1>Usuário "${nome}" cadastrado com sucesso no banco!</h1><a href="/">Voltar</a>`);
    });
    
    }else {
    const sql = 'SELECT id FROM usuario WHERE nome_usuario = ? AND senha = ?';
    
    db.query(sql, [nome_login, senha_login], (err, result) => {
        if (err) {
            console.error('Erro ao consultar banco:', err);
            return res.status(500).send('Erro no servidor.');

        }if (result.length > 0) { //se tiver encontrado um resultado
            const idEncontrado = result[0].id;
            console.log(`Usuário "${nome_login}" acessou com sucesso! ID: ${idEncontrado}`);
            res.send(`<h1>Bem-vindo, ${nome_login}! (ID: ${idEncontrado})</h1>`);
        } 

        else {
            console.log('Tentativa de login falhou: usuário ou senha incorretos.');
            res.send('<h1>Usuário ou senha incorretos!</h1><a href="/">Tentar novamente</a>');
        }
    });
}
});

app.listen(8080);