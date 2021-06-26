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

router.get('/getPublications', async(req,res)=>{
    sql = "select * from PUBLICATION order by idpublication DESC";
    let result = await Proyecto.Open(sql,[],false);
    Publications = [];

    result.rows.map(publication=>{
        let userSchema = {
            "id":publication[0],
            "text": publication[1],
            "idUser":publication[2],
            "image":publication[3]
        }
        Publications.push(userSchema);
    })
    res.json(Publications);
})
//CREATE

router.post('/addUser', async (req, res) => {
    const { name, username, password, image } = req.body;

    sql= `
    BEGIN
        insertar_user(:name,:username,:password,:image);
    COMMIT;
    END;`
    await Proyecto.Open(sql, [name, username, password,image], true);

    res.status(200).json({
        "name": name,
        "username": username,
        "password": password,
        "image": image
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

//LOGIN 
router.post("/login",async (req,res)=>{
    const{username,password} = req.body;
    sql = "Select iduser,name from USER_ where username=:username AND password=:password";
    sql2 = `
        DECLARE
            id_ user_.iduser%TYPE;
            nombre_ user_.name%TYPE;
        BEGIN
            retornar_user(:username,:password,id_,nombre_);
        END;
    `
    let result = await Proyecto.Open(sql,[username, password], false);
    if(result.rows.length > 0) {
        res.status(201).json({
            msg: true,
            DataUser: {
                "iduser": result.rows[0][0],
                "name": result.rows[0][1],
            }
        })
    }else{
        res.status(201).json({
            msg: false,
            DataUser:{
                'iduser': -1,
                'name': 'invalid'
            }
        })
    }
    //Aqui me quede hoy 23/06/2021 tengo que ir al Frontend a crear el Login


    

})

//NEW POST
router.post("/newPost", async (req,res)=>{
    const {text, iduser,image} = req.body;
    console.log(req.body)
    sql= "insert into PUBLICATION(text,iduser,image) values (:text,:iduser,:image)";
    await Proyecto.Open(sql, [text,iduser,image] , true);
    res.status(200).json({
        "text": text,
        "iduser": iduser,
        "image":image
    });
})

//GE FRIENDS
router.get('/getFriends', async (req, res) => {
    const {iduser,iduser2} = req.body;
    sql = "select * from FRIEND WHERE ";
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
//ADD FRIEND
router.post("/newPost", async (req,res)=>{
    const {iduser,iduser2} = req.body;
    console.log(req.body)
    sql= "insert into FRIEND_REQUEST(iduser,iduser2) values (:iduser,:iduser2)";
    await Proyecto.Open(sql, [iduser,iduser2] , true);
    res.status(200).json({
        "iduser": iduser,
        "iduser2": iduser2
    });
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