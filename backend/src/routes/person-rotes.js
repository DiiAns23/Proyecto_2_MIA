const { Router } = require('express');
const router = Router();
const Proyecto = require('../config/configdb');
const sha1 = require('sha1')

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

// GET NO FRIENDS

router.put('/getNoFriends', async(req, res)=>{
    const{id} = req.body;
    var ids = id.split(',');
    sql = "select iduser, name,image from USER_ WHERE "
    for(var i = 0; i<ids.length; i++){
        sql += "iduser!="+ ids[i]+" AND "
    }
    sql = sql.substring(0,sql.length-4);
    sql += "order by username";
    let result = await Proyecto.Open(sql,[],false);
    Users = [];
    result.rows.map(user=>{
        let userSchema = {
            "id":user[0],
            "name": user[1],
        }
        Users.push(userSchema);
    })
    res.json(Users);
})

// GET PUBLICATIONS

router.put('/getPublications', async(req,res)=>{
    const {id} = req.body;
    var ids = id.split(',')
    sql = "select * from PUBLICATION WHERE "
    for(var i=0; i<ids.length; i++){
        sql += "iduser="+ ids[i]+" OR "
    }
    sql = sql.substring(0,sql.length-3);
    sql += "order by idpublication DESC";
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

//CREATE NEW USER

router.post('/addUser', async (req, res) => {
    const { name, username, password, image } = req.body;
    const pass = sha1(password);
    sql= `
    BEGIN
        insertar_user(:name,:username,:pass,:image);
    COMMIT;
    END;`
    await Proyecto.Open(sql, [name, username, pass,image], true);

    res.status(200).json({
        "name": name,
        "username": username,
        "password": pass,
        "image": image
    })
})

//UPDATE USER

router.put("/updateUser", async (req, res) => {
    const { 
        name_,
        username_,
        image_, 
        password_,
        usernameantiguo
    } = req.body;
    console.log("Password enviada sin encriptar: ", password_)
    const pass = sha1(password_)
    let userSchema;
    sql2 = "select * from User_ where username=:username_"
    result = await Proyecto.Open(sql2, [usernameantiguo], true)
    result.rows.map(user => {
        userSchema = {
            "id": user[0],
            "name": user[1],
            "username": user[2],
            "password": user[3]
        }  
    })
    console.log(userSchema['password']," Esta seria la que esta en la base de datos")
    console.log(pass, "Esta es la que yo estoy mandando :c ")
    if((userSchema['password'])== pass){
        sql = "update User_ set name=:name_ , username=:username_, image=:image_ where username=:usernameantiguo and password=:pass";
        await Proyecto.Open(sql, [ name_, username_,image_,usernameantiguo, pass], true);
        res.status(200).json({
            "name": name_,
            "username": username_,
            "image": image_,
        })
    }
    else{
        res.status(200).json({
            "name": "null",
            "username": "null",
            "image": "null"
        })
    }  

})

//LOGIN 

router.post("/login",async (req,res)=>{
    const{username,password} = req.body;
    const pass = sha1(password);
    sql2 = `
    BEGIN 
        Login(:username,:pass);
    END;    
    `
    let result = await Proyecto.Open(sql2,[username, pass], false);
    if(result.implicitResults[0].length > 0) {
        res.status(201).json({
            msg: true,
            DataUser: {
                "iduser": result.implicitResults[0][0][0],
                "name": result.implicitResults[0][0][1],
                "username": result.implicitResults[0][0][2],
                "password": result.implicitResults[0][0][3],
                "image": result.implicitResults[0][0][4]
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
})

//NEW POST

router.post("/newPost", async (req,res)=>{
    const {text, iduser,image, tag} = req.body;
    sql= "insert into PUBLICATION(text,iduser,image) values (:text,:iduser,:image)";
    sql2 = "select idpublication from PUBLICATION WHERE text =:text AND iduser=:iduser AND image=:image";
    sql3 = "insert into TAGS(tag, idpublication) values(:tg,:idpublication)";
    console.log(req.body," Estos datos llegaron a la Api")
    var tags = tag.split("#")
    console.log("Variabla ya spliteada:",tags)
    await Proyecto.Open(sql, [text,iduser,image] , true); //insert publication
    let result = await Proyecto.Open(sql2,[text,iduser,image], true); //obtener el id de la publicacion
    let idpublication = -1;
    result.rows.map(id=>{
        idpublication = id[0]
    })
    console.log("Antes de entrar para hacer el #tag de la publicacion:")
    if(tags!=[] && idpublication!=-1){
        for(var a = 1; a<tags.length; a++){
            var tg = tags[a]
            console.log("Se enviaron estos datos: tag:", tg, " idpublicacion: ",idpublication)
            await Proyecto.Open(sql3, [ tg , idpublication] , true); //insert tag
        }
    }   
    res.status(200).json({
        "text": text,
        "iduser": iduser,
        "image":image
    });
})

//GET FRIENDS

router.put('/getFriends', async (req, res) => {
    const {iduser} = req.body;
    sql = "select iduser,idfriend1 from FRIEND WHERE iduser = :iduser OR idfriend1 = :iduser";
    let result = await Proyecto.Open(sql, [iduser], false);
    Users = [];
    Users2 = [];
    result.rows.map(user => {
        let userSchema = {
            "id1": user[0],
            "id2": user[1],
        }  
        Users.push(userSchema);
    })
    for(var i=0; i < Users.length; i++){
        var id = -1;
        if(Users[i]['id1'] != iduser){
            id = Users[i]['id1'];
            sql2 = "select iduser, name  from User_ WHERE iduser = :id"
        }else{
            id = Users[i]['id2'];
            sql2 = "select iduser, name  from User_ WHERE iduser = :id"
        }
        let result2 = await Proyecto.Open(sql2,[id], false);
        result2.rows.map(user=>{
            let userSchema1={
            "id": user[0],
            "name": user[1]
            }
            Users2.push(userSchema1)
        })
    }
    res.json(Users2);
})

// SET FRIENDLY REQUEST

router.put('/setFR', async (req,res)=>{
    const {iduser,iduser2} = req.body;
    sql= "insert into FRIEND_REQUEST(iduser1,iduser2) values (:iduser,:iduser2)";
    await Proyecto.Open(sql, [iduser,iduser2] , true);
    res.status(200).json({
        "iduser": iduser,
        "iduser2": iduser2
    });
})

// GET FRIENDLY REQUEST

router.put('/getFR', async(req,res)=>{
    const {iduser} = req.body;
    sql = "select * from FRIEND_REQUEST WHERE iduser2=:iduser";
    let result = await Proyecto.Open(sql, [iduser], false);
    Users = [];
    Users2 = [];
    result.rows.map(user => {
        let userSchema = {
            "iduser": user[1],
            "iduser2": user[2],
        }  
        Users.push(userSchema);
    })
    for(var i=0; i < Users.length; i++){
        var id = -1;
        if(Users[i]['iduser'] != iduser){
            id = Users[i]['iduser'];
            sql2 = "select iduser, name  from User_ WHERE iduser = :id"
        }else{
            id = Users[i]['iduser2'];
            sql2 = "select iduser, name  from User_ WHERE iduser = :id"
        }
        let result2 = await Proyecto.Open(sql2,[id], false);
        result2.rows.map(user=>{
            let userSchema1={
            "id": user[0],
            "name": user[1]
            }
            Users2.push(userSchema1)
        })
    }
    res.json(Users2);
})

// GET SET FRIENDLY REQUEST

router.put('/getsetFR', async(req, res)=>{
    const { iduser } = req.body
    sql = "select * from Friend_Request where iduser1=: iduser"
    let result = await Proyecto.Open(sql, [iduser], false);
    Users = [];
    result.rows.map(user => {
        let userSchema = {
            "iduser": user[1],
            "iduser2": user[2],
        }  
        Users.push(userSchema);
    })
    res.json(Users)
})

//DELETE FRIEND REQUEST 

router.delete("/deleteFR/:iduser1/:iduser2", async (req, res) => {
    const { iduser1, iduser2 } = req.params;
    sql = "delete from Friend_Request where iduser1=:iduser1 AND iduser2=:iduser2";
    await Proyecto.Open(sql, [iduser1, iduser2], true);
    res.json({ "msg": "Usuario Eliminado" })
})

//ACEPT FRIEND

router.post('/AceptFriend', async(req, res)=>{
    const { iduser1, iduser2 } = req.body;
    sql = "insert into Friend(iduser,idfriend1) values(:iduser1, :iduser2)"
    await Proyecto.Open(sql, [iduser1, iduser2],true);
    res.status(200).json({
        "msg": "Nuevo Amigo Agregado :3"
    });
})

// FILTER PUBLICATION

router.put('/Filter', async(req,res)=>{
    const { tag } = req.body;
    var aux  = tag;
    sql = "select * from TAGS where tag=:aux"
    let result = await Proyecto.Open(sql,[aux],false);
    Filter = [];
    result.rows.map(filt =>{
        let filtt = {
            "id": filt[0],
            "text": filt[1],
            "idUser": filt[2]
        }
        Filter.push(filtt)
    })
    res.json(Filter)

})

router.get("/", async (req,res) => {
    sql = "select * from User_ Proyecto";
    let result = await Proyecto.Open(sql,[], false);
    console.log(result);
    res.status(200).json({msg:"Todo ok"}); 

})
module.exports = router;