# React + TypeScript + Vite


## Upload file to user

```txt
Crea un componente formulario para subir archivos.

Se necesita desarrollar una aplicación frontend en React que permita la carga de un archivo CSV/Excel con datos específicos y realice una solicitud HTTP a un endpoint backend (por el momento esto aun estara en stand by) para registrar los datos contenidos en el archivo.
 
1.  Carga de Archivo CSV
-Proporcionar un campo de entrada donde el usuario pueda seleccionar un archivo CSV desde su sistema local.
-Validar que el archivo seleccionado sea de tipo CSV.
-Mostrar un mensaje de error si el archivo no es válido o si ocurre algún problema durante la carga.
 
2. Vista Previa de Datos
-Leer el contenido del archivo CSV y mostrar una vista previa de los datos en una tabla dentro de la interfaz.
-Los datos del EXCEL deben incluir las siguientes columnas: nombre_usuario, correo_usuario, telefono.
-Permitir al usuario verificar que los datos sean correctos antes de enviarlos al backend.
 
3. Envío de Datos al Backend
-Proporcionar un botón para enviar los datos leídos del archivo CSV al backend a través de una solicitud HTTP POST (Por el momento que muestre el array que se enviara).
-El formato de los datos enviados debe ser un array de objetos JSON, donde cada objeto tenga la siguiente estructura (perfil ponlo en la tabla de vista previa para llenar, y portal que sea por defecto el que ves abajo:
{
  "correo": "xt9702@rimac.com.pe",
  "name": "Mario Martin Anciburo",
  "perfil": "G_SIS_PROVSALUD_CGAR_USER",
  "portal": "proveedores-salud",
  "telefono": "-"
}
-Manejar posibles errores de la solicitud HTTP (ej.: fallo en la conexión, respuesta incorrecta del servidor) y mostrar mensajes claros al usuario.

```