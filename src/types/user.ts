interface UserData {
  correo: string;
  name: string;
  perfil: string;
  portal: string;
  telefono: string;
}

interface ExcelRow {
  correo_usuario?: string;
  nombre_usuario?: string;
  perfil?: string;
  telefono?: string;
}

export type { UserData, ExcelRow };
