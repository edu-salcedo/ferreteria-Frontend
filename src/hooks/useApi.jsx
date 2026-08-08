import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
});

export function useApi(url, options = {}, autoFetch = true) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState(null);

    // 🚀 Convertimos las opciones a String para romper la recreación de objetos en memoria
    const serializedOptions = JSON.stringify(options);

    // FETCH / REFETCH UNIFICADO
    const fetchData = useCallback(async (customUrl) => {
        const targetUrl = customUrl || url;
        setLoading(true);
        setError(null);
        try {
            // Parseamos las opciones seguras de vuelta a objeto
            const apiOptions = JSON.parse(serializedOptions);
            const response = await api.get(targetUrl, apiOptions);
            setData(response.data ?? []);
        } catch (err) {
            setError(err.message || 'Error al cargar datos');
        } finally {
            setLoading(false);
        }
        // 🚀 Cambiamos [options] por [serializedOptions] para frenar el bucle infinito
    }, [url, serializedOptions]);

    // Sincronizamos la carga automática si autoFetch está activo
    useEffect(() => {
        if (autoFetch) fetchData();
    }, [fetchData, autoFetch]);

    // CREATE 
    const create = useCallback(async (formData, config = {}) => {
        try {
            const response = await api.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                ...config,
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }, [url]);

    // UPDATE 
    const update = useCallback(async (id, formData) => {
        try {
            const response = await api.put(`${url}/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return response.data;
        } catch (err) {
            console.log(err.response?.data);
            throw err;
        }
    }, [url]);

    // DELETE 
    const remove = useCallback(async (id) => {
        try {
            await api.delete(`${url}/${id}`, options);
            return true;
        } catch (err) {
            throw err;
        }
    }, [url, options]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        create,
        update,
        remove
    };
}
