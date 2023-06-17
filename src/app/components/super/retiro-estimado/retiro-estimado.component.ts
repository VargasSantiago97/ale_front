import { Component } from '@angular/core';
import { ComunicacionService } from 'src/app/services/comunicacion.service';

declare var vars: any;

@Component({
    selector: 'app-retiro-estimado',
    templateUrl: './retiro-estimado.component.html',
    styleUrls: ['./retiro-estimado.component.css']
})
export class RetiroEstimadoComponent {

    API_URI_REPORTE_XLSX = vars.API_URI_REPORTE_XLSX

    fechaActual: any

    establecimiento: any = 'VERBECK'
    cultivo: any = 'MAIZ'

    id_establecimiento: any = ''
    id_cultivo: any = ''

    db_granos: any = []
    db_establecimientos: any = []


    db_movimientos: any = []

    totalCamiones: any = 0
    totalCamionesKgs: any = 0

    totalCamionesNorte: any = 0
    totalCamionesYagua: any = 0
    totalKgsNorte: any = 0
    totalKgsYagua: any = 0
    totalEstimadoNorte: any = 0
    totalEstimadoYagua: any = 0
    totalCamionesNorteDesc: any = 0
    totalCamionesYaguaDesc: any = 0

    dataReales: any;
    data: any;

    constructor(
        private comunicacionService: ComunicacionService
    ) { }

    ngOnInit() {
        this.fechaActual = new Date()
        this.fechaActual = this.fechaActual.toLocaleString()

        this.obtenerGranos()
        this.obtenerEstablecimientos()
        this.obtenerMovimientos()
    }


    obtenerGranos() {
        this.comunicacionService.getDB('granos').subscribe(
            (res: any) => {
                this.db_granos = res;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerEstablecimientos() {
        this.comunicacionService.getDB('establecimientos').subscribe(
            (res: any) => {
                this.db_establecimientos = res;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerMovimientos() {
        this.comunicacionService.getDB('movimientos').subscribe(
            (res: any) => {
                this.db_movimientos = res;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }

    onEst() {
        this.establecimiento = this.db_establecimientos.find((e: any) => { return e.id == this.id_establecimiento }).alias
        if (this.id_cultivo) {
            this.buscarDatos()
        }
    }

    onGrano() {
        this.cultivo = this.db_granos.find((e: any) => { return e.id == this.id_cultivo }).alias
        if (this.id_establecimiento) {
            this.buscarDatos()
        }
    }

    buscarDatos() {
        const ID_NORTE = '141ea05753ff'
        const ID_YAGUA = 'bcb3d28daa6b'
        const ID_PLANJAR = '9c89bfa40ad1'

        this.totalCamiones = 0
        this.totalCamionesKgs = 0
        this.totalCamionesNorte = 0
        this.totalCamionesYagua = 0
        this.totalCamionesNorteDesc = 0
        this.totalCamionesYaguaDesc = 0
        this.totalKgsNorte = 0
        this.totalKgsYagua = 0
        this.totalEstimadoNorte = 0
        this.totalEstimadoYagua = 0

        this.db_movimientos.filter((mov: any) => { return (mov.id_grano == this.id_cultivo) && (mov.id_origen == this.id_establecimiento) }).forEach((mov: any) => {
            this.totalCamiones++
            if (mov.kg_neto) {
                this.totalCamionesKgs++

                if ((mov.id_socio == ID_NORTE) || (mov.id_socio == ID_PLANJAR)) {
                    this.totalCamionesNorteDesc++
                }
                if ((mov.id_socio == ID_YAGUA)) {
                    this.totalCamionesYaguaDesc++
                }
            }

            if ((mov.id_socio == ID_NORTE) || (mov.id_socio == ID_PLANJAR)) {
                this.totalCamionesNorte++

                if (mov.kg_neto) {
                    this.totalKgsNorte += parseInt(mov.kg_neto)
                }
            }
            if (mov.id_socio == ID_YAGUA) {
                this.totalCamionesYagua++

                if (mov.kg_neto) {
                    this.totalKgsYagua += parseInt(mov.kg_neto)
                }
            }
        });

        const kilosPorCamion = (this.totalKgsNorte + this.totalKgsYagua) / this.totalCamionesKgs

        this.totalEstimadoNorte = (kilosPorCamion * this.totalCamionesNorte).toFixed(0)
        this.totalEstimadoYagua = (kilosPorCamion * this.totalCamionesYagua).toFixed(0)

        const porNorReal = this.totalKgsNorte / (this.totalKgsNorte + this.totalKgsNorte)
        const porYagReal = this.totalKgsYagua / (this.totalKgsNorte + this.totalKgsNorte)

        const porNor = (kilosPorCamion * this.totalCamionesNorte) / ((kilosPorCamion * this.totalCamionesNorte) + (kilosPorCamion * this.totalCamionesYagua)) * 100
        const porYag = (kilosPorCamion * this.totalCamionesYagua) / ((kilosPorCamion * this.totalCamionesNorte) + (kilosPorCamion * this.totalCamionesYagua)) * 100

        this.dataReales = {
            labels: ['NORTE/PLANJAR', 'YAGUA'],
            datasets: [
                {
                    data: [porNorReal, porYagReal],
                    backgroundColor: [
                        "#42A5F5",
                        "#66BB6A",
                    ],
                    hoverBackgroundColor: [
                        "#64B5F6",
                        "#81C784",
                    ]
                }
            ]
        };
        this.data = {
            labels: ['NORTE/PLANJAR', 'YAGUA'],
            datasets: [
                {
                    data: [porNor, porYag],
                    backgroundColor: [
                        "#42A5F5",
                        "#66BB6A",
                    ],
                    hoverBackgroundColor: [
                        "#64B5F6",
                        "#81C784",
                    ]
                }
            ]
        };

    }


    transf(dato: any, tipo: any) {
        if (tipo == 'n') {
            return dato.toLocaleString()
        }
        if (tipo == 'numeroEntero') {
            return dato.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
        return dato
    }

    imprimirReporteExcel() {
        var datos:any = {
            "tituloReporte": "REPORTE",
            "fechaReporte": "17 de Junio de 2023",
            "emisorReporteNombre": "Norte Semillas S.R.L.",
            "emisorReporteDireccion": "Ruta Nacional 16 km 262",
            "emisorReporteLocalidad": "Pampa del Infierno, Chaco",
            "emisorReporteLogo": "norte.png",
            "datos": [
                {
                    "labels": [
                        {
                            "field": "col1",
                            "header": "Col 1",
                            "columna": "A",
                            "fila": 10
                        },
                        {
                            "field": "col2",
                            "header": "Col 2",
                            "columna": "B",
                            "fila": 10
                        },
                        {
                            "field": "col3",
                            "header": "Col 1",
                            "columna": "C",
                            "fila": 10
                        },
                        {
                            "field": "col4",
                            "header": "Col 2",
                            "columna": "D",
                            "fila": 10
                        },
                        {
                            "field": "col5",
                            "header": "Col 1",
                            "columna": "E",
                            "fila": 10
                        },
                        {
                            "field": "col6",
                            "header": "Col 2",
                            "columna": "F",
                            "fila": 10
                        },
                        {
                            "field": "col7",
                            "header": "Col 1",
                            "columna": "G",
                            "fila": 10
                        },
                        {
                            "field": "col8",
                            "header": "Col 2",
                            "columna": "H",
                            "fila": 10
                        },
                        {
                            "field": "col9",
                            "header": "Col 1",
                            "columna": "I",
                            "fila": 10
                        },
                        {
                            "field": "col10",
                            "header": "Col 2",
                            "columna": "J",
                            "fila": 10
                        },
                        {
                            "field": "col11",
                            "header": "Col 1",
                            "columna": "K",
                            "fila": 10
                        },
                        {
                            "field": "col12",
                            "header": "Col 2",
                            "columna": "L",
                            "fila": 10
                        },
                        {
                            "field": "col13",
                            "header": "Col 1",
                            "columna": "M",
                            "fila": 10
                        },
                        {
                            "field": "col14",
                            "header": "Col 2",
                            "columna": "N",
                            "fila": 10
                        },
                        {
                            "field": "col15",
                            "header": "Col 1",
                            "columna": "O",
                            "fila": 10
                        },
                        {
                            "field": "col16",
                            "header": "Col 2",
                            "columna": "P",
                            "fila": 10
                        }],
                    "encabezados": [
                        {
                            "header": "Cliente:",
                            "data": "Santiago",
                            "cellHeader": "A5",
                            "cellData": "B5"
                        },
                        {
                            "header": "Destino:",
                            "data": "Vargas",
                            "cellHeader": "A7",
                            "cellData": "B7"
                        },
                        {
                            "header": "Cliente:",
                            "data": "Santiago",
                            "cellHeader": "G5",
                            "cellData": "H5"
                        },
                        {
                            "header": "Destino:",
                            "data": "Vargas",
                            "cellHeader": "G7",
                            "cellData": "H7"
                        }],
                    "datos": [
                        {
                            "col1": "P_col1sssssssss",
                            "col2": "P_col2",
                            "col3": "P_col3",
                            "col4": "P_col4",
                            "col5": "2541",
                            "col6": "P_col6",
                            "col7": "P_col7",
                            "col8": "P_cssssssol8",
                            "col9": "P_col9",
                            "col10": "P_col10",
                            "col11": "P_col11",
                            "col12": "P_col12",
                            "col13": "P_col13",
                            "col14": "P_col14",
                            "col15": "P_col15",
                            "col16": "16"
                        },
                        {
                            "col1": "P_col1sssssssss",
                            "col2": "P_col2",
                            "col3": "P_col3",
                            "col4": "P_col4",
                            "col5": "2541",
                            "col6": "P_col6",
                            "col7": "P_col7",
                            "col8": "P_cssssssol8",
                            "col9": "P_col9",
                            "col10": "P_col10",
                            "col11": "P_col11",
                            "col12": "P_col12",
                            "col13": "P_col13",
                            "col14": "P_col14",
                            "col15": "P_col15",
                            "col16": "16"
                        },
                        {
                            "col1": "P_col1sssssssss",
                            "col2": "P_col2",
                            "col3": "P_col3",
                            "col4": "P_col4",
                            "col5": "2541",
                            "col6": "P_col6",
                            "col7": "P_col7",
                            "col8": "P_cssssssol8",
                            "col9": "P_col9",
                            "col10": "P_col10",
                            "col11": "P_col11",
                            "col12": "P_col12",
                            "col13": "P_col13",
                            "col14": "P_col14",
                            "col15": "P_col15",
                            "col16": "16"
                        },
                        {
                            "col1": "S_col1",
                            "col2": "S_col2",
                            "col3": "S_col3",
                            "col4": "S_col4",
                            "col5": "55",
                            "col6": "S_col6",
                            "col7": "S_col7",
                            "col8": "S_col8",
                            "col9": "S_col9",
                            "col10": "S_col10",
                            "col11": "S_col11",
                            "col12": "S_col12",
                            "col13": "S_col13",
                            "col14": "S_col14",
                            "col15": "S_col15",
                            "col16": "15"
                        },
                        {
                            "col1": "T_col1",
                            "col2": "T_col2",
                            "col3": "T_col3",
                            "col4": "T_col4",
                            "col5": "T_col5",
                            "col6": "T_col6",
                            "col7": "T_col7",
                            "col8": "T_col8",
                            "col9": "T_col9",
                            "col10": "T_col10",
                            "col11": "T_col11",
                            "col12": "T_col12",
                            "col13": "T_col13",
                            "col14": "T_col14",
                            "col15": "T_col15",
                            "col16": "T_col16"
                        }],
                    "datosTotales":
                    {
                        "col4": "P_col4",
                        "col5": "P_col4",
                        "col6": "P_col6"
                    }
                },
                {
                    "labels": [
                        {
                            "field": "col1",
                            "header": "Col 1",
                            "columna": "A",
                            "fila": 23
                        },
                        {
                            "field": "col2",
                            "header": "Col 2",
                            "columna": "B",
                            "fila": 23
                        },
                        {
                            "field": "col3",
                            "header": "Col 1",
                            "columna": "C",
                            "fila": 23
                        },
                        {
                            "field": "col4",
                            "header": "Col 2",
                            "columna": "D",
                            "fila": 23
                        },
                        {
                            "field": "col5",
                            "header": "Col 1",
                            "columna": "E",
                            "fila": 23
                        },
                        {
                            "field": "col6",
                            "header": "Col 2",
                            "columna": "F",
                            "fila": 23
                        },
                        {
                            "field": "col7",
                            "header": "Col 1",
                            "columna": "G",
                            "fila": 23
                        },
                        {
                            "field": "col8",
                            "header": "Col 2",
                            "columna": "H",
                            "fila": 23
                        },
                        {
                            "field": "col9",
                            "header": "Col 1",
                            "columna": "I",
                            "fila": 23
                        },
                        {
                            "field": "col10",
                            "header": "Col 2",
                            "columna": "J",
                            "fila": 23
                        },
                        {
                            "field": "col11",
                            "header": "Col 1",
                            "columna": "K",
                            "fila": 23
                        },
                        {
                            "field": "col12",
                            "header": "Col 2",
                            "columna": "L",
                            "fila": 23
                        },
                        {
                            "field": "col13",
                            "header": "Col 1",
                            "columna": "M",
                            "fila": 23
                        },
                        {
                            "field": "col14",
                            "header": "Col 2",
                            "columna": "N",
                            "fila": 23
                        },
                        {
                            "field": "col15",
                            "header": "Col 1",
                            "columna": "O",
                            "fila": 23
                        },
                        {
                            "field": "col16",
                            "header": "Col 2",
                            "columna": "P",
                            "fila": 23
                        }],
                    "encabezados": [
                        {
                            "header": "Cliente:",
                            "data": "Santiago",
                            "cellHeader": "A18",
                            "cellData": "B18"
                        },
                        {
                            "header": "Destino:",
                            "data": "Vargas",
                            "cellHeader": "A20",
                            "cellData": "B20"
                        },
                        {
                            "header": "Cliente:",
                            "data": "Santiago",
                            "cellHeader": "G18",
                            "cellData": "H18"
                        },
                        {
                            "header": "Destino:",
                            "data": "Vargas",
                            "cellHeader": "G20",
                            "cellData": "H20"
                        }],
                    "datos": [
                        {
                            "col1": "P_col1sssssssss",
                            "col2": "P_col2",
                            "col3": "P_col3",
                            "col4": "P_col4",
                            "col5": "2541",
                            "col6": "P_col6",
                            "col7": "P_col7",
                            "col8": "P_cssssssol8",
                            "col9": "P_col9",
                            "col10": "P_col10",
                            "col11": "P_col11",
                            "col12": "P_col12",
                            "col13": "P_col13",
                            "col14": "P_col14",
                            "col15": "P_col15",
                            "col16": "16"
                        },
                        {
                            "col1": "S_col1",
                            "col2": "S_col2",
                            "col3": "S_col3",
                            "col4": "S_col4",
                            "col5": "55",
                            "col6": "S_col6",
                            "col7": "S_col7",
                            "col8": "S_col8",
                            "col9": "S_col9",
                            "col10": "S_col10",
                            "col11": "S_col11",
                            "col12": "S_col12",
                            "col13": "S_col13",
                            "col14": "S_col14",
                            "col15": "S_col15",
                            "col16": "15"
                        },
                        {
                            "col1": "T_col1",
                            "col2": "T_col2",
                            "col3": "T_col3",
                            "col4": "T_col4",
                            "col5": "T_col5",
                            "col6": "T_col6",
                            "col7": "T_col7",
                            "col8": "T_col8",
                            "col9": "T_col9",
                            "col10": "T_col10",
                            "col11": "T_col11",
                            "col12": "T_col12",
                            "col13": "T_col13",
                            "col14": "T_col14",
                            "col15": "T_col15",
                            "col16": "T_col16"
                        }],
                    "datosTotales":
                    {
                        "col4": "P_col4",
                        "col5": "P_col4",
                        "col6": "P_col6"
                    }
                }]
        }

        
        datos = {
            "tituloReporte": "REPORTE",
            "fechaReporte": "17 de Junio de 2023",
            "emisorReporteNombre": "Norte",
            "emisorReporteDireccion": "Ruta",
            "emisorReporteLocalidad": "Pampa",
            emisorReporteLogo: "norte.png",
            "datos": [
                {
                    "labels": [
                        {
                            "field": "col1",
                            "header": "Col 1",
                            "columna": "A",
                            "fila": 10
                        },
                        {
                            "field": "col2",
                            "header": "Col 2",
                            "columna": "B",
                            "fila": 10
                        },
                        {
                            "field": "col3",
                            "header": "Col 1",
                            "columna": "C",
                            "fila": 10
                        },
                        {
                            "field": "col4",
                            "header": "Col 2",
                            "columna": "D",
                            "fila": 10
                        }
                    ],
                    "encabezados": [
                        {
                            "header": "Cliente:",
                            "data": "Santiago",
                            "cellHeader": "A5",
                            "cellData": "B5"
                        }
                    ],
                    "datos": [
                        {
                            "col1": "P_col1sssssssss",
                            "col2": "P_col2",
                            "col3": "P_col3",
                            "col4": "P_col4",
                            "col5": "2541",
                            "col6": "P_col6",
                            "col7": "P_col7",
                            "col8": "P_cssssssol8",
                            "col9": "P_col9",
                            "col10": "P_col10",
                            "col11": "P_col11",
                            "col12": "P_col12",
                            "col13": "P_col13",
                            "col14": "P_col14",
                            "col15": "P_col15",
                            "col16": "16"
                        },
                        {
                            "col1": "P_col1sssssssss",
                            "col2": "P_col2",
                            "col3": "P_col3",
                            "col4": "P_col4",
                            "col5": "2541",
                            "col6": "P_col6",
                            "col7": "P_col7",
                            "col8": "P_cssssssol8",
                            "col9": "P_col9",
                            "col10": "P_col10",
                            "col11": "P_col11",
                            "col12": "P_col12",
                            "col13": "P_col13",
                            "col14": "P_col14",
                            "col15": "P_col15",
                            "col16": "16"
                        },
                        {
                            "col1": "P_col1sssssssss",
                            "col2": "P_col2",
                            "col3": "P_col3",
                            "col4": "P_col4",
                            "col5": "2541",
                            "col6": "P_col6",
                            "col7": "P_col7",
                            "col8": "P_cssssssol8",
                            "col9": "P_col9",
                            "col10": "P_col10",
                            "col11": "P_col11",
                            "col12": "P_col12",
                            "col13": "P_col13",
                            "col14": "P_col14",
                            "col15": "P_col15",
                            "col16": "16"
                        },
                        {
                            "col1": "S_col1",
                            "col2": "S_col2",
                            "col3": "S_col3",
                            "col4": "S_col4",
                            "col5": "55",
                            "col6": "S_col6",
                            "col7": "S_col7",
                            "col8": "S_col8",
                            "col9": "S_col9",
                            "col10": "S_col10",
                            "col11": "S_col11",
                            "col12": "S_col12",
                            "col13": "S_col13",
                            "col14": "S_col14",
                            "col15": "S_col15",
                            "col16": "15"
                        },
                        {
                            "col1": "T_col1",
                            "col2": "T_col2",
                            "col3": "T_col3",
                            "col4": "T_col4",
                            "col5": "T_col5",
                            "col6": "T_col6",
                            "col7": "T_col7",
                            "col8": "T_col8",
                            "col9": "T_col9",
                            "col10": "T_col10",
                            "col11": "T_col11",
                            "col12": "T_col12",
                            "col13": "T_col13",
                            "col14": "T_col14",
                            "col15": "T_col15",
                            "col16": "T_col16"
                        }],
                    "datosTotales":
                    {
                        "col4": "(D11:D15)",
                        "col5": "P_col4",
                        "col6": "P_col6"
                    }
                },
                {
                    "labels": [
                        {
                            "field": "col1",
                            "header": "Col 1",
                            "columna": "A",
                            "fila": 23
                        },
                        {
                            "field": "col2",
                            "header": "Col 2",
                            "columna": "B",
                            "fila": 23
                        },
                        {
                            "field": "col3",
                            "header": "Col 1",
                            "columna": "C",
                            "fila": 23
                        },
                        {
                            "field": "col4",
                            "header": "Col 2",
                            "columna": "D",
                            "fila": 23
                        },
                        {
                            "field": "col5",
                            "header": "Col 1",
                            "columna": "E",
                            "fila": 23
                        },
                        {
                            "field": "col6",
                            "header": "Col 2",
                            "columna": "F",
                            "fila": 23
                        },
                        {
                            "field": "col7",
                            "header": "Col 1",
                            "columna": "G",
                            "fila": 23
                        },
                        {
                            "field": "col8",
                            "header": "Col 2",
                            "columna": "H",
                            "fila": 23
                        },
                        {
                            "field": "col9",
                            "header": "Col 1",
                            "columna": "I",
                            "fila": 23
                        },
                        {
                            "field": "col10",
                            "header": "Col 2",
                            "columna": "J",
                            "fila": 23
                        },
                        {
                            "field": "col11",
                            "header": "Col 1",
                            "columna": "K",
                            "fila": 23
                        },
                        {
                            "field": "col12",
                            "header": "Col 2",
                            "columna": "L",
                            "fila": 23
                        },
                        {
                            "field": "col13",
                            "header": "Col 1",
                            "columna": "M",
                            "fila": 23
                        },
                        {
                            "field": "col14",
                            "header": "Col 2",
                            "columna": "N",
                            "fila": 23
                        },
                        {
                            "field": "col15",
                            "header": "Col 1",
                            "columna": "O",
                            "fila": 23
                        },
                        {
                            "field": "col16",
                            "header": "Col 2",
                            "columna": "P",
                            "fila": 23
                        }],
                    "encabezados": [
                        {
                            "header": "Cliente:",
                            "data": "Santiago",
                            "cellHeader": "A18",
                            "cellData": "B18"
                        },
                        {
                            "header": "Destino:",
                            "data": "Vargas",
                            "cellHeader": "A20",
                            "cellData": "B20"
                        },
                        {
                            "header": "Cliente:",
                            "data": "Santiago",
                            "cellHeader": "G18",
                            "cellData": "H18"
                        },
                        {
                            "header": "Destino:",
                            "data": "Vargas",
                            "cellHeader": "G20",
                            "cellData": "H20"
                        }],
                    "datos": [
                        {
                            "col1": "P_col1sssssssss",
                            "col2": "P_col2",
                            "col3": "P_col3",
                            "col4": "P_col4",
                            "col5": "2541",
                            "col6": "P_col6",
                            "col7": "P_col7",
                            "col8": "P_cssssssol8",
                            "col9": "P_col9",
                            "col10": "P_col10",
                            "col11": "P_col11",
                            "col12": "P_col12",
                            "col13": "P_col13",
                            "col14": "P_col14",
                            "col15": "P_col15",
                            "col16": "16"
                        },
                        {
                            "col1": "S_col1",
                            "col2": "S_col2",
                            "col3": "S_col3",
                            "col4": "S_col4",
                            "col5": "55",
                            "col6": "S_col6",
                            "col7": "S_col7",
                            "col8": "S_col8",
                            "col9": "S_col9",
                            "col10": "S_col10",
                            "col11": "S_col11",
                            "col12": "S_col12",
                            "col13": "S_col13",
                            "col14": "S_col14",
                            "col15": "S_col15",
                            "col16": "15"
                        },
                        {
                            "col1": "T_col1",
                            "col2": "T_col2",
                            "col3": "T_col3",
                            "col4": "T_col4",
                            "col5": "T_col5",
                            "col6": "T_col6",
                            "col7": "T_col7",
                            "col8": "T_col8",
                            "col9": "T_col9",
                            "col10": "T_col10",
                            "col11": "T_col11",
                            "col12": "T_col12",
                            "col13": "T_col13",
                            "col14": "T_col14",
                            "col15": "T_col15",
                            "col16": "T_col16"
                        }],
                    "datosTotales":
                    {
                        "col4": "P_col4",
                        "col5": "P_col4",
                        "col6": "P_col6"
                    }
                }]
        }

        var url = `${this.API_URI_REPORTE_XLSX}/index.php?&o=${this.objUtf8ToBase64(datos)}`
        window.open(url + '&D=D');

    }

    

    objUtf8ToBase64(ent: any) {
        let str = JSON.stringify(ent)
        let bytes = new TextEncoder().encode(str);
        let base64 = btoa(String.fromCharCode(...new Uint8Array(bytes.buffer)));
        return base64;
    }
}
