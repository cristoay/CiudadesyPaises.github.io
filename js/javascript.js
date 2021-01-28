import * as modulo from './questions.js';
 /**
  * Variables globales
  */
const db = modulo.gameData;
console.log("Version de inicio")
console.log(db);
var juegoPaises = document.getElementById("paises");
var juegoCiudades = document.getElementById("ciudades");
var puntuacion = 0;
const cantidad = 5;
var intento =1;
var temporizador= 0;
var reloj;
var cont = document.getElementById("contador");
var botonIniciar = document.getElementById("creaPartida");
 /**
  * Funcion que empieza el contador
  */
function inicioTiempo(){
    temporizador=0;
    cont.textContent = temporizador+" S";
    reloj = setInterval(tiempoContador,1000);
}
/**
 * Función que modifica el contador en el html
 */
function tiempoContador(){
    temporizador++;
    cont.textContent = temporizador+" S";

}
/**
 * Función que modifica un array de manera aleatoria
 * @param {array} array 
 */

  function shuffleFisherYates(array) {
    let i = array.length;
    while (i--) {
      const ri = Math.floor(Math.random() * (i + 1));
      [array[i], array[ri]] = [array[ri], array[i]];
    }
    return array;
  }
//Variables graficos
var data;
var chart;
var options;
var dataLinea;
var chartLinea;
var optionsLinea;
var cesarManrique = [28.456042777672216, -16.28328143719453];
var zoom=23;
var zoomFly=18;
//Mapa
const tilesProvides = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
var mymap = L.map('mapa').setView(cesarManrique, zoom);
L.tileLayer(tilesProvides, {
    attribution: 'Map data openstreetmap'

}).addTo(mymap);

var marcador = L.marker(cesarManrique).addTo(mymap).bindPopup("Cesar Manrique");
/**
 * Función que cambia la zona del mapa
 * @param {*} coordenadas Coordenadas de la ciudad en la que se situara el mapa
 * @param {*} nombre Nombre de la ciudad que se situa en el mapa
 */
function cambiarZona(coordenadas, nombre) {
    mymap.removeLayer(marcador);
    mymap.flyTo(coordenadas, zoomFly);
    marcador = L.marker(coordenadas).addTo(mymap).bindPopup(nombre);
}

/**
 * Función que crea la partida
 */

function crearPartida() {
    inicioTiempo();
    botonIniciar.disabled =true;
    puntuacion = 0;
    var partidaPaises = [];
    var partidaCiudades = [];
    while (document.getElementById("paises").firstChild) {
        document.getElementById("paises").removeChild(document.getElementById("paises").firstChild);
    }
    while (document.getElementById("ciudades").firstChild) {
        document.getElementById("ciudades").removeChild(document.getElementById("ciudades").firstChild);
    }

    while (partidaPaises.length < cantidad) {
        var paisActual = db.countries[Math.floor(Math.random() * db.countries.length)];
       
        var insertarPais = new Object();
        insertarPais.nombre = paisActual.name;
        insertarPais.codigo = paisActual.code;
        var index = partidaPaises.findIndex(x => x.nombre == insertarPais.nombre);
        if (index == -1) {
            partidaPaises.push(insertarPais);
        }


    }
    
    partidaPaises.forEach(a => {
        var paisTest = db.countries.find(b => b.name == a.nombre);
        var ciud = paisTest.cities[Math.floor(Math.random() * paisTest.cities.length)];
        
        var insertarCiudad = new Object();
        insertarCiudad.nombre = ciud.name;
        insertarCiudad.codigo = paisTest.code;
        partidaCiudades.push(insertarCiudad);

    })

    partidaCiudades.forEach(element => {
        crearCiudad(element.nombre, element.codigo);
    });
    
    shuffleFisherYates(partidaPaises);
    
    
    partidaPaises.forEach(element => {
        crearPais(element.nombre, element.codigo);
    });
    
    
}
/**
 * Clona un nodo
 * @param {*} lugar Id del nodo
 */
function clonarNodo(lugar) {
    var temp = document.getElementById(lugar);
    var clonado = temp.content.cloneNode(true);
    return clonado;
}
/**
 * Función que modifica el nodo para un país
 * @param {*} nombre Nombre del pais
 * @param {*} codigo Codigo del pais
 */
function crearPais(nombre, codigo) {
    var pais = clonarNodo("templatePais");
    pais.firstElementChild.firstElementChild.textContent = nombre;
    pais.firstElementChild.dataset.paiscodigo = codigo;
    juegoPaises.appendChild(pais);

    $('*[data-paiscodigo="' + codigo + '"]').droppable({
        accept: function (ui) {
            if (ui.attr("data-ciudadcodigo") == codigo) {
                return true;
            }
        },
        drop: function (event, ui) {

            var ciudad = ui.draggable[0];


            if (ciudad.dataset.ciudadcodigo == codigo) {

                $('*[data-paiscodigo="' + codigo + '"]')[0].firstElementChild.nextElementSibling.classList.remove("defecto");
                $('*[data-paiscodigo="' + codigo + '"]')[0].firstElementChild.nextElementSibling.classList.add("correcto");

                var paisBuscado = db.countries.find(x => x.code == codigo)

                var ciudadBuscada = paisBuscado.cities.find(y => y.name == ui.draggable[0].dataset.nombreCiudad);

                cambiarZona(ciudadBuscada.location, ui.draggable[0].dataset.nombreCiudad);

                //Buscador del elemento draggable añade el dropable a la tabla si no esta y si esta le añade una ocurrencia
                var encontrada = false;
                for (let j = 0; j < data.getNumberOfRows(); j++) {
                    if (data.getValue(j, 0) == nombre) {
                        encontrada = true;
                    }
                }
                if (encontrada === false) {
                    data.addRow([nombre, 1]);
                } else {
                    for (let i = 0; i < data.getNumberOfRows(); i++) {
                        console.log(data.getValue(i, 0));
                        if (data.getValue(i, 0) == nombre) {
                            var ocurren = data.getValue(i, 1);
                            ocurren++;
                            console.log(ocurren);
                            data.setCell(i, 1, ocurren);
                        }
                    }
                }


                chart.draw(data, options);

                puntuacion++;
                ui.draggable.draggable("disable");

            }
            if (puntuacion == cantidad) {
                clearTimeout(reloj);
                dataLinea.addRow([intento,temporizador]);
                intento++;
                chartLinea.draw(dataLinea,optionsLinea);
                botonIniciar.disabled = false;
            }

        }
    })

}
/**
 * Función que modifica el nodo de la ciudad
 * @param {*} nombre Nombre de la ciudad
 * @param {*} codigo Codigo del pais
 */
function crearCiudad(nombre, codigo) {
    var ciudad = clonarNodo("templateCiudad");
    ciudad.firstElementChild.firstElementChild.textContent = nombre;
    ciudad.firstElementChild.dataset.ciudadcodigo = codigo;
    ciudad.firstElementChild.dataset.nombreCiudad = nombre;
    juegoCiudades.appendChild(ciudad);
    $('[data-ciudadcodigo="' + codigo).draggable({
        revert: "invalid"
    });
}
//Graficos 
// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
/**
 * Función dibuja el pie-chart
 */
function drawChart() {
    // Create the data table.
    data = new google.visualization.DataTable();
    data.addColumn('string', 'Paises');
    data.addColumn('number', 'Ocurrencias');
    data.addRow();

    // Set chart options
    options = {
        'title': 'Ocurrencias de países'
    };

    // Instantiate and draw our chart, passing in some options.
    chart = new google.visualization.PieChart(document.getElementById('pie-chart'));
    chart.draw(data, options);
}
google.charts.setOnLoadCallback(drawChartLine);
/**
 * Dibuja el line-chart
 */
function drawChartLine() {
    dataLinea = new google.visualization.DataTable();
    dataLinea.addColumn('number','Intentos');
    dataLinea.addColumn('number','Tiempo');
    

    optionsLinea = {
        title: 'Tiempo de partida',
        curveType: 'function',
        legend: { position: 'rigth' },
        hAxis: {viewWindowMode: 'explicit',
        
    },
        
    };

    chartLinea = new google.visualization.LineChart(document.getElementById('line-chart'));

    chartLinea.draw(dataLinea, optionsLinea);
}
//Cada vez que se modifica la ventana se dibujan de nuevo los graficos para ajustar sus tamaños 
$(window).resize(function(){
    chartLinea.draw(dataLinea,optionsLinea);
    chart.draw(data, options);
  });
botonIniciar.addEventListener("click", crearPartida);