import API from './api';


const API_URL = import.meta.env.VITE_API_URL;

export const getAnalystDashboard = async () => {

    try {
    const res = await axios.get(`${API_URL}/analyst/dashboard`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
    } catch (error) {
    console.error('Error al obtener dashboard:', error);
        throw error;
    }
};

export const downloadReservacionesCSV = async () => {
    try {
        const response = await API.get('/analyst/reservaciones/download', {
            responseType: 'blob'  // Importante para manejar la descarga del archivo
        });
        
        // Crear un objeto URL para el blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        
        // Crear un elemento <a> temporal
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'reservaciones.csv');
        
        // Agregar al documento y hacer clic
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error('Error al descargar reservaciones:', error);
        throw error;
    }
};

export const getReservaciones = async () => {
    try {
        const response = await API.get('/analyst/reservaciones/download');
        // Convertir el CSV a un array de objetos
        const rows = response.data.split('\n');
        const headers = rows[0].split(',');
        
        return rows.slice(1).map(row => {
            const values = row.split(',');
            const obj = {};
            headers.forEach((header, index) => {
                const trimmedHeader = header.trim();
                let value = values[index];
                
                // Convertir el precio a número
                if (trimmedHeader === 'Precio' && value !== undefined) {
                    value = parseFloat(value.replace('$', '').trim());
                }
                
                obj[trimmedHeader] = value;
            });
            return obj;
        });
    } catch (error) {
        console.error('Error al obtener reservaciones:', error);
        throw error;
    }
};