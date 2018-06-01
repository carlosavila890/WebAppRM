﻿jQuery(document).ready(function (e) {
    Init_DatetimePicker("FechaCorteInventario");
    Init_DatetimePicker("FechaInforme");
    Init_Select2();
    adicionarArrRecepcionActivoFijoDetalle();
    initDataTableFiltrado("tableDetallesActivoFijoBajas", [], function () {
        var table = $("#tableDetallesActivoFijoBajas").dataTable();
        var api = table.api();
        var rows = api.rows({ page: 'current' }).nodes();
        var last = null;
        var groupadmin = [];

        crearGrupo(api, rows, last, groupadmin, 18, "Fondo de financiamiento", 0, 22);
        crearGrupo(api, rows, last, groupadmin, 3, "Clase de activo fijo", 6, 22);
        crearGrupo(api, rows, last, groupadmin, 4, "Subclase de activo fijo", 12, 22);
    });
    eventoGuardar();
});

function adicionarArrRecepcionActivoFijoDetalle() {
    var arrIds = idsRecepcionActivoFijoDetalle.split(",");
    $.each(arrIds, function (index, value) {
        if (value != "" && value != null) {
            var arrValores = value.split("_");
            adicionarRecepcionActivoFijoDetalleSeleccionado(arrValores[0], arrValores[1].toLowerCase() === "true");
        }
    });
}

function callBackFunctionSeleccionBaja(idRecepcionActivoFijoDetalle, seleccionado) {
    var rafd = obtenerRecepcionActivoFijoDetalleSeleccionado(idRecepcionActivoFijoDetalle);
    if (seleccionado)
        rafd.seleccionado = true;
    else
        rafd.seleccionado = false;
}

function eventoGuardar() {
    $("#btn-guardar").on("click", function (e) {
        var form = $("#checkout-form");
        var validar = true;

        if (arrRecepcionActivoFijoDetalleSeleccionado.length == 0) {
            mostrarNotificacion("Error", "Tiene que existir al menos un Activo Fijo en el Inventario.");
            validar = false;
        }
        if (!form.valid())
            validar = false;

        if (validar) {
            var arrIdsRecepcionActivoFijoDetalle = [];
            for (var i = 0; i < arrRecepcionActivoFijoDetalleSeleccionado.length; i++)
                arrIdsRecepcionActivoFijoDetalle.push(arrRecepcionActivoFijoDetalleSeleccionado[i].idRecepcionActivoFijoDetalle + "_" + arrRecepcionActivoFijoDetalleSeleccionado[i].seleccionado);

            var idsRecepcionActivoFijoDetalle = arrIdsRecepcionActivoFijoDetalle.join(',').toString();
            $("#idsRecepcionActivoFijoDetalleSeleccionado").val(idsRecepcionActivoFijoDetalle);
            $("#btn-guardar").prop("type", "submit");
        }
    });
}