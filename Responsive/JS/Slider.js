//variables globales
var elementoActivo = 0;

//variables globales para funcion carrusel()
var cantidadElementos;
var posicionesSlider = [];
var puntosInsta = [];

//variables globales para las posiciones de X en el slider para los controles
var xInicio = 0;
var xFin = 0;
var banderaTouch = 0;

//variables globales para miniaturas
var posicionesMiniaturas = [];

//variables globales para la barra
var segmento = 0;
var posicionControlBarra = 0;
var xActual = 0;
var xOffset = 0;

window.onload = function () {
    slider();
    dragDown();
    dragUp();


    //esta parte sirve para interactuar con el touch de los dispositivos moviles
    for (var i = 0; i < document.getElementsByClassName("itemSlider").length ; i++) {
        var tX = document.getElementsByClassName("itemSlider")[i];
        //inicio de touch
        tX.addEventListener("touchstart", function (evt) {
            xInicio = evt.targetTouches[0].clientX;
            slider();
        }, true);
        //transcurso del touch
        tX.addEventListener("touchmove", function (evt) {
            xFin = evt.targetTouches[0].clientX;
        }, true);
        //fin del touch
        tX.addEventListener("touchend", function (evt) {
            slider();
            if (xInicio < xFin) {
                if ((xFin - xInicio) > 50) {
                    controles("izquierdaSlider", 1, "slide");
                    xInicio = 0;
                    xFin = 0;
                }

            } else if (xInicio > xFin) {
                if ((xInicio - xFin) > 50) {
                    controles("derechaSlider", 1, "slide");
                    xInicio = 0;
                    xFin = 0;
                }
            }
        }, true);
    }
    ////ESTILOS PARA LOS PUNTOS
    //x = document.getElementsByClassName("puntoSlider").length;
    ////se limpian estilos
    //for (var i = 0; i < x; i++) {
    //    document.getElementsByClassName("puntoSlider")[i].classList.remove("puntoActivoSlider");
    //}
    ////se asigna clase al punto activo y miniatura
    //if (window.innerWidth < 801) {
    //    document.getElementsByClassName("puntoSlider")[elementoActivo].classList.add("puntoActivoSlider");
    //    document.getElementsByClassName("miniaturaSlider")[elementoActivo].classList.add("miniaturaActiva");
    //}

    //se calcula segmentos para la barra
    segmento = (document.getElementsByClassName("lineaBarraSlider")[0].offsetWidth) / cantidadElementos;

    barra();
}

window.onresize = function () {
    ajustarBarra();
    function ajustarBarra() {
        //calculamos el ancho de los segmentos para la barra
        segmento = (document.getElementsByClassName("lineaBarraSlider")[0].offsetWidth) / cantidadElementos;
    }


}

function slider() {
    cantidadElementos = document.getElementsByClassName("itemSlider").length;
    var elementosSlider;
    var contadorResize = 0;
    var banderaAncho = 0;

    function estilosIniciales() {
        //esto se necesita para que los estilos solo se asignen una vez
        if (window.innerWidth < 801) {
            contadorResize++;
        } else {
            contadorResize = 0;
        }

        //se verifica ancho con ayuda del contador
        if (contadorResize == 0) {
            //ESTILOS INICIALES
            document.getElementsByClassName("slider")[0].style = "";
            document.getElementById("puntosSlider").style = "";
            for (var i = 0; i < cantidadElementos; i++) {
                document.getElementsByClassName("itemSlider")[i].style = "";
            }
        }
        if (contadorResize == 1) {
            //ESTILOS INICIALES
            for (var i = 0; i < cantidadElementos; i++) {
                if (i == 0) {
                    document.getElementsByClassName("itemSlider")[i].style.position = "relative";
                } else {
                    document.getElementsByClassName("itemSlider")[i].style.position = "absolute";
                }
                document.getElementsByClassName("itemSlider")[i].style.display = "flex";

                //SE ASIGNA ZONA DRAG PARA EVENTOS SLIDE
                document.getElementsByClassName("slider")[0].addEventListener("mousedown", dragDown);
                document.getElementsByClassName("slider")[0].addEventListener("mouseup", dragUp);


            }

            //se llena slider (imagenes, miniaturas, puntos)
            llenarSlider();

            //se llaman a las posiciones
            posiciones();

            //monitoreamos el click en las miniaturas
            for (var i = 0; i < document.getElementsByClassName("miniaturaSlider").length; i++) {
                document.getElementsByClassName("miniaturaSlider")[i].addEventListener("click", function () {
                    miniaturaClick(this);
                });
            }

        }
    }
    estilosIniciales();
    window.addEventListener("resize", estilosIniciales);
}

function llenarSlider() {
    //se pone el ultimo elemento del slider como primera posicion (se solicita en el diseño propuesto)
    posicionesSlider.push(document.getElementsByClassName("slider")[0].getElementsByClassName("itemSlider")[cantidadElementos - 1]);
    //se termina de llenar el array
    for (var i = 0; i < cantidadElementos; i++) {
        if (i < (cantidadElementos - 1)) {
            posicionesSlider.push(document.getElementsByClassName("slider")[0].getElementsByClassName("itemSlider")[i]);
        } else {

        }

        ////Aqui se llena el array que servira para darle estilos a los puntos (como en instagram)
        //for (var i = 0; i < 4; i++){
        //    puntosInsta.push(posicionesSlider[i]);
        //}

        //aqui se llenan los puntos para el slider
        document.getElementById("puntosSlider").appendChild(document.createElement("DIV"));
        document.getElementById("puntosSlider").getElementsByTagName("div")[i].classList.add("puntoSlider");
      

        //aqui se crean los div para las miniaturas del slider
        document.getElementById("miniaturasSlider").appendChild(document.createElement("DIV"));
        document.getElementById("miniaturasSlider").getElementsByTagName("div")[i].classList.add("miniaturaSlider");
        posicionesMiniaturas.push(document.getElementById("miniaturasSlider").getElementsByClassName("miniaturaSlider")[i]);

        //Se asignan backgrounds a las miniaturas
        if (i === 0) {
            document.getElementsByClassName("miniaturaSlider")[i].style.backgroundImage = 'linear-gradient(to top, rgba(255, 255, 255, .3), rgba(255, 255, 255, .3) ),url("' + document.getElementsByClassName("imgItemSlider")[cantidadElementos - 1].getAttribute('src') + '")';
        } else {
            document.getElementsByClassName("miniaturaSlider")[i].style.backgroundImage = 'linear-gradient(to top, rgba(255, 255, 255, .3), rgba(255, 255, 255, .3) ),url("' + document.getElementsByClassName("imgItemSlider")[i - 1].getAttribute('src') + '")';
        }
    }
}

//se llama apartir de controles();
function posiciones(identificador, cantidad, evento) {
    if (window.innerWidth < 801) {

        //Esto nos servira para identificar la posicion de cada elemento y darle estilos
        for (var i = 0; i < cantidadElementos; i++) {
            posicionesSlider[i].style.transition = "";
            posicionesSlider[i].style.transition = "left .5s, opacity .3s";

            if (cantidad > 1) { posicionesSlider[i].style.transition = "left 0s"; }
            posicionesSlider[i].style.opacity = "1";

            if (identificador === "derechaSlider") {
                if (i <= (cantidadElementos - 2) && i > 1) {
                    posicionesSlider[i].style.opacity = "0";
                }
            }
            if (identificador === "izquierdaSlider") {
                if (i <= (cantidadElementos - 2) && i > 1) {
                    
                    posicionesSlider[i].style.opacity = "0";

                }
                posicionesSlider[cantidadElementos - 1].style.transition = "left .5s, opacity .3s";
            }

            if (i == 0) {
                //imagen inicial
                posicionesSlider[i].style.left = "2.5%";
            } else if (i == (cantidadElementos - 1)) {
                //imagen a la izquierda
                posicionesSlider[i].style.left = "-97.5%";
            } else if (i == (cantidadElementos - 2)) {
                posicionesSlider[i].style.left = "-200%";
            } else if (i === 1) {
                posicionesSlider[i].style.left = "102.5%";
            }else {
                //imagen default a la derecha
                posicionesSlider[i].style.left = "200%";
            }
        }

        //ESTILOS
        //se limpian estilos
        for (var i = 0; i < cantidadElementos; i++) {
            document.getElementsByClassName("puntoSlider")[i].classList.remove("puntoActivoSlider");
            document.getElementsByClassName("miniaturaSlider")[i].classList.remove("miniaturaActiva");
        }

        //se asignan clases activos
        if (identificador === "" || identificador === undefined) {
        }
        else if (identificador === "izquierdaSlider") {
            if (elementoActivo === 0) {
                elementoActivo = cantidadElementos - 1;
                posicionControlBarra = document.getElementsByClassName("lineaBarraSlider")[0].offsetWidth - segmento;
                
                if (evento === "click" || evento === "slide") {
                    document.getElementsByClassName("controlBarraSlider")[0].style.transform = "translate3d(" + posicionControlBarra + "px," + 0 + "px, 0)";
                    xActual = posicionControlBarra;
                    xOffset = xActual;
                }
                

            } else {
                elementoActivo = elementoActivo - 1;
                posicionControlBarra = posicionControlBarra - segmento;
                if (evento === "click" || evento === "slide") {
                    document.getElementsByClassName("controlBarraSlider")[0].style.transform = "translate3d(" + posicionControlBarra + "px," + 0 + "px, 0)";
                    xActual = posicionControlBarra;
                    xOffset = xActual;
                }
                
            }
        } else {
            if (elementoActivo === (cantidadElementos - 1)) {
                elementoActivo = 0;
                posicionControlBarra = 0;
                if (evento === "click" || evento === "slide") {
                    document.getElementsByClassName("controlBarraSlider")[0].style.transform = "translate3d(" + posicionControlBarra + "px," + 0 + "px, 0)";
                    xActual = posicionControlBarra;
                    xOffset = xActual;
                }
               
     
            } else {
                elementoActivo = elementoActivo + 1;
                posicionControlBarra = posicionControlBarra + segmento;
                if (evento === "click" || evento === "slide") {
                    document.getElementsByClassName("controlBarraSlider")[0].style.transform = "translate3d(" + posicionControlBarra + "px," + 0 + "px, 0)";
                    xActual = posicionControlBarra;
                    xOffset = xActual;
                }

                
               
            }
        }


        document.getElementsByClassName("puntoSlider")[elementoActivo].classList.add("puntoActivoSlider");
        document.getElementsByClassName("miniaturaSlider")[elementoActivo].classList.add("miniaturaActiva");
    }
}

//controles del slider
function controles(identificador, cantidad,  evento) {
    //este array nos sirve para guardar las nuevas posiciones que se le pasaran posteriormente al array de "posicionesSlider"
    var array = [];
    for (var i = 0; i < cantidadElementos; i++) {
        //Dependiendo la direccion reacomodamos los elementos del array
        if (identificador === "izquierdaSlider") {
            if (i === cantidadElementos - 1) {
                //se asignan posiciones en array
                array.splice(0, 0, posicionesSlider[cantidadElementos - 1]);
            } else {
                //se asignan posiciones en array
                array.splice(i + 1, 0, posicionesSlider[i]);
            }

        } else if (identificador === "derechaSlider") {
            if (i === 0) {
                //se asignan posiciones en array
                array.splice(cantidadElementos - 1, 0, posicionesSlider[i]);
            } else {
                //se asignan posiciones en array
                array.splice(i - 1, 0, posicionesSlider[i]);
            }
        }
    }

    for (var i = 0; i < cantidadElementos; i++) {
        posicionesSlider[i] = array[i];
    }

    array = [];
    posiciones(identificador, cantidad, evento);
}

//funcion de las miniaturas
function miniaturaClick(elemento) {
    var miniatura = 0;
    //esto determinara que parametro mandar a la funcion controles();
    for (var i = 0; i < cantidadElementos; i++) {
        if (elemento == posicionesMiniaturas[i]) {
            miniatura = i;
        }
    }
    //aqui se le pasa a controles(); el numero de veces que se moveran las imagenes asi como la dirección (derecha o izquierda)
    var cantidad = 0;
    if (elementoActivo < miniatura) {
        for (var i = elementoActivo; elementoActivo < miniatura; i++) {
            cantidad = cantidad + 1;
            controles("derechaSlider", cantidad, "click");
        }
    } else {
        for (var i = elementoActivo; miniatura < elementoActivo ; i++) {
            cantidad = cantidad + 1;
            controles("izquierdaSlider", cantidad, "click");
        }
    }
}

//FUNCION PARA LA BARRA
function barra() {
    var contenedor = document.getElementsByClassName("barraSlider")[0];
    var control = document.getElementsByClassName("controlBarraSlider")[0];
    var activo = false;
    var xInicio = 0;
    var limite = (document.getElementsByClassName("lineaBarraSlider")[0].offsetWidth) - document.getElementsByClassName("controlBarraSlider")[0].offsetWidth;
    var banderaSegmentos = 0;
    var banderaSegmentosFin = 0;
    var contadorSegmentos = 1;

    //eventos para interactuar con el drag
    contenedor.addEventListener("touchstart", dragStart, false);
    contenedor.addEventListener("touchend", dragEnd, false);
    contenedor.addEventListener("touchmove", drag, false);
    contenedor.addEventListener("mousedown", dragStart, false);
    contenedor.addEventListener("mouseup", dragEnd, false);
    contenedor.addEventListener("mousemove", drag, false);

    //inicia el drag
    function dragStart(e) {
        if (e.type === "touchstart") {
            xInicio = e.touches[0].clientX - xOffset;
        } else {
            xInicio = e.clientX - xOffset;
        }

        if (e.target === control) {
            activo = true;
        }
    }

    //termina el drag
    function dragEnd() {
        xInicio = xActual;
        activo = false;
    }

    //en el momento que se esta haciendo el drag
    function drag(e) {
        if (activo) {
            
            e.preventDefault();
            if (e.type === "touchmove") {
                if (xActual <= limite && xActual >= 0) {
                    xActual = e.touches[0].clientX - xInicio;
                } else {
                    if (xActual >= limite) {
                        xActual = limite;
                    } else if(xActual <= 0) {
                        xActual = 0;
                    }
                }
                if (xActual > limite) {
                    xActual = limite;
                } else if (xActual <= 0) {
                    xActual = 0;
                }

            } else {
                if (xActual <= limite && xActual >= 0) {
                    xActual = e.clientX - xInicio;

                } else {
                    if (xActual >= limite) {
                        xActual = limite;
                    } else if (xActual <= 0) {
                        xActual = 0;
                    }
                }

            }
            xOffset = xActual;

            actualizarPosicion(xActual, control);
        }
    }

    function actualizarPosicion(posicionX, elemento) {
        elemento.style.transform = "translate3d(" + posicionX + "px," + 0 + "px, 0)";
        calcularMovimientos(posicionX);
    }

    //esto se usa en calcularMovimientos();
    var limites = [];
    for (var i = 0; i < cantidadElementos; i++) {
        limites.push(Math.round(segmento * (i + 1)));  
    }

    var banderaFor = 0;
    function calcularMovimientos(posicionX) {

        //segmento, es el espacio asignado dentro de la barra de control para cada slide 
        if (posicionX < (segmento * contadorSegmentos) && posicionX >= (segmento * banderaSegmentos)) {
        } else {
            if (posicionX > (segmento * contadorSegmentos)) {

                contadorSegmentos = contadorSegmentos + 1;
                banderaSegmentos = banderaSegmentos + 1;                
                controles("derechaSlider", 1, "slide");
            } else {

                contadorSegmentos = contadorSegmentos - 1;
                banderaSegmentos = banderaSegmentos - 1;
                controles("izquierdaSlider", 1, "slide");

            }          
        }

    }
}


//Aqui se calcula hacia donde el usuario desliza el puntero 
function dragDown() {
    xInicio = window.event.clientX;
}

function dragUp() {
    xFin = window.event.clientX;
    if (xInicio < xFin) {
        if ((xFin - xInicio) > 20) {
            controles("izquierdaSlider", 1, "slide");
            xInicio = 0;
            xFin = 0;
        }
    } else if (xInicio > xFin) {
        if ((xInicio - xFin) > 20) {
            controles("derechaSlider", 1, "slide");
            xInicio = 0;
            xFin = 0;
        }
    }
}

window.addEventListener("onmousedown", dragDown);
window.addEventListener("onmouseup", dragUp);