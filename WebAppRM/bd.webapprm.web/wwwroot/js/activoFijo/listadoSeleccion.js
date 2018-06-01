﻿var arrRecepcionActivoFijoDetalleSeleccionado = [];
var objAdicional = [];
var mostrarNoSeleccionados = false;

jQuery(document).ready(function (e) {
    initDataTableFiltrado("tableActivosFijos", []);
});

function inicializarDetallesActivoSeleccion() {
    $.each($(".hiddenIdRecepcionActivoFijoDetalle"), function (index, value) {
        var ids = $(value);
        var arrIds = ids.val().toString().split(",");
        $.each(arrIds, function (index, value) {
            adicionarRecepcionActivoFijoDetalleSeleccionado(value, true);
        });
    });
}

function inicializarObjetoAdicional()
{
    $.each(arrRecepcionActivoFijoDetalleSeleccionado, function (index, value) {
        objAdicional.push({
            idRecepcionActivoFijoDetalle: value.idRecepcionActivoFijoDetalle,
            seleccionado: value.seleccionado
        });
    });
}

function adicionarRecepcionActivoFijoDetalleSeleccionado(idRecepcionActivoFijoDetalle, seleccionado)
{
    arrRecepcionActivoFijoDetalleSeleccionado.push({
        idRecepcionActivoFijoDetalle: idRecepcionActivoFijoDetalle,
        seleccionado: seleccionado
    });
}

function abrirVentanaDetallesActivoFijo(id) {
    mostrarLoadingPanel("modalContentTableActivosFijos", "Cargando detalles de activo fijo...");
    $("#modalBodyTableActivosFijos").html("");
    var btn_detalles = $("#btnDetallesActivoFijo_" + id);
    var arrIds = btn_detalles.data("ids").toString().split(",");

    var arrAux = Array();
    for (var i = 0; i < arrIds.length; i++) {
        var arrIdsSeleccionados = arrIds[i].split("_");
        arrAux.push({
            idRecepcionActivoFijoDetalle: parseInt(arrIdsSeleccionados[0]),
            seleccionado: arrIdsSeleccionados[1].toLowerCase() === "true"
        });
    }

    $.ajax({
        url: btn_detalles.data("url"),
        method: "POST",
        data: { listadoRecepcionActivoFijoDetalleSeleccionado: arrAux, arrConfiguraciones: arrConfiguraciones, mostrarNoSeleccionados: mostrarNoSeleccionados },
        success: function (data) {
            $("#modalBodyTableActivosFijos").html(data);
        },
        complete: function (data) {
            initDataTableFiltrado("tableDetallesActivoFijo", []);
            $("#modalContentTableActivosFijos").waitMe("hide");
        }
    });
}

function cargarListadoActivosFijosParaSeleccion(objeto) {
    mostrarLoadingPanel("modalContentDatosEspecificos", "Cargando listado de activos fijos, por favor espere...");
    $.ajax({
        url: urlListadoActivosFijosSeleccionResult,
        method: "POST",
        data: { listadoRecepcionActivoFijoDetalleSeleccionado: arrRecepcionActivoFijoDetalleSeleccionado, objAdicional: objAdicional },
        success: function (data) {
            $("#modalBodyDatosEspecificos").html(data);
            try {
                var nombreFuncionCallback = $(objeto).data("funcioncallback");
                eval(nombreFuncionCallback + "()");
            } catch (e) { }
        },
        error: function (errorMessage) {
            mostrarNotificacion("Error", "Ocurrió un error al cargar el formulario.");
        },
        complete: function (data) {
            $("#modalContentDatosEspecificos").waitMe("hide");
        }
    });
}

function obtenerRecepcionActivoFijoDetalleSeleccionado(valor) {
    for (var i = 0; i < arrRecepcionActivoFijoDetalleSeleccionado.length; i++) {
        if (arrRecepcionActivoFijoDetalleSeleccionado[i].idRecepcionActivoFijoDetalle == valor)
            return arrRecepcionActivoFijoDetalleSeleccionado[i];
    }
    return null;
}

function existeConfiguracion(propiedad)
{
    var configuracion = obtenerConfiguracion(propiedad);
    return configuracion != null ? configuracion.valor : false;
}

function obtenerConfiguracion(propiedad)
{
    for (var i = 0; i < arrConfiguraciones.length; i++) {
        if (arrConfiguraciones[i].propiedad == propiedad)
            return arrConfiguraciones[i];
    }
    return null;
}

function eliminarRecepcionActivoFijoDetalleSeleccionado(idRecepcionActivoFijoDetalle)
{
    for (var i = 0; i < arrRecepcionActivoFijoDetalleSeleccionado.length; i++) {
        if (arrRecepcionActivoFijoDetalleSeleccionado[i].idRecepcionActivoFijoDetalle == idRecepcionActivoFijoDetalle)
        {
            arrRecepcionActivoFijoDetalleSeleccionado.splice(i, 1);
            return;
        }
    }
}

function eventoCheckboxDetallesActivoFijo(checkbox)
{
    var chk = $(checkbox);
    try {
        var idRecepcionActivoFijoDetalle = chk.data("idrecepcionactivofijodetalle");
        var rafdSeleccionado = obtenerRecepcionActivoFijoDetalleSeleccionado(idRecepcionActivoFijoDetalle);
        rafdSeleccionado.seleccionado = chk.prop("checked");
    }
    catch (e) { }
    try {
        var nombreFuncionCallback = chk.data("funcioncallback");
        eval(nombreFuncionCallback + "(" + idRecepcionActivoFijoDetalle + "," + chk.prop("checked") + ")");
    } catch (e) { }
}

function addRowDetallesActivosFijos(idTableACopiar, idTableCopiando, idRecepcionActivoFijoDetalle, arrCeldasCopiando, isOpcionesUltimaColumna) {
    var table = $('#' + idTableACopiar).DataTable();
    var arrValores = [];
    for (var i = 0; i < arrCeldasCopiando.length; i++) {
        if (i == (arrCeldasCopiando.length - 1)) {
            if (isOpcionesUltimaColumna) {
                arrValores.push(arrCeldasCopiando[i]);
            }
            else
                arrValores.push($("#" + idTableCopiando + idRecepcionActivoFijoDetalle + arrCeldasCopiando[i]).html());
        }
        else
            arrValores.push($("#" + idTableCopiando + idRecepcionActivoFijoDetalle + arrCeldasCopiando[i]).html());
    }
    var rowNode = table.row.add(arrValores).draw().node();
    $(rowNode).prop("id", idTableACopiar + idRecepcionActivoFijoDetalle);
    $.each($(rowNode).children(), function (index, value) {
        $(value).prop("id", idTableACopiar + idRecepcionActivoFijoDetalle + arrCeldasCopiando[index]);
    });
}

function addRowDetallesActivosFijosPorArray(idTableACopiar, idRecepcionActivoFijoDetalle, arrCeldasCopiando, arrValores, isOpcionesUltimaColumna)
{
    var table = $('#' + idTableACopiar).DataTable();
    var rowNode = table.row.add(arrValores).draw().node();
    $(rowNode).prop("id", idTableACopiar + idRecepcionActivoFijoDetalle);
    $.each($(rowNode).children(), function (index, value) {
        $(value).prop("id", idTableACopiar + idRecepcionActivoFijoDetalle + arrCeldasCopiando[index]);
    });
}

function deleteRowDetallesActivosFijos(idTableEliminar, idRecepcionActivoFijoDetalle) {
    var row = $("#" + idTableEliminar + idRecepcionActivoFijoDetalle);
    $('#' + idTableEliminar).dataTable().fnDeleteRow(row);
}

function addRowCheckBox(idRecepcionActivoFijoDetalle, isChecked, callbackFunctionCheckBox, isConfiguracionSeleccionDisabled)
{
    return '<div class="checkbox"><label><input class="checkbox style-0 chkDetallesActivoFijo"' + (isChecked ? 'checked="checked"' : '') + ' type="checkbox" onchange="eventoCheckboxDetallesActivoFijo(this)" data-funcioncallback="' + callbackFunctionCheckBox + '" data-idrecepcionactivofijodetalle="' + idRecepcionActivoFijoDetalle + '" id= "chkDetalleActivoFijo_' + idRecepcionActivoFijoDetalle + '"' + (isConfiguracionSeleccionDisabled ? 'disabled="disabled"' : '') + '><span>&nbsp;</span></label ></div>';
}

function agregarDashValorEmpty(valor)
{
    if (valor == "" || valor == null)
        valor = "-";

    return valor;
}