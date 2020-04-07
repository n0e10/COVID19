$(document).ready(function (e) {
    App.elements = App.defelements();

    App.redener.selectOperacion(App.elements.operacion);

    App.elements.operacion.change(function(e){
        let cod_op = App.elements.operacion.val();
        App.redener.selectPeriodo(App.elements.periodo,cod_op);

    });

    App.elements.periodo.change(function(e){
        let cod_op = App.elements.operacion.val();
        let periodo = App.elements.periodo.val();
        App.redener.create_table_sedes_periodo(App.elements.table_sedes_periodo,cod_op,periodo);
    });

    App.elements.table_sedes_periodo.on('click', 'tbody tr', function(e){
        App.params.codsede=$(this).attr('codsede');
        App.params.periodo=$(this).attr('periodo');
        App.params.cod_oper=$(this).attr('cod_oper');
        let sede = $(this).attr('sede');
        let nivel = "brigada";
        App.elements.select_nivel.val(nivel);
        App.elements.sede.html(sede);
        App.redener.create_modal_croquis(App.elements.modal_croquis,App.params.cod_oper,App.params.periodo, App.params.codsede,nivel);
    });

    App.elements.select_nivel.change(function(e){
       let nivel =  App.elements.select_nivel.val();
       App.redener.create_modal_croquis(App.elements.modal_croquis,App.params.cod_oper,App.params.periodo, App.params.codsede,nivel);
    });

    App.elements.table_croquis.on('click','tbody tr', function (e){
        let nom_pdf=$(this).attr('nom_pdf');

        App.elements.nom_pdf.attr('src',nom_pdf);
    });








});
