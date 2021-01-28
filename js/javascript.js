import * as modulo from './questions.js';
//console.log(modulo.gameData);

const db = modulo.gameData;
console.log("Version de inicio")
console.log(db);
var secJuego = document.getElementById("juego");
var juegoPaises = document.getElementById("paises");
var juegoCiudades = document.getElementById("ciudades");
var secMapa = document.getElementById("mapa");
var secGrafico = document.getElementById("graficos");
var puntuacion = 0;
const cantidad = 5;
//Mapa
const tilesProvides = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
var mymap = L.map('mapa').setView([28.456042777672216, -16.28328143719453], 23);
L.tileLayer(tilesProvides, {
    attribution: 'Map data openstreetmap'

}).addTo(mymap);

var marcador = L.marker([28.456042777672216, -16.28328143719453]).addTo(mymap).bindPopup("Cesar Manrique");

function cambiarZona(coordenadas, nombre) {
    mymap.setView(coordenadas, 23);
    marcador = L.marker(coordenadas).addTo(mymap).bindPopup(nombre);
}

function objeto(nombre, codigo) {
    this.nombre = nombre;
    this.codigo = codigo;
}


function crearPartida() {
    console.log("Db llamado al crear la partida")
    console.log(db);
    //Cambiar el set a un array y comprobar que los elementos no se repiten
    //var partidaPaises = new Set();
    puntuacion = 0;
    var partidaPaises = [];
    var partidaCiudades = [];
    while (document.getElementById("paises").firstChild) {
        document.getElementById("paises").removeChild(document.getElementById("paises").firstChild);
    }
    while (document.getElementById("ciudades").firstChild) {
        document.getElementById("ciudades").removeChild(document.getElementById("ciudades").firstChild);
    }
    // //error aqui no inserta los objetos
    while (partidaPaises.length < cantidad) {
        var paisActual = db.countries[Math.floor(Math.random() * db.countries.length)];
        var insertarPais = new objeto(paisActual.name, paisActual.code);
        var index = partidaPaises.findIndex(x => x.nombre == insertarPais.nombre);
        if (index == -1) {
            partidaPaises.push(insertarPais);
        }
        // partidaPaises.find(x =>() => {if (x.nombre==insertarPais.nombre){partidaPaises.push(insertarPais)}});
        //   if(partidaPaises.length==0){
        //       partidaPaises.push(insertarPais);
        //   }else{
        //     partidaPaises.forEach(element => {
        //       if (element.codigo == insertarPais.codigo){
        //           console.log("Ya esta por eso no lo añade");
        //           prueba++;
        //       }
        //   });
        //   if(prueba==0){
        //       partidaPaises.push(insertarPais);
        //   }
        //   }
        //console.log(insertarPais);

        //      // if (!partidaPaises.has(insertarPais.nombre)){
        //      //     partidaPaises.add(insertarPais); 
        //      // }

    }
    console.log("dESPUES D EL WHILE")
    console.log(db);
    //console.log(partidaPaises);
    partidaPaises.forEach(a => {
        var paisTest = db.countries.find(b => b.name == a.nombre);
        var ciud = paisTest.cities[Math.floor(Math.random() * paisTest.cities.length)];
        var insertarCiudad = new objeto(ciud.name, paisTest.code);
        partidaCiudades.push(insertarCiudad);
        //console.log(paisTest);
    })
    console.log("dESPUES DEL FOREACH DE PARTIDAPAISES")
    console.log(db);
    //console.log(partidaCiudades);


    //  db.countries.forEach(element => {
    //      partidaPaises.forEach(elemento => {
    //          if(elemento.codigo==element.code){
    //              var paisActualciudad = element.cities[Math.floor(Math.random()*element.cities.length)];
    //          var insertarCiudad = new objeto(paisActualciudad.name,element.code)
    //         // console.log(element.name);
    //          partidaCiudades.push(insertarCiudad);
    //          }
    //      });



    // if(partidaPaises.has(element.name)){
    //     console.log("Detectado el pais");
    //     var paisActual = element.cities[Math.floor(Math.random()*element.cities.length)];
    //     var insertarCiudad = new objeto(paisActual.name,element.code)
    //     console.log(element.name);
    //     partidaCiudades.push(insertarCiudad);
    // }
    // console.log(partidaCiudades);
    //});
    //console.log(partidaPaises);
    //console.log("-------------------------------")
    //console.log(partidaCiudades);
    partidaCiudades.forEach(element => {
        //console.log("Aqui esta los objetos ciudades y sus atributos");
        //console.log(element.nombre);
        // console.log(element.codigo);
        crearCiudad(element.nombre, element.codigo);
    });
    console.log("DESPUES DEL FOREACH DE PARTIDA CIUDADES")
    console.log(db);
    partidaPaises.forEach(element => {
        //console.log("Aqui esta los objetos paises y sus atributos");
        //console.log(element.nombre);
        //console.log(element.codigo);
        crearPais(element.nombre, element.codigo);
    });
    console.log("DESPUES DEL FOREACH DE PARTIDA PAISES 2")
    console.log(db);
}

function clonarNodo(lugar) {
    var temp = document.getElementById(lugar);
    var clonado = temp.content.cloneNode(true);
    return clonado;
}

var pais = clonarNodo("templatePais");
var ciudad = clonarNodo("templateCiudad");
//console.log(pais);
//console.log(ciudad);

function crearPais(nombre, codigo) {
    var pais = clonarNodo("templatePais");
    pais.firstElementChild.firstElementChild.textContent = nombre;
    pais.firstElementChild.dataset.paiscodigo = codigo;
    juegoPaises.appendChild(pais);
    console.log("-----------------------------")
    console.log($('*[data-paiscodigo="' + codigo + '"]'));
    //probar con ui.dragable
    $('*[data-paiscodigo="' + codigo + '"]').droppable({
        accept: function (ui) {
            if (ui.attr("data-ciudadcodigo") == codigo) {
                return true;
            }
        },
        drop: function (event, ui) {
            console.log("jUSTO AL ACTIVAR EL DROP")
            console.log(db);
            //console.log(ui.draggable[0])
            var ciudad = ui.draggable[0];
            console.log("Aqui debajo esta la ciudad");
            console.log(ciudad);
           // console.log("Aqui esta la ciudad " + ciudad)
            if (ciudad.dataset.ciudadcodigo == codigo) {
               // console.log(ui);
               $('*[data-paiscodigo="' + codigo + '"]')[0].firstElementChild.nextElementSibling.style.backgroundColor = "lightgreen";
                //console.log($("#"+nombre)[0])
                var test = db.countries.find(x => x.code == codigo)
                var test2 = test.cities.find(y => y.name = nombre);
                cambiarZona(test2.location, test2.name);

                //console.log(test);
                //console.log(test2);

                puntuacion++;
                ui.draggable.draggable("disable");

                //$("#"+ui.draggable.attr('id')).draggable("disable");
            }
            if (puntuacion == cantidad) {
                //console.log("Se ha acabado la partida")
                //console.log(db);
                // console.log(modulo.gameData)
            }
            //Si se han movido todas las imagenes se mostrara el mensaje final
            // if(jugadas==img){
            //     $("#dialog").find("p").html("Su puntuación es de "+puntuacion);
            //     $( "#dialog" ).dialog( "open" );
            //     notificacion('puntuacion',"Puntuación : "+puntuacion);
            //     console.log("Usted ha acabado con "+ puntuacion);

            // }
        }
    })

}

function crearCiudad(nombre, codigo) {
    var ciudad = clonarNodo("templateCiudad");
    var ciudadNombre = nombre.replace(/ /g, "-");
    ciudad.firstElementChild.firstElementChild.textContent = nombre;
    ciudad.firstElementChild.dataset.ciudadcodigo = codigo;
    juegoCiudades.appendChild(ciudad);
    $('[data-ciudadcodigo="'+codigo).draggable({
        revert: "invalid"
    });
}


document.getElementById("creaPartida").addEventListener("click", crearPartida);