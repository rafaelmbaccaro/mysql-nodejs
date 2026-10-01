const Sequelize = require('sequelize');
const sequelize = new Sequelize('biblioteca', 'root', '', {host: 'localhost', dialect: 'mysql'});
sequelize.authenticate().then( function(){
    console.log('conectado')
}).catch(function (err){
console.log('falha ao se conectar' + err)
})