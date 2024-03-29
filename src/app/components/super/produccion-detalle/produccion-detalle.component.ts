import { Component, Renderer2 } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-produccion-detalle',
    templateUrl: './produccion-detalle.component.html',
    styleUrls: ['./produccion-detalle.component.css']
})
export class ProduccionDetalleComponent {

    idEstablecimiento: any = ''
    idGrano: any = null

    db_socios: any = []

    db_locales: any = {
        lotes: [],
        silos: [],
        produccion: []
    }

    db_movimientos: any = []
    db_ordenCarga: any = []
    db_cartaPorte: any = []
    db_camiones: any = []
    db_intervinientes: any = []
    db_granos: any = []

    load_est: any = true;
    load_soc: any = true;
    load_lote: any = true;
    load_silo: any = true;
    load_mov: any = true;
    load_movimientos: any = true;
    load_mov_orig: any = true;
    load_lote_silo: any = true;
    load_movimiento_contrato:any = true;
    load_ordenCarga: any = true;
    load_cartaPorte: any = true;
    load_camiones: any = true;
    load_contratos: any = true;
    load_intervinientes: any = true;
    loadPage: any = false;



    datosTabla: any = []
    datosGenerales: any = []

    campo_select: any;

    lotes: any = [];
    lote: any = [];
    totalHasLotes: any = 0;

    silos: any = [];
    silo: any = [];
    totalKilosSilos: any = 0;

    produccion: any = []
    produce: any = []
    socio_id: any = ''
    totalPorcentaje: any = []

    cols: any = []
    colsSilos: any = []
    colsCamiones: any = []


    dataSilos: any = []
    dataSilosTotales: any = {}

    dataCamionesTrilla: any = []
    dataCamionesTrillaTotales: any = {}
    dataCamionesSilos: any = []
    dataCamionesSilosTotales: any = {}

    mostrar_imprimir: any = {
        rinde_lote: true,
        rinde_lote_grafico: true,
        kilos_bolsones: true,
        salidas_trilla: true,
        salidas_bolsones: true,
    }

    display_imprimir: any = false

    constructor(
        private sqlite: SqliteService,
        private comunicacionService: ComunicacionService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2
    ) { }

    ngOnInit() {
        this.getDB('establecimientos', () => {
            this.load_est = false
        })

        this.route.queryParams.subscribe(params => {
            const parametro = params['idd'];
            if(parametro){

                if(!this.idGrano){
                    alert('Seleccione grano')
                } else {

                    this.idEstablecimiento = parametro
                    this.loadPage = true
    
                    this.cols = [
                        { field: 'lote', header: 'Lote' },
                        { field: 'has', header: 'Has' },
                        { field: 'kg_trilla', header: 'Kgs desde Trilla' },
                        { field: 'kg_silo', header: 'Kgs a Silo' },
                        { field: 'kg_total', header: 'TOTALES' },
                        { field: 'rinde', header: 'Rinde' },
                    ]
                    this.colsSilos = [
                        { field: 'silo', header: 'Silo' },
                        { field: 'kg_carga', header: 'Kgs ENTRADA' },
                        { field: 'kg_descarga', header: 'Kgs SALIDA' },
                        { field: 'kg_pendiente', header: 'Kgs EN SILO' },
                        { field: 'porcentaje', header: '% Pendiente' },
                    ]
                    this.colsCamiones = [
                        { field: 'fecha', header: 'Fecha' },
                        { field: 'origen', header: 'L/S' },
                        { field: 'orden_carga', header: 'O.C.' },
                        { field: 'nro_cpe', header: 'CPE' },
                        { field: 'nro_ctg', header: 'CTG' },
                        { field: 'patentes', header: 'Pat.' },
                        { field: 'beneficiario', header: 'Benef.' },
                        { field: 'corredor', header: 'Corr.' },
                        { field: 'destino', header: 'Dest.' },
                        { field: 'kg_campo', header: 'KG Campo' },
                        { field: 'porcentaje', header: '%' },
                        { field: 'kg_balanza', header: 'KG Bal.' },
                        { field: 'kg_regulacion', header: 'KG Reg.' },
                        { field: 'kg_neto', header: 'KG Neto' },
                        { field: 'kg_destino', header: 'KG Dest' },
                        { field: 'kg_final', header: 'KG Final' },
                    ]
        
                    this.obtenerSociosDB()
                    this.obtenerMovimientosDB()
                    this.obtenerOrdenCargaDB()
                    this.obtenerCartaPorteDB()
                    this.obtenerCamionesDB()
                    this.obtenerIntervinientesDB()
        
                    this.getDB('lotes', () => {
                        this.load_lote = false
                        this.generarDatosTabla()
                    })
                    this.getDB('silos', () => {
                        this.load_silo = false
                        this.generarDatosTabla()
                    })
                    this.getDB('movimientos', () => {
                        this.load_mov = false
                        this.generarDatosTabla()
                    })
                    this.getDB('movimiento_origen', () => {
                        this.load_mov_orig = false
                        this.generarDatosTabla()
                    })
                    this.getDB('lote_a_silo', () => {
                        this.load_lote_silo = false
                        this.generarDatosTabla()
                    })
                    this.getDB('movimiento_contrato', () => {
                        this.load_movimiento_contrato = false
                        this.generarDatosTabla()
                    })
                    this.getDB('contratos', () => {
                        this.load_contratos = false
                        this.generarDatosTabla()
                    })
                }
            }
        });
        this.obtenerGranosDB()
    }

    obtenerSociosDB() {
        this.comunicacionService.getDB('socios').subscribe(
            (res: any) => {
                this.db_socios = res
                this.load_soc = false
                this.generarDatosTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerGranosDB() {
        this.comunicacionService.getDB('granos').subscribe(
            (res: any) => {
                this.db_granos = res
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerMovimientosDB() {
        this.comunicacionService.getDB('movimientos').subscribe(
            (res: any) => {
                this.db_movimientos = res
                this.load_movimientos = false
                this.generarDatosTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerOrdenCargaDB() {
        this.comunicacionService.getDB('orden_carga').subscribe(
            (res: any) => {
                this.db_ordenCarga = res
                this.load_ordenCarga = false
                this.generarDatosTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerCartaPorteDB() {
        this.comunicacionService.getDB('carta_porte').subscribe(
            (res: any) => {
                this.db_cartaPorte = res
                this.load_cartaPorte = false
                this.generarDatosTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerCamionesDB() {
        this.comunicacionService.getDB('camiones').subscribe(
            (res: any) => {
                this.db_camiones = res
                this.load_camiones = false
                this.generarDatosTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerIntervinientesDB() {
        this.comunicacionService.getDB('intervinientes').subscribe(
            (res: any) => {
                this.db_intervinientes = res
                this.load_intervinientes = false
                this.generarDatosTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }



    generarDatosTabla() {
        if (!(this.load_contratos || this.load_movimiento_contrato || this.load_intervinientes || this.load_camiones || this.load_cartaPorte || this.load_ordenCarga || this.load_est || this.load_soc || this.load_lote || this.load_mov || this.load_mov_orig || this.load_lote_silo || this.load_silo || this.load_movimientos)) {

            this.datosGenerales = []
            const establecimiento = this.db_locales.establecimientos.find((e:any) => { return e.id == this.idEstablecimiento })

            // ##########################################
            //             RENDIMIENTO LOTES
            // ##########################################
            var dataAgregando: any = {
                establecimiento: establecimiento.alias,
                establecimiento_id: establecimiento.id,
                lotes: [],
                totales: {},

                graficoKilos: {
                    labels: [],
                    datasets: [
                        {
                            data: [],
                            label: 'Kilos',
                        }
                    ]
                },
                graficoRindes: {
                    labels: [],
                    datasets: [
                        {
                            data: [],
                            label: 'Rinde [kg/has]',
                        }
                    ]
                }
            }

            var has = 0
            var rinde:any = 0
            var kg_trilla = 0
            var kg_silo = 0
            var kg_total = 0

            var DIC_LOTES:any = {}

            var lotes = this.db_locales.lotes.filter((f: any) => { return (f.id_establecimiento == establecimiento.id) && (f.id_grano == this.idGrano) })
            lotes.forEach((lote: any) => {
                DIC_LOTES[lote.id] = lote.alias

                if (lote.activo == '1') {

                    //HAS
                    const hasLote = lote.has ? parseInt(lote.has) : 0


                    //TRILLA
                    var totalKilosTrilla: any = 0
                    var movimiento_origen = this.db_locales.movimiento_origen.filter((movOrig: any) => { return movOrig.id_origen == lote.id })
                    movimiento_origen.forEach((f: any) => {
                        const kgMov = f.kilos ? parseInt(f.kilos) : 0
                        totalKilosTrilla += kgMov
                    })


                    //SILOS
                    var totalKilosSilo: any = 0
                    var silos_est = this.db_locales.silos.filter((s:any) => { return (s.id_establecimiento == establecimiento.id) && (s.id_grano == this.idGrano) })
                    var lote_a_silo = this.db_locales.lote_a_silo.filter((f: any) => { return (f.id_lote == lote.id) && (silos_est.some((sil:any) => { return sil.id == f.id_silo})) })
                    lote_a_silo.forEach((f: any) => {
                        const kilos = f.kilos ? parseInt(f.kilos) : 0
                        totalKilosSilo += kilos
                    })

                    var rindeLote = 0
                    if (hasLote) {
                        rindeLote = (totalKilosTrilla + totalKilosSilo) / hasLote
                    }

                    dataAgregando.lotes.push({
                        lote: lote.alias,
                        has: this.transformarDatoMostrarTabla(hasLote, 'numero'),
                        kg_trilla: this.transformarDatoMostrarTabla(totalKilosTrilla, 'numero'),
                        kg_silo: this.transformarDatoMostrarTabla(totalKilosSilo, 'numero'),
                        kg_total: this.transformarDatoMostrarTabla(totalKilosSilo + totalKilosTrilla, 'numero'),
                        rinde: this.transformarDatoMostrarTabla(rindeLote, 'numero'),

                        cantCamiones: 1
                    })

                    dataAgregando.graficoKilos.labels.push(lote.alias)
                    dataAgregando.graficoKilos.datasets[0].data.push(totalKilosSilo + totalKilosTrilla)

                    dataAgregando.graficoRindes.labels.push(lote.alias)
                    dataAgregando.graficoRindes.datasets[0].data.push(rindeLote)

                    has += hasLote
                    kg_trilla += totalKilosTrilla
                    kg_silo += totalKilosSilo
                }
            })

            kg_total = kg_trilla + kg_silo
            if (has) {
                rinde = (kg_total / has).toFixed(2)
            }

            dataAgregando.totales = {
                lote: 'TOTALES',
                has: this.transformarDatoMostrarTabla(has, 'numero'),
                kg_trilla: this.transformarDatoMostrarTabla(kg_trilla, 'numero'),
                kg_silo: this.transformarDatoMostrarTabla(kg_silo, 'numero'),
                kg_total: this.transformarDatoMostrarTabla(kg_total, 'numero'),
                rinde: this.transformarDatoMostrarTabla(rinde, 'numero')
            }

            this.datosGenerales.push(dataAgregando)


            // ##########################################
            //             SILOS / BOLSONES
            // ##########################################

            var kg_carga = 0
            var kg_descarga = 0
            var kg_pendiente = 0

            this.dataSilos = []

            var DIC_SILOS:any = {}

            var silos = this.db_locales.silos.filter((f: any) => { return (f.id_establecimiento == establecimiento.id) && (f.id_grano == this.idGrano) })
            silos.forEach((silo: any) => {
                DIC_SILOS[silo.id] = silo.alias

                var kg_cargaSilo = 0
                var kg_descargaSilo = 0

                //SILOS CARGA
                var lote_a_silo = this.db_locales.lote_a_silo.filter((f: any) => { return f.id_silo == silo.id })
                lote_a_silo.forEach((f: any) => {
                    const kilos = f.kilos ? parseInt(f.kilos) : 0
                    kg_cargaSilo += kilos
                })

                //SILOS DESCARGA
                var mov_desde_silo = this.db_locales.movimiento_origen.filter((f: any) => { return f.id_origen == silo.id })
                mov_desde_silo.forEach((f: any) => {
                    const kilos = f.kilos ? parseInt(f.kilos) : 0
                    kg_descargaSilo += kilos
                })

                var kg_pendienteSilo = kg_cargaSilo - kg_descargaSilo

                var porcentajeSilo = '100 %'
                if(kg_descargaSilo){
                    if(kg_cargaSilo){
                        porcentajeSilo = (100 - (kg_descargaSilo / kg_cargaSilo * 100)).toFixed(2) + ' %'
                    }
                }


                this.dataSilos.push({
                    silo: silo.alias,
                    kg_carga: this.transformarDatoMostrarTabla(kg_cargaSilo, 'numero'),
                    kg_descarga: this.transformarDatoMostrarTabla(kg_descargaSilo, 'numero'),
                    kg_pendiente: this.transformarDatoMostrarTabla(kg_pendienteSilo, 'numero'),
                    porcentaje: porcentajeSilo,
                })

                kg_carga += kg_cargaSilo
                kg_descarga += kg_descargaSilo
                kg_pendiente += kg_pendienteSilo
            })

            var porcentajeSiloTotales = '100 %'
            if(kg_descarga){
                if(kg_carga){
                    porcentajeSiloTotales = (100 - (kg_descarga / kg_carga * 100)).toFixed(2) + ' %'
                }
            }

            this.dataSilosTotales = {
                silo: 'TOTALES',
                kg_carga: this.transformarDatoMostrarTabla(kg_carga, 'numero'),
                kg_descarga: this.transformarDatoMostrarTabla(kg_descarga, 'numero'),
                kg_pendiente: this.transformarDatoMostrarTabla(kg_pendiente, 'numero'),
                porcentaje: porcentajeSiloTotales,
            }

            // ##########################################
            //            CAMIONES DESDE TRILLA
            // ##########################################

            this.dataCamionesTrilla = []

            var kg_campoTotales: any = 0
            var kg_balanzaTotales: any = 0
            var kg_regulacionTotales: any = 0
            var kg_netoTotales: any = 0
            var kg_destinoTotales: any = 0
            var kg_finalTotales: any = 0

            var movimientos_granos = this.db_movimientos.filter((mov:any) => { return mov.id_grano == this.idGrano })
            var movimientos_origenes = this.db_locales['movimiento_origen'].filter((mov_orig:any) => { return (mov_orig.tipo_origen == 'lote') && (mov_orig.id_establecimiento == establecimiento.id) && (movimientos_granos.some((m:any) => { return m.id == mov_orig.id_movimiento}) ) })

            movimientos_origenes.forEach((movimiento_origen : any) => {
                //tener en cuenta que por "CONTRATO" puede beneficiar a varios socios.
                //console.log(movimiento_origen)

                //porcentaje / proporcion
                var sumaKilosMovimientoOrigen = this.db_locales['movimiento_origen'].filter((mov_orig:any) => { return (mov_orig.id_movimiento == movimiento_origen.id_movimiento) }).reduce((a:any, b:any) => {
                    const kkgg = b.kilos ? (parseInt(b.kilos) ? parseInt(b.kilos) : 0) : 0
                    return a + kkgg
                }, 0)
                const porcentaje = parseInt(movimiento_origen.kilos) / sumaKilosMovimientoOrigen


                const movimiento = this.db_movimientos.find((mov:any) => { return mov.id == movimiento_origen.id_movimiento })
                const movimientoLocal = this.db_locales['movimientos'].find((mov:any) => { return mov.id_movimiento == movimiento_origen.id_movimiento})

                const ok_origen = movimientoLocal.ok_origen == '1'
                const ok_balanza = movimientoLocal.ok_balanza == '1'
                const ok_acondicionadora = movimientoLocal.ok_acondicionadora == '1'
                const ok_descarga = movimientoLocal.ok_descarga == '1'
                const ok_contratos = movimientoLocal.ok_contratos == '1'

                var fechaMov = '-'
                if(movimiento.fecha){
                    var fecha = new Date(movimiento.fecha);

                    if(fecha){
                        var anio = fecha.getFullYear(); // Año de 4 dígitos
                        var mes:any = fecha.getMonth() + 1; // Mes (0-11), por lo que se suma 1
                        var dia:any = fecha.getDate(); // Día del mes
                        
                        mes = mes.toString().padStart(2, '0')
                        dia = dia.toString().padStart(2, '0')
                        
                        // Construye la cadena en el formato deseado
                        fechaMov = dia + '/' + mes + '/' + anio
                    }
                }

                var nroOrdenCarga = '-'
                var ordenCarga = this.db_ordenCarga.find((e:any) => { return e.id_movimiento == movimiento_origen.id_movimiento })
                if(ordenCarga){
                    nroOrdenCarga = ordenCarga.numero ? ordenCarga.numero : '-'
                }

                var nro_cpe:any = ''
                var nro_ctg:any = ''
                var cartasPorte = this.db_cartaPorte.filter((e:any) => { return e.id_movimiento == movimiento_origen.id_movimiento})
                cartasPorte.forEach((cartaPorte:any) => {
                    nro_cpe += (cartaPorte.sucursal && cartaPorte.nro_cpe) ? (cartaPorte.sucursal.toString().padStart(2, '0') + '-' + cartaPorte.nro_cpe.toString().padStart(5, '0') + ' ') : ''
                    nro_ctg += (cartaPorte.nro_ctg + ' ')
                })

                var patentes = ''
                if(movimiento.id_camion){
                    if(this.db_camiones.some((cam:any) => { return cam.id == movimiento.id_camion})){
                        const camion = this.db_camiones.find((cam:any) => { return cam.id == movimiento.id_camion})
                        const pat1 = camion.patente_chasis ? camion.patente_chasis : '' 
                        const pat2 = camion.patente_acoplado ? ' - ' + camion.patente_acoplado : ''
                        patentes = pat1 + pat2
                    }
                }

                var beneficiario = ''
                var corredor = ''
                var destino = ''
                //DE CONTRATO. -> SINO DE CPE NO AN -> SINO CPE -> sino MOV
                beneficiario = movimiento.id_socio ? this.transformarDatoMostrarTabla(movimiento.id_socio, 'socio') : '-'
                corredor = movimiento.id_corredor ? this.transformarDatoMostrarTabla(movimiento.id_corredor, 'intervinientes') : '-'
                destino = movimiento.id_acopio ? this.transformarDatoMostrarTabla(movimiento.id_acopio, 'intervinientes') : '-'

                cartasPorte.forEach((cartaPorte:any) => {
                    if(cartaPorte.data){
                        if(JSON.parse(cartaPorte.data)){
                            if(JSON.parse(cartaPorte.data).estado != 'AN' && JSON.parse(cartaPorte.data).estado != 'RE'){
                                beneficiario = cartaPorte.cuit_solicitante ? this.transformarDatoMostrarTabla(cartaPorte.cuit_solicitante, 'socioCuit') : ''
                                corredor = cartaPorte.cuit_corredor_venta_primaria ? this.transformarDatoMostrarTabla(cartaPorte.cuit_corredor_venta_primaria, 'intervinientesCuit') : ''
                                destino = cartaPorte.cuit_destino ? this.transformarDatoMostrarTabla(cartaPorte.cuit_destino, 'intervinientesCuit') : ''
                            }
                        }
                    }
                })

                if(ok_contratos){
                    const mov_ctos = this.db_locales['movimiento_contrato'].filter((mov_cto:any) => { return mov_cto.id_movimiento == movimiento.id })

                    var beneficiarioAnt:any = ''
                    var corredorAnt:any = ''
                    var destinoAnt:any = ''

                    for (let i = 0; i < mov_ctos.length; i++) {

                        const mov_cto = mov_ctos[i];
                        const cto = this.db_locales['contratos'].find((e:any) => { return e.id == mov_cto.id_contrato })

                        if(i==0){
                            beneficiario = cto.id_socio ? this.transformarDatoMostrarTabla(cto.id_socio, 'socio') : '-'
                            corredor = cto.cuit_corredor ? this.transformarDatoMostrarTabla(cto.cuit_corredor, 'intervinientesCuit') : '-'
                            destino = cto.cuit_comprador ? this.transformarDatoMostrarTabla(cto.cuit_comprador, 'intervinientesCuit') : '-'

                            beneficiarioAnt = cto.id_socio
                            corredorAnt = cto.cuit_corredor
                            destinoAnt = cto.cuit_comprador
                        } else {

                            if (beneficiarioAnt != cto.id_socio) {
                                beneficiario += '/' + (cto.id_socio ? this.transformarDatoMostrarTabla(cto.id_socio, 'socio') : '-')
                            }
                            if (corredorAnt != cto.cuit_corredor) {
                                corredor += '/' + (cto.cuit_corredor ? this.transformarDatoMostrarTabla(cto.cuit_corredor, 'intervinientesCuit') : '-')
                            }
                            if (destinoAnt != cto.cuit_comprador) {
                                console.log(destinoAnt)
                                console.log(cto.cuit_comprador)
                                destino += '/' + (cto.cuit_comprador ? this.transformarDatoMostrarTabla(cto.cuit_comprador, 'intervinientesCuit') : '-')
                            }

                            beneficiarioAnt = cto.id_socio
                            corredorAnt = cto.cuit_corredor
                            destinoAnt = cto.cuit_comprador

                        }
                    }
                }


                const kg_balanzaPropor = (movimientoLocal.kg_balanza ? (parseInt(movimientoLocal.kg_balanza) * porcentaje) : 0)
                const kg_regulacionPropor = (movimientoLocal.kg_regulacion ? (parseInt(movimientoLocal.kg_regulacion) * porcentaje) : 0)
                const kg_salidaPropor = (movimientoLocal.kg_salida ? (parseInt(movimientoLocal.kg_salida) * porcentaje) : 0)
                const kg_descargaPropor = (movimientoLocal.kg_descarga ? (parseInt(movimientoLocal.kg_descarga) * porcentaje) : 0)
                const kg_finalPropor = (movimientoLocal.kg_final ? (parseInt(movimientoLocal.kg_final) * porcentaje) : 0)

                this.dataCamionesTrilla.push({
                    porcentaje: porcentaje.toFixed(3),
                    fecha: fechaMov,
                    origen: DIC_LOTES[movimiento_origen.id_origen],
                    orden_carga: nroOrdenCarga,
                    nro_cpe: nro_cpe,
                    nro_ctg: nro_ctg,
                    patentes: patentes,
                    beneficiario: beneficiario,
                    corredor: corredor,
                    destino: destino,
                    kg_campo: ok_origen ? this.transformarDatoMostrarTabla(movimiento_origen.kilos, 'numero') : '-',
                    kg_balanza: ok_balanza ? this.transformarDatoMostrarTabla(kg_balanzaPropor, 'numero') : '-',
                    kg_regulacion: ok_balanza ? this.transformarDatoMostrarTabla(kg_regulacionPropor, 'numero') : '-',
                    kg_neto: ok_balanza ? this.transformarDatoMostrarTabla(kg_salidaPropor, 'numero') : '-',
                    kg_destino: ok_descarga ? this.transformarDatoMostrarTabla(kg_descargaPropor, 'numero') : '-',
                    kg_final: ok_descarga ? this.transformarDatoMostrarTabla(kg_finalPropor, 'numero') : '-',
                })

                //calculamos total
                kg_campoTotales += parseInt(movimiento_origen.kilos) ? parseInt(movimiento_origen.kilos) : 0
                kg_balanzaTotales += kg_balanzaPropor ? kg_balanzaPropor : 0
                kg_regulacionTotales += kg_regulacionPropor ? kg_regulacionPropor : 0
                kg_netoTotales += kg_salidaPropor ? kg_salidaPropor : 0
                kg_destinoTotales += kg_descargaPropor ? kg_descargaPropor : 0
                kg_finalTotales += kg_finalPropor ? kg_finalPropor : 0
            })

            this.dataCamionesTrillaTotales = {
                porcentaje: '',
                fecha: '',
                origen: '',
                orden_carga: '',
                nro_cpe: '',
                nro_ctg: '',
                patentes: '',
                beneficiario: '',
                corredor: '',
                destino: '',
                kg_campo: this.transformarDatoMostrarTabla(kg_campoTotales, 'numero'),
                kg_balanza: this.transformarDatoMostrarTabla(kg_balanzaTotales, 'numero'),
                kg_regulacion: this.transformarDatoMostrarTabla(kg_regulacionTotales, 'numero'),
                kg_neto: this.transformarDatoMostrarTabla(kg_netoTotales, 'numero'),
                kg_destino: this.transformarDatoMostrarTabla(kg_destinoTotales, 'numero'),
                kg_final: this.transformarDatoMostrarTabla(kg_finalTotales, 'numero'),
            }

            //ordenamos ORDEN
            this.dataCamionesTrilla.sort((a:any, b:any) => {
                if (a['orden_carga'] < b['orden_carga']) return -1;
                if (a['orden_carga'] > b['orden_carga']) return 1;
                return 0;
            });
            //ordenamos FECHA
            this.dataCamionesTrilla.sort((a:any, b:any) => {
                if (a['fecha'] < b['fecha']) return -1;
                if (a['fecha'] > b['fecha']) return 1;
                return 0;
            });
            //ordenamos SOCIO
            this.dataCamionesTrilla.sort((a:any, b:any) => {
                if (a['beneficiario'] < b['beneficiario']) return -1;
                if (a['beneficiario'] > b['beneficiario']) return 1;
                return 0;
            });




            // ##########################################
            //            CAMIONES DESDE SILOS
            // ##########################################

            this.dataCamionesSilos = []

            kg_campoTotales = 0
            kg_balanzaTotales = 0
            kg_regulacionTotales = 0
            kg_netoTotales = 0
            kg_destinoTotales = 0
            kg_finalTotales = 0

            var movimientos_granos = this.db_movimientos.filter((mov:any) => { return mov.id_grano == this.idGrano })
            var movimientos_origenes = this.db_locales['movimiento_origen'].filter((mov_orig:any) => { return (mov_orig.tipo_origen == 'silo') && (mov_orig.id_establecimiento == establecimiento.id) && (movimientos_granos.some((m:any) => { return m.id == mov_orig.id_movimiento}) ) })

            movimientos_origenes.forEach((movimiento_origen : any) => {
                //tener en cuenta que por "CONTRATO" puede beneficiar a varios socios.
                //console.log(movimiento_origen)

                //porcentaje / proporcion
                var sumaKilosMovimientoOrigen = this.db_locales['movimiento_origen'].filter((mov_orig:any) => { return (mov_orig.id_movimiento == movimiento_origen.id_movimiento) }).reduce((a:any, b:any) => {
                    const kkgg = b.kilos ? (parseInt(b.kilos) ? parseInt(b.kilos) : 0) : 0
                    return a + kkgg
                }, 0)
                const porcentaje = parseInt(movimiento_origen.kilos) / sumaKilosMovimientoOrigen


                const movimiento = this.db_movimientos.find((mov:any) => { return mov.id == movimiento_origen.id_movimiento })
                const movimientoLocal = this.db_locales['movimientos'].find((mov:any) => { return mov.id_movimiento == movimiento_origen.id_movimiento})

                const ok_origen = movimientoLocal.ok_origen == '1'
                const ok_balanza = movimientoLocal.ok_balanza == '1'
                const ok_acondicionadora = movimientoLocal.ok_acondicionadora == '1'
                const ok_descarga = movimientoLocal.ok_descarga == '1'
                const ok_contratos = movimientoLocal.ok_contratos == '1'

                var fechaMov = '-'
                if(movimiento.fecha){
                    var fecha = new Date(movimiento.fecha);

                    if(fecha){
                        var anio = fecha.getFullYear(); // Año de 4 dígitos
                        var mes:any = fecha.getMonth() + 1; // Mes (0-11), por lo que se suma 1
                        var dia:any = fecha.getDate(); // Día del mes
                        
                        mes = mes.toString().padStart(2, '0')
                        dia = dia.toString().padStart(2, '0')
                        
                        // Construye la cadena en el formato deseado
                        fechaMov = dia + '/' + mes + '/' + anio
                    }
                }

                var nroOrdenCarga = '-'
                var ordenCarga = this.db_ordenCarga.find((e:any) => { return e.id_movimiento == movimiento_origen.id_movimiento })
                if(ordenCarga){
                    nroOrdenCarga = ordenCarga.numero ? ordenCarga.numero : '-'
                }

                var nro_cpe:any = ''
                var nro_ctg:any = ''
                var cartasPorte = this.db_cartaPorte.filter((e:any) => { return e.id_movimiento == movimiento_origen.id_movimiento})
                cartasPorte.forEach((cartaPorte:any) => {
                    nro_cpe += (cartaPorte.sucursal && cartaPorte.nro_cpe) ? (cartaPorte.sucursal.toString().padStart(2, '0') + '-' + cartaPorte.nro_cpe.toString().padStart(5, '0') + ' ') : ''
                    nro_ctg += (cartaPorte.nro_ctg + ' ')
                })

                var patentes = ''
                if(movimiento.id_camion){
                    if(this.db_camiones.some((cam:any) => { return cam.id == movimiento.id_camion})){
                        const camion = this.db_camiones.find((cam:any) => { return cam.id == movimiento.id_camion})
                        const pat1 = camion.patente_chasis ? camion.patente_chasis : '' 
                        const pat2 = camion.patente_acoplado ? ' - ' + camion.patente_acoplado : ''
                        patentes = pat1 + pat2
                    }
                }

                var beneficiario = ''
                var corredor = ''
                var destino = ''
                //DE CONTRATO. -> SINO DE CPE NO AN -> SINO CPE -> sino MOV
                beneficiario = movimiento.id_socio ? this.transformarDatoMostrarTabla(movimiento.id_socio, 'socio') : '-'
                corredor = movimiento.id_corredor ? this.transformarDatoMostrarTabla(movimiento.id_corredor, 'intervinientes') : '-'
                destino = movimiento.id_acopio ? this.transformarDatoMostrarTabla(movimiento.id_acopio, 'intervinientes') : '-'

                cartasPorte.forEach((cartaPorte:any) => {
                    if(cartaPorte.data){
                        if(JSON.parse(cartaPorte.data)){
                            if(JSON.parse(cartaPorte.data).estado != 'AN' && JSON.parse(cartaPorte.data).estado != 'RE'){
                                beneficiario = cartaPorte.cuit_solicitante ? this.transformarDatoMostrarTabla(cartaPorte.cuit_solicitante, 'socioCuit') : ''
                                corredor = cartaPorte.cuit_corredor_venta_primaria ? this.transformarDatoMostrarTabla(cartaPorte.cuit_corredor_venta_primaria, 'intervinientesCuit') : ''
                                destino = cartaPorte.cuit_destino ? this.transformarDatoMostrarTabla(cartaPorte.cuit_destino, 'intervinientesCuit') : ''
                            }
                        }
                    }
                })

                if(ok_contratos){
                    const mov_ctos = this.db_locales['movimiento_contrato'].filter((mov_cto:any) => { return mov_cto.id_movimiento == movimiento.id })

                    var beneficiarioAnt:any = ''
                    var corredorAnt:any = ''
                    var destinoAnt:any = ''

                    for (let i = 0; i < mov_ctos.length; i++) {

                        const mov_cto = mov_ctos[i];
                        const cto = this.db_locales['contratos'].find((e:any) => { return e.id == mov_cto.id_contrato })

                        if(i==0){
                            beneficiario = cto.id_socio ? this.transformarDatoMostrarTabla(cto.id_socio, 'socio') : '-'
                            corredor = cto.cuit_corredor ? this.transformarDatoMostrarTabla(cto.cuit_corredor, 'intervinientesCuit') : '-'
                            destino = cto.cuit_comprador ? this.transformarDatoMostrarTabla(cto.cuit_comprador, 'intervinientesCuit') : '-'

                            beneficiarioAnt = cto.id_socio
                            corredorAnt = cto.cuit_corredor
                            destinoAnt = cto.cuit_comprador
                        } else {

                            if (beneficiarioAnt != cto.id_socio) {
                                beneficiario += '/' + (cto.id_socio ? this.transformarDatoMostrarTabla(cto.id_socio, 'socio') : '-')
                            }
                            if (corredorAnt != cto.cuit_corredor) {
                                corredor += '/' + (cto.cuit_corredor ? this.transformarDatoMostrarTabla(cto.cuit_corredor, 'intervinientesCuit') : '-')
                            }
                            if (destinoAnt != cto.cuit_comprador) {
                                console.log(destinoAnt)
                                console.log(cto.cuit_comprador)
                                destino += '/' + (cto.cuit_comprador ? this.transformarDatoMostrarTabla(cto.cuit_comprador, 'intervinientesCuit') : '-')
                            }

                            beneficiarioAnt = cto.id_socio
                            corredorAnt = cto.cuit_corredor
                            destinoAnt = cto.cuit_comprador

                        }
                    }
                }


                const kg_balanzaPropor = (movimientoLocal.kg_balanza ? (parseInt(movimientoLocal.kg_balanza) * porcentaje) : 0)
                const kg_regulacionPropor = (movimientoLocal.kg_regulacion ? (parseInt(movimientoLocal.kg_regulacion) * porcentaje) : 0)
                const kg_salidaPropor = (movimientoLocal.kg_salida ? (parseInt(movimientoLocal.kg_salida) * porcentaje) : 0)
                const kg_descargaPropor = (movimientoLocal.kg_descarga ? (parseInt(movimientoLocal.kg_descarga) * porcentaje) : 0)
                const kg_finalPropor = (movimientoLocal.kg_final ? (parseInt(movimientoLocal.kg_final) * porcentaje) : 0)

                this.dataCamionesSilos.push({
                    porcentaje: porcentaje.toFixed(3),
                    fecha: fechaMov,
                    origen: DIC_SILOS[movimiento_origen.id_origen],
                    orden_carga: nroOrdenCarga,
                    nro_cpe: nro_cpe,
                    nro_ctg: nro_ctg,
                    patentes: patentes,
                    beneficiario: beneficiario,
                    corredor: corredor,
                    destino: destino,
                    kg_campo: ok_origen ? this.transformarDatoMostrarTabla(movimiento_origen.kilos, 'numero') : '-',
                    kg_balanza: ok_balanza ? this.transformarDatoMostrarTabla(kg_balanzaPropor, 'numero') : '-',
                    kg_regulacion: ok_balanza ? this.transformarDatoMostrarTabla(kg_regulacionPropor, 'numero') : '-',
                    kg_neto: ok_balanza ? this.transformarDatoMostrarTabla(kg_salidaPropor, 'numero') : '-',
                    kg_destino: ok_descarga ? this.transformarDatoMostrarTabla(kg_descargaPropor, 'numero') : '-',
                    kg_final: ok_descarga ? this.transformarDatoMostrarTabla(kg_finalPropor, 'numero') : '-',
                })

                //calculamos total
                kg_campoTotales += parseInt(movimiento_origen.kilos) ? parseInt(movimiento_origen.kilos) : 0
                kg_balanzaTotales += kg_balanzaPropor ? kg_balanzaPropor : 0
                kg_regulacionTotales += kg_regulacionPropor ? kg_regulacionPropor : 0
                kg_netoTotales += kg_salidaPropor ? kg_salidaPropor : 0
                kg_destinoTotales += kg_descargaPropor ? kg_descargaPropor : 0
                kg_finalTotales += kg_finalPropor ? kg_finalPropor : 0
            })

            this.dataCamionesSilosTotales = {
                porcentaje: '',
                fecha: '',
                origen: '',
                orden_carga: '',
                nro_cpe: '',
                nro_ctg: '',
                patentes: '',
                beneficiario: '',
                corredor: '',
                destino: '',
                kg_campo: this.transformarDatoMostrarTabla(kg_campoTotales, 'numero'),
                kg_balanza: this.transformarDatoMostrarTabla(kg_balanzaTotales, 'numero'),
                kg_regulacion: this.transformarDatoMostrarTabla(kg_regulacionTotales, 'numero'),
                kg_neto: this.transformarDatoMostrarTabla(kg_netoTotales, 'numero'),
                kg_destino: this.transformarDatoMostrarTabla(kg_destinoTotales, 'numero'),
                kg_final: this.transformarDatoMostrarTabla(kg_finalTotales, 'numero'),
            }

            //ordenamos ORDEN
            this.dataCamionesSilos.sort((a:any, b:any) => {
                if (a['orden_carga'] < b['orden_carga']) return -1;
                if (a['orden_carga'] > b['orden_carga']) return 1;
                return 0;
            });
            //ordenamos FECHA
            this.dataCamionesSilos.sort((a:any, b:any) => {
                if (a['fecha'] < b['fecha']) return -1;
                if (a['fecha'] > b['fecha']) return 1;
                return 0;
            });
            //ordenamos SOCIO
            this.dataCamionesSilos.sort((a:any, b:any) => {
                if (a['beneficiario'] < b['beneficiario']) return -1;
                if (a['beneficiario'] > b['beneficiario']) return 1;
                return 0;
            });




            setTimeout(() => { this.loadPage = false }, 1000)

        }
    }


    seleccionarCampo(campo: any) {
        this.campo_select = campo
        this.acualizarDatosLotes()
        this.acualizarDatosSilos()
        this.actualizarDatosProduccion()
    }
    acualizarDatosLotes() {
        this.lotes = []
        this.totalHasLotes = 0

        this.getDB('lotes', () => {
            this.lotes = this.db_locales['lotes'].filter((e: any) => { return (e.id_establecimiento == this.campo_select.id) && (e.estado == 1) })
            this.lotes.forEach((e: any) => {
                if (e.activo == 'falso' || e.activo == 'false' || e.activo == '0' || e.activo == null) {
                    e.activo = false
                }
                this.totalHasLotes += parseInt(e.has)
            })
        })
    }
    acualizarDatosSilos() {
        this.silos = []
        this.totalKilosSilos = 0

        this.getDB('silos', () => {
            this.silos = this.db_locales['silos'].filter((e: any) => { return (e.id_establecimiento == this.campo_select.id) && (e.estado == 1) })
            this.silos.forEach((e: any) => {
                if (e.activo == 'falso' || e.activo == 'false' || e.activo == '0' || e.activo == null) {
                    e.activo = false
                }
                this.totalKilosSilos += parseInt(e.kilos)
            })
        })
    }
    actualizarDatosProduccion() {
        this.produccion = []
        this.totalPorcentaje = 0

        this.getDB('produccion', () => {
            this.produccion = this.db_locales['produccion'].filter((e: any) => { return e.id_establecimiento == this.campo_select.id })
            this.produccion.forEach((e: any) => {
                this.totalPorcentaje += parseFloat(e.porcentaje)
            })
        })
    }



    getDB(tabla: any, func: any = false) {
        this.sqlite.getDB(tabla).subscribe(
            (res: any) => {
                if (res) {
                    this.db_locales[tabla] = res
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta' })
                }

                if (func) {
                    func()
                }
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error conectando a BACKEND' })
            }
        )
    }
    crearDatoDB(tabla: any, data: any, func: any = false) {
        this.sqlite.createDB(tabla, data).subscribe(
            (res: any) => {
                if (res) {
                    if (res.mensaje) {
                        this.messageService.add({ severity: 'success', summary: 'CORRECTO', detail: 'Creado con exito' })
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en backend' })
                    }
                    if (func) {
                        func()
                    }
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta' })
                }
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error conectando a BACKEND' })
            }
        )
    }
    editarDB(tabla: any, data: any, func: any = false) {
        this.sqlite.updateDB(tabla, data).subscribe(
            (res: any) => {
                if (res) {
                    if (res.mensaje) {
                        this.messageService.add({ severity: 'success', summary: 'CORRECTO', detail: 'Modificado con exito' })
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en backend' })
                    }
                    if (func) {
                        func()
                    }
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta' })
                }
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    borrarDB(tabla: any, idd: any, func: any = false) {
        this.sqlite.deleteDB(tabla, idd).subscribe(
            (res: any) => {
                if (res) {
                    if (res.mensaje) {
                        this.messageService.add({ severity: 'success', summary: 'CORRECTO', detail: 'Borrado con exito' })
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en backend' })
                    }

                    if (func) {
                        func()
                    }

                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta' })
                }
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error conectando a BACKEND' })
            }
        )
    }
    generarID(tabla: any) {
        var idd: any = this.generateUUID()
        if (!this.db_locales[tabla].some((e: any) => { return e.id == idd })) {
            return idd
        }
        idd = this.generateUUID()
        if (!this.db_locales[tabla].some((e: any) => { return e.id == idd })) {
            return idd
        }
        idd = this.generateUUID()
        if (!this.db_locales[tabla].some((e: any) => { return e.id == idd })) {
            return idd
        }
        idd = this.generateUUID()
        return idd
    }
    generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
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
        if (tipo == 'numero') {
            if(!dato){
                return dato
            }
            if(!parseInt(dato)){
                return dato
            }
            if(!parseInt(dato).toLocaleString('es-AR')){
                return parseInt(dato)
            } else {
                return parseInt(dato).toLocaleString('es-AR')
            }
        }
        if (tipo == 'socio') {
            return this.db_socios.some((e: any) => { return e.id == dato }) ? this.db_socios.find((e: any) => { return e.id == dato }).alias : dato
        }
        if (tipo == 'socioCuit') {
            return this.db_socios.some((e: any) => { return e.cuit == dato }) ? this.db_socios.find((e: any) => { return e.cuit == dato }).alias : dato
        }
        if (tipo == 'has') {
            const has = parseFloat(this.totalHasLotes) * parseFloat(dato) / 100
            return has.toLocaleString('es-AR');
        }
        if (tipo == 'intervinientes') {
            return this.db_intervinientes.some((e: any) => { return e.id == dato }) ? this.db_intervinientes.find((e: any) => { return e.id == dato }).alias : '-'
        }
        if (tipo == 'intervinientesCuit') {
            return this.db_intervinientes.some((e: any) => { return e.cuit == dato }) ? this.db_intervinientes.find((e: any) => { return e.cuit == dato }).alias : '-'
        }


        return dato
    }

    navegarConParametro() {
        const idd = this.idEstablecimiento
        this.router.navigate(['/produccionDetalle'], { queryParams: { idd } });
    }

    imprimir(){
        this.display_imprimir = false
        this.renderer.setStyle(document.body, 'webkitPrintColorAdjust', 'exact');
        window.print()
    }

    grano(){
        if(this.idGrano){
            var grano = this.db_granos.find((e:any) => { return e.id == this.idGrano })
            return grano.alias
        }
    }


}