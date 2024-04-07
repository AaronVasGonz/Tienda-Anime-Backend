const mysql = require('mysql');

const createConnection = () => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'tienda_anime'
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.log('Error de conexión:', err);
        reject(err);
      } else {
        console.log('Conexión establecida con la base de datos MySQL');
        resolve(connection);
      
      }
    });
  });
};

module.exports = createConnection;

  



 function checkingExistingEmail(email, callback){
  
  
 }