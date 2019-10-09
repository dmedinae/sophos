export interface Product {
    idProducto: number;
    descripcion: string;
    categoria: string;
    miniatura: string;
    imagen: string;
    precio: number;
    cantidadDisponible: number;
    cantidadSolicitada?: number;
}