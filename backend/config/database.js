const {Sequelize} = require('sequelize')
const sequelize = new Sequelize('EmployeeManagement', 'root', 'Aditya!s123', {
    host: 'localhost',
    dialect: 'mysql',
});
module.exports = sequelize;
 