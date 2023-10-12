import { Component, Renderer2 } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';

@Component({
    selector: 'app-registros',
    templateUrl: './registros.component.html',
    styleUrls: ['./registros.component.css']
})
export class RegistrosComponent {

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
    colsRetirosSocio: any = []

    datosSociedad: any = []
    datosTablaSociedad: any = []
    datosTablaSociedadTotales: any = {}

    datosTablaSociedadTijuana: any = []
    datosTablaSociedadTotalesTijuana: any = {}
    datosTablaSociedadTraviesas: any = []
    datosTablaSociedadTotalesTraviesas: any = {}

    datosTablaRetirosSocio: any = []
    datosTablaRetirosSocioTotales: any = {}

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

    display_imprimir: any = false
    mostrar_imprimir: any = {
        totales_retirados_campos: true
    }
    colsRetirosCampos: any = []

    anotaciones: any = {
        "465b2f38ca75": {
            sociedad: [
                "~ TOTALES KILOS SOCIEDAD (No tiene en cuenta ANDION / MANATIAL POZO) ~",
                "Trilla Retiros Clientes: SABATE 92.134kgs (Picado + 25tn en tolva). El resto TIJUANA",
                "Bolson Retiros Clientes: LEGUIZA 216.140 kg de Bolson LA NINA"
            ],
            sociedadTijuana: [],
            sociedadTraviesas: []
        },
        "d81473ae9754": {
            sociedad: ["Trilla Retiros Clientes: DOÑA CHICA (EST. LA FE) - 92.950 kgs"],
            sociedadTijuana: [],
            sociedadTraviesas: []
        }
    }

    encargados: any = [
        { id: "81f01651370e", encargado: "MANU", establecimiento: "VERBECK" },
        { id: "fba493f3d681", encargado: "DAVALOS", establecimiento: "DORADO" },
        { id: "02d62eb5ecd5", encargado: "DOMITROVIC", establecimiento: "OCHETTI" },
        { id: "1d34df6042eb", encargado: "RUBENS", establecimiento: "TANITO" },
        { id: "1cfde2badf96", encargado: "RUBENS/JONA", establecimiento: "YUCHAN" },
        { id: "69cd3d6ba763", encargado: "JAVIER", establecimiento: "MAZOLA" },
        { id: "9efddf081918", encargado: "DOMITROVIC", establecimiento: "PAOLETTI BERMEJO" },
        { id: "b99511f71834", encargado: "DOMITROVIC", establecimiento: "REDONDO" },
        { id: "d44ef6ce5631", encargado: "RUBENS", establecimiento: "BOHACEK" },
        { id: "5ce5a87275c7", encargado: "DAVALOS", establecimiento: "CUSSIGH" },
        { id: "b4cbd068c56c", encargado: "", establecimiento: "FOGAR" },
        { id: "1382c1329140", encargado: "JAVIER/JONA", establecimiento: "LA SEVERA 2" },
        { id: "e4a6546a10a2", encargado: "DAVALOS", establecimiento: "LAS NOVENTAS " },
        { id: "847f0e000531", encargado: "DOMITROVIC", establecimiento: "DON JUAN" },
        { id: "6b0e33f38e57", encargado: "DAVALOS", establecimiento: "CISKA L" },
        { id: "6ae13c65c6da", encargado: "DAVALOS", establecimiento: "ALLENDE" },
        { id: "ef1932bf6dc7", encargado: "DAVALOS", establecimiento: "PAOLETTI RUTA" },
        { id: "75b0a129c168", encargado: "JAVIER", establecimiento: "DOÑA BLANCO" },
        { id: "2b525c1a0c47", encargado: "JAVIER", establecimiento: "VILCHEZ" },
        { id: "903a8dce11e4", encargado: "JAVIER", establecimiento: "LA NINA" },
        { id: "c064cec5275e", encargado: "DOMITROVIC", establecimiento: "KOHN" },
        { id: "3c0a6995ab6d", encargado: "RUBENS", establecimiento: "EL TANITO" },
        { id: "fc97687123e8", encargado: "", establecimiento: "LA NINA NO" },
        { id: "c2a47a02e7d7", encargado: "JAVIER", establecimiento: "LA VERONICA" },
        { id: "9a6c78129dad", encargado: "DAVALOS", establecimiento: "LA FE" },
        { id: "32b755cf498e", encargado: "", establecimiento: "SALOMON" },
        { id: "772459ddf44e", encargado: "DOMITROVIC", establecimiento: "BRIGUI" },
        { id: "5cf2aaebc1ea", encargado: "DAVALOS", establecimiento: "CISKA J A" },
        { id: "9e33b1deb52c", encargado: "JAVIER/JONA", establecimiento: "LA TOLOSITA" },
        { id: "ff7d09a94950", encargado: "JAVIER", establecimiento: "PAOLETTI SILENCIO" },
        { id: "c8c37bbcda94", encargado: "DAVALOS", establecimiento: "LA JUANITA" },
        { id: "e2000b49953a", encargado: "DOMITROVIC", establecimiento: "FALA" },
        { id: "e228e4a8b12b", encargado: "MANU", establecimiento: "ANDION" },
        { id: "66aa2a3ab78f", encargado: "MANU", establecimiento: "BALEANI" },
        { id: "9f64db1d744e", encargado: "DOMITROVIC", establecimiento: "MOSIMANN" },
        { id: "6cf5e60f1b25", encargado: "DAVALOS", establecimiento: "SABATE" },
        { id: "42e4980affc2", encargado: "DOMITROVIC", establecimiento: "JABZDA" },
        { id: "97c61741be74", encargado: "JAVIER/JONA", establecimiento: "LA SEVERA" },
        { id: "28175e08a2e4", encargado: "MANU", establecimiento: "PB PAOLETTI" },
        { id: "b4f28e48a704", encargado: "RUBENS", establecimiento: "LA JULIETA" },
        { id: "d26f218fd3e6", encargado: "DAVALOS", establecimiento: "LA CALANDRIA" },
        { id: "5e22f482e3ed", encargado: "JAVIER", establecimiento: "BIASSI" },
        { id: "b03bb8ee0140", encargado: "", establecimiento: "MERCANTI 128" },
        { id: "7e7fe6705318", encargado: "JAVIER", establecimiento: "LA PROVIDENCIA" },
        { id: "e66a3e837a50", encargado: "RUBENS", establecimiento: "LA BANDERITA " },
        { id: "bfd648424a87", encargado: "RUBENS", establecimiento: "GARCIA 82" },
        { id: "987e1de9f9e2", encargado: "RUBENS", establecimiento: "LA ANA" },
        { id: "73830a647729", encargado: "RUBENS", establecimiento: "LA ESMERALDA" },
        { id: "3de996f2ff1b", encargado: "MANU", establecimiento: "MANANTIAL POZO" },

    ]

    ests: any = [
    {
        "id": "81f01651370e",
        "establecimiento": "VERBECK",
        "produce": "Sociedad"
    },
    {
        "id": "02d62eb5ecd5",
        "establecimiento": "OCHETTI",
        "produce": "Sociedad"
    },
    {
        "id": "1cfde2badf96",
        "establecimiento": "YUCHAN",
        "produce": "Yagua"
    },
    {
        "id": "69cd3d6ba763",
        "establecimiento": "MAZOLA",
        "produce": "Sociedad"
    },
    {
        "id": "fba493f3d681",
        "establecimiento": "DORADO",
        "produce": "Sociedad"
    },
    {
        "id": "9efddf081918",
        "establecimiento": "PAOLETTI BERMEJO",
        "produce": "Sociedad"
    },
    {
        "id": "d44ef6ce5631",
        "establecimiento": "BOHACEK",
        "produce": "Planjar"
    },
    {
        "id": "b99511f71834",
        "establecimiento": "REDONDO",
        "produce": "Sociedad"
    },
    {
        "id": "5ce5a87275c7",
        "establecimiento": "CUSSIGH",
        "produce": "Sociedad"
    },
    {
        "id": "b4cbd068c56c",
        "establecimiento": "FOGAR",
        "produce": "Planjar"
    },
    {
        "id": "1382c1329140",
        "establecimiento": "LA SEVERA 2",
        "produce": "Yuchan"
    },
    {
        "id": "e4a6546a10a2",
        "establecimiento": "LAS NOVENTAS ",
        "produce": "Sociedad"
    },
    {
        "id": "847f0e000531",
        "establecimiento": "DON JUAN",
        "produce": "Sociedad"
    },
    {
        "id": "6b0e33f38e57",
        "establecimiento": "CISKA L",
        "produce": "Sociedad"
    },
    {
        "id": "6ae13c65c6da",
        "establecimiento": "ALLENDE",
        "produce": "Sociedad"
    },
    {
        "id": "ef1932bf6dc7",
        "establecimiento": "PAOLETTI RUTA",
        "produce": "Sociedad"
    },
    {
        "id": "75b0a129c168",
        "establecimiento": "DOÑA BLANCO",
        "produce": "Sociedad"
    },
    {
        "id": "1d34df6042eb",
        "establecimiento": "TANITO",
        "produce": "Sociedad"
    },
    {
        "id": "c2a47a02e7d7",
        "establecimiento": "LA VERONICA",
        "produce": "Sociedad"
    },
    {
        "id": "903a8dce11e4",
        "establecimiento": "LA NINA",
        "produce": "Sociedad"
    },
    {
        "id": "5cf2aaebc1ea",
        "establecimiento": "CISKA J A",
        "produce": "Sociedad"
    },
    {
        "id": "9a6c78129dad",
        "establecimiento": "LA FE",
        "produce": "Sociedad"
    },
    {
        "id": "32b755cf498e",
        "establecimiento": "SALOMON",
        "produce": "Planjar"
    },
    {
        "id": "e10402607ce5",
        "establecimiento": "BALANZA",
        "produce": "Sociedad"
    },
    {
        "id": "772459ddf44e",
        "establecimiento": "BRIGUI",
        "produce": "Planjar"
    },
    {
        "id": "c064cec5275e",
        "establecimiento": "KOHN",
        "produce": "Planjar"
    },
    {
        "id": "9e33b1deb52c",
        "establecimiento": "LA TOLOSITA",
        "produce": "Yagua"
    },
    {
        "id": "ff7d09a94950",
        "establecimiento": "PAOLETTI SILENCIO",
        "produce": "Sociedad"
    },
    {
        "id": "c8c37bbcda94",
        "establecimiento": "LA JUANITA",
        "produce": "Sociedad"
    },
    {
        "id": "e2000b49953a",
        "establecimiento": "FALA",
        "produce": "Sociedad"
    },
    {
        "id": "e228e4a8b12b",
        "establecimiento": "ANDION",
        "produce": "SocTij"
    },
    {
        "id": "66aa2a3ab78f",
        "establecimiento": "BALEANI",
        "produce": "Planjar"
    },
    {
        "id": "9f64db1d744e",
        "establecimiento": "MOSIMANN",
        "produce": "Sociedad"
    },
    {
        "id": "28175e08a2e4",
        "establecimiento": "PB PAOLETTI",
        "produce": "Sociedad"
    },
    {
        "id": "6cf5e60f1b25",
        "establecimiento": "SABATE",
        "produce": "Sociedad"
    },
    {
        "id": "97c61741be74",
        "establecimiento": "LA SEVERA",
        "produce": "Sociedad"
    },
    {
        "id": "42e4980affc2",
        "establecimiento": "JABZDA",
        "produce": "Sociedad"
    },
    {
        "id": "b4f28e48a704",
        "establecimiento": "LA JULIETA",
        "produce": "Sociedad"
    },
    {
        "id": "d26f218fd3e6",
        "establecimiento": "LA CALANDRIA",
        "produce": "Sociedad"
    },
    {
        "id": "5e22f482e3ed",
        "establecimiento": "BIASSI",
        "produce": "Sociedad"
    },
    {
        "id": "b03bb8ee0140",
        "establecimiento": "MERCANTI 128",
        "produce": "Planjar"
    },
    {
        "id": "2b525c1a0c47",
        "establecimiento": "VILCHEZ",
        "produce": "Sociedad"
    },
    {
        "id": "7e7fe6705318",
        "establecimiento": "LA PROVIDENCIA",
        "produce": "Sociedad"
    },
    {
        "id": "e66a3e837a50",
        "establecimiento": "LA BANDERITA ",
        "produce": "Sociedad"
    },
    {
        "id": "73830a647729",
        "establecimiento": "LA ESMERALDA",
        "produce": "Sociedad"
    }
    ]


    constructor(
        private comunicacionService: ComunicacionService,
        private sqlite: SqliteService,
        private messageService: MessageService,
        private renderer: Renderer2
    ) { }

    ngOnInit() {

        this.colsProd = [
            { field: 'establecimiento', header: 'ESTABLECIMIENTO' },
            { field: 'grano', header: 'GRANO' },
            { field: 'desde', header: 'DESDE' },
            { field: 'produce', header: 'PRODUCE' },
            { field: 'retira', header: 'RETIRA' },
            { field: 'entrega', header: 'ENTREGA' },
            { field: 'exportador', header: 'EXPORTADOR' },
            { field: 'corredor', header: 'CORREDOR' },
            { field: 'destino', header: 'DESTINO' },
            { field: 'kg_bruto', header: 'KG BRUTO' },
            { field: 'kg_tara', header: 'KG TARA' },
            { field: 'kg_neto', header: 'KG NETO' },
            { field: 'kg_regulacion', header: 'REGUACION' },
            { field: 'kg_salida', header: 'KG SALIDA' },
            { field: 'kg_campo', header: 'KG CAMPO' },
            { field: 'kg_acondicionado', header: 'ACOND.' },
            { field: 'kg_destino', header: 'KG DESTINO' },
            { field: 'kg_mermas', header: 'KG MERMAS' },
            { field: 'kg_final', header: 'KG FINAL' },
            { field: 'contrato', header: 'CONTRATO' },
        ]


        this.getAll('granos')
        this.getAll('movimientos', () => {
            this.ok_movimientos = true
        })
        this.getAll('carta_porte', () => {
            this.ok_cpe = true
        })
        this.getAll('socios', () => {
            this.db['socios'].forEach((e: any) => { this.colsRetirosPorSocio.push({ field: e.id, header: e.alias }) })
            this.ok_socios = true
        })
        this.getAll('establecimientos', () => {
            this.ok_establecimientos = true
        })

        this.getAllLocal('movimientos', () => {
            this.ok_movimientos_local = true
        })
        this.getAllLocal('movimiento_origen', () => {
            this.ok_movimiento_origen = true
        })
        this.getAllLocal('movimiento_contrato', () => {
            this.ok_movimiento_contrato = true
        })
        this.getAllLocal('produccion', () => {
            this.ok_establecimientoProduccion = true
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

    //DATOS MOVIMIENTOS
    armarDatosMovimientos() {
        this.datosTablaProduccion = []

        this.db['movimientos'].forEach((movimiento:any) => {
            var mov = {
                establecimiento: this.transformarDatoMostrarTabla(movimiento.id_origen, 'establecimiento'),
                grano: this.transformarDatoMostrarTabla(movimiento.id_grano, 'grano'),
                desde: movimiento.tipo_origen,
                produce: this.transformarDatoMostrarTabla(movimiento.id_origen, 'produce'),
                retira: '',
                entrega: '',
                exportador: '',
                corredor: '',
                destino: '',
                kg_bruto: '',
                kg_tara: '',
                kg_neto: '',
                kg_regulacion: '',
                kg_salida: '',
                kg_campo: '',
                kg_acondicionado: '',
                kg_destino: '',
                kg_mermas: '',
                kg_final: '',
                contrato: '',
            }

            this.datosTablaProduccion.push(mov)
        });

        var dat:any = []
        this.db['movimientos'].forEach((movimiento:any) => {
            if(!dat.includes(movimiento.id_origen)){
                dat.push(movimiento.id_origen)
            }
        });
        var mostrar: any = []
        dat.forEach((element:any) => {
            mostrar.push({
                id: element,
                establecimiento: this.transformarDatoMostrarTabla(element, 'establecimiento')
            })
        });
        console.log(mostrar)

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
            let dev = dato
            if (dev) {
                return parseInt(dev).toLocaleString('es-AR');
            } else {
                return dev
            }
        }
        if (tipo == 'numeroEntero') {
            return dato.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
        if (tipo == 'establecimiento') {
            return this.db['establecimientos'].some((e: any) => { return e.id == dato }) ? this.db['establecimientos'].find((e: any) => { return e.id == dato }).alias : dato
        }
        if (tipo == 'produce') {
            return this.ests.some((e: any) => { return e.id == dato }) ? this.ests.find((e: any) => { return e.id == dato }).produce : ''
        }
        if (tipo == 'grano') {
            return this.db['granos'].some((e: any) => { return e.id == dato }) ? this.db['granos'].find((e: any) => { return e.id == dato }).alias : dato
        }
        if (tipo == 'encargado') {
            return this.encargados.some((e: any) => { return e.id == dato }) ? this.encargados.find((e: any) => { return e.id == dato }).encargado : dato
        }

        return dato
    }

    imprimir() {
        this.display_imprimir = false
        this.renderer.setStyle(document.body, 'webkitPrintColorAdjust', 'exact');
        window.print()
    }
}