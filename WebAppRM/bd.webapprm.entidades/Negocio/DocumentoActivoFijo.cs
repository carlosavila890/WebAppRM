﻿using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace bd.webapprm.entidades
{
    public partial class DocumentoActivoFijo
    {
        [Key]
        public int IdDocumentoActivoFijo { get; set; }

        [Required(ErrorMessage = "Debe introducir el {0}")]
        [Display(Name = "Documento:")]
        [StringLength(200, MinimumLength = 2, ErrorMessage = "El {0} no puede tener más de {1} y menos de {2}")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "Debe introducir la {0}")]
        [Display(Name = "Fecha de subida:")]
        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy hh:mm tt}", ApplyFormatInEditMode = true)]
        public DateTime Fecha { get; set; }

        [Required(ErrorMessage = "Debe introducir la {0}")]
        [Display(Name = "Dirección:")]
        [StringLength(1024, MinimumLength = 2, ErrorMessage = "El {0} no puede tener más de {1} y menos de {2}")]
        public string Url { get; set; }

        [Display(Name = "Activo fijo:")]
        [Range(1, double.MaxValue, ErrorMessage = "Debe seleccionar el {0}")]
        public int? IdActivoFijo { get; set; }
        public virtual ActivoFijo ActivoFijo { get; set; }

        [Display(Name = "Detalle de recepción de activo Fijo:")]
        [Range(1, double.MaxValue, ErrorMessage = "Debe seleccionar el {0}")]
        public int? IdRecepcionActivoFijoDetalle { get; set; }
        public virtual RecepcionActivoFijoDetalle RecepcionActivoFijoDetalle { get; set; }

        [Display(Name = "Alta de activo fijo:")]
        [Range(1, double.MaxValue, ErrorMessage = "Debe seleccionar el {0}")]
        public int? IdAltaActivoFijo { get; set; }
        public virtual AltaActivoFijo AltaActivoFijo { get; set; }

        [Display(Name = "Factura de alta de activo fijo:")]
        [Range(1, double.MaxValue, ErrorMessage = "Debe seleccionar el {0}")]
        public int? IdFacturaActivoFijo { get; set; }
        public virtual FacturaActivoFijo FacturaActivoFijo { get; set; }

        [Display(Name = "Proceso judicial de activo fijo:")]
        [Range(1, double.MaxValue, ErrorMessage = "Debe seleccionar el {0}")]
        public int? IdProcesoJudicialActivoFijo { get; set; }
        public virtual ProcesoJudicialActivoFijo ProcesoJudicialActivoFijo { get; set; }

        [Display(Name = "Recepción de activo fijo:")]
        [Range(1, double.MaxValue, ErrorMessage = "Debe seleccionar la {0}")]
        public int? IdRecepcionActivoFijo { get; set; }
        public virtual RecepcionActivoFijo RecepcionActivoFijo { get; set; }

        [Display(Name = "Compañía de seguro:")]
        [Range(1, double.MaxValue, ErrorMessage = "Debe seleccionar la {0}")]
        public int? IdCompaniaSeguro { get; set; }
        public virtual CompaniaSeguro CompaniaSeguro { get; set; }
    }
}
