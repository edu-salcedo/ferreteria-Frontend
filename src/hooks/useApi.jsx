import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
});

export function useApi(url, options = {}, autoFetch = true) {
    // 1. SOLUCIÓN: Cambiar null por [] evita los errores de lectura de .filter()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState(null);

    // FETCH
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(url, options);
            // Aseguramos que si la API responde algo vacío, guarde un arreglo
            setData(response.data || []);
        } catch (err) {
            setError(err.message || 'Error al cargar datos');
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        if (autoFetch) fetchData();
    }, [fetchData, autoFetch]);


    // CREATE
    const create = useCallback(async (formData, config = {}) => {
        // Quitamos el setLoading(true) global de aquí para que el botón de "Cargando..."
        // general de la lista no oculte tus productos mientras creas uno nuevo.
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

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch, create, update, remove };
}
