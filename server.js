const express = require("express");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
// app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


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

//Create Database

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

app.use(express.static(__dirname));

// routes
// start server -- npm start
// domain http://127.0.0.1:3000/

app.get("/babita-form", (req, res) => {
  console.log(__dirname)
  res.sendFile(__dirname + '/index.html');
});


app.post('/test', (req, res) => {
  sql = `Delete from users where id = ${req.body.userId} `
  connectionStr.query(sql, function (err, result) {
    if (err) throw err;
    console.log("user deleted");
  });
  return res.redirect(req.get('/getUserDetails'));
})

app.post('/deleteAllIds', (req, res) => {
  //  console.log(`${req.body.userId}`)
  if (req.body.userId.length != 0) {
    sql = `Delete from users where id in (${req.body.userId})`
    console.log(sql)
    connectionStr.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Selected users deleted");
    });
  }
  return res.redirect(req.get('/getUserDetails'));
})

app.post('/editAllIds', (req, res) => {
  console.log(`${req.body.userId}`)
  return res.redirect(req.get('/getUserDetails'));
})

app.post('/bulkUpdate', (req, res) => {
  for (i in req.body.users) {
    sql = `UPDATE users SET Name = '${req.body.users[i].Name}' , Address = '${req.body.users[i].Address}',
  Phone ='${req.body.users[i].Phone}', DOB = '${req.body.users[i].DOB}' WHERE id =${req.body.users[i].userId} `
  
  console.log(sql)
  connectionStr.query(sql, function (err, result) {
    if (err) throw err;
    console.log("All details updated");
  });
}
  return res.redirect(req.get('/getUserDetails'));
})

app.post('/update', (req, res) => {
  sql = `UPDATE users SET Name = '${req.body.userInfo.Name}' , Address = '${req.body.userInfo.Address}',
Phone ='${req.body.userInfo.Phone}', DOB = '${req.body.userInfo.DOB}' WHERE id =${req.body.userInfo.userId} `
  console.log(sql)
  connectionStr.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Details updated");
  });
  return res.redirect(req.get('/getUserDetails'));
})

app.get("/getUserDetails", (req, res) => {
  let sql = "Select * from users;"

  let style = `<style> table, th, td  {border:1px solid black; padding: 2px;background-color: #f2f2f2;
    font-family: Arial, Helvetica, sans-serif;text-align: left; 
  };
   </style>`;

  let script = `
  <script>
  this.collectiveEdit = []
 
function editClick(userId){
  editColumn = document.getElementsByClassName("xyz_"+userId)
  let editButton = document.getElementById("edit_"+userId)
  for(i in editColumn ){
    editButton.disabled= true
    editColumn[i].contentEditable = true
    
    //editColumn[i].style.border = '1px solid red';
  }
}



let object = {}
function onSave(userId){
let saveColumn = document.getElementsByClassName("xyz_"+userId)
for(i in saveColumn){
object.userId = saveColumn[0].innerHTML
object.Name = saveColumn[1].innerHTML
object.Address = saveColumn[2].innerHTML
object.Phone = saveColumn[3].innerHTML
object.DOB = saveColumn[4].innerHTML
}
console.log(object)
fetch("/update", {
  method: "POST",

  // Adding body or contents to send
    body: JSON.stringify({
     userInfo: object
     }),
    headers: {
    "Content-type": "application/json; charset=UTF-8"
    }

 })

// Converting to JSON
.then(response => response.json()) //igonre this

// Displaying results to console
.then((json) => {
console.log(json)
})
}

function deleteFunction(userId){
    alert("Are you sure you want to delete")

    fetch("/test", {
              method: "POST",

              // Adding body or contents to send
                body: JSON.stringify({
                 userId: userId
                 }),
                headers: {
                "Content-type": "application/json; charset=UTF-8"
                }

             })

  // Converting to JSON
  .then(response => response.json()) //igonre this

  // Displaying results to console
  .then((json) => {
      console.log(json)
  })

}


function onSelect(userId){
let checkbox = document.getElementById("name_"+userId)
if(checkbox.checked){
  this.collectiveEdit.push(userId)
}
else{
  this.collectiveEdit = this.collectiveEdit.filter(function(e){
     return e != userId
    })
}
console.log(this.collectiveEdit)
}


let collectiveArr = []
function saveAll(){
for(i in this.collectiveEdit){
let object1 = {}
let saveAllId = document.getElementsByClassName("xyz_"+this.collectiveEdit[i]) 
object1.userId = saveAllId[0].innerHTML
object1.Name = saveAllId[1].innerHTML
object1.Address = saveAllId[2].innerHTML
object1.Phone = saveAllId[3].innerHTML
object1.DOB = saveAllId[4].innerHTML
collectiveArr.push(object1)
}


fetch("/bulkUpdate", {
  method: "POST",

  // Adding body or contents to send
  body: JSON.stringify({
    users: collectiveArr
  }),

  // Adding headers to the request

  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }

})

// Converting to JSON
.then(response => response.json()) //igonre this

// Displaying results to console
.then((json) => {
    console.log(json)
});


}



function editAll(){
if(this.collectiveEdit.length!=null){
  for(i in this.collectiveEdit){
    editClick(this.collectiveEdit[i])
  }
}

fetch("/editAllIds", {
  method: "POST",

  // Adding body or contents to send
  body: JSON.stringify({
    userId: this.collectiveEdit
  }),

  // Adding headers to the request

  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }

})

// Converting to JSON
.then(response => response.json()) //igonre this

// Displaying results to console
.then((json) => {
    console.log(json)
});


}

function deleteAll(userId){
alert("Are you sure you want to delete")
console.log(this.collectiveEdit)

fetch("/deleteAllIds", {
  method: "POST",

  // Adding body or contents to send
  body: JSON.stringify({
    userId: this.collectiveEdit
  }),

  // Adding headers to the request

  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }

})

// Converting to JSON
.then(response => response.json()) //igonre this

// Displaying results to console
.then((json) => {
    console.log(json)
});

}

      </script>`
  let Edit = `<button type="button" onclick="editClick()" >Edit</button>`
  let Delete = `<button type="button" onclick="deleteFunction()">Delete</button>`
  let header = `<tr> 
  <th>SNo</th>
  <th>CheckBox</th>
  <th>Name</th>
  <th>Address</th>
  <th>Phone</th>
  <th>DOB</th>
  <th>Action1</th>
  <th>Action3</th>
  <th>Action2</th>
</tr>`
  let Check = `<button type="button" onclick ="deleteAll()"> Collective Delete </button>`
  let CheckEdit = `<button type="button"  onclick ="editAll()"> Collective Edit </button>`
  let CollecSave = `<button type="button"  onclick ="saveAll()"> Collective Save </button>`
  let tableBody = ''
  let allNames = []
  connectionStr.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    for (i in result) {
      tb =
        `<tr>
        <td><div id = "abc" class= "xyz_${result[i].id}">${result[i].id}</div></td>
        <td><input type= "checkbox" id = "name_${result[i].id}"  onclick ="onSelect(${result[i].id})"></td>
        <td><div id = "abc" class= "xyz_${result[i].id}" >${result[i].name}</div></td>
        <td><div id = "abc" class = "xyz_${result[i].id}">${result[i].address}</div></td>
        <td><div id = "abc" class = "xyz_${result[i].id}">${result[i].phone}</div></td>
        <td><div id = "abc" class = "xyz_${result[i].id}">${result[i].dob}</div></td>
        <td><button type="button" id = "edit_${result[i].id}" onclick="editClick('${result[i].id}')" >Edit</button></td>
        <td><button type="button" id = "save_${result[i].id}" onclick="onSave('${result[i].id}')" >Save</button></td>
        <td><button type="button"  onclick="deleteFunction('${result[i].id}')">Delete</button></td>         
      </div> </tr>`
      tableBody += tb
    }

    res.send(
      `${style}
      ${script}
           <table>
           ${header}
           ${tableBody}
         </table>  
         ${Check}
         ${CheckEdit}
         ${CollecSave}
         `
    )
  })
});

app.post('/babita-form', (req, res) => {
  let name = req.body.name
  let address = req.body.address
  let phone = req.body.phone
  let dobb = req.body.DOB

  console.log(req.body)

  let sql = `INSERT INTO users (name, address, phone, dob) VALUES ("${name}","${address}","${phone}","${dobb}")`

  connectionStr.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  return res.redirect('/');
})