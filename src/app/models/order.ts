import { Product } from './products';

export interface Order {
    idPedido: number;
    nombre: string;
    fechaNacimiento: string;
    direccionEnvio: string;
    ciudad: number;
    copiaCedula: string;
    productos?: Array<Product>;
}