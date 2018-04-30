namespace bd.webapprm.entidades
{
    using Microsoft.AspNetCore.Mvc;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class CodigoActivoFijo
    {
        [Key]
        public int IdCodigoActivoFijo { get; set; }

        [Required(ErrorMessage = "Debe introducir el {0}")]
        [Display(Name = "C�digo secuencial:")]
        [StringLength(20, MinimumLength = 2, ErrorMessage = "El {0} no puede tener m�s de {1} y menos de {2}")]
        public string Codigosecuencial { get; set; }

        [Required(ErrorMessage = "Debe introducir el {0}")]
        [Display(Name = "C�digo de barras:")]
        [StringLength(20, MinimumLength = 2, ErrorMessage = "El {0} no puede tener m�s de {1} y menos de {2}")]
        [Remote("ValidarCodigoBarras", "ActivoFijo", AdditionalFields = "IdCodigoActivoFijo", ErrorMessage = "El {0} ya existe.", HttpMethod = "POST")]
        public string CodigoBarras { get; set; }

        [NotMapped]
        [Display(Name = "C�digo �nico:")]
        [Remote("ValidarCodigoUnico", "ActivoFijo", AdditionalFields = "IdCodigoActivoFijo,TAF,CAF", ErrorMessage = "El {0} ya existe.", HttpMethod = "POST")]
        public int Consecutivo { get; set; }

        [NotMapped]
        public string TAF { get; set; }

        [NotMapped]
        public string CAF { get; set; }

        //Propiedades Virtuales Referencias a otras clases
        public virtual ICollection<ActivoFijo> ActivoFijo { get; set; }
    }
}
