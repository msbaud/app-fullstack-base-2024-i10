/**
 * Clase Device que representa un dispositivo.
 * - id: Identificador del dispositivo. Lo asigna la base de datos.
 * - name: Nombre del dispositivo. Lo asigna el usuario.
 * - description: Descripción del dispositivo. Lo asigna el usuario.
 * - state: Estado del dispositivo. Lo asigna el usuario.
 * - type: Tipo de dispositivo. Lo asigna el usuario.
 */
class Device {
  public id: number;
  public name: string;
  public description: string;
  public state: number;
  public type: number;
}
