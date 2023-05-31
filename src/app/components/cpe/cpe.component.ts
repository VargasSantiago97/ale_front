import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';
import * as XLSX from 'xlsx';

declare var vars: any;

const CPE_PROVINCIAS: any = vars.CPE_PROVINCIAS;

@Component({
    selector: 'app-cpe',
    templateUrl: './cpe.component.html',
    styleUrls: ['./cpe.component.css']
})
export class CpeComponent {

    db: any = {}

    cpeTotales: any = 0
    cpeConfirmadas: any = 0
    cpeAnuladas: any = 0
    cpeActivas: any = 0
    cpeRechhazadas: any = 0

    cols: any = []
    selectedColumns: any = []
    selectedTablaCPE: any = []
    datosCPE: any = []

    datosTabla: any = []

    ok_movimientos: any = false
    ok_cpe: any = false
    ok_socios: any = false
    ok_establecimientos: any = false
    ok_intervinientes: any = false


    constructor(
        private comunicacionService: ComunicacionService,
        private sqlite: SqliteService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'solicitante', min: '80px', header: 'Socio' },
            { field: 'grano', min: '150px', header: 'Grano' },
            { field: 'nro_cpe', min: '150px', header: 'N° CPE' },
            { field: 'nro_ctg', min: '150px', header: 'N° CTG' },
            { field: 'estado', min: '150px', header: 'Estado' },

            { field: 'cod_localidad', min: '150px', header: 'Loc. Dest.' },
            { field: 'cod_provincia', min: '150px', header: 'Prov. Dest.' },
            { field: 'cod_localidad_productor', min: '150px', header: 'Loc. Orig.' },
            { field: 'cod_provincia_productor', min: '150px', header: 'Prov. Dest.' },
            { field: 'codigo_turno', min: '250px', header: 'Cod. Turno' },

            { field: 'corredor_venta_primaria', min: '150px', header: 'Corr. Vta Pri.' },
            { field: 'corredor_venta_secundaria', min: '150px', header: 'Corr. Vta Sec.' },
            { field: 'destino', min: '150px', header: 'Destino' },
            { field: 'destinatario', min: '150px', header: 'Destinatario' },

            { field: 'transportista', min: '150px', header: 'Transportista' },
            { field: 'chofer', min: '150px', header: 'Chofer' },
            { field: 'acoplado', min: '150px', header: 'Pat. Acoplado' },
            { field: 'chasis', min: '150px', header: 'Pat. Chasis' },
            { field: 'pagador_flete', min: '150px', header: 'Pagador flete' },
            { field: 'intermediario_flete', min: '150px', header: 'Interm. Flete' },

            { field: 'remitente_comercial_productor', min: '150px', header: 'Rte. Com. Prod.' },
            { field: 'remitente_comercial_venta_primaria', min: '150px', header: 'Rte. Com. Vta. Prim.' },
            { field: 'remitente_comercial_venta_secundaria', min: '150px', header: 'Rte. Com. Vta. Sec.' },
            { field: 'remitente_comercial_venta_secundaria2', min: '150px', header: 'Rte. Com. Vta. Sec. 2' },
            { field: 'mercado_a_termino', min: '150px', header: 'Merc. a Térm.' },

            { field: 'representante_entregador', min: '150px', header: 'Rep. Ent.' },
            { field: 'representante_recibidor', min: '150px', header: 'Rep. Recib.' },

            { field: 'kg_descarga', min: '150px', header: 'Kg Desc' },
            { field: 'fecha_hora_partida', min: '150px', header: 'F/H Partida' },
            { field: 'peso_bruto', min: '150px', header: 'BRUTO' },
            { field: 'peso_tara', min: '150px', header: 'TARA' },
            { field: 'planta_destino', min: '150px', header: 'Planta Dest.' },

            { field: 'tarifa_referencia', min: '150px', header: 'Tarifa ref' },
            { field: 'tarifa', min: '150px', header: 'Tarifa' },
            { field: 'km_recorrer', min: '150px', header: 'Kms' },
            { field: 'sistema', min: '150px', header: 'Creada' },
            { field: 'tipo_cpe', min: '150px', header: 'Tipo CPE' },
            { field: 'cosecha', min: '150px', header: 'Camp.' },
            { field: 'id_movimiento', min: '150px', header: 'Mov' },
            { field: 'observaciones', min: '750px', header: 'observaciones' },
            { field: 'observaciones_sistema', min: '300px', header: 'observaciones_sistema' },
        ]
        this.selectedColumns = [
            { field: 'solicitante', min: '80px', header: 'Socio' },
            { field: 'grano', min: '150px', header: 'Grano' },
            { field: 'nro_cpe', min: '150px', header: 'N° CPE' },
            { field: 'nro_ctg', min: '150px', header: 'N° CTG' },
            { field: 'estado', min: '150px', header: 'Estado' },

            { field: 'cod_localidad', min: '150px', header: 'Loc. Dest.' },
            { field: 'cod_provincia', min: '150px', header: 'Prov. Dest.' },
            { field: 'cod_localidad_productor', min: '150px', header: 'Loc. Orig.' },
            { field: 'cod_provincia_productor', min: '150px', header: 'Prov. Dest.' },
            { field: 'codigo_turno', min: '250px', header: 'Cod. Turno' },

            { field: 'corredor_venta_primaria', min: '150px', header: 'Corr. Vta Pri.' },
            { field: 'corredor_venta_secundaria', min: '150px', header: 'Corr. Vta Sec.' },
            { field: 'destino', min: '150px', header: 'Destino' },
            { field: 'destinatario', min: '150px', header: 'Destinatario' },

            { field: 'transportista', min: '150px', header: 'Transportista' },
            { field: 'chofer', min: '150px', header: 'Chofer' },
            { field: 'acoplado', min: '150px', header: 'Pat. Acoplado' },
            { field: 'chasis', min: '150px', header: 'Pat. Chasis' },
            { field: 'pagador_flete', min: '150px', header: 'Pagador flete' },
            { field: 'intermediario_flete', min: '150px', header: 'Interm. Flete' },

            { field: 'remitente_comercial_productor', min: '150px', header: 'Rte. Com. Prod.' },
            { field: 'remitente_comercial_venta_primaria', min: '150px', header: 'Rte. Com. Vta. Prim.' },
            { field: 'remitente_comercial_venta_secundaria', min: '150px', header: 'Rte. Com. Vta. Sec.' },
            { field: 'remitente_comercial_venta_secundaria2', min: '150px', header: 'Rte. Com. Vta. Sec. 2' },
            { field: 'mercado_a_termino', min: '150px', header: 'Merc. a Térm.' },

            { field: 'representante_entregador', min: '150px', header: 'Rep. Ent.' },
            { field: 'representante_recibidor', min: '150px', header: 'Rep. Recib.' },

            { field: 'kg_descarga', min: '150px', header: 'Kg Desc' },
            { field: 'fecha_hora_partida', min: '150px', header: 'F/H Partida' },
            { field: 'peso_bruto', min: '150px', header: 'BRUTO' },
            { field: 'peso_tara', min: '150px', header: 'TARA' },
            { field: 'planta_destino', min: '150px', header: 'Planta Dest.' },

            { field: 'tarifa_referencia', min: '150px', header: 'Tarifa ref' },
            { field: 'tarifa', min: '150px', header: 'Tarifa' },
            { field: 'km_recorrer', min: '150px', header: 'Kms' },
            { field: 'sistema', min: '150px', header: 'Creada' },
            { field: 'tipo_cpe', min: '150px', header: 'Tipo CPE' },
            { field: 'cosecha', min: '150px', header: 'Camp.' },
            { field: 'id_movimiento', min: '150px', header: 'Mov' },
            { field: 'observaciones', min: '750px', header: 'observaciones' },
            { field: 'observaciones_sistema', min: '300px', header: 'observaciones_sistema' },
        ]

        this.getAll('movimientos', () => {
            this.ok_movimientos = true
            this.armarDatos()
        })
        this.getAll('carta_porte', () => {
            this.ok_cpe = true
            this.armarDatos()
        })
        this.getAll('socios', () => {
            this.ok_socios = true
            this.armarDatos()
        })
        this.getAll('establecimientos', () => {
            this.ok_establecimientos = true
            this.armarDatos()
        })
        this.getAll('intervinientes', () => {
            this.ok_intervinientes = true
            this.armarDatos()
        })
    }

    getAll(tabla: any, func: any = null) {
        this.comunicacionService.getDB(tabla).subscribe(
            (res: any) => {
                if (res) {
                    this.db[tabla] = res
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta (Comunic)' })
                }
                if (func) {
                    func()
                }
            },
            (err: any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error conectando a BACKEND (Comunic)' })
            }
        )
    }



    //DATOS MOVIMIENTOS

    armarDatos() {

        if (this.ok_movimientos && this.ok_cpe && this.ok_socios && this.ok_establecimientos && this.ok_intervinientes) {
            
            this.datosCPE = []

            this.db['carta_porte'].forEach((cpe:any) => {

                //filtros
                if(true){
                    var data:any = {}

                    if(cpe.data){
                        if(JSON.parse(cpe.data)){
                            data = JSON.parse(cpe.data)
                        }
                    }

                    this.datosCPE.push({
                        activo: cpe.activo,
                        certificado_coe: cpe.certificado_coe,
                        cod_grano: cpe.cod_grano,
                        cod_localidad: cpe.cod_localidad,
                        cod_localidad_operador: cpe.cod_localidad_operador,
                        cod_localidad_productor: cpe.cod_localidad_productor,
                        cod_provincia: cpe.cod_provincia,
                        cod_provincia_operador: cpe.cod_provincia_operador,
                        cod_provincia_productor: cpe.cod_provincia_productor,
                        codigo_turno: cpe.codigo_turno,
                        controlada: cpe.controlada,
                        controlada_final: cpe.controlada_final,
                        corresponde_retiro_productor: cpe.corresponde_retiro_productor,
                        cosecha: cpe.cosecha,
                        creado_el: cpe.creado_el,
                        creado_por: cpe.creado_por,
                        cuit_chofer: cpe.cuit_chofer,
                        cuit_corredor_venta_primaria: cpe.cuit_corredor_venta_primaria,
                        cuit_corredor_venta_secundaria: cpe.cuit_corredor_venta_secundaria,
                        cuit_destinatario: cpe.cuit_destinatario,
                        cuit_destino: cpe.cuit_destino,
                        cuit_intermediario_flete: cpe.cuit_intermediario_flete,
                        cuit_mercado_a_termino: cpe.cuit_mercado_a_termino,
                        cuit_pagador_flete: cpe.cuit_pagador_flete,
                        cuit_remitente_comercial_productor: cpe.cuit_remitente_comercial_productor,
                        cuit_remitente_comercial_venta_primaria: cpe.cuit_remitente_comercial_venta_primaria,
                        cuit_remitente_comercial_venta_secundaria: cpe.cuit_remitente_comercial_venta_secundaria,
                        cuit_remitente_comercial_venta_secundaria2: cpe.cuit_remitente_comercial_venta_secundaria2,
                        cuit_representante_entregador: cpe.cuit_representante_entregador,
                        cuit_representante_recibidor: cpe.cuit_representante_recibidor,
                        cuit_solicitante: cpe.cuit_solicitante,
                        cuit_transportista: cpe.cuit_transportista,
                        data: data,
                        datos: cpe.datos,
                        dominio: cpe.dominio,
                        editado_el: cpe.editado_el,
                        editado_por: cpe.editado_por,
                        es_destino_campo: cpe.es_destino_campo,
                        es_solicitante_campo: cpe.es_solicitante_campo,
                        estado: cpe.estado,
                        fecha_hora_partida: cpe.fecha_hora_partida,
                        id: cpe.id,
                        id_movimiento: cpe.id_movimiento,
                        km_recorrer: cpe.km_recorrer,
                        mercaderia_fumigada: cpe.mercaderia_fumigada,
                        nro_cpe: cpe.nro_cpe,
                        nro_ctg: cpe.nro_ctg,
                        observaciones: cpe.observaciones,
                        observaciones_sistema: cpe.observaciones_sistema,
                        peso_bruto: cpe.peso_bruto,
                        peso_tara: cpe.peso_tara,
                        planta_destino: cpe.planta_destino,
                        planta_origen: cpe.planta_origen,
                        sistema: cpe.sistema,
                        sucursal: cpe.sucursal,
                        tarifa: cpe.tarifa,
                        tarifa_referencia: cpe.tarifa_referencia,
                        terminada: cpe.terminada,
                        tipo_cpe: cpe.tipo_cpe
                    })
                }
            })

            this.armarDatosParaTabla()
        }
    }

    armarDatosParaTabla() {
        this.datosTabla = []

        this.datosCPE.forEach((mov: any) => {

            var estado = ''
            var kg_descarga = null

            if(mov.data){
                if(mov.data.estado){
                    estado = mov.data.estado
                }
                if(mov.data.kg_descarga){
                    kg_descarga = mov.data.kg_descarga
                }
            }

            this.datosTabla.push({
                solicitante: this.transformarDatoMostrar(mov.cuit_solicitante, 'cuit', 'socios', 'alias'),
                grano: mov.cod_grano,
                cod_localidad: 0,
                cod_provincia: 0,
                cod_localidad_productor: 0,
                cod_provincia_productor: 0,
                codigo_turno: 0,
                cosecha: 0,
                chofer: 0,
                corredor_venta_primaria: this.transformarDatoMostrar(mov.cuit_corredor_venta_primaria, 'cuit', 'intervinientes', 'alias'),
                corredor_venta_secundaria: this.transformarDatoMostrar(mov.cuit_corredor_venta_secundaria, 'cuit', 'intervinientes', 'alias'),
                destinatario: this.transformarDatoMostrar(mov.cuit_destinatario, 'cuit', 'intervinientes', 'alias'),
                destino: this.transformarDatoMostrar(mov.cuit_destino, 'cuit', 'intervinientes', 'alias'),
                intermediario_flete: this.transformarDatoMostrar(mov.cuit_intermediario_flete, 'cuit', 'intervinientes', 'alias'),
                mercado_a_termino: this.transformarDatoMostrar(mov.cuit_mercado_a_termino, 'cuit', 'intervinientes', 'alias'),
                pagador_flete: this.transformarDatoMostrar(mov.cuit_pagador_flete, 'cuit', 'intervinientes', 'alias'),
                remitente_comercial_productor: this.transformarDatoMostrar(mov.cuit_remitente_comercial_productor, 'cuit', 'intervinientes', 'alias'),
                remitente_comercial_venta_primaria: this.transformarDatoMostrar(mov.cuit_remitente_comercial_venta_primaria, 'cuit', 'intervinientes', 'alias'),
                remitente_comercial_venta_secundaria: this.transformarDatoMostrar(mov.cuit_remitente_comercial_venta_secundaria, 'cuit', 'intervinientes', 'alias'),
                remitente_comercial_venta_secundaria2: this.transformarDatoMostrar(mov.cuit_remitente_comercial_venta_secundaria2, 'cuit', 'intervinientes', 'alias'),
                representante_entregador: this.transformarDatoMostrar(mov.cuit_representante_entregador, 'cuit', 'intervinientes', 'alias'),
                representante_recibidor: this.transformarDatoMostrar(mov.cuit_representante_recibidor, 'cuit', 'intervinientes', 'alias'),
                transportista: 0,
                estado: estado,
                kg_descarga: this.transformarDatoMostrar(kg_descarga, 'kilos'),
                chasis: 0,
                acoplado: 0,
                fecha_hora_partida: 0,
                nro_cpe: mov.sucursal.toString().padStart(4, "0") + "-" + mov.nro_cpe.toString().padStart(6, "0"),
                nro_ctg: mov.nro_ctg,
                peso_bruto: 0,
                peso_tara: 0,
                planta_destino: 0,
                tarifa_referencia: 0,
                tarifa: 0,
                km_recorrer: 0,
                sistema: 0,
                tipo_cpe: 0,
                id_movimiento: 0,
                observaciones: 0,
                observaciones_sistema: 0,
            })

        })
    }

    transformarDatoMostrar(dato: any, tipo: any, tabla: any = '', obtener: any = null) {

        if (tipo == 'kilos') {
            if (dato) {
                var numero = parseInt(dato)
                return numero.toLocaleString("es-ES") ? numero.toLocaleString("es-ES") : null;
            }
        }

        if (tipo == 'cuit') {
            if(obtener){
                return this.db[tabla].some((e: any) => { return e.cuit == dato }) ? this.db[tabla].find((e: any) => { return e.cuit == dato })[obtener] : dato
            } else {
                return this.db[tabla].some((e: any) => { return e.cuit == dato }) ? this.db[tabla].find((e: any) => { return e.cuit == dato }) : dato
            }
        }
        if (tipo == 'id') {
            if(obtener){
                return this.db[tabla].some((e: any) => { return e.id == dato }) ? this.db[tabla].find((e: any) => { return e.id == dato })[obtener] : dato
            } else {
                return this.db[tabla].some((e: any) => { return e.id == dato }) ? this.db[tabla].find((e: any) => { return e.id == dato }) : dato
            }
        }


        if (tipo == 'provinciaCPE') {
            return CPE_PROVINCIAS.some((e: any) => { return e.codigo == dato }) ? CPE_PROVINCIAS.find((e: any) => { return e.codigo == dato }).descripcion : dato
        }

        return dato
    }

    exportToExcel(){
        /* Crear un libro de trabajo */
        const workbook = XLSX.utils.book_new();
      
        /* Crear una hoja de cálculo */
        const worksheet = XLSX.utils.json_to_sheet(this.datosTabla);
        
        /* Agregar la hoja de cálculo al libro de trabajo */
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
        
        /* Descargar el archivo */
        XLSX.writeFile(workbook, 'movimientos.xlsx');
    }
    ver(){
        console.log(this.selectedTablaCPE)
    }

}