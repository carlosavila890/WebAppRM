﻿var arrRecepcionActivoFijoDetalleComponentes = Array();
var idFilaDatoEspecificoActual = -1;
var cantComponentesSeleccionados = 0;
jQuery(document).ready(function () {
    initComponentes();
});

function initComponentes()
{
    $.each($(".btnComponentesDatosEspecificos"), function (index, value) {
        var btnComponente = $(value);
        var idFilaDatoEspecifico = btnComponente.data("idfila");
        addComponenteToArray(idFilaDatoEspecifico, btnComponente.data("idorigen"), $("#hComponentes_" + idFilaDatoEspecifico).val().split(","));
    });
}

function addComponenteToArray(idFilaDatoEspecifico, idRecepcionActivoDetalleOrigen, arrIdsComponentes)
{
    arrRecepcionActivoFijoDetalleComponentes.push({
        idFilaDatoEspecifico: idFilaDatoEspecifico,
        idRecepcionActivoDetalleOrigen: idRecepcionActivoDetalleOrigen,
        arrIdsComponentes: arrIdsComponentes
    });
}

function cargarFormularioComponentesDatosEspecificos(idFila) {
    mostrarLoadingPanel("checkout-form", "Cargando componentes, por favor espere...");
    $("#btnAdicionarComponentes").data("idFila", idFila);
    idFilaDatoEspecificoActual = idFila;
    $.ajax({
        url: urlModalComponentesResult,
        method: "POST",
        data: { componentesActivo: obtenerRecepcionActivoFijoDetalleComponente(), idsComponentesExcluir: obtenerIdsComponentesExcluir(idFila) },
        success: function (data) {
            var divComponentes = '<div id="divContenedorComponentes">';
            var btnAdicionarEliminarComponentes = '<p><button type="button" class="btn btn-primary" style="padding:7px !important;margin-top:7px !important;margin-left:7px !important;" onclick="cargarListadoActivosFijosParaComponentes()" id="btnAdicionarComponentes">Adicionar / Eliminar Componentes</button></p>';
            var infoComponentes = '<div class="row"><div class="alert alert-info alert-block" style="border-left-width:5px !important;padding-left:20px !important;"><h4 class="alert-heading">Informaci&oacute;n</h4>Un componente de Activo fijo, es un Activo fijo en sí, que se recepcionó con Motivo de alta: "Adici&oacute;n".</br>Haga clic en Adicionar / Eliminar Componentes para visualizar y asignar a este Activo fijo los componentes disponibles que existen en el sistema.</div></div>';
            Init_BootBox("Componentes de Activo fijo", divComponentes + infoComponentes + btnAdicionarEliminarComponentes + data + "</div>", "large", null, null, function () {
                isComponentes = false;
                cantComponentesSeleccionados = 0;
            });
        },
        error: function (errorMessage) {
            mostrarNotificacion("Error", "Ocurrió un error al cargar el formulario.");
        },
        complete: function (data) {
            initDataTableFiltrado("tableDetallesActivoFijo", [thClassName.bodega, thClassName.proveedor, thClassName.motivoAlta, thClassName.fechaRecepcion, thClassName.ordenCompra, thClassName.fondoFinanciamiento, thClassName.fechaAlta, thClassName.numeroFactura], function () {
                crearGrupo("tableDetallesActivoFijo", [
                    { propiedad: thClassName.claseActivoFijo, valor: "Clase de activo fijo" }
                ]);
            });
            $("#tableDetallesActivoFijo_filter > label > span").prop("style", "height:32px !important;");
            ajustarBootboxPorCiento(80);
            isComponentes = true;
            cantComponentesSeleccionados = 0;
            $("#checkout-form").waitMe("hide");
        }
    });
}

function cargarListadoActivosFijosParaComponentes()
{
    mostrarLoadingPanel("divContenedorComponentes", "Cargando listado de activos fijos, por favor espere...");
    var idFila = $("#btnAdicionarComponentes").data("idFila");

    var componentesActivo = obtenerRecepcionActivoFijoDetalleComponente();
    var idsComponentesExcluir = obtenerIdsComponentesExcluir(idFila);
    idsComponentesExcluir.push(componentesActivo.idRecepcionActivoDetalleOrigen);
    
    $.ajax({
        url: urlComponentesActivosFijos,
        method: "POST",
        data: { componentesActivo: componentesActivo, idsComponentesExcluir: idsComponentesExcluir },
        success: function (data) {
            Init_BootBox("Componentes disponibles", data, "large", null, null, function () {
                isComponentes = false;
                cantComponentesSeleccionados = 0;
            });
        },
        error: function (errorMessage) {
            mostrarNotificacion("Error", "Ocurrió un error al cargar el formulario.");
        },
        complete: function (data) {
            initDataTableFiltrado("tableDetallesActivoFijoComponentes", [thClassName.bodega, thClassName.proveedor, thClassName.motivoAlta, thClassName.fechaRecepcion, thClassName.ordenCompra, thClassName.fondoFinanciamiento, thClassName.fechaAlta, thClassName.numeroFactura], function () {
                var table = $("#tableDetallesActivoFijoComponentes").dataTable();
                var api = table.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;
                var groupadmin = [];
                crearGrupo(api, rows, last, groupadmin, 3, "Clase de activo fijo", 0, 24);
            });
            eventoCheckboxDetallesActivoFijo();
            $("#tableDetallesActivoFijoComponentes_filter > label > span").prop("style", "height:32px !important;");
            ajustarBootboxPorCiento(80);
            $("#divContenedorComponentes").waitMe("hide");
        }
    });
}

function tryMarcarCheckBoxTodosComponentes() {
    var api = $("#tableDetallesActivoFijoComponentes").dataTable().api();
    var cantFilas = api.rows().nodes().length;

    if (cantComponentesSeleccionados == cantFilas)
        $("#chkDetalleActivoFijo_0").prop("checked", "checked");
    else
        $("#chkDetalleActivoFijo_0").prop("checked", "");
}

function obtenerIdsComponentesExcluir(idFila)
{
    var arrIdsComponentesExcluir = Array();
    for (var i = 0; i < arrRecepcionActivoFijoDetalleComponentes.length; i++) {
        if (arrRecepcionActivoFijoDetalleComponentes[i].idFilaDatoEspecifico != idFila)
        {
            var arrIdsComponentes = arrRecepcionActivoFijoDetalleComponentes[i].arrIdsComponentes;
            for (var j = 0; j < arrIdsComponentes.length; j++)
                arrIdsComponentesExcluir.push(arrIdsComponentes[j]);
        }
    }
    return arrIdsComponentesExcluir;
}

function eliminarIdComponente(idRecepcionActivoFijoDetalleEliminar, rafdComponente)
{
    for (var i = 0; i < rafdComponente.arrIdsComponentes.length; i++) {
        if (rafdComponente.arrIdsComponentes[i] == idRecepcionActivoFijoDetalleEliminar) {
            rafdComponente.arrIdsComponentes.splice(i, 1);
            return;
        }
    }
}

function eliminarComponente(idFilaDatoEspecifico)
{
    for (var i = 0; i < arrRecepcionActivoFijoDetalleComponentes.length; i++) {
        if (arrRecepcionActivoFijoDetalleComponentes[i].idFilaDatoEspecifico == idFilaDatoEspecifico) {
            arrRecepcionActivoFijoDetalleComponentes.splice(i, 1);
            return;
        }
    }
}

function obtenerRecepcionActivoFijoDetalleComponente()
{
    for (var i = 0; i < arrRecepcionActivoFijoDetalleComponentes.length; i++) {
        if (arrRecepcionActivoFijoDetalleComponentes[i].idFilaDatoEspecifico == idFilaDatoEspecificoActual) {
            return arrRecepcionActivoFijoDetalleComponentes[i];
        }
    }
    return null;
}

function existeIdComponente(idComponente)
{
    var rafdComponente = obtenerRecepcionActivoFijoDetalleComponente();
    for (var i = 0; i < rafdComponente.arrIdsComponentes.length; i++) {
        if (rafdComponente.arrIdsComponentes[i] == idComponente)
            return true;
    }
    return false;
}

function callBackFunctionSeleccionComponente(idRecepcionActivoFijoDetalle, seleccionado)
{
    if (seleccionado) {
        var btnEliminarComponente = "<div id='divEliminarComponente_" + idRecepcionActivoFijoDetalle + "' class='btnEliminarComponentes' style='display:inline;'><a href='javascript: void(0);' id='btnEliminarComponente_" + idRecepcionActivoFijoDetalle + "' onclick=abrirVentanaConfirmacion('btnEliminarComponente_" + idRecepcionActivoFijoDetalle + "') data-funcioncallback=callBackEliminarComponente('" + idRecepcionActivoFijoDetalle + "') data-titulo='Eliminar' data-descripcion='&#191; Desea eliminar el Componente... ?'>Eliminar</a></div>";
        addRowDetallesActivosFijos("tableDetallesActivoFijo", "tableDetallesActivoFijoComponentes", idRecepcionActivoFijoDetalle, [thClassName.codigoSecuencial, thClassName.tipoActivoFijo, thClassName.claseActivoFijo, thClassName.subClaseActivoFijo, thClassName.nombreActivoFijo, thClassName.marca, thClassName.modelo, thClassName.serie, thClassName.numeroChasis, thClassName.numeroMotor, thClassName.placa, thClassName.numeroClaveCatastral, thClassName.sucursal, thClassName.dependencia, thClassName.bodega, thClassName.empleado, thClassName.proveedor, thClassName.motivoAlta, thClassName.fechaRecepcion, thClassName.ordenCompra, thClassName.fondoFinanciamiento, thClassName.fechaAlta, thClassName.numeroFactura, btnEliminarComponente], true);
        var rafdComponente = obtenerRecepcionActivoFijoDetalleComponente();
        rafdComponente.arrIdsComponentes.push(idRecepcionActivoFijoDetalle);
    }
    else
        callBackEliminarComponente(idRecepcionActivoFijoDetalle);
    putValuesComponentesenCampoHidden();
}

function callBackEliminarComponente(idRecepcionActivoFijoDetalle)
{
    deleteRowDetallesActivosFijos("tableDetallesActivoFijo", idRecepcionActivoFijoDetalle);
    var rafdComponente = obtenerRecepcionActivoFijoDetalleComponente();
    eliminarIdComponente(idRecepcionActivoFijoDetalle, rafdComponente);
    putValuesComponentesenCampoHidden();
}

function putValuesComponentesenCampoHidden()
{
    var hComponentes = $("#hComponentes_" + idFilaDatoEspecificoActual);
    var rafdComponente = obtenerRecepcionActivoFijoDetalleComponente();
    var idsComponentes = rafdComponente.arrIdsComponentes.join(',');
    hComponentes.val(idsComponentes);
}