const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

//imports
const personRoutes = require('./routes/person-rotes');

//settings
app.set('port', 3000);

//middlewares
app.use(morgan('dev')); // Cuando entre una solicitud a la ruta, antes de que se introduzca, se lanza en consola que tipo de peticion se esta lanzando
app.use(express.json()); //Todo lo que entre sera de tipo json :3
app.use(express.urlencoded({ extended: false }));

//routes
app.use(personRoutes);


//run
app.listen(app.get('port'), () => {
    console.log('Servidor listo en el puerto 3000')
})