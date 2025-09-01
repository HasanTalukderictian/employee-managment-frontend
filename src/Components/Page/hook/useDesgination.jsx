// hooks/useDesignations.js
import { useState, useEffect } from "react";

const useDesignations = (BASE_URL, searchQuery) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            setError(null);
            try {
                let url = `${BASE_URL}/api/get-desi`;
                if (searchQuery.trim()) {
                    url += `?search=${encodeURIComponent(searchQuery)}`;
                }

                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch data");
                const result = await response.json();
                setEmployees(Array.isArray(result.data) ? result.data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, [BASE_URL, searchQuery]);

    return { employees, setEmployees, loading, error };
};

export default useDesignations;
