//Inicio de navegación segura
function protocoloSeguridad() {
    if (window.location.href.indexOf("localhost") === -1 && window.location.href.indexOf("192.168.") === -1) {
        if (window.location.href.charAt(4) === ":") {
            $.ajax({
                url: window.location.href.replace("http:", "https:") + '?callback=?',
                dataType: 'JSONP',
                jsonpCallback: 'callbackFnc',
                type: 'GET',
                async: false,
                crossDomain: true,
                complete: function (data) {
                    if (data.readyState === 4 && data.status === 200) window.location.href = window.location.href.replace("http:", "https:"); //Redireccionamiento si es posible
                }
            });
        }
    }
    else console.log("Bienvenido a TheEngine");
}

//Función para dar formato al FileUpload
function subirArchivoGeneral(archivo, identificador, valid_extensions) {
    var maxArchivo = 10000000; //Variable para definir el máximo del archivo a subir, por default son 10MB(10000000)
    if (archivo.value !== '') {
        $(document).on('change', 'input[type="file"]', function () {
            if (typeof this.files[0] !== "undefined") {
                var fileSize = this.files[0].size;
                if (fileSize > maxArchivo) {
                    document.getElementById(identificador).value = '';
                    this.value = '';
                    var btn = document.getElementById("ContentPlaceHolder1_btnFileUpload");
                    btn.click();
                }
                else {
                    document.getElementById(identificador).value = archivo.value.replace("C:\\fakepath\\", "");
                    var file = document.getElementById(identificador).value
                    var fileExt = file.substring(file.lastIndexOf(".") + 1, file.length).toLowerCase();
                    //var btnModal = document.getElementById("ContentPlaceHolder1_ContentPlaceHolder1_btnModalExt");
                    if (valid_extensions.length !== 0) {
                        var extArray = valid_extensions.split("|");
                        var mensaje = "Solo se admiten archivos de tipo:  "
                            + (extArray.join("|"));
                        for (var i = 0; i < extArray.length; i++) {
                            if (extArray[i] === fileExt) {
                                return true;
                            }
                        }
                        document.getElementById(identificador).value = '';
                        archivo.value = '';
                        //btnModal.click();
                        modalUpload.classList.remove("ocultar");
                        document.getElementById("lblUpload").innerHTML = mensaje;
                        //alert(mensaje);
                        archivo.value = "";

                    }
                }
            }
        });
    }
    else {
        document.getElementById(identificador).value = "";
    }
    return false;
}

//Función para limitar lo que se introduce en un textbox multiline
function limitarMultiline(e, contenido, caracteres) { if (contenido.value.length >= caracteres) { contenido.value = contenido.value.substring(0, caracteres); return false; } return true; }

function pageLoad() {
    //Se verifica si el navegador es FireFox, si así es se oculta el loader
    var es_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (es_firefox) {
        document.getElementById("loaderSVG").classList.add("dispNone");
    }

    // JS to execute during full and partial postbacks    
    $('.uppercase').on('input blur focus change', function (e) { $(this).val($(this).val().toUpperCase()); return $(this).val(); });
    $('.lowercase').on('input blur focus change', function (e) { $(this).val($(this).val().toLowerCase()); return $(this).val(); });
    $('.dragModal').draggable({
        containment: 'parent',
        axis: "y",
        scroll: false
    });
    var draggableDiv = $('.dragModal').draggable();
    $('.contenidoNModal', draggableDiv).mousedown(function (ev) {
        draggableDiv.draggable('disable');
    }).mouseup(function (ev) {
        draggableDiv.draggable('enable');
    });

    //Función para cerrar el autocompletar al mover el modal
    $(".tituloNModal").mousedown(function () { $("ul.ui-autocomplete").hide(); });
    //Función para cerrar el autocompletar al hacer scroll general
    $(".mensajes").scroll(function () { $("#ui-datepicker-div").css("display", "none"); });


}


function main() {
    protocoloSeguridad();
    var contador = 1; var panel = 1;
    menu();
    bloqueaCalendario();
    detectaMovil();
    detectaNavegador();
    $('#cierraModalUpload').click(function () { $('#modalUpload').addClass("ocultar"); });
    $('#cierraModalValida').click(function () { $('#modalValidaciones').addClass("ocultar"); });

    //menú derecho
    $('.burger2').click(function () {
        $(".burger2").toggleClass("open");
        $('#ocultarCualquiera').show();

        if (contador === 1) {
            $('.menuPrincipal').animate({
                left: '0'
            });
            contador = 0;
        }
    });
    //ocultamos los menus cuando se da click en la mascara
    $('#ocultarCualquiera').click(function () {
        $('#ocultarCualquiera').hide();
        if (window.innerWidth <= 800) {
            if (panel === 0) {
                $(".panelico").toggleClass("open");
                $('.menuIzqPanel').animate({
                    right: '-110%'
                });
                panel = 1;
            }
        }
        else {
            if (panel === 0) {
                $('.menuIzqPanel').animate({
                    right: '-110%'
                });
                panel = 1;
            }
        }

        if (contador === 0) {
            $(".burger2").toggleClass("open");
            $('.menuPrincipal').animate({
                left: '-110%'
            });
            contador = 1;
        }
    });
    //menú izquierdo resolución mayor
    $('.panelfactura').click(function () {
        if (panel === 1) {
            $('#ocultarCualquiera').show();
            $('.menuIzqPanel').animate({
                left: '0'
            });
            panel = 0;
        }
    });
    //menú izquierdo
    $('.panelico').click(function () {
        $(".panelico").toggleClass("open");
        $('#ocultarCualquiera').show();
        if (panel === 1) {
            $('.menuIzqPanel').animate({
                left: '0'
            });
            panel = 0;
        }
    });

    //Función para ocultar el menú responsivo en cualquier resolución al ser redimensionada la pantalla
    //Esto también funciona cuando se cambia la orientación del móvil
    $(window).resize(function () {
        $("ul.ui-autocomplete").hide();
        $('#ocultarCualquiera').hide();
        if (contador === 0) { $('.burger2').toggleClass('open'); contador = 1; }
        if (panel === 0) { $('.panelico').toggleClass('open'); }
        $('.menuIzqPanel').animate({ left: '-110%' }, 50); panel = 1;
        if (window.innerWidth <= 1000) {
            $('.menuPrincipal').animate({ right: '-110%' }, 50); contador = 1;
        }
        else {
            //Menu Principal                           
            $('.menuPrincipal').animate({ right: '0%' }, 50);
        }
        bloqueaCalendario();
        ocultarBotonLaptop();
    });


    /*Impedir caracteres de código malicioso*/
    var arreglo = ['"', "'", "`", ">", "<", "[", "]", "^", "{", "}", "\\"];
    //Función para no aceptar caracteres especiales en los textbox o textarea
    // " 34 ' 39 ` 96 > 62 < 60  [ 91 ] 93 ^ 94 { 123 } 125 \ 92
    $('input[type=text] , textarea').keyup(function (e) { var control = e.currentTarget.id; ascii(control); });
    $("input[type=text] , textarea").bind("paste", function (e) { var control = e.currentTarget.id; ascii(control); });
    $('input[type=text] , textarea').on("input", function (e) { var control = e.currentTarget.id; ascii(control); });
    function ascii(idControl) {
        var texto = $('#' + idControl);
        var cadena = texto.val();
        for (i = 0; i < cadena.length; i++) {
            if (cadena[i].charCodeAt(0) > 255) { cadena = cadena.replace(cadena[i], ""); }
            for (j = 0; j < arreglo.length; j++) cadena = cadena.replace(arreglo[j], "");
        }
        $('#' + idControl).val(cadena);
    }

    //estilos iniciales de hamburguesa menu
    document.getElementsByClassName("barraHamburguesa")[0].style.top = "0rem";
    document.getElementsByClassName("barraHamburguesa")[1].style.top = ".4rem";
    document.getElementsByClassName("barraHamburguesa")[2].style.top = ".8rem";

    $(window).scroll(function () {
        ocultarBotonLaptop();
    });
    ocultarBotonLaptop();
    //Loader
    window.addEventListener("load", function () { $(".loader1").delay(10).fadeOut("slow"); });



    //Animación para el menú
    $('.menu > div:first-child').animate({ left: 0, opacity: 1 }, 0);
    $('.menu > div:last-child').animate({ right: 0, opacity: 1 }, 0);
}
function ocultarBotonLaptop() {
    var soyIndex = $('#botonLaptop')[0];
    if (soyIndex !== undefined) {
        var ancho = $(window).width();
        if (ancho > 950) {
            $("#AunNo").hide();
            var BotonLaptopSiempre = $('#BotonLaptopSiempre').offset().top;
            var altoVentana = $(window).height();
            var scrollActual = $(window).scrollTop();
            var total = altoVentana + scrollActual;
            if (total < BotonLaptopSiempre) {
                $('#botonLaptop').show();
            }
            else {
                $('#botonLaptop').hide();
            }
        }
        else {
            $("#AunNo").show();
            $('#botonLaptop').hide();
        }
    }
}

function irA(id) {
    console.log("Entra");
    $('body,html').stop(true, true).animate({
        scrollTop: $("#" + id).offset().top
    }, 1);
    $('body,html').stop(true, true).animate({
        scrollTop: $("#" + id).offset().top
    }, 1);
    document.location.href = "#" + id;
    document.location.href = "#" + id;
}

//Función para detectar el navegador
function detectaNavegador() {
    var navegador = navigator.userAgent.toLowerCase();
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');

    if (navegador.indexOf("chrome") > -1) {
        //El navegador es chrome u opera");
    } else if (navegador.indexOf("firefox") > -1) {
        //El navegador es mozilla
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = '../../Responsive/CSS/navegadores/mozilla.css';
        head.appendChild(link);
    } else if (navegador.indexOf("opr") > -1) {
        //El navegador es opera
    } else if (navegador.indexOf("msie") > -1) {
        //El navegador es IE
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = '../../Responsive/CSS/navegadores/ie.css';
        head.appendChild(link);
    }
    else {
        //Navegador desconocido o versión vieja (se usa tambien para IE)        
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = '../../Responsive/CSS/navegadores/ie.css';
        head.appendChild(link);
    }
}

//Función para detectar el dispositivo donde se despliega el aplicativo
function detectaMovil() {
    var useragent = navigator.userAgent || navigator.vendor || window.opera;
    //Variable para detectar los móviles
    var ismobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|zh-cn|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(useragent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(useragent.substr(0, 4));
    //Opción cuando es Móvil
    if (ismobile) { $('.ocultaMovil').addClass("ocultar"); $('.mostrarMovil').removeClass("ocultar"); $('iframe').addClass("ocultar"); $('object').addClass("ocultar"); }
    //Opción cuando no es Móvil
    else { $('.ocultaMovil').removeClass("ocultar"); $('.mostrarMovil').addClass("ocultar"); }
}

//Función para ocultar Modal con la tecla ESC
$(document).keydown(function (tecla) {
    if (tecla.keyCode === 27) {
        if ($("#mensajeConfirma").css("display") === "block") {
            var btnCC = document.getElementById("btnCierraConfirmacion"); btnCC.click();
        } else if ($("#divMensajes").css("display") === "block") { var btnCM = document.getElementById("btnCierraModal"); btnCM.click(); }
    }
    //Función para detectar el enter, se conserva foco y no hace validación
    $('input[type=text]').keydown(function (e) { if (e.keyCode === 13) { return e.keyCode !== 13; } });
});

function bloqueaCalendario() { if ($(window).innerHeight() > 400) { $('.calendario,.calendarioBlanco,.calendarioHora,.calendarioHoraBlanco').addClass("calendarioBloqueado"); } else { $('.calendario,.calendarioBlanco,.calendarioHora,.calendarioHoraBlanco').removeClass("calendarioBloqueado"); } }

jQuery(function ($) {
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar', prevText: 'Ant', nextText: 'Sig', currentText: 'Hoy', monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], dayNames: ['Domingo', 'Lunes', 'Martes', 'Mi&eacute;rcoles', 'Jueves', 'Viernes', 'S&aacute;bado'], dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mi&eacute;', 'Juv', 'Vie', 'S&aacute;b'], dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'S&aacute;'], weekHeader: 'Sm', dateFormat: 'dd/mm/yy', firstDay: 1, isRTL: false, changeYear: true, changeMonth: true, showMonthAfterYear: false, yearRange: "c-5:c+5", yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
});


//ScriptManager.RegisterStartupScript(Me.Page, Me.GetType(), "funcionesGenerales", "funcionesGenerales();", True)
function funcionesGenerales() {
    detectaMovil();
    bloqueaCalendario();
    //----------------------Inicia Funcionalidad de calendario
    $(".calendario").datepicker({ showOn: "button", buttonImage: "../../Responsive/img/Icons/calendarioGris.png", buttonImageOnly: true, buttonText: 'Seleccionar la fecha', dateFormat: 'yy-mm-dd' });
    $(".calendarioBlanco").datepicker({ showOn: "button", buttonImage: "../../Responsive/img/Icons/calendarioBlanco.png", buttonImageOnly: true, buttonText: 'Seleccionar la fecha', dateFormat: 'yy-mm-dd' });
    $(".calendarioGris").datepicker({ showOn: "button", buttonImage: "../../Responsive/img/Icons/calendarioGris.png", buttonImageOnly: true, buttonText: 'Seleccionar la fecha', dateFormat: 'yy-mm-dd' });
    $('.calendarioHora').datetimepicker({ showOn: "button", buttonImage: "../../Responsive/img/Icons/calendarioGris.png", buttonImageOnly: true, buttonText: 'Seleccionar la fecha', dateFormat: 'yy-mm-dd', controlType: 'select', oneLine: true, timeFormat: 'HH:mm:ss' });
    $('.calendarioHoraBlanco').datetimepicker({ showOn: "button", buttonImage: "../../Responsive/img/Icons/calendarioBlanco.png", buttonImageOnly: true, buttonText: 'Seleccionar la fecha', dateFormat: 'yy-mm-dd' });
    $('.calendario,.calendarioBlanco').attr('placeholder', 'AAAA-MM-DD').attr('maxlength', 10);
    $('.calendarioHora,.calendarioHoraBlanco').attr('placeholder', 'AAAA-MM-DDThh:mm:ss').attr('maxlength', 19);
    $('.calendario.restringido,.calendarioBlanco.restringido,.calendarioHora.restringido,.calendarioHoraBlanco.restringido').datepicker('change', { minDate: '-3d', maxDate: '0d' }); $('.calendario,.calendarioBlanco,.calendarioHora,.calendarioHoraBlanco').keypress(function (e) { if ($(window).innerHeight() > 400) { return false; } });
    $('.calendario,.calendarioBlanco,.calendarioHora,.calendarioHoraBlanco').keydown(function (e) { if ($(window).innerHeight() > 400) { if (window.event && window.event.keyCode === 8 || window.event && window.event.keyCode === 46) { this.value = ""; } } });
}

var anchoModalTel;
var altoMod;
function animaModal() {
    document.getElementsByClassName("contenedorModalTelefono")[0].style = "";
    var botonModal = document.getElementById("btnEntendidoTelefono");
    var anchoPantalla = window.innerWidth;
    $(".contenedorModalTelefono div").animate({ opacity: 0 });
    let top = ((document.getElementById("lnkIcoWhats").getBoundingClientRect().top - document.getElementsByClassName("contenedorModalTelefono")[0].getBoundingClientRect().top) - (document.getElementsByClassName("contenedorModalTelefono")[0].offsetHeight / 2)) + "px";
    var x = $("#lnkIcoWhats").offset().left;
    var xModal = $(".contenedorModalTelefono").offset().left;
    anchoModalTel = document.getElementsByClassName("contenedorModalTelefono")[0].offsetWidth;
    altoMod = $(".contenedorModalTelefono").height();
    //se resetea el left
    $(".contenedorModalTelefono").css("left", "0");
    $(".contenedorModalTelefono").animate({ "left": ((x - xModal - document.getElementsByClassName("contenedorModalTelefono")[0].style.marginLeft) - document.getElementsByClassName("contenedorModalTelefono")[0].offsetWidth / 2) + "px", "margin-top": "0%", "top": top, height: '0', width: '0', opacity: '0' }, 1000, 'swing');
    $(".fondoTelefono").delay(1000).animate({ opacity: 0 });
    setTimeout(function () { botonModal.click(); }, 1000);
}

function regresaModal() {
    document.getElementsByClassName("contenedorModalTelefono")[0].style = "";
    $(".contenedorModalTelefono div").css("opacity", "0");
    $(".fondoTelefono").delay(1000).animate({ opacity: 1 });
    var x = $("#lnkIcoWhats").offset().left;
    var xModal = $(".contenedorModalTelefono").offset().left;
    let top = ((document.getElementById("lnkIcoWhats").getBoundingClientRect().top - document.getElementsByClassName("contenedorModalTelefono")[0].getBoundingClientRect().top) - (document.getElementsByClassName("contenedorModalTelefono")[0].offsetHeight / 2)) + "px";
    document.getElementsByClassName("contenedorModalTelefono")[0].style.top = top;
    $(".contenedorModalTelefono").addClass("regresaModal");
    $(".contenedorModalTelefono").css("left", ((x - xModal - document.getElementsByClassName("contenedorModalTelefono")[0].style.marginLeft) - document.getElementsByClassName("contenedorModalTelefono")[0].offsetWidth / 2) - (anchoModalTel / 2) + "px");
    $(".contenedorModalTelefono").animate({ "left": 0, "top": '0', "height": altoMod, width: '100%', opacity: '1' }, 1000, 'swing');
    $(".contenedorModalTelefono div").animate({ opacity: 1 });
    $(".contenedorModalTelefono").removeClass("regresaModal");
}

function navega(aplicativo) {
    navega2(aplicativo);
}
function navega2(aplicativo) {
    setTimeout(function () {
        if (aplicativo !== "") {
            var ruta = "";
            var titulo = "";
            var tipo = 0;
            switch (aplicativo) {
                case "PagosCFDI":
                    ruta = "../../../PagoOnLine/PresentacionInicio/PagoenLinea.html" + obtieneQuery(1, 1);
                    titulo = "Aplicativo de pagos";
                    tipo = 3;
                    break;
                    //https://factureyanacional.com
                case "PagosTimbrado":
                    ruta = "https://app.factureyapac.com/PagoOnLineV5/Presentacion/Home/PagoenLinea.aspx?Ctenvo=1&tipoproducto=2" + obtieneQuery(1, 1);
                    titulo = "Aplicativo de pagos";
                    tipo = 3;
                    break;
                case "PagosProdsContables":
                    ruta = "https://app.factureyapac.com/PagoOnLineV5/Presentacion/Home/PagoenLinea.aspx?Ctenvo=1&tipoproducto=13" + obtieneQuery(1, 1);
                    titulo = "Aplicativo de pagos";
                    tipo = 3;
                    break;
                case "PagosAddendas":
                    ruta = "https://app.factureyapac.com/PagoOnLineV5/Presentacion/Home/PagoenLinea.aspx?Ctenvo=1&tipoproducto=3" + obtieneQuery(1, 1);
                    titulo = "Aplicativo de pagos";
                    tipo = 3;
                    break;
                case "PagosBuzonRecep":
                    ruta = "https://app.factureyapac.com/PagoOnLineV5/Presentacion/Home/PagoenLinea.aspx?Ctenvo=1&tipoproducto=5" + obtieneQuery(1, 1);
                    titulo = "Aplicativo de pagos";
                    tipo = 3;
                    break;
                case "PagosClienteNuevo":
                    ruta = "https://app.factureyapac.com/PagoOnLineV5/Presentacion/Home/PagoEnLinea.aspx?Ctenvo=1" + obtieneQuery(1, 1);
                    titulo = "Aplicativo de pagos";
                    tipo = 3;
                    break;
                case "Pagos":
                    ruta = "https://app.factureyapac.com/PagoOnLineV5/Presentacion/Home/PagoEnLinea.aspx" + obtieneQuery(2, 1);
                    titulo = "Aplicativo de pagos";
                    tipo = 3;
                    break;
                case "PagosGoogleAds":
                    ruta = "https://app.factureyapac.com/PagoOnLineV5/Presentacion/Home/PagoEnLinea.aspx" + obtieneQuery(2, 1);
                    var callback = function () {
                        if (typeof ruta !== 'undefined') {
                            window.location = ruta;
                        }
                    };
                    gtag('event', 'conversion', { 'send_to': 'AW-757601337/B4GFCOXGlpcBELmooOkC', 'event_callback': callback });
                    break;
                ///////////////PAGOS
                ///////////////Navegación interna Aplicativo
                case "CorreoSeguro":
                    ruta = "../../Responsive/Contacto/CorreoElectronicoSeguro.html" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "Negocio":
                    ruta = "../Negocio/Negocio.aspx" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "Productos":
                    ruta = "../../Responsive/Productos/Productos.html" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "Contacto":
                    ruta = "../Contacto/Contacto.html" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "Index":
                    ruta = "/index.html" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "Aviso":
                    ruta = "../Contacto/Aviso.aspx" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "Terminos":
                    ruta = "../Contacto/TerminosCondiciones.aspx" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "FacturacionElectronica":
                    ruta = "../Productos/FacturacionElectronica.aspx" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "Timbrado":
                    ruta = "../Productos/Timbrado.aspx" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "XMLContable":
                    ruta = "../Productos/XMLContable.aspx" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "BuzonValidador":
                    ruta = "../Productos/Buzon.aspx" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "ERPContable":
                    ruta = "https://www.factureyanacional.com/portalBase/Presentacion/Landing/landing.aspx";
                    tipo = 3;
                    break;
                case "Addendas":
                    ruta = "../Productos/Addendas.aspx" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "ValidadorXML":
                    ruta = "../Productos/ValidadorXML.aspx" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "Click":
                    ruta = "../Productos/Click.aspx" + obtieneQuery(2, 0);
                    tipo = 3;
                    break;
                case "exeClick":
                    ruta = "https://www.factureyanacional.com/web/descargas/Instalaciones/Click.exe";
                    titulo = "Instalador click";
                    tipo = 2;
                    break;
                case "SistemaOnline":
                    ruta = "https://factureya.blikon.com/CFDI33FP/Presentacion/Usuario/Ingreso.aspx";
                    titulo = "Aplicativo de facturación";
                    tipo = 1;
                    break;
                case "Gratuita":
                    ruta = "https://factureya.blikon.com/CFDIGratuita33/Presentacion/Usuario/Ingreso.aspx";
                    titulo = "Aplicativo gratuito de facturación";
                    tipo = 1;
                    break;      
                case "Consulte3.2":
                    ruta = "https://www.factureyapac.com/CFDIFY/Presentacion/Usuario/Ingreso.aspx";
                    titulo = "Consulte sus facturas en la versión3.2";
                    tipo = 1;
                    break;
                case "Buzon":
                    ruta = "https://app.factureyapac.com/Tools33/validador/buzonvalidador.aspx";
                    titulo = "Buzón validador";
                    tipo = 1;
                    break;
                case "Micrositio":
                    ruta = "https://app.factureyapac.com/MicrositioV3/Presentacion/Login.aspx";
                    titulo = "Micrositio V4";
                    tipo = 1;
                    break;
                case "DescargaXML":
                    ruta = "https://app.factureyapac.com/Tools33/XML/DescargaXML.aspx";
                    titulo = "Descargue sus XML Gratis";
                    tipo = 1;
                    break;
                case "PAC":
                    ruta = "http://omawww.sat.gob.mx/tramitesyservicios/Paginas/pac_factureya.htm";
                    tipo = 2;
                    break;
                case "Facebook":
                    ruta = "https://www.facebook.com/PACFactureYa/";
                    tipo = 2;
                    break;
                case "Youtube":
                    ruta = "https://www.youtube.com/channel/UCntnf2jdfEmb6fQuGvHZz4A";
                    tipo = 2;
                    break;
                case "FAQ":
                    ruta = "https://app.factureyapac.com/FAQ/Presentacion/Inicio/Index.html";
                    tipo = 2;
                    break;
                default: return false;
            }

            switch (tipo) {
                case 0: console.warn("Error al realizar la petición");
                    return false;
                case 1: window.open(ruta, titulo, "toolbar=no, location=false, titlebar=no, directories=no, statusbar=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=1185, height=750, left=0, top=0, screenX=0, screenY=0");
                    break;
                case 2: window.open(ruta, '_blank');
                    break;
                case 3: location.assign(ruta);
                    break;

            }
        }
    }, 1000);
}


function obtieneQuery(amp, comp) {

    var origen = window.location.search.replace("?", "").replace("%20", "").toLowerCase();
    while (origen.substring(origen.length - 1, origen.length) === "&") {
        origen = origen.substring(0, origen.length - 1);
    }
    var origenReturn = "";
    if (origen !== "") {
        var arreglo = origen.split("&");
        var querys = ["origen=", "clave="];
        var querysValidacion = [new RegExp("^[123]{1}$"), new RegExp("^([Ff][LlDdYyIi]-[FfDd]\\d{6})$")];
        var i = 0;
        arreglo.forEach(function (elementArreglo) {
            querys.forEach(function (elementOrigen) {
                if (elementArreglo.indexOf(elementOrigen) > -1) {
                    var cadena = elementArreglo.substring(elementOrigen.length);
                    if (querysValidacion[i].test(cadena)) {
                        //console.log(elementArreglo + "   " + elementOrigen + "   " + cadena);
                        switch (comp) {
                            case 0: origenReturn = origenReturn + "&" + elementArreglo;
                                break;
                            case 1:
                                if (elementOrigen === "origen=")
                                    origenReturn = origenReturn + "&clave=" + selecciona(cadena);
                                else
                                    origenReturn = origenReturn + "&" + elementArreglo + selecciona(cadena);
                                break;

                        }
                    }
                }
                i++;
            });
            i = 0;
        });
        //console.log(origenReturn);
    }
    if (origenReturn.length > 0) {
        switch (amp) {
            case 0: return origenReturn.substr(1);
            case 1: return origenReturn;
            case 2: return "?" + origenReturn.substr(1);
            default: return "";
        }
    }
    return "";
}

function selecciona(valor) {
    switch (valor) {
        case "1": return "FY-D980018"; //GoogleAds
        case "2": return "FY-D980019"; //Facebook
        case "3": return "FY-D980020"; //Instagram
        default: return ""; //Error
    }
}

function loader(vGroup) {
    var updateProgress = null;
    if (vGroup === null) {
        updateProgress = $find('.upLoader');
        window.setTimeout(updateProgress.set_visible(true), updateProgress.get_displayAfter());
    }
    else if (Page_ClientValidate(vGroup)) {
        updateProgress = $find('.upLoader');
        window.setTimeout(updateProgress.set_visible(true), updateProgress.get_displayAfter());
    }
}



function menu() {
    var banderaMenu = 0;
    //hamburguesa

    function estilosIniciales() {
        //Medida en la cual se muestra el menu
        if (window.innerWidth < 1200) {
            document.getElementsByClassName("opcionesMenu")[0].style.marginTop = "-" + window.innerHeight + "px";
            document.getElementsByClassName("opcionesMenu")[0].style.height = window.innerHeight - document.getElementsByClassName("menu")[0].offsetHeight + "px";
            document.getElementsByClassName("opcionesMenu")[0].style.position = "";
            document.getElementsByClassName("opcionesMenu")[0].style.transition = "margin-top .5s";

        } else {
            document.getElementsByClassName("opcionesMenu")[0].style.marginTop = "";
            document.getElementsByClassName("opcionesMenu")[0].style.height = "";
            document.getElementsByClassName("opcionesMenu")[0].style.transition = "margin-top 0s";
        }
    }
    estilosIniciales();

    //Aqui es donde se muestra u oculta el menu
    function desplegar() {
        if (banderaMenu === 0) {
            document.getElementsByClassName("opcionesMenu")[0].style.marginTop = "4rem";
            open();
            banderaMenu = 1;
        } else {
            document.getElementsByClassName("opcionesMenu")[0].style.marginTop = "-" + window.innerHeight + "px";
            close();
            banderaMenu = 0;
        }
    }
    document.getElementsByClassName("hamburguesa")[0].addEventListener("click", desplegar);


    //animaciones hamburguesa
    function open() {
        for (var i = 0; i > document.getElementsByClassName("barraHamburguesa").length; i++) {
            document.getElementsByClassName("barraHamburguesa")[0].style = "";
        }
        document.getElementsByClassName("barraHamburguesa")[0].style.top = ".4rem";
        document.getElementsByClassName("barraHamburguesa")[2].style.top = ".4rem";
        setTimeout(function () {
            document.getElementsByClassName("barraHamburguesa")[0].style.transform = "rotate(45deg)";
            document.getElementsByClassName("barraHamburguesa")[2].style.transform = "rotate(-45deg)";
            document.getElementsByClassName("barraHamburguesa")[1].style.opacity = "0";
        }, 300);
    }

    function close() {
        for (var i = 0; i > document.getElementsByClassName("barraHamburguesa").length; i++) {
            document.getElementsByClassName("barraHamburguesa")[0].style = "";
        }
        document.getElementsByClassName("barraHamburguesa")[0].style.transform = "rotate(0deg)";
        document.getElementsByClassName("barraHamburguesa")[2].style.transform = "rotate(0deg)";
        setTimeout(function () {
            document.getElementsByClassName("barraHamburguesa")[0].style.top = "0rem";
            document.getElementsByClassName("barraHamburguesa")[1].style.opacity = "1";
            document.getElementsByClassName("barraHamburguesa")[2].style.top = ".8rem";
        }, 200);

    }

    //monitoreamos si se hace click en alguna opcion del menu para ocultarlo
    for (var i = 0; i < document.getElementsByClassName("opcionMenu").length; i++) {
        document.getElementsByClassName("opcionMenu")[i].addEventListener("click", function () {
            if (window.innerWidth < 651) {
                banderaMenu = 1;
                desplegar();
            }

        });
    }

    function fondoMenu() {
        var menu = document.getElementsByClassName("menu")[0];
        if (menu !== undefined) {
            if (window.innerWidth > 1000 && document.getElementsByTagName("BODY")[0].getBoundingClientRect().top === 0) {
                document.getElementsByClassName("menu")[0].style = "";
            } else {
                document.getElementsByClassName("menu")[0].style.background = "#FCC432";
            }
        }

    }
    window.addEventListener("scroll", fondoMenu);

    //monitoreamos si se redimensiona la pantalla para ocultar el menu
    window.addEventListener("resize", function () {
        banderaMenu = 1;
        desplegar();
        estilosIniciales();
        fondoMenu();
    });
}

