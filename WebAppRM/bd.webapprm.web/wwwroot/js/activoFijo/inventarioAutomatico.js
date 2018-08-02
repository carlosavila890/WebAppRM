﻿jQuery(document).ready(function (e) {
    Init_DatetimePicker("FechaCorteInventario", true);
    Init_DatetimePicker("FechaInforme", true);
    Init_Select2();
    adicionarArrRecepcionActivoFijoDetalle();
    initDataTableFiltrado("tableDetallesActivoFijoBajas", [thClassName.bodega, thClassName.proveedor, thClassName.motivoAlta, thClassName.fechaRecepcion, thClassName.ordenCompra, thClassName.fondoFinanciamiento, thClassName.fechaAlta, thClassName.numeroFactura], function () {
        var table = $("#tableDetallesActivoFijoBajas").dataTable();
        var api = table.api();
        var rows = api.rows({ page: 'current' }).nodes();
        var last = null;
        var groupadmin = [];

        crearGrupo(api, rows, last, groupadmin, 21, "Fondo de financiamiento", 0, 25);
        crearGrupo(api, rows, last, groupadmin, 3, "Clase de activo fijo", 6, 25);
        crearGrupo(api, rows, last, groupadmin, 4, "Subclase de activo fijo", 12, 25);
    });
    $('#tableDetallesActivoFijoBajas').DataTable().page.len(-1).draw();
    eventoGuardar();
    eventoLectorCodigoBarras();
    inicializarIdsArrRecepcionActivoFijoDetalleTodos();

    //Simula la detección de un código (El parámetro debe ser un código de un activo fijo en alta)
    //$("#CodigoActivoFijo_Codigosecuencial").scannerDetection('1.002.001.1');

    if (isVistaDetalles) {
        $("#NumeroInforme").prop("disabled", "disabled");
        $("#FechaCorteInventario").prop("disabled", "disabled");
        $("#FechaInforme").prop("disabled", "disabled");
        $("#IdEstado").prop("disabled", "disabled");
    }
});

function eventoLectorCodigoBarras()
{
    Init_DeteccionLectorCodigoBarras("CodigoActivoFijo_Codigosecuencial", function (barcode, qty) {
        eventoScannerCodigosecuencial(barcode, qty);
    });
}

function eventoScannerCodigosecuencial(barcode, qty)
{
    mostrarLoadingPanel("checkout-form", "Cargando datos de activo fijo...");
    limpiarCampos();
    $("#CodigoActivoFijo_Codigosecuencial").val(barcode);
    $.ajax({
        url: urlDatosInventarioActivoFijo,
        method: "POST",
        data: { codigoSecuencial: barcode },
        success: function (data) {
            $("#divDatosInventarioActivoFijo").html(data);
            if (existeActivoFijoEnTabla())
            {
                mostrarNotificacion("Error", "El activo fijo con el código secuencial " + barcode + " ya se encuentra en el listado.");
                limpiarCampos();
            }
            else {
                HabilitarCheckConstatadoBtnRegistrar(true);
                eventoRegistrar();
            }
        },
        error: function (errorObj) {
            mostrarNotificacion("Error", errorObj.responseText);
            limpiarCampos();
        },
        complete: function (data) {
            eventoLectorCodigoBarras();
            $("#checkout-form").waitMe("hide");
        }
    });
}

function existeActivoFijoEnTabla()
{
    var idRecepcionActivoFijoDetalle = $("#IdRecepcionActivoFijoDetalle").val();
    var rafd = obtenerRecepcionActivoFijoDetalleSeleccionado(idRecepcionActivoFijoDetalle);
    return rafd != null;
}

function HabilitarCheckConstatadoBtnRegistrar(habilitar)
{
    if (habilitar) {
        $("#chkConstatado").prop("disabled", "");
        $("#btn-registrar").prop("disabled", "");
    }
    else {
        $("#chkConstatado").prop("disabled", "disabled");
        $("#btn-registrar").prop("disabled", "disabled");
    }
}

function adicionarArrRecepcionActivoFijoDetalle() {
    var arrIds = idsRecepcionActivoFijoDetalle.split(",");
    $.each(arrIds, function (index, value) {
        if (value != "" && value != null) {
            var arrValores = value.split("_");
            adicionarRecepcionActivoFijoDetalleSeleccionado(arrValores[0], arrValores[1].toLowerCase() === "true");
        }
    });
}

function callBackFunctionSeleccionBaja(idRecepcionActivoFijoDetalle, seleccionado)
{
    var rafd = obtenerRecepcionActivoFijoDetalleSeleccionado(idRecepcionActivoFijoDetalle);
    if (seleccionado)
        rafd.seleccionado = true;
    else
        rafd.seleccionado = false;
}

function callBackFunctionSeleccionConstatado(idRecepcionActivoFijoDetalle, seleccionado) {
    adicionarRecepcionActivoFijoDetalleSeleccionado(idRecepcionActivoFijoDetalle, seleccionado);
    var hIdRecepcionActivoFijoDetalle = '<input type="hidden" class="hiddenIdRecepcionActivoFijoDetalle" id="hIdRecepcionActivoFijoDetalle_' + idRecepcionActivoFijoDetalle + '" name="hIdRecepcionActivoFijoDetalle_' + idRecepcionActivoFijoDetalle + '" value="' + idRecepcionActivoFijoDetalle + '" />';
    var btnEliminarActivoFijo = "<div id='divEliminarDatosEspecificos_" + idRecepcionActivoFijoDetalle + "' class='btnEliminarDatosEspecificos' style='display:inline;'><a href='javascript: void(0);' id='btnEliminarDatosEspecifico_" + idRecepcionActivoFijoDetalle + "' onclick=abrirVentanaConfirmacion('btnEliminarDatosEspecifico_" + idRecepcionActivoFijoDetalle + "') data-funcioncallback=callBackFunctionEliminarDatoEspecifico('" + idRecepcionActivoFijoDetalle + "') data-titulo='Eliminar' data-descripcion='&#191; Desea eliminar el Activo Fijo seleccionado... ?'>Eliminar</a></div>";

    addRowDetallesActivosFijosPorArray("tableDetallesActivoFijoBajas", idRecepcionActivoFijoDetalle, ['', thClassName.codigoSecuencial, thClassName.tipoActivoFijo, thClassName.claseActivoFijo, thClassName.subClaseActivoFijo, thClassName.nombreActivoFijo, thClassName.marca, thClassName.modelo, thClassName.serie, thClassName.numeroChasis, thClassName.numeroMotor, thClassName.placa, thClassName.numeroClaveCatastral, thClassName.sucursal, thClassName.dependencia, thClassName.bodega, thClassName.empleado, thClassName.proveedor, thClassName.motivoAlta, thClassName.fechaRecepcion, thClassName.ordenCompra, thClassName.fondoFinanciamiento, thClassName.fechaAlta, thClassName.motivoAlta, thClassName.numeroFactura, ''],
        [
        addRowCheckBox(idRecepcionActivoFijoDetalle, seleccionado, "callBackFunctionSeleccionBaja", false, "", "", false),
        $("#CodigoActivoFijo_Codigosecuencial").val(),
        $("#ActivoFijo_SubClaseActivoFijo_ClaseActivoFijo_TipoActivoFijo_Nombre").val(),
        $("#ActivoFijo_SubClaseActivoFijo_ClaseActivoFijo_Nombre").val(),
        $("#ActivoFijo_SubClaseActivoFijo_Nombre").val(),
        $("#ActivoFijo_Nombre").val(),
        $("#ActivoFijo_Modelo_Marca_Nombre").val(),
        $("#ActivoFijo_Modelo_Nombre").val(),
        agregarDashValorEmpty($("#Serie").val()),
        agregarDashValorEmpty($("#RecepcionActivoFijoDetalleVehiculo_NumeroChasis").val()),
        agregarDashValorEmpty($("#RecepcionActivoFijoDetalleVehiculo_NumeroMotor").val()),
        agregarDashValorEmpty($("#RecepcionActivoFijoDetalleVehiculo_Placa").val()),
        agregarDashValorEmpty($("#RecepcionActivoFijoDetalleEdificio_NumeroClaveCatastral").val()),
        $("#SucursalActual_Nombre").val(),
        agregarDashValorEmpty($("#UbicacionActivoFijoActual_Empleado_Dependencia_Nombre").val()),
        agregarDashValorEmpty($("#UbicacionActivoFijoActual_Bodega_Nombre").val()),
        $("#UbicacionActivoFijoActual_IdEmpleado").val(),
        $("#RecepcionActivoFijo_IdProveedor").val(),
        $("#RecepcionActivoFijo_MotivoAlta_Descripcion").val(),
        $("#RecepcionActivoFijo_FechaRecepcion").val(),
        $("#RecepcionActivoFijo_OrdenCompra").val(),
        $("#RecepcionActivoFijo_FondoFinanciamiento_Nombre").val(),
        agregarDashValorEmpty($("#AltaActivoFijoActual_FechaAlta").val()),
        agregarDashValorEmpty($("#AltaActivoFijoActual_FacturaActivoFijo_NumeroFactura").val()),
        hIdRecepcionActivoFijoDetalle + btnEliminarActivoFijo
    ], true);
}

function callBackFunctionEliminarDatoEspecifico(idRecepcionActivoFijoDetalle) {
    deleteRowDetallesActivosFijos("tableDetallesActivoFijoBajas", idRecepcionActivoFijoDetalle);
    eliminarRecepcionActivoFijoDetalleSeleccionado(idRecepcionActivoFijoDetalle);
    $("#CodigoActivoFijo_Codigosecuencial").focus();
}

function eventoRegistrar()
{
    $("#btn-registrar").on("click", function (e) {
        var idRecepcionActivoFijoDetalle = $("#IdRecepcionActivoFijoDetalle").val();
        arrRecepcionActivoFijoDetalleTodos.push(idRecepcionActivoFijoDetalle);
        var seleccionado = $("#chkConstatado").prop("checked");
        callBackFunctionSeleccionConstatado(idRecepcionActivoFijoDetalle, seleccionado);
        limpiarCampos();
        tryMarcarCheckBoxTodos();
    });
}

function limpiarCampos()
{
    $("#CodigoActivoFijo_Codigosecuencial").val("");
    $("#ActivoFijo_Nombre").val("");
    $("#SucursalActual_Nombre").val("");
    $("#UbicacionActivoFijoActual_IdEmpleado").val("");
    $("#chkConstatado").prop("checked", "");
    HabilitarCheckConstatadoBtnRegistrar(false);
    $("#CodigoActivoFijo_Codigosecuencial").focus();
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