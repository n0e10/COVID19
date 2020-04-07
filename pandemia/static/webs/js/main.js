/** Logica frontend
 *  @author Jose Ramirez Tello
 *  @version 0.1
 */

var table_asignados = undefined;

var App = {
    /**
     * Define los elemenos UI que se utilizaran en el proyecto
     */
    "sedeMarcoData": null,
    "defelements": () => {
        return {
            "territory": $("select#territory"),
            "vertodo": $("#vertodo"),
            "logistica": $("table#tbllogistica"),
            "frmselect": $("#frmselect"),
            "verdistribucion": $("#verdistribucion"),
            "guardar": $("#guardar_distribucion"),
            "imprimird": $("#imprimir_distribucion"),
            "csrf_token": $("#csrf_token"),
            "table_sedes_periodo": $("table#table_sedes_periodo"),
            "periodo": $("#periodo"),
            "operacion": $("#operacion"),
            "modal_croquis": $("#modal_croquis"),
            "select_nivel":$("#select_nivel"),
            "table_croquis":$("table#table_croquis"),
            "nom_pdf":$("#nom_pdf"),
            "sede":$("#sede"),

        }
    },
    /**
     * Objeto contiene lo labels
     */
    "labels": {

    },

    params:{
        "cod_oper":"01",
        "codsede":"01",
        "periodo":"1",
        "brigada":"001",
        "ruta":"0001",
        "empadronador":"0001",
    }
};

App.utils = {
    "getQuery": (paramter) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(paramter);
    }
};

/**
 * @class Contiene las funciones generica de ajax y las que consumen los servicios REST
 */
App.service = (() => {
    /**
     * Metodo general para consumir la API rest
     * @param endpoint Url Path del servicio
     * @param callback Funcion a ejecutar cuando el resultado es correcto
     */
    let get = (endpoint, callback) =>{
        toolsApp.alertaFlotante.cerrarAlertas();
        $.ajax({
            url: API_BASE_URL + endpoint,
            success: (data) => {
                callback(data);
            },
            error: (err, status, otherr) => {
                toolsApp.alertaFlotante.crear('error', App.labels.defaultmsg.get.error, 'icon-x');
                toolsApp.tablaSpin.apagado();
            }
        })
    };

    /**
     * Metodo general para actualizar parcialmente registro en una API
     * @param endpoint
     * @param token Url Path del servicio
     * @param data Datos enviados para actualizar
     * @param callback Funcion a ejecutar cuando el resultado es correcto
     * @param errcallback Funciona que se ejecuta cuando ocurre un error en la petición
     */
    let patch = (endpoint, token, data, callback, errcallback) =>{
        toolsApp.alertaFlotante.cerrarAlertas();
        $.ajax({
            url: API_BASE_URL + endpoint,
            type: 'PATCH',
            dataType: 'JSON',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            headers: {
                "X-CSRFToken": token
            },
            success: (data) => {
                if (callback !== undefined) {
                    callback(data);
                }
                toolsApp.alertaFlotante.crear('correcto', App.labels.defaultmsg.patch.success, 'icon-check');
                toolsApp.botonSpin.finalizarLoading();
            },
            error: (err, status, otherr) => {
                let msgerr = App.labels.defaultmsg.patch.error;
                if (err.responseJSON !== undefined) {
                    if (err.responseJSON.detail !== undefined) {
                        msgerr = err.responseJSON.detail;
                    }
                }
                toolsApp.alertaFlotante.crear('error', msgerr, 'icon-x');
                toolsApp.tablaSpin.apagado();
                toolsApp.botonSpin.finalizarLoading();

                if (errcallback !== undefined) {
                    errcallback(data);
                }
            }
        });
    };



    /**
     * Consume la API con lo marco sensales de logistica bajo los filtros determinados
     * @param filters Query parametes con filtros sobre el modelo MarcoCensal
     * @param callback Funcion a ejecutar cuando el resultado es correcto
     */
    let get_sedes_periodo = (filters, callback) => {
        let endpoint = '/commons_api/sedes/lista_sedes/' + filters;
        get(endpoint, callback);
    };

    /**
     * Consume la API con lo marco sensales de logistica bajo los filtros determinados
     * @param filters Query parametes con filtros sobre el modelo MarcoCensal
     * @param callback Funcion a ejecutar cuando el resultado es correcto
     */
    let get_periodos = (filters, callback) => {
        let endpoint = '/commons_api/periodo/lista_periodo/' + filters;
        get(endpoint, callback);
    };

    let get_croquis_listado_reportes = (nivel,filters, callback) => {
        let endpoint = `/croquis_listado_api/reportes/${nivel}/` + filters;
        get(endpoint, callback);
    };

    /**
     * Consume la API con lo marco sensales de logistica bajo los filtros determinados
     * @param callback Funcion a ejecutar cuando el resultado es correcto
     */
    let get_operaciones = (callback) => {
        let endpoint = '/commons_api/operacion/';
        get(endpoint, callback);
    };







    return {
        "get": get,
        "patch": patch,
        "get_sedes_periodo": get_sedes_periodo,
        "get_periodos": get_periodos,
        "get_operaciones":get_operaciones,
        "get_croquis_listado_reportes":get_croquis_listado_reportes,
    }
})();

/**
 * @class Renderiza resultado en la UI
 */
App.redener = ((app, service) => {
    let null_to = (value, result) => {
        result = (result === undefined) ? "" : result;
        return (value === null) ? result : value;
    };

    let selectPeriodo = (element_periodo , cod_oper) => {
        let filters = `?cod_oper=${cod_oper}`;
        let htmloptions = '';

        service.get_periodos(filters,(datos)=>{
            //si no hay ningun periodo
            let periodo ='-1';
            $.each(datos, function (i,v) {
              htmloptions += `<option value='${v.periodo}' >PERIODO 0${v.periodo}</option>`;
            });
            element_periodo.html(htmloptions);
            if(datos.length>0){
                periodo = datos[0].periodo;
            }
            create_table_sedes_periodo(App.elements.table_sedes_periodo,cod_oper,periodo);
        });

    };

    let selectOperacion = (element_operacion) => {
        let htmloptions = '';

        service.get_operaciones((datos)=>{
            $.each(datos, function (i,v) {
              htmloptions += `<option value='${v.cod_oper}'>${v.descripcion}</option>`;
            });

            element_operacion.html(htmloptions);
            App.elements.operacion.trigger("change");
        });


    };

    /**
     * Crea el HTML tabla generica del marco mostrando los flag de seguimiento
     * @param element_table Referencia al objeto HTML de la tabla donde se va a renderizar
     * @param flag Campo que se utilizara para el seguimiento de la actividad
     * @param datos Datos a renderizar en la tabla
     */
    let create_table_sedes_periodo = (element_table, cod_oper,periodo) => {

        let filters = `?cod_oper=${cod_oper}&periodo=${periodo}`;

        if(element_table.DataTable!==null)
            element_table.DataTable().destroy();

        service.get_sedes_periodo(filters,(datos)=>{
            let html = "";
            $.each(datos, (i,v) => {
                html += `<tr sede="${v.sede}" codsede='${v.codsede}' periodo='${periodo}'  cod_oper='${v.cod_oper}'  style="cursor:pointer" class="openModal" >
                    <td>${v.codsede}</td>
                    <td>${v.sede}</td>
                    
                    </tr>`;

            });
            element_table.find('tbody').html(html);
            element_table.DataTable();
        });

    };


    let create_table_modal_croquis = (element_table,nivel,datos) =>{

        let html = "";
        let html_head = "";
        if(element_table.DataTable!==null)
            element_table.DataTable().destroy();

        if(nivel=="brigada"){
            $.each(datos, (i,v) => {
                html += `<tr codsede='${v.codsede}' periodo='${v.periodo}'  
                           cod_oper='${v.cod_oper}'  style="cursor:pointer" class="openModal" nom_pdf='${URL_PDF}${v.nom_pdf}'  >
                               <td>${v.codsede}</td>
                               <td>${v.periodo}</td>
                               <td>${v.brigada}</td>
                           </tr>`;
            });
            html_head +=
                "<tr>" +
                "<th>SEDE</th>" +
                "<th>PERIODO</th>" +
                "<th>BRIGADA</th>" +
                "</tr>";
        }
        else if(nivel =="empadronador"){
            $.each(datos, (i,v) => {
                html += `<tr codsede='${v.codsede}' periodo='${v.periodo}'  
                           cod_oper='${v.cod_oper}'   style="cursor:pointer" class="openModal" nom_pdf='${URL_PDF}${v.nom_pdf}' >
                               <td>${v.codsede}</td>
                               <td>${v.periodo}</td>
                               <td>${v.brigada}</td>
                               <td>${v.empadronador}</td>
                           </tr>`;
            });
            html_head +=
                "<tr>" +
                "<th>SEDE</th>" +
                "<th>PERIODO</th>" +
                "<th>BRIGADA</th>" +
                "<th>EMPADRONADOR</th>" +
                "</tr>";
        }

        element_table.find('thead').html(html_head);
        element_table.find('tbody').html(html);
        element_table.DataTable({
            searching: false,
             //scrollY: 500
        });

    }


    let create_modal_croquis = (element_modal,cod_oper,periodo,codsede,nivel) => {
        let filters = `?cod_oper=${cod_oper}&periodo=${periodo}&codsede=${codsede}`;

        App.service.get_croquis_listado_reportes(nivel, filters,(datos)=>{
            create_table_modal_croquis(App.elements.table_croquis,nivel,datos.data);
            if (datos.data.length>0) {
                let urlini=`${URL_PDF}${datos.data[0].nom_pdf}`;
                App.elements.nom_pdf.attr('src',urlini);
            }

            element_modal.modal("show");
        });
    };




    return {
        "null_to":null_to,
        "selectPeriodo": selectPeriodo,
        "selectOperacion": selectOperacion,

        "create_table_sedes_periodo":create_table_sedes_periodo,
        "create_modal_croquis" : create_modal_croquis,
        "create_table_modal_croquis" : create_table_modal_croquis,
    }
})(App, App.service);
