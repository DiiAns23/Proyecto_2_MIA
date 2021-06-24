const { Router } = require('express');
const router = Router();
const Proyecto = require('../config/configdb');

//READ
router.get('/getUsers', async (req, res) => {
    sql = "select * from USER_";
    let result = await Proyecto.Open(sql, [], false);
    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "id": user[0],
            "name": user[1],
            "username": user[2],
            "password": user[3]
        }  
        Users.push(userSchema);
    })
    res.json(Users);
})

//CREATE

router.post('/addUser', async (req, res) => {
    const { name, username, password } = req.body;

    sql = "insert into USER_(name,username,password) values (:name,:username,:password)";

    await Proyecto.Open(sql, [name, username, password], true);

    res.status(200).json({
        "name": name,
        "username": username,
        "password": password
    })
})

//UPDATE
router.put("/updateUser", async (req, res) => {
    const { 
        iduser,
        name,
        username, 
        password } = req.body;

    sql = "update USER_ set name=:name username=:username, password=:password where iduser=:iduser";

    await Practica1.Open(sql, [ iduser,name, username,password], true);

    res.status(200).json({
        "codu": codu,
        "username": username,
        "firstname": firstname,
        "lastname": lastname
    })

})


// //DELETE
// router.delete("/deleteUser/:codu", async (req, res) => {
//     const { codu } = req.params;

//     sql = "update person set state=0 where codu=:codu";

//     await Practica1.Open(sql, [codu], true);

//     res.json({ "msg": "Usuario Eliminado" })
// })

// router.get("/", async (req,res) => {
//     sql = "select * from Practica1";
//     let result = await Practica1.Open(sql,[], false);
//     console.log(result);
//     res.status(200).json({msg:"Todo ok"}); 
// })


module.exports = router;