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
            { field: 'saldo', header: 'CAMARA' },
            { field: 'retiros', header: 'RETIROS BOLSONES' },
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
        var establecimientosSociedad: any = []
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

                if(producenSocios.length > 1){
                    establecimientosSociedad.includes(est.id_establecimiento) ? null : establecimientosSociedad.push(est.id_establecimiento)
                }

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


        return dato
    }
}