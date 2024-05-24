const express = require("express")
const app = express();
// const fs = require("fs")
const session = require("express-session")
const port = 4400
const mysql = require("mysql2")
const sendemail = require(__dirname + "/methods/sendemail")
const forgotpassword = require(__dirname + "/methods/forgotpassword")

const multer = require("multer")
const upload = multer({ dest: __dirname + "/uploads" })



app.use(express.static(__dirname + "/images"))
app.use(express.static(__dirname + "/uploads"))
// app.use(express.static(__dirname+"/public"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

let ejs = require("ejs");
const { send } = require("process");
const { error } = require("console");
app.set("view engine", "ejs")
app.set("views", __dirname + "/ejsfiles")


app.use(express.static(__dirname + "/images"))
// app.use(express.static(__dirname+"/public"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())


const connec = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Ab@9697194840',
  database: 'ecom4',
});

connec.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database: ' + error.stack);
    return;
  }

  console.log('Connected to MySQL database as ID ' + connec.threadId);
});

app.use(session({
  secret: "keyword cat",
  resave: "false",
  saveUninitialized: "true"
}))

//   connec.query('SELECT * FROM data', (error, results) => {
//     if (error) {
//       console.error('Error executing query: ' + error.stack);
//       return;
//     }

//     console.log('Query results:', results);
//   });

//   connec.end((error) => {
//     if (error) {
//       console.error('Error closing database connection: ' + error.stack);
//       return;
//     }

//     console.log('MySQL connection closed.');
//   });

app.get("/", function (req, res) {
  res.render(__dirname + "/ejsfiles/root.ejs",{name:"GUEST USER",email:""})
})

app.get("/signup", function (req, res) {
  res.render(__dirname + "/ejsfiles/signup.ejs", { message: "" })
})


app.get("/login", function (req, res) {

  if (req.session.isloggedin) {
    console.log("here")
    res.render(__dirname + "/ejsfiles/home.ejs", { name: req.session.details.name, email: req.session.details.email })
    return
  }
  if (!req.session.isloggedin) {
    console.log("hererere")
    res.render(__dirname + "/ejsfiles/login.ejs", { message: "" })
    return
  }

  console.log("here3")

  res.render(__dirname + "/ejsfiles/login.ejs", { message: "" })
})


app.get("/home", function (req, res) {

  if (!req.session.isloggedin) {
    console.log("hererere")
    res.render(__dirname + "/ejsfiles/login.ejs", { message: "please login first" })
    return
  }

  console.log(req.body)

  if (req.session.isloggedin) {
    i = 0
    res.render(__dirname + "/ejsfiles/home.ejs", { name: req.session.details.name, email: req.session.details.email })
  }
})

app.use(express.static(__dirname + "/public"))



app.post("/signup", function (req, res) {

  console.log(req.body)
  let username = req.body.username
  let email = req.body.email
  let user = req.body


  connec.query(`SELECT * FROM data where username = '${username}'or email = '${email}';`, (error, results) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return;
    }
    console.log('Query results:', results);
    if (!results.length == 0) {
      console.log("Account already in database")
      res.send("1")
    }
    else {
      user.isverified = false
      user.mailtoken = Date.now()
      console.log(user)
      console.log(user.email)
      console.log("Account doesn't exist so creating a new one")
      connec.query(`insert into data values('${user.username}','${user.email}','${user.name}','${user.password}','${user.isverified}','${user.mailtoken}',${0});`, (err, results) => {
        if (err) {
          console.log("error occured",err)
        }
        else {
          sendemail(user.email, user.mailtoken, function (err, data) {
            if (err) {
              res.send("1")
              return;
            }
            res.send("0")
            return;
          })
        }
      })
    }
  });



  //       connec.end((error) => {
  //         if (error) {
  //           console.error('Error closing database connection: ' + error.stack);
  //           return;
  //         }

  //         console.log('MySQL connection closed.');
  //       });

})
let i = 0;
// let j=4;

app.get("/getdetails", function (req, res) {
  // fs.readFile(__dirname + "/productdata.json", "utf-8", function (err, data) {
  //     if (err) {
  //         console.log("error occured while opening file productdata.json")
  //     }
  //     else {
  //         let prodlist = JSON.parse(data)
  //         let prodsend = prodlist.slice(i, i + 5)
  //         i = i + 5;

  //         if (prodlist.length - i > 0) {
  //             prodsend.push(1)
  //         }
  //         else {
  //             prodsend.push(0)
  //         }

  //         res.send(prodsend)
  //     }
  // })
  // connec.query(`select * from productdata where id between ${i} and ${i + 4};`, function (err, result) {
  connec.query(`SELECT * FROM productdata ORDER BY id ASC LIMIT ${i},5;`, function (err, result) {
    if (err) {
      console.log("error occoured:", err.stack)
    }
    else {
      console.log(result)
      console.log(i)
      i = i + 5;
      console.log(i)

      if (result.length == 5) {
        console.log(result.length)
        result.push(1)
      }
      else {
        console.log(result.length)
        result.push(0)
      }
      result = JSON.stringify(result)
      res.send(result)

    }
  })
})

app.get("/verifyemail/:token", function (req, res) {
  const { token } = req.params
  console.log(token)
  // fs.readFile(__dirname + "/data.json", "utf-8", function (err, data) {
  //     if (data.length > 0) {
  //         data = JSON.parse(data)
  //     }

  //     for (let i = 0; i < data.length; i++) {
  //         let user = data[i]
  //         console.log(user.mailtoken)
  //         if (user.mailtoken == token) {
  //             console.log(req.session)

  //             data[i].isverified = true
  //             fs.writeFile(__dirname + "/data.json", JSON.stringify(data), function (err) { })


  //             res.render(__dirname + "/ejsfiles/login", { message: "email verified you can now login" })
  //             return
  //         }
  //     }
  // })

  connec.query(`select isverified from data where mailtoken = ${token};`, function (err, result) {
    if (err) {
      console.error('Error executing query: ' + error.stack);
      return;
    }
    else if (result.length == 0) {
      console.log("No such account already in database")
      res.send("1")
      return
    }
    else {
      connec.query(`update data set isverified = 'true' where mailtoken = ${token};`, function (err, result) {
        // res.render(__dirname+"/ejsfiles/login.ejs")
        if (err) {
          console.log("error occured: ", err.stack)
        }
        else {
          console.log("done")
          res.render(__dirname + "/ejsfiles/login", { message: "" })
        }
      })
    }
  })
})

app.post("/login", function (req, res) {
  console.log(req.body)
  username = req.body.username
  password = req.body.password
  // fs.readFile(__dirname + "/data.json", "utf-8", function (err, data) {
  //     if (err) {
  //         console.log("error")
  //     }
  //     else {
  //         let todos;
  //         console.log(data.length)
  //         if (data.length === 0) {
  //             console.log("hrere")
  //             res.redirect("/signup")
  //             return
  //         }
  //         else {
  //             // console.log(data)
  //             // todos = JSON.parse(data)
  //             let flag = 0;
  //             todos = JSON.parse(data)
  //             for (let element of todos) {
  //                 if (req.body.username == element.username) {
  //                     if ((req.body.password) == element.password) {
  //                         req.session.isloggedin = true
  //                         req.session.details = element
  //                         flag = 1;
  //                         res.redirect("/home")
  //                         return;
  //                     }
  //                 }
  //             }
  //             if (flag == 0) {
  //                 console.log("wrong password")
  //                 res.render(__dirname + "/ejsfiles/login.ejs", { message: "Warning: Invalid username or password" })
  //             }
  //         }
  //     }

  // })

  connec.query(`select * from data where username='${username}' and password = '${password}'`, function (err, result) {
    if (result.length == 0) {
      console.log("no such user")
      console.log("wrong password")
      res.render(__dirname + "/ejsfiles/login.ejs", { message: "Warning: Invalid username or password" })
    }
    else {
      console.log(result)
      console.log(result[0].isverified)
      if (result[0].isverified=="false"){
        res.render(__dirname + "/ejsfiles/login.ejs", { message: "Warning: User not verified" } )
      return}
        
        else{
          req.session.details = result[0]
          req.session.isloggedin = true
        console.log(req.session)
        res.redirect("/home")
        }


    }
  })

})


app.post("/addtocart", function (req, res) {
  console.log(req.body)
  let username = req.session.details.username;
  let itemid = req.body.itemid
  quantity = 1;
  connec.query(`select * from cart where username = "${username}" and itemid = ${itemid}`, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    else {
      if (result.length == 0) {
        console.log(result)
        connec.query(`insert into cart values('${username}',${itemid},${quantity})`)
        res.send("0")
      }
      else if (result.length == 1) {
        console.log(result)
        let quan = result[0].quantity;

        // quan = quan+1;
        // console.log(quan)
        // let z = result[0].quantity++
        // console.log(z)
        // console.log(result[0].quantity)
        // connec.query(`update cart set quantity = ${quan} where username = "${username}" and itemid = ${itemid}`)

        res.send("1")
      }
      else {
        console.log(result)
        console.log("duplicate entries found")
        res.send("nothing occured")
      }

    }
  })
})

app.get("/viewcart", function (req, res) {
  if (!req.session.isloggedin) {
    console.log("hererere")
    res.render(__dirname + "/ejsfiles/login.ejs", { message: "" })
    return
  }
  res.render(__dirname + "/ejsfiles/cart.ejs", { name: req.session.details.name, email: req.session.details.email })
  return
})

app.get("/gotocart", function (req, res) {
  connec.query(`select * from cart where username = '${req.session.details.username}'`, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    else {
      if (result.length == 0) {
        res.end();
      }
      else {
        console.log(result)
        let senddata = []
        let flag = result.length;
        console.log(flag)
        for (let i = 0; i < result.length; i++) {
          connec.query(`select * from productdata where id = ${result[i].itemid}`, function (err, proresult) {

            let tempdata = { item: proresult[0], quantity: result[i].quantity }
            console.log(senddata)
            senddata.push(tempdata)
            flag--;
            console.log(flag)
            if (flag == 0) {
              senddata = JSON.stringify(senddata)
              res.send(senddata)
              return

            }

          })
        }







      }
    }
  })
})


app.post("/increasecount", function (req, res) {
  console.log(req.body)
  let itemid = req.body.itemid
  let username = req.session.details.username

  connec.query(`select * from cart where username = '${username}' and itemid = ${itemid}`, function (err, result) {
    connec.query(`select quantity from productdata where id = ${itemid}`, function (err, proresult) {
      console.log(proresult)
      console.log(result[0].quantity)
      if (result[0].quantity + 1 <= proresult[0].quantity) {
        connec.query(`update cart set quantity = ${result[0].quantity + 1} where username = "${username}" and itemid = ${itemid}`)
        res.send(`${result[0].quantity + 1}`)
        return
      }
      else {
        res.send('-1')
      }
    })
  })
})
app.post("/decreasecount", function (req, res) {
  console.log(req.body)
  let itemid = req.body.itemid
  let username = req.session.details.username

  connec.query(`select * from cart where username = '${username}' and itemid = ${itemid}`, function (err, result) {
    connec.query(`select quantity from productdata where id = ${itemid}`, function (err, proresult) {
      console.log(proresult)
      console.log(result[0].quantity)
      if (result[0].quantity - 1 > 0) {
        connec.query(`update cart set quantity = ${result[0].quantity - 1} where username = "${username}" and itemid = ${itemid}`)
        res.send(`${result[0].quantity - 1}`)
        return
      }
      else {
        res.send('-1')
      }
    })
  })
})

app.post("/deletedata", function (req, res) {
  itemid = req.body.itemid
  connec.query(`delete from cart where username = '${username}' and itemid = ${itemid}`, function (err, result) {
    if (err) {
      console.log(err.stack)
      res.send('-1')
      return
    }
    else {

      res.send('1')
      return
    }



  })
})
app.post("/deleteproduct", function (req, res) {
  itemid = req.body.itemid
  itemid = parseInt(itemid)
  connec.query(`delete from productdata where id = ${itemid}`, function (err, result) {
    if (err) {
      console.log(err.stack)
      res.send('-1')
      return
    }
    else {

      connec.query(`delete from cart where itemid = ${itemid}`, function (err, result) {
        if(err){
          console.log("error")
        }
        else{
          console.log(result)

        }
      })

      res.send('1')
      return
    }



  })
})

app.get("/admincontrol", function (req, res) {

  if (!req.session.isloggedin) {
    console.log("hererere")

    res.render(__dirname + "/ejsfiles/login.ejs", { message: "Please login" })
    return
  }
  else if(req.session.isloggedin && req.session.details.isadmin==0){

    res.send("User not authorized to use this page")
    return

  }
  i = 0
  res.render(__dirname + "/ejsfiles/admincontrol.ejs", { name: req.session.details.name, email: req.session.details.email })
})

app.get("/admin", function (req, res) {

  if (!req.session.isloggedin && !req.session.details.isadmin) {
    console.log("hererere")
    res.render(__dirname + "/ejsfiles/login.ejs", { message: "" })
    return
  }

  res.render(__dirname + "/ejsfiles/addproduct.ejs", { name: req.session.details.name, email: req.session.details.email })
  return;


})


app.post("/addproducts", upload.single("pic"), function (req, res) {
  console.log(req.body)
  console.log(req.file)
  let { name, description, price, category, quantity } = req.body
  console.log(name)
  console.log(description)
  console.log(typeof (price))
  console.log(quantity)
  let image = req.file.filename

  connec.query(`insert into productdata(name,description,image,price,category,quantity) values('${name}' ,'${description}' ,'${image}',${parseFloat(price)},'${category}',${parseInt(quantity)});`, function (err, result) {

    if (err) {
      console.log(err.stack)
      res.send("-1")
    }
    else {
      console.log(result)
      res.send('1')
    }
  })
})

app.post("/prodetail", function (req, res) {
  let itemid = req.body.itemid
  connec.query(`select * from productdata where id = '${itemid}';`, function (err, result) {

    let senddata = result[0]
    senddata = JSON.stringify(senddata)
    res.send(senddata)
    return;
  })
})

app.post("/updatedata", function (req, res) {
  console.log(req.body)
  let { id, naem, description, price, category, quantity } = req.body
  console.log(naem)
  connec.query(`update productdata set name = '${naem}',description = '${description}',price = ${price},category = '${category}',quantity = ${quantity} where id = ${id};`, function (err, result) {
    if (err) {
      console.log(err.stack)
      res.send("-1")
    }
    else {
      console.log(result)
      res.send("1")
    }
  })
})

app.get("/changepassword", function (req, res) {
  console.log(req.session.isloggedin)

  if (!req.session.isloggedin) {
    res.render(__dirname + "/ejsfiles/login.ejs", { message: "please login first" })
    return
  }
  res.render(__dirname + "/ejsfiles/cp.ejs", { error: "" })
})

app.post("/changepassword", function (req, res) {
  console.log(req.body)
  console.log(req.session.details)
  console.log(req.session.isloggedin)
  if (!req.session.isloggedin) {
    console.log("cp1")
    req.session.destroy();
    res.redirect("/")
  }

  else if (req.body.opassword == req.body.npassword || req.body.opassword != req.session.details.password) {

    console.log("cp2")
    console.log(req.body.opassword)
    console.log(req.session.details.password)
    if (req.body.opassword != req.session.details.password) {
      console.log("cp21")

      // res.render(__dirname + "/ejsfiles/cp.ejs", { error: "Error: wrong old password" })
      res.send("-1")
      return
    }
    else {
      console.log("cp22")

      // res.render(__dirname + "/ejsfiles/cp.ejs", { error: "Error: old password and new password cannot be same" })
      res.send("-1")
      return
    }
  }
  else {
    console.log("cp3")

    // fs.readFile(__dirname + "/data.json", "utf-8", function (err, data) {
    //     if (err) {
    //         console.log("error")
    //     }
    //     else {
    //         if (data.length == 0) {
    //             console.log("length=0")
    //             return
    //         }

    //         else {

    //             data = JSON.parse(data)
    //             for (let i = 0; i < data.length; i++) {
    //                 if (data[i].mailtoken == req.session.details.mailtoken) {

    //                     data[i].password = req.body.newpassword

    //                     fs.writeFile(__dirname + "/data.json", JSON.stringify(data), function (err, data) {
    //                         if (err) {
    //                             console.log("error")
    //                         }
    //                         else {
    //                             res.redirect("/logout")
    //                             return

    //                         }


    //                     })

    //                 }
    //             }
    //         }
    //     }


    // })
    connec.query(`select * from data where mailtoken = ${req.session.details.mailtoken}`, function (err, result) {
      if (err) {
        console.log(err.stack)
      }
      else {
        console.log(result)
        if (result.length == 1) {
          connec.query(`update data set password = '${req.body.npassword}' where username = '${req.session.details.username}';`)
          res.send("0");
        }

      }
    })
  }
})

app.get("/forgotpassword", function (req, res) {
  console.log(req.session.isloggedin)
  res.render(__dirname + "/ejsfiles/fp.ejs", { error: "" })
})

app.post("/forgotpassword", function (req, res) {
  console.log(req.body);
  let { username, email, name } = req.body

  connec.query(`select * from data where username = '${username}' and email = '${email}' and name = '${name}';`, function (err, result) {
    if (err) {
      console.log(err.stack)

    }
    else {
      if (result.length == 1) {
        console.log(result)
        forgotpassword(email, name, function (err, data) {
          if (err) {
            return

          }
          else {
            console.log("about to redirect to login")
            res.render(__dirname + "/ejsfiles/login.ejs", { message: "A link has been sent to your registered email to change password" })
            return
          }
        })

      }
      else {
        console.log("no such account")
      }


    }
  })

})

app.get("/changepass/:email", function (req, res) {


  const { email } = req.params

  console.log(email)
  res.render(__dirname + "/ejsfiles/rp.ejs", { error: "" })
  return
})

app.post("/resetpassword", function (req, res) {
  console.log(req.body)
  let { username, email, name, password } = req.body
  //  fs.readFile(__dirname + "/data.json", "utf-8", function (err, data) {
  //     if (data.length > 0) {
  //         data = JSON.parse(data)
  //     }

  //     for (let i = 0; i < data.length; i++) {
  //         let user = data[i]
  //         if (user.email == req.body.email) {
  //             console.log(req.session)

  //             data[i].password = req.body.password

  //             fs.writeFile(__dirname + "/data.json", JSON.stringify(data), function (err) { })

  //             console.log(data)


  //             res.render(__dirname + "/ejsfiles/login.ejs", { message: "password changed successfully, you can now login" })
  //             return
  //         }
  //     }
  // })

  connec.query(`update data set password = '${password}' where username = '${username}' and email='${email}';`, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    else {
      res.render(__dirname + "/ejsfiles/login.ejs", { message: "Password changed successfully, you can login now" })
    }

  })

})

app.get("/logout", (req, res) => {

  if (!req.session.isloggedin) {
    res.render(__dirname + "/ejsfiles/login.ejs", { message: "please login first" })
    return
  }
  req.session.destroy();
  res.redirect("/")
})








app.listen(port, () => {
  console.log(`server running at port ${port}`)
})