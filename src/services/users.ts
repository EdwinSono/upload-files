export interface User {
  correo: string;
  name: string;
  perfil: string;
  portal: string;
  telefono: string;
}

export const saveUsers = async (users: User[]): Promise<{ success: boolean; message: string }> => {
  try {
    // Simulamos un delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulamos una respuesta exitosa
    return {
      success: true,
      message: `Se guardaron ${users.length} usuarios exitosamente`
    };
  } catch (error) {
    console.log(error);
    // Simulamos un error
    return {
      success: false,
      message: 'Error al guardar los usuarios'
    };
  }
};




