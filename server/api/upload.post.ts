import { type MultiPartData } from 'h3'
import { createStorage } from 'unstorage'
import fsLiteDriver from 'unstorage/drivers/fs-lite'
import { randomUUID } from 'node:crypto'

// Crear carpeta que guarda imagenes
const storage = createStorage({
    driver: fsLiteDriver({ base: './public/imgs' })
})

const guardarArchivo = async ( archivo: MultiPartData) => {
    // Del archivo recibido se extrae el tipo para obtener la extension (image/jpg)
    const [_mime, ext] = String(archivo.type).split('/');

    // Se cambia el nombre del archivo por uno aleatorio
    const fileName = randomUUID() + '.' + ext;

    // Gaudar archivo
    await storage.setItemRaw(fileName, archivo.data)

    return fileName
} 

const tipos = [ 'image/png', 'image/jpg', 'image/jpeg' ]

export default defineEventHandler( async (event) => {
    let msg: String = ''
    let nombreArchivo: String = ''
    let tipo : String = ''

    try {
        // Obtener el form del archivo enviado
        const body = await readMultipartFormData( event );

        // body es un arreglo, por lo que se destructura para obtener los datos
        const [ archivo ] = <MultiPartData[]> body;

        // Validacion del tipo de archivo (si es png/jpg/jpeg)
        if( archivo.type !== tipos.find( tipo => tipo === archivo.type ) ) {
            tipo = 'error'
            msg = 'Archivo no permitido';
            nombreArchivo = archivo.filename + ' No coincide con los formatos para subir';
        } else {
            tipo = 'hecho'
            msg = '';
            nombreArchivo = await guardarArchivo( archivo );
        }

        // console.log({tipo, msg, nombreArchivo})

        return {
            tipo: tipo,
            msg: msg,
            nombreArchivo: nombreArchivo
        }
    } catch (error) {
        console.log('error', error)
    }
})