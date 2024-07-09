import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import _ from "lodash";
import chalk from "chalk";


//Inicializar con npm run dev y la ruta http://localhost:3000/usuarios


//Se inicializa el servidor
const app = express();
const port = process.env.PORT || 3000;

//Array para guardar los usuarios que vamos a consultar a la API
let users = [];

//
app.get("/", (req, res) => {
    res.send("¡Bienvenido/a a Clinica Dende Spa!");
});

app.get("/usuarios", async (req, res) => {
    const{data} = await axios.get("https://randomuser.me/api/");
    const {
        gender,
        name: { first, last },
    } = data.results[0];

    const id = uuidv4().slice(0, 8); //Id generado por el paquete uuid
    const timestamp = moment().format("MMMM Do YYYY, hh:mm A"); 

    users.push({first, last, id, gender, timestamp });

    //División de la lista de usuarios teniendo como condición el sexo del usuario
    let [maleUsers, femaleUsers] = _.partition(users, user => user.gender === "male"); 

    
    let maleWebTemplate = "<h1> LISTADO DE USUARIOS </h1><h2>Hombres:</h2><ul>";
    let femaleWebTemplate = "<h2>Mujeres:</h2><ul>";

    
    let maleConsoleTemplate = "Hombres:\n";
    let femaleConsoleTemplate = "Mujeres:\n";

    for (let user of maleUsers) {
        let userInfo = `Nombre: ${user.first} - Apellido: ${user.last} - ID: ${user.id} - TimeStamp: ${user.timestamp}`;
        maleWebTemplate+= `<li>${userInfo}</li>`;
        maleConsoleTemplate += `    - ${userInfo}\n`;
    }
    maleWebTemplate += "</ul>";
    maleConsoleTemplate += "\n";

    for (let user of femaleUsers) {
        let userInfo = `Nombre: ${user.first} - Apellido: ${user.last} - ID: ${user.id} - TimeStamp: ${user.timestamp}`;
        femaleWebTemplate += `<li>${userInfo}</li>`;
        femaleConsoleTemplate += `    - ${userInfo}\n`;
    }

    femaleWebTemplate += "</ul>";
    femaleConsoleTemplate += "\n";

    //Cambio de colores de letra y fondo de la consola del servidor con Chalk
    console.log(chalk.blue.bgWhite("- Listado de Usuarios -"));
    console.log(chalk.blue.bgWhite(maleConsoleTemplate));
    console.log(chalk.blue.bgWhite(femaleConsoleTemplate));

    res.send(`${maleWebTemplate}${femaleWebTemplate}`);
});

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);

app.get("*", (req, res) => {
  res.send("<h1></h1>");
});