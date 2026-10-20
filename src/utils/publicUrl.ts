/**
 * URL de un archivo de la carpeta public/ (imágenes, íconos…), respetando la carpeta donde se publica el sitio.
 *   Raíz (lutsa.mx):        publicUrl('/seccion01/x.svg') → '/seccion01/x.svg'
 *   Subcarpeta (/pruebas/): publicUrl('/seccion01/x.svg') → '/pruebas/seccion01/x.svg'
 * Todas las imágenes de los componentes pasan por aquí; nunca escribir '/seccion…' a mano en un src.
 * (Las del CSS no lo necesitan: Vite les agrega la carpeta al compilar.)
 */
export function publicUrl(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
