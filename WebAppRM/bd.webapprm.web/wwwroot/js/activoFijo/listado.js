﻿var arrRecepcionActivoFijoDetalleSeleccionado = Array();
jQuery(document).ready(function () {
    initDataTableFiltrado("tableActivosFijos", []);

    $.each($(".btnDetallesActivosFijos"), function (index, value) {
        var ids = $(value);
        var arrIds = ids.data("ids").toString().split(",");
        $.each(arrIds, function (index, value) {
            arrRecepcionActivoFijoDetalleSeleccionado.push({
                idRecepcionActivoFijoDetalle: value,
                seleccionado: false
            });
        });
    });
});

function abrirVentanaDetallesActivoFijo(id) {
    mostrarLoadingPanel("modalContentTableActivosFijos", "Cargando detalles de activo fijo...");
    $("#modalBodyTableActivosFijos").html("");
    var btn_detalles = $("#btnDetallesActivoFijo_" + id);
    var arrIds = btn_detalles.data("ids").toString().split(",");

    var arrAux = Array();
    for (var i = 0; i < arrIds.length; i++) {
        var rafdSeleccionado = obtenerRecepcionActivoFijoDetalleSeleccionado(arrIds[i]);
        arrAux.push(rafdSeleccionado);
    }

    $.ajax({
        url: btn_detalles.data("url"),
        method: "POST",
        data: { listadoRecepcionActivoFijoDetalleSeleccionado: arrAux, arrConfiguraciones: arrConfiguraciones },
        success: function (data) {
            $("#modalBodyTableActivosFijos").html(data);
        },
        complete: function (data) {
            if (existeConfiguracion("IsConfiguracionRecepcion"))
                initDataTableFiltrado("tableDetallesActivoFijo", [5, 8, 10, 13, 14, 15, 16]);
            else if (existeConfiguracion("IsConfiguracionMantenimiento"))
                initDataTableFiltrado("tableDetallesActivoFijo", [15, 16]);
            $("#modalContentTableActivosFijos").waitMe("hide");
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