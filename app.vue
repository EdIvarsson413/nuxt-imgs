<template>
  <div class="h-screen mt-[90px]">
    <h1 class="my-10 text-6xl text-center">Subir Archivos y Manejo de Imágenes</h1>
    
    <!-- Contenido -->
    <main class="w-1/4 mx-auto">
      <input 
        class="block w-full px-3 py-2 mx-auto mb-5 bg-gray-300 border-2 border-gray-400 rounded-md"
        type="file" 
        @change="onChangeFile" 
        accept="image/png, image/jpg, image/jpeg"
      >

      <button @click="onSubmit" class="w-full py-2 text-lg transition-all duration-200 bg-orange-300 rounded-md hover:bg-orange-400 hover:font-bold">
        Subir
      </button>

      <!-- Cuando se haya cargado el archivo en la carpeta imgs -->
      <article class="mt-5" v-if="hayImagen">
        <div class="border-2 border-gray-500 rounded-md"></div>
        <h2 class="my-2 text-2xl text-center">Imagen subida</h2>
        <img 
          :src="`/imgs/${respuesta.nombreArchivo}`" 
          alt="imagen" 
          width="400"
          class="mx-auto border-4 border-gray-500 rounded-md shadow-lg shadow-black "
        />
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
interface Respuesta {
  tipo: String
  msg: String
  nombreArchivo: String
}
const archivo = ref <File | null> (null);
let respuesta = reactive <Respuesta> ({
  tipo: '',
  msg: '',
  nombreArchivo: ''
})

const onChangeFile = ( e: Event ) => {
  // Cuando se haya seleccionado la imagen (solo se selecciona uno y queda guardado en un array)
  const [ _archivo ] = (e.target as HTMLInputElement).files as FileList;
  archivo.value = _archivo;
}

const onSubmit = async () => {
  try {
    // Si no se ha seleccionado un archivo se cancela el método
    if( !archivo.value ) return;

    // Se crea nuevo fom data para contener el archivo al enviarlo
    const body = new FormData();
    body.append('file', archivo.value, archivo.value.name)

    // Peticion para enviar la imagen
    const data = await $fetch <Respuesta> ('/api/upload', {
      headers: {
        "client-platform": "browser"
      },
      method: 'post',
      body: body
    })

    // Obtener datos de respuesta
    respuesta.tipo = data.tipo
    respuesta.msg = data.msg
    respuesta.nombreArchivo = data.nombreArchivo

  } catch (error) {
    console.log(error)
  }
}

// Verificar su ya hay imagen en la carpeta para mostrarla
const hayImagen = computed(() => { return respuesta.tipo === 'hecho' })

useHead({
  title: 'Subir Archivos',
  meta: [ { name: 'description', content: 'Subir archivos con librerias y funciones nativas de Nodejs en Nuxt' } ]
})
</script>