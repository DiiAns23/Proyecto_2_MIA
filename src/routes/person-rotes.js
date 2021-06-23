const { Router } = require('express');
const router = Router();
const Practica1 = require('../config/configdb');

//READ
router.get('/getUsers', async (req, res) => {
    sql = "select * from Prueba1";

    let result = await Practica1.Open(sql, [], false);
    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "id": user[0],
            "Nombre": user[1],
            "Apellido": user[2]
        }

        Users.push(userSchema);
    })
    res.json(Users);
})

//CREATE

router.post('/addUser', async (req, res) => {
    const {  firstname, lastname } = req.body;

    sql = "insert into Prueba1 values (:firstname,:lastname)";

    await Practica1.Open(sql, [firstname, lastname], true);

    res.status(200).json({
        "firstname": firstname,
        "lastname": lastname
    })
})

//UPDATE
router.put("/updateUser", async (req, res) => {
    const { 
        codu,  
        firstname, 
        lastname } = req.body;

    sql = "update person set username=: firstname=:firstname, lastname=:lastname where codu=:codu";

    await Practica1.Open(sql, [ firstname, lastname,codu], true);

    res.status(200).json({
        "codu": codu,
        "username": username,
        "firstname": firstname,
        "lastname": lastname
    })

})


//DELETE
router.delete("/deleteUser/:codu", async (req, res) => {
    const { codu } = req.params;

    sql = "update person set state=0 where codu=:codu";

    await Practica1.Open(sql, [codu], true);

    res.json({ "msg": "Usuario Eliminado" })
})

router.get("/", async (req,res) => {
    sql = "select * from Practica1";
    let result = await Practica1.Open(sql,[], false);
    console.log(result);
    res.status(200).json({msg:"Todo ok"}); 
})


module.exports = router;