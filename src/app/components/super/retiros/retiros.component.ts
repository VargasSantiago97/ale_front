import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';

@Component({
    selector: 'app-retiros',
    templateUrl: './retiros.component.html',
    styleUrls: ['./retiros.component.css']
})
export class RetirosComponent {

    idGranosSeleccionado: any = ''

    db: any = {}
    db_locales: any = {}

    ///
    movimientosTotales: any = null
    movimientosKilosBalanza: any = 0
    movimientosKilosCampo: any = 0

    movimientosTotalesLocales: any = 0

    ok_origen: any = 0
    ok_balanza: any = 0
    ok_acondicionadora: any = 0
    ok_descarga: any = 0
    ok_contratos: any = 0

    cpeTotales: any = 0
    cpeConfirmadas: any = 0
    cpeAnuladas: any = 0
    cpeActivas: any = 0
    cpeRechhazadas: any = 0

    establecimientos: any = 0
    establecimientosSocio: any = 0

    colsProd: any = []

    colsRetirosPorSocio: any = []
    datosMovimientos: any = []


    datosTabla: any = []
    datosTablaTotales: any = []
    
    datosProduccion: any = []
    datosTablaProduccion: any = []
    datosTablaProduccionTotales: any = {}
    
    datosCorresponde: any = []
    datosTablaCorresponde: any = []
    datosTablaCorrespondeTotales: any = {}
    
    colsRetiros: any = []
    datosRetiros: any = []
    datosTablaRetiros: any = []
    datosTablaRetirosTotales: any = {}

    colsSociedad: any = []
    colsSociedadTerceros: any = []

    datosSociedad: any = []
    datosTablaSociedad: any = []
    datosTablaSociedadTotales: any = {}
    
    datosTablaSociedadTijuana: any = []
    datosTablaSociedadTotalesTijuana: any = {}
    datosTablaSociedadTraviesas: any = []
    datosTablaSociedadTotalesTraviesas: any = {}

    ok_movimientos: any = false
    ok_movimientos_local: any = false
    ok_cpe: any = false
    ok_socios: any = false
    ok_establecimientos: any = false
    ok_establecimientoProduccion: any = false
    ok_silos: any = false
    ok_loteASilos: any = false
    ok_movimiento_origen: any = false
    ok_lotes: any = false
    ok_produccion: any = false
    ok_contratosDB: any = false
    ok_movimiento_contrato: any = false

    anotaciones:any = {
        "465b2f38ca75" : {
            sociedad: ["men 1", "men 2"],
            sociedadTijuana: ["mens 4", "men 4"],
            sociedadTraviesas: ["men 5", "men 56"]
        }
    }


    constructor(
        private comunicacionService: ComunicacionService,
        private sqlite: SqliteService,
        private messageService: MessageService
    ) { }

    ngOnInit() {

        this.colsProd = [
            { field: 'establecimiento', header: 'ESTABLECIMIENTO' },
            { field: 'has', header: 'HAS' },
            { field: 'cant_mov', header: 'CANT. MOVS' },
            { field: 'cant_trilla', header: 'CANT. MOVS TRILLA' },
            { field: 'kg_trilla', header: 'TOTAL KGS TRILLA' },
            { field: 'kg_silo', header: 'TOTAL KGS A SILO' },
            { field: 'cant_silo', header: 'CANT. SILOS' },
            { field: 'kg', header: 'TOTAL KGS' },
            { field: 'rinde', header: 'RINDE' },
        ]
        
        this.colsRetirosPorSocio = [
            { field: 'establecimiento', header: 'ESTABLECIMIENTO' },
            { field: 'kg', header: 'TOTAL KILOS' },
        ]

        this.colsRetiros = [
            { field: 'socio', header: 'SOCIO' },
            { field: 'corresponde', header: 'CORRESPONDE' },
            { field: 'retiros', header: 'RETIROS (SILO Y TRILLA)' },
            { field: 'saldo', header: 'SALDO' },
        ]

        this.colsSociedad = [
            { field: 'socio', header: 'SOCIO' },
            { field: 'corresponde', header: 'CORRESPONDE (Trilla)' },
            { field: 'retiros', header: 'RETIROS TRILLA' },
            { field: 'camara', header: 'CAMARA' },
            { field: 'clientes', header: 'RET. CLIENTES' },
            { field: 'saldo', header: 'SALDO PROD.' },
            { field: 'lotes_yc', header: 'LOTES YC' },
            { field: 'lotes_pl', header: 'LOTES PL' },
            { field: 'saldo_lotes', header: 'SALDO' },
            { field: 'bolsones', header: 'CORRESPONDE (Bolsones)' },
            { field: 'retiros_bolsones', header: 'RETIROS BOLSONES' },
            { field: 'retiros_bolsones_camara', header: 'RET. BOL A CAM.' },
            { field: 'retiros_bolsones_clientes', header: 'RET. CLIENTES (BOL.)' },
            { field: 'retiros_bolsones_lotes_yc', header: 'RET. BOL. YC' },
            { field: 'retiros_bolsones_lotes_pl', header: 'RET. BOL. PL' },
            { field: 'saldo_final', header: 'SALDO FINAL' },
        ]
        this.colsSociedadTerceros = [
            { field: 'socio', header: 'SOCIO' },
            { field: 'corresponde', header: 'CORRESPONDE (Trilla)' },
            { field: 'retiros', header: 'RETIROS TRILLA' },
            { field: 'saldo', header: 'SALDO PROD.' },
            { field: 'lotes_yc', header: 'LOTES YC' },
            { field: 'lotes_pl', header: 'LOTES PL' },
            { field: 'lotes_ny', header: 'LOTES SOC NY' },
            { field: 'saldo_lotes', header: 'SALDO' },
            { field: 'bolsones', header: 'CORRESPONDE (Bolsones)' },
            { field: 'retiros_bolsones', header: 'RETIROS BOLSONES' },
            { field: 'retiros_bolsones_lotes_yc', header: 'RET. BOL. YC' },
            { field: 'retiros_bolsones_lotes_pl', header: 'RET. BOL. PL' },
            { field: 'retiros_bolsones_lotes_ny', header: 'RET. BOL. SOC NY' },
            { field: 'saldo_final', header: 'SALDO FINAL' },
        ]



        this.getAll('granos')
        this.getAll('movimientos', () => {
            this.ok_movimientos = true
            this.analizarMovimientosTotales()
        })
        this.getAll('carta_porte', () => {
            this.ok_cpe = true
            this.analizarCPE()
        })
        this.getAll('socios', () => {
            this.db['socios'].forEach((e:any) => { this.colsRetirosPorSocio.push({field: e.id, header: e.alias}) }) 
            this.ok_socios = true
        })
        this.getAll('establecimientos', () => {
            this.ok_establecimientos = true
            this.analizarEstablecimientos()
        })

        this.getAllLocal('movimientos', () => {
            this.ok_movimientos_local = true
            this.analizarMovimientosTotalesLocales()
        })
        this.getAllLocal('movimiento_origen', () => {
            this.ok_movimiento_origen = true
        })
        this.getAllLocal('movimiento_contrato', () => {
            this.ok_movimiento_contrato = true
        })
        this.getAllLocal('produccion', () => {
            this.ok_establecimientoProduccion = true
            this.analizarEstablecimientos()
        })
        this.getAllLocal('silos', () => {
            this.ok_silos = true
        })
        this.getAllLocal('lote_a_silo', () => {
            this.ok_loteASilos = true
        })
        this.getAllLocal('lotes', () => {
            this.ok_lotes = true
        })
        this.getAllLocal('produccion', () => {
            this.ok_produccion = true
        })
        this.getAllLocal('contratos', () => {
            this.ok_contratosDB = true
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
    getAllLocal(tabla: any, func: any = false) {
        this.sqlite.getDB(tabla).subscribe(
            (res: any) => {
                if (res) {
                    this.db_locales[tabla] = res
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta (Local)' })
                }
                if (func) {
                    func()
                }
            },
            (err: any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error conectando a BACKEND (Local)' })
            }
        )
    }

    //DATOS GENERALES
    analizarMovimientosTotales() {
        this.movimientosTotales = this.db['movimientos'].length

        this.db['movimientos'].forEach((mov: any) => {
            if (mov.kg_neto_final) {
                this.movimientosKilosBalanza++;
            }
            if (mov.kg_campo) {
                this.movimientosKilosCampo++;
            }
        });
    }
    analizarMovimientosTotalesLocales() {
        this.movimientosTotalesLocales = this.db_locales['movimientos'].length

        this.ok_origen = 0
        this.ok_balanza = 0
        this.ok_acondicionadora = 0
        this.ok_descarga = 0
        this.ok_contratos = 0

        this.db_locales['movimientos'].forEach((mov: any) => {
            if (mov.ok_origen == 1) {
                this.ok_origen++;
            }
            if (mov.ok_balanza == 1) {
                this.ok_balanza++;
            }
            if (mov.ok_acondicionadora == 1) {
                this.ok_acondicionadora++;
            }
            if (mov.ok_descarga == 1) {
                this.ok_descarga++;
            }
            if (mov.ok_contratos == 1) {
                this.ok_contratos++;
            }
        });
    }
    analizarCPE() {
        this.cpeTotales = this.db['carta_porte'].length

        this.cpeConfirmadas = 0
        this.cpeAnuladas = 0
        this.cpeActivas = 0
        this.cpeRechhazadas = 0

        this.db['carta_porte'].forEach((cpe: any) => {
            if (cpe.data) {
                if (JSON.parse(cpe.data)) {
                    if (JSON.parse(cpe.data).estado) {
                        const estado = JSON.parse(cpe.data).estado

                        if (estado == 'CN') {
                            this.cpeConfirmadas++;
                        }
                        if (estado == 'AN') {
                            this.cpeAnuladas++;
                        }
                        if (estado == 'AC') {
                            this.cpeActivas++;
                        }
                        if (estado == 'RE') {
                            this.cpeRechhazadas++;
                        }
                    }
                }
            }
        });

    }
    analizarEstablecimientos() {
        if (this.ok_establecimientoProduccion && this.ok_establecimientos) {
            this.establecimientos = this.db['establecimientos'].length

            this.establecimientosSocio = 0

            this.db['establecimientos'].forEach((est: any) => {
                if (this.db_locales['produccion'].some((e: any) => { return e.id_establecimiento == est.id })) {
                    this.establecimientosSocio++
                }
            });
        }
    }

    //DATOS MOVIMIENTOS
    armarDatosMovimientos() {
        console.log(this.idGranosSeleccionado)

        this.datosProduccion = []

        var totales_kg_trilla = 0
        var totales_kg_silo = 0
        var totales_kg = 0
        var totales_cant_mov = 0
        var totales_cant_trilla = 0
        var totales_cant_silo = 0
        var totales_has = 0

        this.db['establecimientos'].forEach((est: any) => {
            var dataPorEstablecimiento:any = {
                id_establecimiento: est.id,
                establecimiento: est.alias,
                kg_trilla : 0,
                kg_silo : 0,
                kg : 0,
                cantidad_silos: null,
                cantidad_movimientos: 0,
                cantidad_movimientos_con_kg: 0,
                has: 0,
                rinde: 0,
            }

            //SILOS
            const silosDelLote = this.db_locales['silos'].filter((silo:any) => { return (silo.id_establecimiento == est.id) && (silo.id_grano == this.idGranosSeleccionado) })
            if(silosDelLote.length){
                dataPorEstablecimiento.cantidad_silos = silosDelLote.length

                var kgs_entrada = 0
                silosDelLote.forEach((silo:any) => {
                    const kilosASilo = this.db_locales['lote_a_silo'].filter((lote_a_silo:any) => { return lote_a_silo.id_silo == silo.id })

                    kilosASilo.forEach((kgs:any) => {
                        kgs_entrada += parseInt(kgs.kilos)
                    })
                })

                dataPorEstablecimiento.kg_silo = kgs_entrada
            }


            //LOTES
            const movs_origen = this.db_locales['movimiento_origen'].filter((e:any) => { return (e.id_establecimiento == est.id) && (e.tipo_origen == 'lote') })

            var movimientosConOrigen:any = []
            movs_origen.forEach((movOrig:any) => {
                if(!movimientosConOrigen.includes(movOrig.id_movimiento)){
                    movimientosConOrigen.push(movOrig.id_movimiento)
                }
            });

            var cantidad_movimientos: any = 0
            var cantidad_movimientos_con_kg: any = 0
            var kg_trilla: any = 0

            var movimientosFiltradosGranos = this.db['movimientos'].filter((e:any) => { return e.id_grano == this.idGranosSeleccionado })

            movimientosFiltradosGranos.forEach((movimiento:any) => {
                //SI TIENE MOVIMIENTO LOCAL CON ORIGEN
                if(movimientosConOrigen.includes(movimiento.id)){
                    const origenesAfectados = this.db_locales['movimiento_origen'].filter((e:any) => { return e.id_movimiento == movimiento.id })

                    const totalKilosMovimiento = origenesAfectados.reduce((acc:any, curr:any) => {
                        return acc + parseInt(curr.kilos)
                    }, 0)

                    const totalKilosEst = origenesAfectados.reduce((acc:any, curr:any) => {
                        var valor = 0
                        if((curr.id_establecimiento == est.id) && (curr.tipo_origen == 'lote')){
                            valor = parseInt(curr.kilos)
                        }
                        return acc + valor
                    }, 0)


                    const proporcion = totalKilosEst/totalKilosMovimiento

                    if(movimiento.kg_neto){
                        const corresponde = proporcion * movimiento.kg_neto

                        kg_trilla += corresponde
                    }
                    cantidad_movimientos_con_kg ++
                    cantidad_movimientos ++
                } else if(movimiento.id_origen == est.id && movimiento.tipo_origen == 'T') {
                    if(movimiento.kg_neto){
                        //console.log(parseFloat(movimiento.kg_neto))
                        kg_trilla += parseInt(movimiento.kg_neto)
                        cantidad_movimientos ++
                    }
                }
            })


            //HAS / RINDE
            const totalKilos = parseInt(dataPorEstablecimiento.kg_silo) + parseInt(kg_trilla)
            const has = this.db_locales['lotes'].filter((e:any) => { return (e.id_establecimiento == est.id) && (e.id_grano == this.idGranosSeleccionado) }).reduce((acc:any, cur:any) => { return acc + parseInt(cur.has) },0)
            const rinde = totalKilos / has

            dataPorEstablecimiento.kg = totalKilos
            dataPorEstablecimiento.cantidad_movimientos = cantidad_movimientos
            dataPorEstablecimiento.cantidad_movimientos_con_kg = cantidad_movimientos_con_kg
            dataPorEstablecimiento.has = has
            dataPorEstablecimiento.rinde = has ? rinde.toFixed(2) : ''
            dataPorEstablecimiento.kg_trilla = kg_trilla ? this.transformarDatoMostrarTabla(kg_trilla, 'numero') : ''

            totales_kg_trilla += kg_trilla
            totales_kg_silo += dataPorEstablecimiento.kg_silo
            totales_kg += totalKilos
            totales_cant_mov += cantidad_movimientos
            totales_cant_trilla += cantidad_movimientos_con_kg
            totales_cant_silo += dataPorEstablecimiento.cantidad_silos
            totales_has += has

            this.datosProduccion.push(dataPorEstablecimiento)
        })


        const totales_rinde = totales_has ? (totales_kg / totales_has).toFixed(2) : ''

        this.datosTablaProduccionTotales = {
            establecimiento: '',
            kg_trilla: this.transformarDatoMostrarTabla(totales_kg_trilla, 'numero'),
            kg_silo: this.transformarDatoMostrarTabla(totales_kg_silo, 'numero'),
            kg: this.transformarDatoMostrarTabla(totales_kg, 'numero'),
            cant_mov: this.transformarDatoMostrarTabla(totales_cant_mov, 'numero'),
            cant_trilla: this.transformarDatoMostrarTabla(totales_cant_trilla, 'numero'),
            cant_silo: this.transformarDatoMostrarTabla(totales_cant_silo, 'numero'),
            has: this.transformarDatoMostrarTabla(totales_has, 'numero'),
            rinde: this.transformarDatoMostrarTabla(totales_rinde, 'numero'),
        }









        //CORRESPONDE POR SOCIOS
        this.datosCorresponde = []

        var kg_totales:any = {
            kg: 0,
        }
        this.db['socios'].forEach((e:any) => { kg_totales[e.id] = 0 }) 

        this.datosProduccion.forEach((est:any) => {
            if(this.db_locales['produccion'].some((e:any) => { return e.id_establecimiento == est.id_establecimiento })){
                var dato:any = {
                    establecimiento: est.establecimiento,
                    kg: this.transformarDatoMostrarTabla(est.kg, 'numero')
                }

                const producenSocios:any = this.db_locales['produccion'].filter((e:any) => { return e.id_establecimiento == est.id_establecimiento })

                producenSocios.forEach((prodSocio:any) => {

                    const corresponde = est.kg * parseFloat(prodSocio.porcentaje) / 100
                    dato[prodSocio.id_socio] = this.transformarDatoMostrarTabla(corresponde, 'numero')

                    kg_totales[prodSocio.id_socio] += corresponde
                })

                kg_totales.kg += est.kg
                this.datosCorresponde.push(dato)
            }

            this.datosTablaCorrespondeTotales = {
                kg: this.transformarDatoMostrarTabla(kg_totales.kg, 'numero')
            }
            this.db['socios'].forEach((e:any) => { 
                this.datosTablaCorrespondeTotales[e.id] = this.transformarDatoMostrarTabla(kg_totales[e.id], 'numero') 
                this.datosTablaCorrespondeTotales['kilos_' + e.id] = kg_totales[e.id]
            }) 
        })






        //TOTALES KILOS RETIRADOS - (Por SOCIO)
        var totalesRetiros: any = 0
        var totalesSaldos: any = 0
        this.datosRetiros = []

        this.db['socios'].forEach((socio:any) => {

            var movimientosConContrato:any = []
            this.db_locales['movimiento_contrato'].forEach((e:any) => { movimientosConContrato.includes(e.id_movimiento) ? null : movimientosConContrato.push(e.id_movimiento) })

            var kg_retirosSocio: any = 0

            var movimientosFiltradosGranos = this.db['movimientos'].filter((e:any) => { return e.id_grano == this.idGranosSeleccionado })

            movimientosFiltradosGranos.forEach((movimiento:any) => {
                //SI TIENE MOVIMIENTO LOCAL CON ORIGEN
                if(movimientosConContrato.includes(movimiento.id)){

                    const contratosAfectados = this.db_locales['movimiento_contrato'].filter((e:any) => { return e.id_movimiento == movimiento.id })

                    const sumatoriaKilosContratos = contratosAfectados.reduce((acc:any, curr:any) => {
                        return acc + parseInt(curr.kilos)
                    }, 0)

                    const totalKilosSocio = contratosAfectados.reduce((acc:any, curr:any) => {
                        var valor = 0

                        const contratoAfectado = this.db_locales['contratos'].find((e:any) => { return e.id == curr.id_contrato })

                        if(contratoAfectado){
                            if(contratoAfectado.id_socio){
                                if(contratoAfectado.id_socio == socio.id){
                                    valor = parseInt(curr.kilos)
                                }
                            }
                        }
                        
                        return acc + valor

                    }, 0)

                    const proporcion = totalKilosSocio / sumatoriaKilosContratos

                    if(movimiento.kg_neto){
                        const corresponde = proporcion * movimiento.kg_neto
                        kg_retirosSocio += corresponde
                    }

                } else if(movimiento.id_socio == socio.id) {
                    if(movimiento.kg_neto){
                        kg_retirosSocio += parseInt(movimiento.kg_neto)
                    }
                }
            })

            //kg_totales
            var dato:any = {
                socio: socio.razon_social,
                corresponde: this.datosTablaCorrespondeTotales[socio.id],
                retiros: this.transformarDatoMostrarTabla(kg_retirosSocio, 'numero'),
                saldo: this.transformarDatoMostrarTabla(this.datosTablaCorrespondeTotales['kilos_' + socio.id] - kg_retirosSocio, 'numero'),
            }
            totalesRetiros += kg_retirosSocio
            totalesSaldos += (this.datosTablaCorrespondeTotales['kilos_' + socio.id] - kg_retirosSocio)

            this.datosRetiros.push(dato)
        })

        this.datosTablaRetirosTotales = {
            corresponde: this.datosTablaCorrespondeTotales.kg,
            retiros: this.transformarDatoMostrarTabla(totalesRetiros, 'numero'),
            saldo: this.transformarDatoMostrarTabla(totalesSaldos, 'numero'),
        }
        this.armarDatosParaTabla()
        this.armarDatosEspecialesSociedad()

    }

    armarDatosParaTabla() {
        this.datosTablaProduccion = []
        this.datosTablaCorresponde = []
        this.datosTablaRetiros = []

        this.datosProduccion.forEach((mov:any) => {
            this.datosTablaProduccion.push({
                establecimiento : mov.establecimiento,
                kg_trilla : this.transformarDatoMostrarTabla(mov.kg_trilla, 'numero'),
                kg_silo : mov.cantidad_silos ? this.transformarDatoMostrarTabla(mov.kg_silo, 'numero') : '',
                kg : this.transformarDatoMostrarTabla(mov.kg, 'numero'),
                cant_mov: mov.cantidad_movimientos,
                cant_trilla: mov.cantidad_movimientos ? mov.cantidad_movimientos_con_kg : '',
                cant_silo: mov.cantidad_silos ? mov.cantidad_silos : '',

                has: mov.has,
                rinde: mov.rinde,
            })
        })

        this.datosCorresponde.forEach((mov:any) => {
            this.datosTablaCorresponde.push(mov)
        })

        this.datosRetiros.forEach((mov:any) => {
            this.datosTablaRetiros.push(mov)
        })
    }

    armarDatosEspecialesSociedad(){
        this.datosTablaSociedad = []

        var dataNP: any = {
            socio: 'NORTE-PLANJAR (50%)',
            corresponde: 0,
            retiros: 0,
            camara: 0,
            clientes: 0,
            saldo: 0,
            lotes_yc: 0,
            lotes_pl: 0,
            saldo_lotes: 0,
            bolsones: 0,
            retiros_bolsones: 0,
            saldo_final: 0,
        }

        var dataY: any = {
            socio: 'YAGUA (50%)',
            corresponde: 0,
            retiros: 0,
            camara: 0,
            clientes: 0,
            saldo: 0,
            lotes_yc: 0,
            lotes_pl: 0,
            saldo_lotes: 0,
            bolsones: 0,
            retiros_bolsones: 0,
            saldo_final: 0,
        }


        const ID_NORTE = '141ea05753ff'
        const ID_YAGUA = 'bcb3d28daa6b'
        const ID_PLANJAR = '9c89bfa40ad1'
        const ID_TIJUANA = 'afb70d896b9e'
        const ID_TRAVIESAS = '3461420d81eb'

        const ID_CONTRATO_CAMARA = ['982f36b64653', 'fca0ef6ebd87']
        const ID_CONTRATO_CLIENTES = ['021b3c0a8357', '8502307611bb', 'e626f63756d1', 'a43add8a956d', 'f6d0b22e90b5', '863162fd7629', '59a44d418ed9', 'da0f0840146a']
        const ID_CONTRATO_CLIENTES_MEDIAS = ['021b3c0a8357', '8502307611bb', 'e626f63756d1', 'a43add8a956d', 'f6d0b22e90b5', '863162fd7629', '59a44d418ed9', 'da0f0840146a']

        //Armamos establecimientos que estan en sociedad / Lotes PL / Lotes YC
        var establecimientosSociedad: any = []
        var establecimientosSociedadTijuana: any = []
        var establecimientosSociedadTraviesas: any = []

        var establecimientosPL: any = []
        var establecimientosYC: any = []

        this.datosProduccion.forEach((est:any) => {
            if(this.db_locales['produccion'].some((e:any) => { return e.id_establecimiento == est.id_establecimiento })){
                const producenSocios:any = this.db_locales['produccion'].filter((e:any) => { return e.id_establecimiento == est.id_establecimiento })

                //SOCIEDAD NORTE-YAGUA
                if(producenSocios.some((e:any) => { return (e.id_socio == ID_NORTE) && (e.porcentaje == 50) }) && producenSocios.some((e:any) => { return (e.id_socio == ID_YAGUA) && ( e.porcentaje == 50) })){
                    establecimientosSociedad.includes(est.id_establecimiento) ? null : establecimientosSociedad.push(est.id_establecimiento)
                }
                //SOCIEDAD CON TIJUANA
                if(producenSocios.some((e:any) => { return (e.id_socio == ID_NORTE) && (e.porcentaje == 25) }) && producenSocios.some((e:any) => { return (e.id_socio == ID_YAGUA) && ( e.porcentaje == 25) }) && producenSocios.some((e:any) => { return (e.id_socio == ID_TIJUANA) && ( e.porcentaje == 50) })){
                    establecimientosSociedadTijuana.includes(est.id_establecimiento) ? null : establecimientosSociedadTijuana.push(est.id_establecimiento)
                }
                //SOCIEDAD CON TRAVIESAS
                if(producenSocios.some((e:any) => { return (e.id_socio == ID_NORTE) && (e.porcentaje == 25) }) && producenSocios.some((e:any) => { return (e.id_socio == ID_YAGUA) && ( e.porcentaje == 25) }) && producenSocios.some((e:any) => { return (e.id_socio == ID_TRAVIESAS) && ( e.porcentaje == 50) })){
                    establecimientosSociedadTraviesas.includes(est.id_establecimiento) ? null : establecimientosSociedadTraviesas.push(est.id_establecimiento)
                }

                if(producenSocios.length == 1){
                    if(producenSocios[0]['id_socio'] == ID_PLANJAR){
                        establecimientosPL.includes(est.id_establecimiento) ? null : establecimientosPL.push(est.id_establecimiento)
                    }
                    if(producenSocios[0]['id_socio'] == ID_YAGUA){
                        establecimientosYC.includes(est.id_establecimiento) ? null : establecimientosYC.push(est.id_establecimiento)
                    }
                }
            }
        })



        //MOVIMIENTOS POR DIVISIONES:
        var paqueteMovimientos:any = []

        this.db['movimientos'].forEach((movimiento:any) => {
            //si existe movimiento local
            if(this.db_locales['movimientos'].some((e:any) => { return e.id_movimiento == movimiento.id })){

                //si existe origen local:
                if(this.db_locales['movimiento_origen'].some((e:any) => { return e.id_movimiento == movimiento.id })){

                    const movimientos_origenes = this.db_locales['movimiento_origen'].filter((e:any) => { return e.id_movimiento == movimiento.id })

                    const kilosTotOrig = movimientos_origenes.reduce((acc:any, curr:any) => { return acc + parseInt(curr.kilos) }, 0)

                    movimientos_origenes.forEach((movOrig:any) => {

                        const proporcionOrig = (movOrig.kilos / kilosTotOrig)

                        //si existe destino local (contrato):
                        if(this.db_locales['movimiento_contrato'].some((e:any) => { return e.id_movimiento == movimiento.id })){

                            const movimientos_contratos = this.db_locales['movimiento_contrato'].filter((e:any) => { return e.id_movimiento == movimiento.id })
                            const kilosTotCtos = movimientos_contratos.reduce((acc:any, curr:any) => { return acc + parseInt(curr.kilos) }, 0)

                            movimientos_contratos.forEach((movCto:any) => {
                                const contrato = this.db_locales['contratos'].find((e:any) => { return e.id == movCto.id_contrato })

                                const proporcionCtos = (movCto.kilos / kilosTotCtos)

                                var kilos = 35000

                                if(movimiento.kg_campo){
                                    if(parseInt(movimiento.kg_campo)){
                                        kilos = parseInt(movimiento.kg_campo)
                                    }
                                }
                                
                                if(movimiento.kg_neto){
                                    if(parseInt(movimiento.kg_neto)){
                                        kilos = parseInt(movimiento.kg_neto)
                                    }
                                }

                                const kilosComputar = proporcionOrig * proporcionCtos * kilos

                                paqueteMovimientos.push({
                                    kilos: kilosComputar,
                                    id_grano: movimiento.id_grano,
                                    id_establecimiento: movOrig.id_establecimiento,
                                    id_socio: movimiento.id_socio,
                                    tipo_origen: movOrig.tipo_origen,
                                    id_destino: movimiento.id_destino,
                                    contrato: contrato.id,
                                })
                            })

                        } else {
                            var kilos = 35000

                            if(movimiento.kg_campo){
                                if(parseInt(movimiento.kg_campo)){
                                    kilos = parseInt(movimiento.kg_campo)
                                }
                            }
                            
                            if(movimiento.kg_neto){
                                if(parseInt(movimiento.kg_neto)){
                                    kilos = parseInt(movimiento.kg_neto)
                                }
                            }

                            const kilosComputar = proporcionOrig * kilos
                            paqueteMovimientos.push({
                                kilos: kilosComputar,
                                id_grano: movimiento.id_grano,
                                id_establecimiento: movOrig.id_establecimiento,
                                id_socio: movimiento.id_socio,
                                tipo_origen: movOrig.tipo_origen,
                                id_destino: movimiento.id_destino,
                                contrato: 0
                            })
                        }
                    })
                } else {

                    //si existe destino local (contrato):
                    if(this.db_locales['movimiento_contrato'].some((e:any) => { return e.id_movimiento == movimiento.id })){

                        const movimientos_contratos = this.db_locales['movimiento_contrato'].filter((e:any) => { return e.id_movimiento == movimiento.id })
                        const kilosTotCtos = movimientos_contratos.reduce((acc:any, curr:any) => { return acc + parseInt(curr.kilos) }, 0)

                        movimientos_contratos.forEach((movCto:any) => {
                            const contrato = this.db_locales['contratos'].find((e:any) => { return e.id == movCto.id_contrato })

                            var kilos = 35000

                            if(movimiento.kg_campo){
                                if(parseInt(movimiento.kg_campo)){
                                    kilos = parseInt(movimiento.kg_campo)
                                }
                            }
                            
                            if(movimiento.kg_neto){
                                if(parseInt(movimiento.kg_neto)){
                                    kilos = parseInt(movimiento.kg_neto)
                                }
                            }

                            const kilosComputar = movCto.kilos/kilosTotCtos * kilos

                            paqueteMovimientos.push({
                                kilos: kilosComputar,
                                id_grano: movimiento.id_grano,
                                id_establecimiento: movimiento.id_origen,
                                id_socio: contrato.id_socio,
                                tipo_origen: movimiento.tipo_origen == 'T' ? 'lote' : 'silo',
                                id_destino: movimiento.id_destino,
                                contrato: contrato.id,
                            })
                        })

                    } else {
                        var kilos = 35000

                        if(movimiento.kg_campo){
                            if(parseInt(movimiento.kg_campo)){
                                kilos = parseInt(movimiento.kg_campo)
                            }
                        }
                        
                        if(movimiento.kg_neto){
                            if(parseInt(movimiento.kg_neto)){
                                kilos = parseInt(movimiento.kg_neto)
                            }
                        }

                        paqueteMovimientos.push({
                            kilos: kilos,
                            id_grano: movimiento.id_grano,
                            id_establecimiento: movimiento.id_origen,
                            id_socio: movimiento.id_socio,
                            tipo_origen: movimiento.tipo_origen == 'T' ? 'lote' : 'silo',
                            id_destino: movimiento.id_destino,
                            contrato: 0
                        })
                    }
                }

            } else {
                //SI NO EXISTIERA MOVIMIENTO LOCAL:
                var kilos = 35000

                if(movimiento.kg_campo){
                    if(parseInt(movimiento.kg_campo)){
                        kilos = parseInt(movimiento.kg_campo)
                    }
                }
                
                if(movimiento.kg_neto){
                    if(parseInt(movimiento.kg_neto)){
                        kilos = parseInt(movimiento.kg_neto)
                    }
                }

                paqueteMovimientos.push({
                    kilos: kilos,
                    id_grano: movimiento.id_grano,
                    id_establecimiento: movimiento.id_origen,
                    id_socio: movimiento.id_socio,
                    tipo_origen: movimiento.tipo_origen == 'T' ? 'lote' : 'silo',
                    id_destino: movimiento.id_destino,
                    contrato: 0,
                })
            }
        })



        //CORRESPONDE
        var produccionSociedad = 0
        
        paqueteMovimientos.forEach((paq:any) => { 
            if(paq.id_grano == this.idGranosSeleccionado && paq.tipo_origen=='lote'){
                if(establecimientosSociedad.includes(paq.id_establecimiento)){
                    produccionSociedad += paq.kilos 
                }
            }
        })

        //console.group("Prod sociedades")
        //console.log('soc. ', produccionSociedad)
        //console.log('tij. ', produccionSociedadTijuana)
        //console.log('tra. ', produccionSociedadTraviesas)
        //console.groupEnd()

        const correspondeNorte = produccionSociedad/2
        const correspondeYagua = produccionSociedad/2

        var norteRetiros = 0
        var yaguaRetiros = 0

        var norteCamara = 0
        var yaguaCamara = 0

        var norteClientes = 0
        var yaguaClientes = 0

        //SALIDAS A CAMARA - CLIENTES - RETIROS DESDE TRILLA
        paqueteMovimientos.filter((e:any) => { return establecimientosSociedad.includes(e.id_establecimiento) && (e.id_grano == this.idGranosSeleccionado) && (e.tipo_origen=='lote') }).forEach((mov:any) => {
            if(ID_CONTRATO_CAMARA.includes(mov.contrato)){
                norteCamara += mov.kilos/2
                yaguaCamara += mov.kilos/2

            }
            if(ID_CONTRATO_CLIENTES.includes(mov.contrato)){
                if(ID_CONTRATO_CLIENTES_MEDIAS.includes(mov.contrato)){
                    norteClientes += mov.kilos/2
                    yaguaClientes += mov.kilos/2
                } else if(mov.id_socio == ID_NORTE || mov.id_socio == ID_PLANJAR){
                    norteClientes += mov.kilos
                } else if(mov.id_socio == ID_YAGUA){
                    yaguaClientes += mov.kilos
                } else {
                    norteClientes += mov.kilos/2
                    yaguaClientes += mov.kilos/2
                }
            }
            if(!ID_CONTRATO_CAMARA.includes(mov.contrato) && !ID_CONTRATO_CLIENTES.includes(mov.contrato)){
                if(mov.id_socio == ID_NORTE || mov.id_socio == ID_PLANJAR){
                    norteRetiros += mov.kilos
                }
                if(mov.id_socio == ID_YAGUA){
                    yaguaRetiros += mov.kilos
                }
            }
        })

        var nortelotes_yc = 0
        var yagualotes_yc = 0
        
        var nortelotes_pl = 0
        var yagualotes_pl = 0

        //LOTES DE YAGUA Y PLANJAR
        paqueteMovimientos.filter((e:any) => { return (e.id_grano == this.idGranosSeleccionado) && (e.tipo_origen=='lote') }).forEach((mov:any) => {
            if(establecimientosPL.includes(mov.id_establecimiento)){
                if(mov.id_socio == ID_YAGUA){
                    yagualotes_pl -= mov.kilos
                    nortelotes_pl += mov.kilos
                }
            }
            if(establecimientosYC.includes(mov.id_establecimiento)){
                if(mov.id_socio == ID_NORTE || mov.id_socio == ID_PLANJAR){
                    nortelotes_yc -= mov.kilos
                    yagualotes_yc += mov.kilos
                }
            }
        })

        var nortebolson_yc = 0
        var yaguabolson_yc = 0
        
        var nortebolson_pl = 0
        var yaguabolson_pl = 0
        
        //BOLSONES DE YAGUA Y PLANJAR
        paqueteMovimientos.filter((e:any) => { return (e.id_grano == this.idGranosSeleccionado) && (e.tipo_origen=='silo') }).forEach((mov:any) => {
            if(establecimientosPL.includes(mov.id_establecimiento)){
                if(mov.id_socio == ID_YAGUA){
                    yaguabolson_pl -= mov.kilos
                    nortebolson_pl += mov.kilos
                }
            }
            if(establecimientosYC.includes(mov.id_establecimiento)){
                if(mov.id_socio == ID_NORTE || mov.id_socio == ID_PLANJAR){
                    nortebolson_yc -= mov.kilos
                    yaguabolson_yc += mov.kilos
                }
            }
        })

        //SILOS
        var kilosTotalesSilosSociedad:any = 0
        establecimientosSociedad.forEach((est:any) => {
            const silosDelLote = this.db_locales['silos'].filter((silo:any) => { return (silo.id_establecimiento == est) && (silo.id_grano == this.idGranosSeleccionado) })
            if(silosDelLote.length){
                var kgs_entrada = 0
                silosDelLote.forEach((silo:any) => {
                    const kilosASilo = this.db_locales['lote_a_silo'].filter((lote_a_silo:any) => { return lote_a_silo.id_silo == silo.id })
                    kilosASilo.forEach((kgs:any) => {
                        kgs_entrada += parseInt(kgs.kilos)
                    })
                })
                kilosTotalesSilosSociedad += kgs_entrada
            }
        })

        var norteRetiroBolsones = 0
        var yaguaRetiroBolsones = 0

        var norteRetiroBolsonesClientes = 0
        var yaguaRetiroBolsonesClientes = 0
        
        var norteRetiroBolsonesCamara = 0
        var yaguaRetiroBolsonesCamara = 0

        //SILOS RETIROS
        paqueteMovimientos.filter((e:any) => { return establecimientosSociedad.includes(e.id_establecimiento) && (e.id_grano == this.idGranosSeleccionado) && (e.tipo_origen=='silo') }).forEach((mov:any) => {
            if(ID_CONTRATO_CAMARA.includes(mov.contrato)){
                norteRetiroBolsonesCamara += mov.kilos/2
                yaguaRetiroBolsonesCamara += mov.kilos/2
            }

            if(ID_CONTRATO_CLIENTES.includes(mov.contrato)){
                if(ID_CONTRATO_CLIENTES_MEDIAS.includes(mov.contrato)){
                    norteRetiroBolsonesClientes += mov.kilos/2
                    yaguaRetiroBolsonesClientes += mov.kilos/2
                } else if(mov.id_socio == ID_NORTE || mov.id_socio == ID_PLANJAR){
                    norteRetiroBolsonesClientes += mov.kilos
                } else if(mov.id_socio == ID_YAGUA){
                    yaguaRetiroBolsonesClientes += mov.kilos
                } else {
                    norteRetiroBolsonesClientes += mov.kilos/2
                    yaguaRetiroBolsonesClientes += mov.kilos/2
                }
            }

            if(!ID_CONTRATO_CAMARA.includes(mov.contrato) && !ID_CONTRATO_CLIENTES.includes(mov.contrato)){
                if(mov.id_socio == ID_NORTE || mov.id_socio == ID_PLANJAR){
                    norteRetiroBolsones += mov.kilos
                }
                if(mov.id_socio == ID_YAGUA){
                    yaguaRetiroBolsones += mov.kilos
                }
            }
        })


        var norteSaldo = correspondeNorte - norteRetiros - norteCamara - norteClientes
        var yaguaSaldo = correspondeYagua - yaguaRetiros - yaguaCamara - yaguaClientes

        var norteSaldoLotes = norteSaldo + nortelotes_pl + nortelotes_yc
        var yaguaSaldoLotes = yaguaSaldo + yagualotes_pl + yagualotes_yc

        var norteSaldoFinal = norteSaldoLotes + (kilosTotalesSilosSociedad/2) - norteRetiroBolsones - norteRetiroBolsonesClientes - norteRetiroBolsonesCamara + nortebolson_pl + nortebolson_yc
        var yaguaSaldoFinal = yaguaSaldoLotes + (kilosTotalesSilosSociedad/2) - yaguaRetiroBolsones - yaguaRetiroBolsonesClientes - yaguaRetiroBolsonesCamara + yaguabolson_pl + yaguabolson_yc


        dataNP.corresponde = this.transformarDatoMostrarTabla(correspondeNorte.toFixed(), "numeroEntero")
        dataNP.retiros = this.transformarDatoMostrarTabla(norteRetiros.toFixed(), "numeroEntero")
        dataNP.camara = this.transformarDatoMostrarTabla(norteCamara.toFixed(), "numeroEntero")
        dataNP.clientes = this.transformarDatoMostrarTabla(norteClientes.toFixed(), "numeroEntero")
        dataNP.saldo = this.transformarDatoMostrarTabla(norteSaldo.toFixed(), "numeroEntero")
        dataNP.lotes_yc = this.transformarDatoMostrarTabla(nortelotes_yc.toFixed(), "numeroEntero")
        dataNP.lotes_pl = this.transformarDatoMostrarTabla(nortelotes_pl.toFixed(), "numeroEntero")
        dataNP.saldo_lotes = this.transformarDatoMostrarTabla(norteSaldoLotes.toFixed(), "numeroEntero")
        dataNP.bolsones = this.transformarDatoMostrarTabla((kilosTotalesSilosSociedad/2).toFixed(), "numeroEntero")
        dataNP.retiros_bolsones = this.transformarDatoMostrarTabla(norteRetiroBolsones.toFixed(), "numeroEntero")
        dataNP.retiros_bolsones_camara = this.transformarDatoMostrarTabla(norteRetiroBolsonesCamara.toFixed(), "numeroEntero")
        dataNP.retiros_bolsones_clientes = this.transformarDatoMostrarTabla(norteRetiroBolsonesClientes.toFixed(), "numeroEntero")
        dataNP.retiros_bolsones_lotes_yc = this.transformarDatoMostrarTabla(nortebolson_yc.toFixed(), "numeroEntero")
        dataNP.retiros_bolsones_lotes_pl = this.transformarDatoMostrarTabla(nortebolson_pl.toFixed(), "numeroEntero")
        dataNP.saldo_final = this.transformarDatoMostrarTabla(norteSaldoFinal.toFixed(), "numeroEntero")

        dataY.corresponde = this.transformarDatoMostrarTabla(correspondeYagua.toFixed(), "numeroEntero")
        dataY.retiros = this.transformarDatoMostrarTabla(yaguaRetiros.toFixed(), "numeroEntero")
        dataY.camara = this.transformarDatoMostrarTabla(yaguaCamara.toFixed(), "numeroEntero")
        dataY.clientes = this.transformarDatoMostrarTabla(yaguaClientes.toFixed(), "numeroEntero")
        dataY.saldo = this.transformarDatoMostrarTabla(yaguaSaldo.toFixed(), "numeroEntero")
        dataY.lotes_yc = this.transformarDatoMostrarTabla(yagualotes_yc.toFixed(), "numeroEntero")
        dataY.lotes_pl = this.transformarDatoMostrarTabla(yagualotes_pl.toFixed(), "numeroEntero")
        dataY.saldo_lotes = this.transformarDatoMostrarTabla(yaguaSaldoLotes.toFixed(), "numeroEntero")
        dataY.bolsones = this.transformarDatoMostrarTabla((kilosTotalesSilosSociedad/2).toFixed(), "numeroEntero")
        dataY.retiros_bolsones = this.transformarDatoMostrarTabla(yaguaRetiroBolsones.toFixed(), "numeroEntero")
        dataY.retiros_bolsones_camara = this.transformarDatoMostrarTabla(yaguaRetiroBolsonesCamara.toFixed(), "numeroEntero")
        dataY.retiros_bolsones_clientes = this.transformarDatoMostrarTabla(yaguaRetiroBolsonesClientes.toFixed(), "numeroEntero")
        dataY.retiros_bolsones_lotes_yc = this.transformarDatoMostrarTabla(yaguabolson_yc.toFixed(), "numeroEntero")
        dataY.retiros_bolsones_lotes_pl = this.transformarDatoMostrarTabla(yaguabolson_pl.toFixed(), "numeroEntero")
        dataY.saldo_final = this.transformarDatoMostrarTabla(yaguaSaldoFinal.toFixed(), "numeroEntero")


        this.datosTablaSociedad.push(dataNP)
        this.datosTablaSociedad.push(dataY)

        this.datosTablaSociedadTotales = {
            socio: 'TOTAL',
            corresponde: this.transformarDatoMostrarTabla(produccionSociedad.toFixed(), "numeroEntero"),
            retiros: this.transformarDatoMostrarTabla((norteRetiros+yaguaRetiros).toFixed(), "numeroEntero"),
            camara: this.transformarDatoMostrarTabla((norteCamara+yaguaCamara).toFixed(), "numeroEntero"),
            clientes: this.transformarDatoMostrarTabla((norteClientes+yaguaClientes).toFixed(), "numeroEntero"),
            saldo: this.transformarDatoMostrarTabla((norteSaldo+yaguaSaldo).toFixed(), "numeroEntero"),
            lotes_yc: this.transformarDatoMostrarTabla((nortelotes_yc+yagualotes_yc).toFixed(), "numeroEntero"),
            lotes_pl: this.transformarDatoMostrarTabla((nortelotes_pl+yagualotes_pl).toFixed(), "numeroEntero"),
            saldo_lotes: this.transformarDatoMostrarTabla((norteSaldoLotes+yaguaSaldoLotes).toFixed(), "numeroEntero"),
            bolsones: this.transformarDatoMostrarTabla(kilosTotalesSilosSociedad.toFixed(), "numeroEntero"),
            retiros_bolsones: this.transformarDatoMostrarTabla((norteRetiroBolsones+yaguaRetiroBolsones).toFixed(), "numeroEntero"),
            retiros_bolsones_camara: this.transformarDatoMostrarTabla((norteRetiroBolsonesCamara+yaguaRetiroBolsonesCamara).toFixed(), "numeroEntero"),
            retiros_bolsones_clientes: this.transformarDatoMostrarTabla((norteRetiroBolsonesClientes+yaguaRetiroBolsonesClientes).toFixed(), "numeroEntero"),
            retiros_bolsones_lotes_yc: this.transformarDatoMostrarTabla((nortebolson_yc+yaguabolson_yc).toFixed(), "numeroEntero"),
            retiros_bolsones_lotes_pl: this.transformarDatoMostrarTabla((nortebolson_pl+yaguabolson_pl).toFixed(), "numeroEntero"),
            saldo_final: this.transformarDatoMostrarTabla((norteSaldoFinal+yaguaSaldoFinal).toFixed(), "numeroEntero"), 
        }


        //SOCIEDADES CON TIJUANA
        this.datosTablaSociedadTijuana = []
        
        var dataT: any = {
            socio: "TIJUANA (50%)",
            corresponde: 0,
            retiros: 0,
            saldo: 0,
            lotes_yc: 0,
            lotes_pl: 0,
            lotes_ny: 0,
            saldo_lotes: 0,
            bolsones: 0,
            retiros_bolsones: 0,
            retiros_bolsones_lotes_yc: 0,
            retiros_bolsones_lotes_pl: 0,
            retiros_bolsones_lotes_ny: 0,
            saldo_final: 0,
        }
        var dataNP: any = {
            socio: "NORTE-PLANJAR (25%)",
            corresponde: 0,
            retiros: 0,
            saldo: 0,
            lotes_yc: 0,
            lotes_pl: 0,
            lotes_ny: 0,
            saldo_lotes: 0,
            bolsones: 0,
            retiros_bolsones: 0,
            retiros_bolsones_lotes_yc: 0,
            retiros_bolsones_lotes_pl: 0,
            retiros_bolsones_lotes_ny: 0,
            saldo_final: 0,
        }
        var dataY: any = {
            socio: "YAGUA (25%)",
            corresponde: 0,
            retiros: 0,
            saldo: 0,
            lotes_yc: 0,
            lotes_pl: 0,
            lotes_ny: 0,
            saldo_lotes: 0,
            bolsones: 0,
            retiros_bolsones: 0,
            retiros_bolsones_lotes_yc: 0,
            retiros_bolsones_lotes_pl: 0,
            retiros_bolsones_lotes_ny: 0,
            saldo_final: 0,
        }

        //CORRESPONDE
        var produccionSociedadTijuana = 0
        paqueteMovimientos.forEach((paq:any) => { 
            if(paq.id_grano == this.idGranosSeleccionado && paq.tipo_origen=='lote'){
                if(establecimientosSociedadTijuana.includes(paq.id_establecimiento)){
                    produccionSociedadTijuana += paq.kilos 
                }
            }
        })

        const correspondeTijuana_socTij = produccionSociedadTijuana*0.5
        const correspondeNorte_socTij = produccionSociedadTijuana*0.25
        const correspondeYagua_socTij = produccionSociedadTijuana*0.25


        //RETIROS - SALIDAS DE SOCIEDAD TIJUANA
        var tijuanaRetiros = 0
        var norteRetiros = 0
        var yaguaRetiros = 0

        paqueteMovimientos.filter((e:any) => { return establecimientosSociedadTijuana.includes(e.id_establecimiento) && (e.id_grano == this.idGranosSeleccionado) && (e.tipo_origen=='lote') }).forEach((mov:any) => {
            if(mov.id_socio == ID_NORTE || mov.id_socio == ID_PLANJAR){
                norteRetiros += mov.kilos
            }
            if(mov.id_socio == ID_YAGUA){
                yaguaRetiros += mov.kilos
            }
            if(mov.id_socio == ID_TIJUANA){
                tijuanaRetiros += mov.kilos
            }
        })

        //SALDOS
        var tijuanaSaldo = correspondeTijuana_socTij - tijuanaRetiros
        var norteSaldo = correspondeNorte_socTij - norteRetiros
        var yaguaSaldo = correspondeYagua_socTij - yaguaRetiros


        //LOTES DE YAGUA Y PLANJAR Y SOC NY
        var tijuanalotes_yc = 0
        var tijuanalotes_pl = 0
        var tijuanalotes_ny = 0

        var nortelotes_pl = 0
        var nortelotes_ny = 0
        
        var yagualotes_yc = 0
        var yagualotes_ny = 0

        paqueteMovimientos.filter((e:any) => { return (e.id_grano == this.idGranosSeleccionado) && (e.tipo_origen=='lote') }).forEach((mov:any) => {
            if(establecimientosPL.includes(mov.id_establecimiento)){
                if(mov.id_socio == ID_TIJUANA){
                    tijuanalotes_pl -= mov.kilos
                    nortelotes_pl += mov.kilos
                }
            }
            if(establecimientosYC.includes(mov.id_establecimiento)){
                if(mov.id_socio == ID_TIJUANA){
                    tijuanalotes_yc -= mov.kilos
                    yagualotes_yc += mov.kilos
                }
            }
            if(establecimientosSociedad.includes(mov.id_establecimiento)){
                if(mov.id_socio == ID_TIJUANA){
                    tijuanalotes_ny -= mov.kilos
                    nortelotes_ny += mov.kilos/2
                    yagualotes_ny += mov.kilos/2
                }
            }
        })

        //SALDO LOTES
        var tijuanaSaldo_lotes = tijuanaSaldo + tijuanalotes_yc + tijuanalotes_pl + tijuanalotes_ny
        var norteSaldo_lotes = norteSaldo + nortelotes_pl + nortelotes_ny
        var yaguaSaldo_lotes = yaguaSaldo + yagualotes_yc + yagualotes_ny


        //BOLSONES - CORRESPONDE
        var kilosTotalesSilosSociedad:any = 0
        establecimientosSociedadTijuana.forEach((est:any) => {
            const silosDelLote = this.db_locales['silos'].filter((silo:any) => { return (silo.id_establecimiento == est) && (silo.id_grano == this.idGranosSeleccionado) })
            if(silosDelLote.length){
                var kgs_entrada = 0
                silosDelLote.forEach((silo:any) => {
                    const kilosASilo = this.db_locales['lote_a_silo'].filter((lote_a_silo:any) => { return lote_a_silo.id_silo == silo.id })
                    kilosASilo.forEach((kgs:any) => {
                        kgs_entrada += parseInt(kgs.kilos)
                    })
                })
                kilosTotalesSilosSociedad += kgs_entrada
            }
        })

        var tijuana_bolsones = kilosTotalesSilosSociedad*0.5
        var norte_bolsones = kilosTotalesSilosSociedad*0.25
        var yagua_bolsones = kilosTotalesSilosSociedad*0.25

        //RETIRO BOLSONES
        var tijuana_retiro_bolsones = 0
        var norte_retiro_bolsones = 0
        var yagua_retiro_bolsones = 0

        paqueteMovimientos.filter((e:any) => { return establecimientosSociedadTijuana.includes(e.id_establecimiento) && (e.id_grano == this.idGranosSeleccionado) && (e.tipo_origen=='silo') }).forEach((mov:any) => {
            if(ID_CONTRATO_CAMARA.includes(mov.contrato)){
                norte_retiro_bolsones += mov.kilos/2
                yagua_retiro_bolsones += mov.kilos/2
            }

            if(ID_CONTRATO_CLIENTES.includes(mov.contrato)){
                if(ID_CONTRATO_CLIENTES_MEDIAS.includes(mov.contrato)){
                    norte_retiro_bolsones += mov.kilos/2
                    yagua_retiro_bolsones += mov.kilos/2
                } else if(mov.id_socio == ID_NORTE || mov.id_socio == ID_PLANJAR){
                    norte_retiro_bolsones += mov.kilos
                } else if(mov.id_socio == ID_YAGUA){
                    yagua_retiro_bolsones += mov.kilos
                } else {
                    norte_retiro_bolsones += mov.kilos/2
                    yagua_retiro_bolsones += mov.kilos/2
                }
            }

            if(!ID_CONTRATO_CAMARA.includes(mov.contrato) && !ID_CONTRATO_CLIENTES.includes(mov.contrato)){
                if(mov.id_socio == ID_NORTE || mov.id_socio == ID_PLANJAR){
                    norte_retiro_bolsones += mov.kilos
                }
                if(mov.id_socio == ID_YAGUA){
                    yagua_retiro_bolsones += mov.kilos
                }
                if(mov.id_socio == ID_TIJUANA){
                    tijuana_retiro_bolsones += mov.kilos
                }
            }
        })


        //RETIRO BOLSONES DE YAGUA - NORTE - SOCIEDAD NY
        var tijuanaBolsones_yc = 0
        var tijuanaBolsones_pl = 0
        var tijuanaBolsones_ny = 0

        var norteBolsones_pl = 0
        var norteBolsones_ny = 0
        
        var yaguaBolsones_yc = 0
        var yaguaBolsones_ny = 0

        paqueteMovimientos.filter((e:any) => { return (e.id_grano == this.idGranosSeleccionado) && (e.tipo_origen=='silo') }).forEach((mov:any) => {
            if(establecimientosPL.includes(mov.id_establecimiento)){
                if(mov.id_socio == ID_TIJUANA){
                    tijuanaBolsones_pl -= mov.kilos
                    norteBolsones_pl += mov.kilos
                }
            }
            if(establecimientosYC.includes(mov.id_establecimiento)){
                if(mov.id_socio == ID_TIJUANA){
                    tijuanaBolsones_yc -= mov.kilos
                    yaguaBolsones_yc += mov.kilos
                }
            }
            if(establecimientosSociedad.includes(mov.id_establecimiento)){
                if(mov.id_socio == ID_TIJUANA){
                    tijuanaBolsones_ny -= mov.kilos
                    norteBolsones_ny += mov.kilos/2
                    yaguaBolsones_ny += mov.kilos/2
                }
            }
        })


        //SALDOS TOTALES
        var tijuana_saldo_final = tijuanaSaldo_lotes + tijuana_bolsones - tijuana_retiro_bolsones + tijuanaBolsones_yc + tijuanaBolsones_pl + tijuanaBolsones_ny
        var norte_saldo_final = norteSaldo_lotes + norte_bolsones - norte_retiro_bolsones + norteBolsones_pl + norteBolsones_ny
        var yagua_saldo_final = yaguaSaldo_lotes + yagua_bolsones - yagua_retiro_bolsones + yaguaBolsones_yc + yaguaBolsones_ny



        dataT.corresponde = this.transformarDatoMostrarTabla(correspondeTijuana_socTij.toFixed(), "numeroEntero")
        dataNP.corresponde = this.transformarDatoMostrarTabla(correspondeNorte_socTij.toFixed(), "numeroEntero")
        dataY.corresponde = this.transformarDatoMostrarTabla(correspondeYagua_socTij.toFixed(), "numeroEntero")

        dataT.retiros = this.transformarDatoMostrarTabla(tijuanaRetiros.toFixed(), "numeroEntero")
        dataNP.retiros = this.transformarDatoMostrarTabla(norteRetiros.toFixed(), "numeroEntero")
        dataY.retiros = this.transformarDatoMostrarTabla(yaguaRetiros.toFixed(), "numeroEntero")

        dataT.saldo = this.transformarDatoMostrarTabla(tijuanaSaldo.toFixed(), "numeroEntero")
        dataNP.saldo = this.transformarDatoMostrarTabla(norteSaldo.toFixed(), "numeroEntero")
        dataY.saldo = this.transformarDatoMostrarTabla(yaguaSaldo.toFixed(), "numeroEntero")

        dataT.lotes_yc = this.transformarDatoMostrarTabla(tijuanalotes_yc.toFixed(), "numeroEntero")
        dataNP.lotes_yc = 0
        dataY.lotes_yc = this.transformarDatoMostrarTabla(yagualotes_yc.toFixed(), "numeroEntero")

        dataT.lotes_pl = this.transformarDatoMostrarTabla(tijuanalotes_pl.toFixed(), "numeroEntero")
        dataNP.lotes_pl = this.transformarDatoMostrarTabla(nortelotes_pl.toFixed(), "numeroEntero")
        dataY.lotes_pl = 0

        dataT.lotes_ny = this.transformarDatoMostrarTabla(tijuanalotes_ny.toFixed(), "numeroEntero")
        dataNP.lotes_ny = this.transformarDatoMostrarTabla(nortelotes_ny.toFixed(), "numeroEntero")
        dataY.lotes_ny = this.transformarDatoMostrarTabla(yagualotes_ny.toFixed(), "numeroEntero")

        dataT.saldo_lotes = this.transformarDatoMostrarTabla(tijuanaSaldo_lotes.toFixed(), "numeroEntero")
        dataNP.saldo_lotes = this.transformarDatoMostrarTabla(norteSaldo_lotes.toFixed(), "numeroEntero")
        dataY.saldo_lotes = this.transformarDatoMostrarTabla(yaguaSaldo_lotes.toFixed(), "numeroEntero")

        dataT.bolsones = this.transformarDatoMostrarTabla(tijuana_bolsones.toFixed(), "numeroEntero")
        dataNP.bolsones = this.transformarDatoMostrarTabla(norte_bolsones.toFixed(), "numeroEntero")
        dataY.bolsones = this.transformarDatoMostrarTabla(yagua_bolsones.toFixed(), "numeroEntero")

        dataT.retiros_bolsones = this.transformarDatoMostrarTabla(tijuana_retiro_bolsones.toFixed(), "numeroEntero")
        dataNP.retiros_bolsones = this.transformarDatoMostrarTabla(norte_retiro_bolsones.toFixed(), "numeroEntero")
        dataY.retiros_bolsones = this.transformarDatoMostrarTabla(yagua_retiro_bolsones.toFixed(), "numeroEntero")

        dataT.retiros_bolsones_lotes_yc = this.transformarDatoMostrarTabla(tijuanaBolsones_yc.toFixed(), "numeroEntero")
        dataNP.retiros_bolsones_lotes_yc = 0
        dataY.retiros_bolsones_lotes_yc = this.transformarDatoMostrarTabla(yaguaBolsones_yc.toFixed(), "numeroEntero")

        dataT.retiros_bolsones_lotes_pl = this.transformarDatoMostrarTabla(tijuanaBolsones_pl.toFixed(), "numeroEntero")
        dataNP.retiros_bolsones_lotes_pl = this.transformarDatoMostrarTabla(norteBolsones_pl.toFixed(), "numeroEntero")
        dataY.retiros_bolsones_lotes_pl = 0

        dataT.retiros_bolsones_lotes_ny = this.transformarDatoMostrarTabla(tijuanaBolsones_ny.toFixed(), "numeroEntero")
        dataNP.retiros_bolsones_lotes_ny = this.transformarDatoMostrarTabla(norteBolsones_ny.toFixed(), "numeroEntero")
        dataY.retiros_bolsones_lotes_ny = this.transformarDatoMostrarTabla(yaguaBolsones_ny.toFixed(), "numeroEntero")

        dataT.saldo_final = this.transformarDatoMostrarTabla(tijuana_saldo_final.toFixed(), "numeroEntero")
        dataNP.saldo_final = this.transformarDatoMostrarTabla(norte_saldo_final.toFixed(), "numeroEntero")
        dataY.saldo_final = this.transformarDatoMostrarTabla(yagua_saldo_final.toFixed(), "numeroEntero")






        this.datosTablaSociedadTijuana.push(dataT)
        this.datosTablaSociedadTijuana.push(dataNP)
        this.datosTablaSociedadTijuana.push(dataY)

        this.datosTablaSociedadTotalesTijuana = {
            socio: 'TOTAL',
            corresponde: this.transformarDatoMostrarTabla(produccionSociedadTijuana.toFixed(), "numeroEntero"),
            retiros: this.transformarDatoMostrarTabla((tijuanaRetiros+norteRetiros+yaguaRetiros).toFixed(), "numeroEntero"),
            saldo: this.transformarDatoMostrarTabla((tijuanaSaldo+norteSaldo+yaguaSaldo).toFixed(), "numeroEntero"),
            lotes_yc: this.transformarDatoMostrarTabla((tijuanalotes_yc+yagualotes_yc).toFixed(), "numeroEntero"),
            lotes_pl: this.transformarDatoMostrarTabla((tijuanalotes_pl+nortelotes_pl).toFixed(), "numeroEntero"),
            lotes_ny: this.transformarDatoMostrarTabla((tijuanalotes_ny+nortelotes_ny+yagualotes_ny).toFixed(), "numeroEntero"),
            saldo_lotes: this.transformarDatoMostrarTabla((tijuanaSaldo_lotes+norteSaldo_lotes+yaguaSaldo_lotes).toFixed(), "numeroEntero"),
            bolsones: this.transformarDatoMostrarTabla(kilosTotalesSilosSociedad.toFixed(), "numeroEntero"),
            retiros_bolsones: this.transformarDatoMostrarTabla((tijuana_retiro_bolsones+norte_retiro_bolsones+yagua_retiro_bolsones).toFixed(), "numeroEntero"),
            retiros_bolsones_lotes_yc: this.transformarDatoMostrarTabla((tijuanaBolsones_yc+yaguaBolsones_yc).toFixed(), "numeroEntero"),
            retiros_bolsones_lotes_pl: this.transformarDatoMostrarTabla((tijuanaBolsones_pl+norteBolsones_pl).toFixed(), "numeroEntero"),
            retiros_bolsones_lotes_ny: this.transformarDatoMostrarTabla((tijuanaBolsones_ny+norteBolsones_ny+yaguaBolsones_ny).toFixed(), "numeroEntero"),
            saldo_final: this.transformarDatoMostrarTabla((tijuana_saldo_final+norte_saldo_final+yagua_saldo_final).toFixed(), "numeroEntero")
        }

    }



    transformarDatoMostrarTabla(dato: any, tipo: any) {
        if (tipo == 'moneda') {
            const number = parseFloat(dato);
            if (number == 0) {
                return '$ 0'
            }
            if (number == null || !number) {
                return ''
            }
            const options = {
                style: 'currency',
                currency: 'ARS',
                useGrouping: true,
                maximumFractionDigits: 2
            };
            return number.toLocaleString('es-AR', options);
        }
        if (tipo=='numero'){
            let dev = dato
            return dev.toLocaleString('es-AR');
        }
        if (tipo=='numeroEntero'){
            return dato.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }

        return dato
    }
}