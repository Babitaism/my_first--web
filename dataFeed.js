
const mysql = require('mysql');

// app.engine('html', require('ejs').renderFile);


const connectionStr = mysql.createConnection({
  host: 'localhost', user: 'root',
  password: 'babita_360703', database: 'babita_first_web'
})

//connect to mysql
connectionStr.connect(err => {
  if (err) {
    throw err
  }
  console.log("MYSQL Connected")
})




let object = {}
function insertLoop() {
    for (i = 1; i < 10; i++) {
        object.name = "ash" + i
        object.address = "gangaconstella" + i
        object.phone = "817824829" + i
        object.dob = "1990-05-15"
      result = console.log(object)
      let sql = `INSERT INTO users (name, address, phone, dob) VALUES ("${object.name}","${object.address}","${object.phone}","${object.dob}")`
      connectionStr.query(sql, function (err, result) {
        if (err) throw err;
        console.log("records inserted");
      });
    }
   
}
 final = insertLoop()




