DOCUMENTACION 📑
===================
## Indice 📚
- [Introduccion](#introduccion)
- [Arquitectura Implementada](#arqui)
- [Grafo Entidad-Relacion](#enti)
- [Endpoints](#end)
- [Stored Procedure](#estpro)
- [Version de Oracle](#oracle)
- [FAQ](#questions)

<div id='introduccion'/>

## Introducción 📕

Con la finalidad de la implementacion de `Bases de Datos` asi como `NodeJS` y `Angular` se llevo a cabo el Segundo Proyecto del curso _Manejo e Implementacion de Archivos_ , dicho programa cuenta con la finalidad de creacion de `Usuarios`, `Amigos` y `Publicaciones` así como herramientas que permiten un mejor control del programa. Se le asegura a cada usuario un almacenamiento de informacion único e intangible evitando así su robo de información.

<div id='arqui'/>

## Arquitectura Implementada 🔨

La `Arquitectura Implementada` de dicho proyecto fue de la siguiente manera:

![](https://github.com/DiiAns23/Prueba-2/blob/Master/Arquitectura.PNG)


<div id='enti'/>

## Grafo Entidad-Relacion 📊

![](https://github.com/DiiAns23/Prueba-2/blob/Master/Entidad-Relacion.png)



  - **User:** 
Esta tabla contiene la información de cada usuario registrado, en ella se encuentran datos como `nombre`, `usuario`, `contraseña` y si tuviera; una `imagen` de perfil. Como se puede observar, cada usuario puede realizar muchas `Publicaciones` asi como tener muchos `Amigos` y poseer muchas `Solicitudes de Amistad`, el usuario tambien podrá realizar `Mensajes` entre sus amigos.

  - **Publication:** 
Tabla en la cual se almacena la información de cada `Publicacion` realizada, esta tabla contiene la información del `Usuario` que realiza la publicación. Podemos observar que una `Publicación` puede tener muchos `Tags` siendo estos un tipo de identificador para cada publicación.

  - **Tags:** 
Esta tabla almacena un identificador para cada `Publicación` que se realice.

  - **Message:** 
El `Usuario` puede realizar muchos `Mensajes` con sus `Amigos`

  - **Friend_Request:**
Al momento que se es enviada una `Solicitud de Amistad`, el `Usuario` podrá ver las personas que le han mandado solicitud, para ello se utiliza la tabla _Friend Request_.

  - **Friend:**
Esta tabla contiene el identificador de los usuarios que son `Amigos` del usuario logueado. Un usuario puede poseer uno o muchos amigos.


<div id='end'/>

## Endpoints 📊

  - **Get Users**:
```typescript
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

// Devuelve la informacion de cada usuario alojado en la base de datos
```

  - **Get No Friends**:
```typescript
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

// Devuelve los usuarios que no son amigos del usuario logueado
```
  - **Get Publications**:
```typescript
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


// Devuelve las publicaciones de usuario logueado asi como las publicaciones de los amigos del usuario logueado
```

  - **Agregar Usuario**:
```typescript
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


// Inserta un nuevo usuario en la base de datos
```
  - **Actualizar Usuario**:
```typescript
router.put("/updateUser", async (req, res) => {
    const { 
        name_,
        username_,
        image_, 
        password_,
        usernameantiguo
    } = req.body;
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

// Actualiza la informacion del usuario en la base de datos
```
  - **Login**:
```typescript
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

// Realiza la petición de la información del usuario para el acceso a la página "Home"
```
  - **Nueva Publicación**:
```typescript
router.post("/newPost", async (req,res)=>{
    const {text, iduser,image, tag} = req.body;
    sql= "insert into PUBLICATION(text,iduser,image) values (:text,:iduser,:image)";
    sql2 = "select idpublication from PUBLICATION WHERE text =:text AND iduser=:iduser AND image=:image";
    sql3 = "insert into TAGS(tag, idpublication) values(:tg,:idpublication)";
    var tags = tag.split("#")
    await Proyecto.Open(sql, [text,iduser,image] , true); //insert publication
    let result = await Proyecto.Open(sql2,[text,iduser,image], true); //obtener el id de la publicacion
    let idpublication = -1;
    result.rows.map(id=>{
        idpublication = id[0]
    })
    if(tags!=[] && idpublication!=-1){
        for(var a = 1; a<tags.length; a++){
            var tg = tags[a]
            await Proyecto.Open(sql3, [ tg , idpublication] , true); //insert tag
        }
    }   
    res.status(200).json({
        "text": text,
        "iduser": iduser,
        "image":image
    });
})
// Agrega una nueva publicación a la base de datos
```

  - **Obtener Amigos**:
```typescript
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
// Realiza la consulta de los usuarios que son amigos del usuario logueado y los devuelve
```
  - **Devolver Solicitudes de Amistad**:
```typescript
router.put('/setFR', async (req,res)=>{
    const {iduser,iduser2} = req.body;
    sql= "insert into FRIEND_REQUEST(iduser1,iduser2) values (:iduser,:iduser2)";
    await Proyecto.Open(sql, [iduser,iduser2] , true);
    res.status(200).json({
        "iduser": iduser,
        "iduser2": iduser2
    });
})
// Realiza una solicitud de amistad
```
  - **Obtener Solicitudes de Amistad**:
```typescript
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
// Obtiene las solicitudes de amistad que se le han mandado al usuario logueado
```
  - **Obtener Solicitudes Envidas**:
```typescript
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
// Obtiene las solicitudes de amistad que el usuario logueado ha enviado
```
  - **Eliminar Solicitud de Amistad**:
```typescript
router.delete("/deleteFR/:iduser1/:iduser2", async (req, res) => {
    const { iduser1, iduser2 } = req.params;
    sql = "delete from Friend_Request where iduser1=:iduser1 AND iduser2=:iduser2";
    await Proyecto.Open(sql, [iduser1, iduser2], true);
    res.json({ "msg": "Usuario Eliminado" })
})
// Cuando un usuario acepta una solicitud de amistad, esta fila sera eliminada
```
  - **Aceptar Amigo**:
```typescript
router.post('/AceptFriend', async(req, res)=>{
    const { iduser1, iduser2 } = req.body;
    sql = "insert into Friend(iduser,idfriend1) values(:iduser1, :iduser2)"
    await Proyecto.Open(sql, [iduser1, iduser2],true);
    res.status(200).json({
        "msg": "Nuevo Amigo Agregado :3"
    });
})
// Agrega un nuevo amigo a la base de datos, segun el usuario logueado
```
  - **Filtrar Publicaciones**:
```typescript
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
// Filtra las publicaciones segun tu Tag
```

<div id='estpro'/>

## Stored Procedure

 - **Insertar Usuario:**
 Para la creacion de un nuevo usuario se realizó un Stored Procedure en el que se debe de ingresar el nombre, usuario contraseña y una imagen.
```sql
CREATE OR REPLACE PROCEDURE insertar_user(name in varchar, username_ in varchar,
password in varchar, image in varchar)
IS
existe number;
BEGIN
    existe:=0;
    SELECT Count(*) into existe 
    FROM User_
    WHERE username = username_;
    
    if existe = 0 then
        insert into User_(name,username, password, image) values(name, username_, password, image);
        dbms_output.put_line('Usuario registrado con exito: ' || username_);
    else
        existe := -1;
        dbms_output.put_line('No registrado error: ' || existe);
    end if;
END;
```
 - **Logueo de Usuario:**
El Stored Procedure para el logueo de un usuario, solicita el usuario y contraseña del mismo, de no existir en la base de datos no devolverá ningún valor.
```sql
CREATE OR REPLACE PROCEDURE Login(
        usu in User_.username%TYPE,
        pass in User_.password%TYPE)
    AS
        c SYS_REFCURSOR;
    BEGIN
        OPEN c for
        select * from User_ u where (u.username=usu and u.password=pass);
        dbms_sql.return_result(c);
    END;
```

<div id='oracle'/>

## Versión De Oracle Utilizada

![](https://github.com/DiiAns23/Prueba-2/blob/Master/Oracle-V.PNG)


<div id='questions'/> 

## Preguntas Frecuentes (FAQ) ❓
**1. ¿Me puedo loguear dos veces?** 

> _R//_ *Si, siempre y cuando el nombre de usuario (username) no sea el mismo*

**2. ¿Se puede visualizar mi constraseña en la base de datos?** 

> _R//_ *No, debido a que tu contraseña se almacena de una forma encriptada*

**3. ¿Cuántos amigos puedo tener?** 

> _R//_ *La aplicación no tiene un límite de amigos*

**4.¿En donde se almacenan mis datos?** 

> _R//_ *Se almacenan en un servidor local en una base de datos*

**5. ¿Cuántas publicaciones puedo realizar?** 

> _R//_ *No existe un límite de publicaciones por usuario*

```js
Universidad San Carlos de Guatemala 2021
Programador: Diego Andrés Obín Rosales
Carne: 201903865
Correo: diego.obin23@gmail.com
```
