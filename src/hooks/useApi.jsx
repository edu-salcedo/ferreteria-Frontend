import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/',
    timeout: 10000,
});

export function useApi(url, options = {}, autoFetch = true) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState(null);

    // FETCH
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(url, options);
            setData(response.data);
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
    // CREATE
    const create = useCallback(async (formData, config = {}) => {
        setLoading(true);
        try {
            const response = await api.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                ...config, // 👈 permite onUploadProgress
            });
            return response.data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }, [url]);


    // UPDATE
    const update = useCallback(async (id, formData) => {
        setLoading(true);
        try {
            const response = await api.put(`${url}/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            return response.data;
        } catch (err) {
            console.log(err.response.data);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [url]);


    // DELETE
    const remove = useCallback(async (id) => {
        setLoading(true);
        try {
            await api.delete(`${url}/${id}`, options);
            return true;
        } finally {
            setLoading(false);
        }
    }, [url, options]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch, create, update, remove };
}
