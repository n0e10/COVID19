var botonEsperandoEstado;

var toolsApp = toolsApp || {};

toolsApp.tablaSpin = {

    inicializar : function(){

        var _this = $('.tableSpin');
        _this.prepend(`<i class="icon-spinner2 spinner" data-estado="false"></i>`);

    },

    encendido : function(){
        var _this = $('.tableSpin');
        _this.children("tbody").hide();
        _this.find('i.spinner').attr( 'data-estado','true');
    },

    apagado : function () {
        var _this = $('.tableSpin');
        _this.find('i.spinner').attr( 'data-estado','false');
        _this.children("tbody").show();

    }

};

toolsApp.botonSpin = {

    inicializar : function () {

        $(document).on('click','.botonSpin', function () {
            var _this = $(this);
            var contenidoReal = _this.html();

            _this.html('<i class="icon-spinner2 position-left spinner"></i> Cargando');
            _this.attr('data-contenidoReal','')
                .attr('data-contenidoReal',contenidoReal)
                .addClass("esperandoEstadoBoton");
        });
    },

    finalizarLoading : function () {
        var  conteReal = $('.esperandoEstadoBoton').attr('data-contenidoReal');

        $('.esperandoEstadoBoton')
            .html(conteReal)
            .removeClass('esperandoEstadoBoton');
    }

};

toolsApp.alertaFlotante = {
        crear : function (tipo,mensaje, icono) {
            var retorno = true; // Escapar del For


            const tipoAlerta = {
                correcto: 'bg-success',
                error: 'bg-danger',
                info: 'bg-primary',
                warning: 'bg-warning'
            };

            $('.alert').remove('.alert');

            $.each( tipoAlerta, function( key, value ) {
              if(tipo == key){
                  tipo = value;
                  retorno = false;
              }
              return retorno;
            });

            $('.page-header').prepend(`
                <div class="alert ${tipo} ${icono}" style="position: absolute;z-index: 99999999; right: 0; display: none">
                    <button style="margin-left: 20px;" type="button" class="close" data-dismiss="alert"><span>×</span><span class="sr-only">Close</span></button>
                    <span style="font-family: Roboto;">${mensaje} </span> 
                </div>
            `);

            $('.alert').fadeIn();
    },

    cerrarAlertas : function () {
        $('.alert').remove('.alert');
    },
};

toolsApp.modalFunciones = {
  asignarAlturadinammicaPDF : function () {
      var alto = window.innerHeight - 250;
      var elemento = document.getElementsByClassName('pdfModalEmbebido');
      if(elemento[0] != undefined){
        elemento[0].style.height = alto +"px";
      }


  }
};

toolsApp.printBoton = {
  imprimirBoton : function(){
      $(document).on('click','[data-urlpdf]', function () {
          var _this = $(this);

          printJS(_this.attr('data-urlpdf'));

      });
  }
};

toolsApp.crearModal = {
    inicializar : function () {
        $("html body").append(`
            <div id="modal_generado" class="modal fade" data-backdrop="static" style="display: none;">
						<div class="modal-dialog modal-lg">
							<div class="modal-content">
								<div class="modal-header bg-primary">
									<button type="button" class="close" data-dismiss="modal">×</button>
									<h6 class="modal-title">Titulo del modal</h6>
								</div>

								<div class="modal-body">
								    <div class="row"></div>
                                </div>
									

								<div class="modal-footer">
									<button type="button" class="btn btn-warning" data-dismiss="modal">Cancelar</button>
									<button type="button" class="actionButton btn btn-success">Guardar</button>
								</div>
							</div>
						</div>
					</div>
        `);
    },
    crearFormulario : function (options ) {

        /* Formato de options */

        // let options = {
        //     titulo : "",
        //     inputs : [
        //         {
        //             tituloInput:"",
        //             tipoInput:"",
        //             requerido:true,
        //         },
        //     ],
        //     botonTexto:"",
        //     functionClick:""
        // };



        let inputsGenerados="";
        $("h6.modal-title").html(options.titulo);

        options.inputs.forEach(function (element,index ,value) {

            console.log(value[0]);

            let requerid;

            if(value[0].requerido == true){
                requerid = "required";
            }
            inputsGenerados += `
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>${value[0].tituloInput}:</label>
                            <input type="${value[0].tipoInput}" class="form-control" ${requerid} >
                        </div>
                    </div>
            `;

        });
        $("#modal_generado .modal-body .row").html(inputsGenerados);
        $("#modal_generado .actionButton")
            .attr('onclick',options.functionClick)
            .html(options.botonTexto);

    },
    crearModalTabletSit : function (datos) {

        /* Modelo de objeto */

        // let datoss = {
        //     dni:"45797127",
        //     apeName:"",
        //     codPatri:"",
        //     serie:""
        // }

        if ( $("#modal_tabletSitu").length > 0 ) {
            $("#modal_tabletSitu").remove();
        }

        $("html body").append(`
            <div id="modal_tabletSitu" class="modal fade" data-backdrop="static" style="display: none;">
						<div class="modal-dialog modal-lg">
							<div class="modal-content">
								<div class="modal-header bg-primary">
									<button type="button" class="close" data-dismiss="modal">×</button>
									<h6 class="modal-title">Editar situación de tablet modal</h6>
								</div>

								<div class="modal-body">
								    <div class="row">
								        <div class="col-md-6">
								            <div class="row">
								                <div class="col-md-12">
								                    <h6>DNI:</h6>
								                    <p class="text-indent20">${datos.dni}</p>	
								                    <h6>Apellidos y Nombres:</h6>
								                    <p class="text-indent20">${datos.apeName}</p>
                                                    <h6>Codigo Patrimonial:	</h6>
                                                    <p class="text-indent20">${datos.codPatri}</p>
                                                    <h6>Serie:</h6>
                                                    <p class="text-indent20">${datos.serie}</p> 

                                                </div>
                                            </div>
                                            
                                        </div>
                                        <div class="col-md-6">
                                            <div class="row">
                                                <div class="form-group">
                                                    <h6>Tipo de situación</h6>
                                                    <select id="select-modalSituTab" name="txttipotablet" class="form-control">
                                                       <option value="0">Seleccione</option>
                                                       <option value="2">Perdida</option>
                                                       <option value="3">Deterioro</option>
                                                       <option value="4">Robo</option>
                                                       <option value="5">Para su Reasignacion</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <h6>Tipo de situación</h6>
                                                    <textarea rows="4" id="txtarea-modalSituTab" class="form-control"></textarea>
                                                </div>
                                                <div class="form-group">
                                                    <div class="checkbox">
                                                        <label class="text-primary">
                                                            <input type="checkbox" class="styled text-semibold bAutomatic" data-objetivo="text-modalSituTab-cpr">
                                                            Reasignar Tablet al personal mencionado
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="text-semibold">Codigo Patrimonial Reemplazo: (Pasar Lector de Codigo de Barra ) </label>
                                                    <input id="text-modalSituTab-cpr" disabled type="text" class="form-control"> 
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
									

								<div class="modal-footer">
									<button type="button" class="btn btn-warning" data-dismiss="modal">Cancelar</button>
									<button type="button" class="actionButton btn btn-success">Guardar</button>
								</div>
							</div>
						</div>
					</div>
        `);

        /* Verificacion disable para input */
        toolsApp.validaciones.cbxDisable();
    },

};

toolsApp.validaciones = {
    cbxDisable : function () {
        $("html").on("change", ".bAutomatic", function () {
            let _elemento =$("#" + $(this).attr('data-objetivo'));
            _elemento.prop('disabled', function(i, v) { return !v; });
            _elemento.val("");
        });
    }
};

toolsApp.bloques = {
    datosBloque : function(datos){
        $('.contenedorBlockSuperior[data-num="1"]').find(".detalleBlock").html(datos.total);
        $('.contenedorBlockSuperior[data-num="2"]').find(".detalleBlock").html(datos.progress);
        $('.contenedorBlockSuperior[data-num="3"]').find(".detalleBlock").html(datos.pending);
    }
};

toolsApp.btnTabs = {
    inicializar : function () {
        $("html").on("click",".btnTab",function () {
            let tipoAvance = $(this).attr('data-tipoAvance');
            let sede = $(this).attr('data-sede');

            if(tipoAvance == "true"){

                tipoAvance = true;
            }else{
                tipoAvance = false;
            }



            $(this)
                .removeClass("btn-secondary")
                .addClass("noActionElement btn-primary")
                .siblings(".btnTab")
                .removeClass("noActionElement btn-primary");

            toolsApp.daTables.generarData(tipoAvance,sede);
        });
    }
};

toolsApp.daTables = {
    tableObject: null,
    sedeSelect: null,
    inicializar : function (tipoAvance,sede,idElementoSelect) {
        this.generarData(tipoAvance,sede);
        this.selectChange(idElementoSelect);
        this.btnVerDetalle();
    },
    generarData: function(tipoAvance,sede){
        /* Enviar tipo de Avance True ("Avanzado"), False("Faltante")
         * Sede false = total
         *
          * */
        let dataLegajo = $("data#dataLegajo");
        let modulo = dataLegajo.val();
        let filtros = dataLegajo.attr("data-filters");
        let avance = `&${modulo}=true`;
        let faltante = `&${modulo}=false`;
        let sedeE = "";
        let periodo = App.elements.periodo.val();
        let urlData = `/api/v1/logistica/marco/control/?cod_periodo_id=${periodo}`;

        if(sede !== false){
            sedeE = "&cod_sede="+sede;
        }

        if(tipoAvance == true){
            urlData = `${urlData}&flag=${modulo}${avance}&${sedeE}`;

        }else{
            urlData = `${urlData}&flag=${modulo}${faltante}&${sedeE}`;
        }

        urlData = `${urlData}&${filtros}`;

        toolsApp.daTables.generarTablaDataBloque(sede, urlData,tipoAvance);

        }
    ,
    generarTablaDataBloque : function (sede, urlData, tipoAvance) {
        App.service.get(urlData, function (data) {
            if (sede) {
                App.sedeMarcoData = data;
            }

            toolsApp.bloques.datosBloque(data.sumary);

            $("#tbllogistica").dataTable().fnDestroy();
            let element_table = $('#tbllogistica');
            let html = "";

            $.each(data.data, (i,v) => {
                let apoyo = "";
                let botonAvance ="";
                if(v.cant_apoyo > 0){
                    apoyo = v.cant_apoyo;
                }else if(v.cant_apoyo == 0 && v.es_apoyo == false){
                    apoyo = "-";
                }

                if(tipoAvance == true){
                    botonAvance = `
                        <button type="button" class="btn bg-danger-400 btn-rounded btn-sm bRemover">
                                <i class="icon-bin position-left"></i>
                                Remover</button>
                    `;
                }else{
                    botonAvance = `
                        <button type="button" class="btn bg-success-400 btn-rounded btn-sm bAgregar">
                                <i class="icon-check position-left"></i>
                                Seleccionar</button>
                    `;
                }

                html += `<tr class='' data-id='${v.id}' data-codigo='${v.codigo}'>
                            <td>${v.es_apoyo ? '---' : ''} ${v.codigo}</td>
                            <td>${v.nivel.descripcion}</td>
                            <td>${v.cod_sede.descripcion}</td>
                            <td>${apoyo}</td>
                            <td>
                                <button type="button" class="btn bg-blue-400 btn-rounded btn-sm btnVerDetalleTabla">
                                <i class="icon-eye2 position-left"></i>
                                Ver detalle</button>
                            </td>
                            <td>${botonAvance}</td>
                        </tr>`;
            });

            element_table.find('tbody').html(html);

            element_table.DataTable({
                       "ordering": false,
                        "info":     false,
                       "lengthChange":false,
                       "language": {
                           "paginate": {
                               "previous": "Anterior",
                               "next": "Siguiente"
                           }
                       }
                   });
        });
    },

    selectChange : function (idElementoSelect) {
        let _this = this;
        $("#"+idElementoSelect).change(function (e) {
            // Alerta en caso exista data pendeinte

            let valorSelect = $("#"+idElementoSelect).val();
            let valorText = $("#"+idElementoSelect+" option:selected").text();
            if (App.sedeMarcoData !== null) {
                if (App.sedeMarcoData.sumary.pending == 0) {
                    _this.applySelect(valorSelect);
                }else {
                    swal({
                      title: "Recepción de legajos",
                      text: `Aun existe ${App.sedeMarcoData.sumary.pending} legajos pendientes para las sede operativa 
                      ${toolsApp.daTables.sedeSelect.nombre}, ¿desea continuar?`,
                      type: "warning",
                      showCancelButton: true,
                      closeOnConfirm: false,
                      showLoaderOnConfirm: true
                    }, function (isConfirm) {
                      if (isConfirm) {
                          _this.applySelect(valorSelect);
                          swal.close();
                      }else {
                          swal.close();
                          e.stopImmediatePropagation();
                          $("#"+idElementoSelect).val(toolsApp.daTables.sedeSelect.codigo);
                      }
                    });
                }
            }else {
                toolsApp.daTables.sedeSelect = {"codigo": valorSelect, "nombre": valorText};
                _this.applySelect(valorSelect);
            }


        });

    },
    applySelect: function(valorSelect) {
        $(".btnTab").attr('data-sede',valorSelect); // seteando valor de sede al boton
        $(".btnTab:first-child")
            .removeClass("btn-secondary")
            .addClass("noActionElement btn-primary")
            .siblings(".btnTab")
            .removeClass("noActionElement btn-primary");
        toolsApp.daTables.generarData(true,valorSelect);

        // Activar y desactivar input

        let input_codigo = App.elements.frmselect.find('#codigo');
        if (valorSelect !== "") {
            input_codigo.removeAttr('readonly');
            input_codigo.focus();
        }else {
            input_codigo.attr('readonly', 'readonly');
        }
    },
    crearModalTabla : function (data) {
        let datosTd ="";


        $("#modal_tablaT").remove();

        $("html body").append(`
            <div id="modal_tablaT" class="modal fade" data-backdrop="static" style="display: none;">
						<div class="modal-dialog modal-lg">
							<div class="modal-content">
								<div class="modal-header bg-primary">
									<button type="button" class="close" data-dismiss="modal">×</button>
									<h6 class="modal-title">Detalles</h6>
								</div>

								<div class="modal-body">
								    <div class="row">
								        <table class="table tableSpin">
                                            <thead>
                                                <tr class="">
                                                    <th>ESTADO</th>
                                                    <th>USUARIO</th>
                                                    <th>FECHA</th>        
                                                </tr>
                                            </thead>
                                            <tbody>
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
									

								<div class="modal-footer">
									<button type="button" class="btn btn-warning" data-dismiss="modal">Aceptar</button>								
								</div>
							</div>
						</div>
					</div>
        `);

        $.each(data,function (i,val) {
            let fecha;
            if(val.creation_date != null){
                fecha = new Date(val.creation_date);
            }

            datosTd += `
                <tr>
                    <td>${val.valor_flag ? 
                        '<i class="icon-check  position-left text-primary"></i>Ingresado':'<i class="icon-cross  position-left text-danger"></i>Quitado ' }</td>
                    <td>${val.created_by}</td>
                    <td>${val.creation_date != null ? fecha.getDay()+"/"+fecha.getMonth()+"/"+fecha.getFullYear() : "-"}</td> 
                </tr>
            `;
        });

        $("#modal_tablaT table tbody").html(datosTd);
        $("#modal_tablaT").modal();
    },
    btnVerDetalle : function () {

        $("html").on("click",".btnVerDetalleTabla", function () {

            let modulo = $("data").val();
            let codigo = $(this).closest("tr").attr('data-codigo');
            let urlData=`/api/v1/audits/legajo/?nombre_flag=${modulo}&codigo=${codigo}`;
            $("#modal_tablaT").remove();
            App.service.get(urlData, function (data) {
                toolsApp.daTables.crearModalTabla(data);
            });
        });
    }
};



$(document).ready(function () {
    toolsApp.tablaSpin.inicializar();
    toolsApp.botonSpin.inicializar();
    toolsApp.crearModal.inicializar();
    toolsApp.btnTabs.inicializar();
    //toolsApp.daTables.inicializar(true,false,"territory");


    /* datos formulario para Modal*/
    /* Formato de options */

        // let options = {
        //     titulo : "",
        //     inputs : [
        //         {
        //             tituloInput:"",
        //             tipoInput:"",
        //             requerido:true,
        //         },
        //     ],
        //     botonTexto:"",
        //     functionClick:""
        // };


    // toolsApp.crearModal.crearFormulario(options);


    /* iniar Modal Situ */

    /* Modelo de objeto */

        let datos = {
            dni:"45797127",
            apeName:"Ebed Guerra Borda",
            codPatri:"3453423",
            serie:"234235236235"
        };
    toolsApp.crearModal.crearModalTabletSit(datos);

    /* LLamar en boton */
    /*
    <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal_tabletSitu">
            <i class="icon-cog3 position-left"></i> lanzarModal
        </button>
    */




    /* Asignar altura en pdfEmbebido */
    toolsApp.modalFunciones.asignarAlturadinammicaPDF();

    /* Inicalizar los botones para imprimirPDF*/

    toolsApp.printBoton.imprimirBoton();





});


