const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const multipart = require('connect-multiparty');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

//imports
const personRoutes = require('./routes/person-rotes');

//settings
app.set('port', 3000);

//middlewares
app.use(morgan('dev')); // Cuando entre una solicitud a la ruta, antes de que se introduzca, se lanza en consola que tipo de peticion se esta lanzando
app.use(express.json()); //Todo lo que entre sera de tipo json :3
app.use(express.urlencoded({ extended: false }));
app.use(cors([ //Permite hacer consultas desde otros puertos como el puerto 4200
    {
        origin: 'localhost:3000',
        credentials:true
    }
]));

const multiPartMiddleware = multipart({
    uploadDir:'../my-project/src/assets/public'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

//Image
app.post('/subir',multiPartMiddleware,(req,res)=>{
    let archivos= req.files.uploads;
    let ruta = "";
    //se trae el array de archivos
       for (let i=0; i<archivos.length;++i){
           // Reescribe el archivo
           ruta = `../my-project/src/assets/public/${archivos[i].name}`;
           fs.rename(archivos[i].path, `../my-project/src/assets/public/${archivos[i].name}`, () => {}); 
       }    
    res.json({
        'msg':'Imagen subida correctamente!',
        'ruta': ruta
    })
})
//routes
app.use(personRoutes);

//run
app.listen(app.get('port'), () => {
    console.log('Servidor listo en el puerto 3000')
})