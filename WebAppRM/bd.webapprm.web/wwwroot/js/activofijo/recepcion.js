﻿$(document).ready(function () {
    Init_Select2();
    Init_Touchspin();
    eventoTipoActivoFijo();
    eventoClaseActivoFijo();
    eventoMarca();
    eventoValidacionTecnicaChange();
    $('.datepicker').datetimepicker({
        'format': 'D-M-Y hh:mm'
    });

    var wizard = $('.wizard').wizard();
    wizard.on('finished', function (e, data) {
        alert("Finalizar");
        //$("#fuelux-wizard").submit();
        //console.log("submitted!");
        //$.smallBox({
        //    title: "Congratulations! Your form was submitted",
        //    content: "<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",
        //    color: "#5F895F",
        //    iconSmall: "fa fa-check bounce animated",
        //    timeout: 4000
        //});
    });
});

function eventoValidacionTecnicaChange()
{
    $("#RecepcionActivoFijo_ValidacionTecnica").on("change", function (e) {
        mostrarOcultarDatosEspecificosCodificacion(e.currentTarget.checked);
    });
}

function mostrarOcultarDatosEspecificosCodificacion(mostrarOcultar)
{
    if (mostrarOcultar)
    {
        $("#btn_next").hide();
        $("#li_codificacion").hide();
    }
    else
    {
        $("#btn_next").show();
        $("#li_codificacion").show();
    }
}

function eventoTipoActivoFijo() {
    $("#RecepcionActivoFijo_SubClaseActivoFijo_ClaseActivoFijo_IdTipoActivoFijo").on("change", function (e) {
        partialViewTipoActivoFijo(e.val);
    });
}

function eventoClaseActivoFijo() {
    $("#RecepcionActivoFijo_SubClaseActivoFijo_IdClaseActivoFijo").on("change", function (e) {
        partialViewClaseActivoFijo(e.val);
    });
}

function eventoMarca()
{
    $("#ActivoFijo_Modelo_IdMarca").on("change", function (e) {
        mostrarLoadingPanel("checkout-form", "Cargando modelos...");
        $.ajax({
            url: "/ActivoFijo/Modelo_SelectResult",
            method: "POST",
            data: { idMarca: e.val },
            success: function (data) {
                $("#div_modelo").html(data);
                Init_Select2();
            },
            complete: function (data) {
                $("#checkout-form").waitMe("hide");
            }
        });
    });
}

function partialViewTipoActivoFijo(idTipoActivoFijo) {
    mostrarLoadingPanel("checkout-form", "Cargando clases de activo fijo...");
    $.ajax({
        url: "/ActivoFijo/ClaseActivoFijo_SelectResult",
        method: "POST",
        data: { idTipoActivoFijo: idTipoActivoFijo != null ? idTipoActivoFijo : -1 },
        success: function (data) {
            $("#div_claseActivoFijo").html(data);
            Init_Select2();
            partialViewClaseActivoFijo($("#RecepcionActivoFijo_SubClaseActivoFijo_IdClaseActivoFijo").val());
            eventoClaseActivoFijo();
        },
        error: function (data) {
            $("#checkout-form").waitMe("hide");
        }
    });
}

function partialViewClaseActivoFijo(idClaseActivoFijo) {
    mostrarLoadingPanel("checkout-form", "Cargando sub clases de activo fijo...");
    $.ajax({
        url: "/ActivoFijo/SubClaseActivoFijo_SelectResult",
        method: "POST",
        data: { idClaseActivoFijo: idClaseActivoFijo != null ? idClaseActivoFijo : -1 },
        success: function (data) {
            $("#div_subClaseActivoFijo").html(data);
            Init_Select2();
        },
        complete: function (data) {
            $("#checkout-form").waitMe("hide");
        }
    });
}