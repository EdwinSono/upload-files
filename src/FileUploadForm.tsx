import { useState, ChangeEvent, DragEvent } from 'react';
import * as XLSX from 'xlsx';
import { UserData, ExcelRow } from "./types/user";
import { saveUsers } from './services/users';

export const FileUploadForm = () => {
  const [previewData, setPreviewData] = useState<UserData[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
    // Limpiar el input de archivo después de soltar
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleClear = () => {
    setPreviewData([]);
    setSuccess('');
    setError('');
    // Limpiar el input de archivo
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  const processFile = (file: File) => {
    // Validate file type
    if (!file.name.match(/\.(csv|xlsx?)$/i)) {
      setError('Por favor, seleccione un archivo CSV o Excel válido');
      return;
    }
    handleClear();
    // Read the file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

        // Validar columnas requeridas
        const requiredColumns = ['correo_usuario', 'nombre_usuario', 'telefono'];
        const firstRow = jsonData[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));

        if (missingColumns.length > 0) {
          setError('Los nombres de las columnas no son permitidas. Se requieren las siguientes columnas: ' + 
            requiredColumns.join(', '));
          setPreviewData([]); // Limpiar datos de vista previa
          return;
        }

        // Transform data to match required format
        const transformedData = jsonData.map((row) => ({
          correo: row.correo_usuario || '',
          name: row.nombre_usuario || '',
          perfil: row.perfil || 'G_SIS_PROVSALUD_CGAR_USER',
          portal: 'proveedores-salud',
          telefono: row.telefono || '-'
        }));

        setPreviewData(transformedData);
      } catch {
        setError('Error al leer el archivo. Por favor, verifique el formato.');
        setPreviewData([]); // Limpiar datos de vista previa
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    if (previewData.length === 0) {
      setError('No hay datos para enviar');
      return;
    }

    setSuccess('Datos preparados para enviar al backend');
    const result = await saveUsers(previewData);
    if (result.success) {
      setSuccess('Datos enviados al backend');
    } else {
      setError('Error al enviar los datos al backend');
    }
    setTimeout(() => {
      handleClear();
    }, 3000);
  };

  return (
    <div className="justify-center items-center min-h-screen w-full bg-gray-50">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 m-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Subir Archivo de Usuarios</h2>
        
        <div className="flex justify-center mx-auto">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors w-full max-w-md ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm mb-2">Arrastra y suelta tu archivo aquí</p>
              <p className="text-xs mb-3">o</p>
              <label className="cursor-pointe transition-colors text-sm">
                Seleccionar archivo
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-3">Formatos soportados: .csv, .xlsx, .xls</p>
            </div>
          </div>
        </div>
        <div className="mb-6">
          {error && (
            <div className="m-4 p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
              {success}
            </div>
          )}
        </div>

        {previewData.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Vista Previa de Datos</h3>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md transition-colors text-gray-500 bg-gray-500"
              >
                Enviar Datos
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.correo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.perfil}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.portal}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.telefono}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}; 