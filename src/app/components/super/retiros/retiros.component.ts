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
    datosSociedad: any = []
    datosTablaSociedad: any = []
    datosTablaSociedadTotales: any = {}

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
            { field: 'corresponde', header: 'CORRESPONDE' },
            { field: 'retiros', header: 'RETIROS TRILLA' },
            { field: 'camara', header: 'CAMARA' },
            { field: 'clientes', header: 'CLIENTES' },
            { field: 'saldo', header: 'SALDO PROD.' },
            { field: 'lotes_yc', header: 'LOTES YC' },
            { field: 'lotes_pl', header: 'LOTES PL' },
            { field: 'saldo_lotes', header: 'SALDO' },
            { field: 'bolsones', header: 'CORRESPONDE BOLSONES' },
            { field: 'retiros_bolsones', header: 'RETIROS BOLSONES' },
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
            socio: 'NORTE-PLANJAR',
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
            socio: 'YAGUA',
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

        const ID_CONTRATO_CAMARA = ['982f36b64653', 'fca0ef6ebd87']
        const ID_CONTRATO_CLIENTES = ['021b3c0a8357', '8502307611bb']

        //Armamos establecimientos que estan en sociedad / Lotes PL / Lotes YC
        var establecimientosSociedad: any = []
        var establecimientosPL: any = []
        var establecimientosYC: any = []

        this.datosProduccion.forEach((est:any) => {
            if(this.db_locales['produccion'].some((e:any) => { return e.id_establecimiento == est.id_establecimiento })){
                const producenSocios:any = this.db_locales['produccion'].filter((e:any) => { return e.id_establecimiento == est.id_establecimiento })

                if(producenSocios.some((e:any) => { return e.id_socio == ID_NORTE }) && producenSocios.some((e:any) => { return e.id_socio == ID_YAGUA })){
                    establecimientosSociedad.includes(est.id_establecimiento) ? null : establecimientosSociedad.push(est.id_establecimiento)
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
        const kilosRef = 'kg_neto'
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

                                const kilos = movimiento[kilosRef] ? parseInt(movimiento[kilosRef]) : 0
                                const kilosComputar = proporcionOrig * proporcionCtos * kilos

                                paqueteMovimientos.push({
                                    kilos: kilosComputar,
                                    id_grano: movimiento.id_grano,
                                    id_establecimiento: movOrig.id_establecimiento,
                                    id_socio: contrato.id_socio,
                                    tipo_origen: movOrig.tipo_origen,
                                    id_destino: movimiento.id_destino,
                                    contrato: contrato.id,
                                })
                            })

                        } else {
                            const kilos = movimiento[kilosRef] ? parseInt(movimiento[kilosRef]) : 0
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

                            const kilos = movimiento[kilosRef] ? parseInt(movimiento[kilosRef]) : 0
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
                        const kilos = movimiento[kilosRef] ? parseInt(movimiento[kilosRef]) : 0
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
                const kilos = movimiento[kilosRef] ? parseInt(movimiento[kilosRef]) : 0
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

        /* 
        kilos
        id_grano
        id_establecimiento
        id_socio
        tipo_origen
        id_destino
        contrato
         */

        //CORRESPONDE
        const produccionSociedad = paqueteMovimientos.reduce((acc:any, curr:any) => { 
            var valor = 0
            if(establecimientosSociedad.includes(curr.id_establecimiento) && curr.id_grano == this.idGranosSeleccionado && curr.tipo_origen=='lote'){
                valor = curr.kilos 
            }
            return acc + valor
        }, 0)

        const correspondeNorte = produccionSociedad/2
        const correspondeYagua = produccionSociedad/2

        var norteRetiros = 0
        var yaguaRetiros = 0

        var norteCamara = 0
        var yaguaCamara = 0

        var norteClientes = 0
        var yaguaClientes = 0

        //SALIDAS A CAMARA - CLIENTES - RETIROS
        paqueteMovimientos.filter((e:any) => { return establecimientosSociedad.includes(e.id_establecimiento) && (e.id_grano == this.idGranosSeleccionado) && (e.tipo_origen=='lote') }).forEach((mov:any) => {
            if(ID_CONTRATO_CAMARA.includes(mov.contrato)){
                if(mov.id_socio == ID_NORTE || mov.id_socio == ID_PLANJAR){
                    norteCamara += mov.kilos
                }
                if(mov.id_socio == ID_YAGUA){
                    yaguaCamara += mov.kilos
                }
            }
            if(ID_CONTRATO_CLIENTES.includes(mov.contrato)){
                if(mov.id_socio == ID_NORTE || mov.id_socio == ID_PLANJAR){
                    norteClientes += mov.kilos
                }
                if(mov.id_socio == ID_YAGUA){
                    yaguaClientes += mov.kilos
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

        //SILOS RETIROS
        paqueteMovimientos.filter((e:any) => { return establecimientosSociedad.includes(e.id_establecimiento) && (e.id_grano == this.idGranosSeleccionado) && (e.tipo_origen=='silo') }).forEach((mov:any) => {
            if(mov.id_socio == ID_NORTE || mov.id_socio == ID_PLANJAR){
                norteRetiroBolsones += mov.kilos
            }
            if(mov.id_socio == ID_YAGUA){
                yaguaRetiroBolsones += mov.kilos
            }
        })


        var norteSaldo = correspondeNorte - norteRetiros - norteCamara - norteClientes
        var yaguaSaldo = correspondeYagua - yaguaRetiros - yaguaCamara - yaguaClientes

        var norteSaldoLotes = norteSaldo + nortelotes_pl + nortelotes_yc
        var yaguaSaldoLotes = yaguaSaldo + yagualotes_pl + yagualotes_yc

        var norteSaldoFinal = norteSaldoLotes + (kilosTotalesSilosSociedad/2) - norteRetiroBolsones
        var yaguaSaldoFinal = yaguaSaldoLotes + (kilosTotalesSilosSociedad/2) - yaguaRetiroBolsones


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
            saldo_final: this.transformarDatoMostrarTabla((norteSaldoFinal+yaguaSaldoFinal).toFixed(), "numeroEntero"), 
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