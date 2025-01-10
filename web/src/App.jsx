import React, { useEffect, useState } from 'react';
import './App.css';
import Parts from "./Parts";

function App() {
    const [error, setError] = useState(null); // Estado para manejar errores
    const [loading, setLoading] = useState(true); // Estado de carga
    const [spec, setSpec] = useState(null); // Datos del backend
    const [partChoices, setPartChoices] = useState({}); // Opciones seleccionadas por el usuario
    const [avatarURL, setAvatarURL] = useState(null); // URL del avatar generado

    // Función para seleccionar opciones aleatorias basadas en la especificación
    const randomizeChoices = (spec) => {
        if (!spec) {
            return;
        }

        const parts = {};
        Object.keys(spec.parts).forEach(partName => {
            // Solo selecciona partes que existan en un grupo del editor
            if (Object.values(spec.groups).some(g => g.includes(partName))) {
                const partType = spec.parts[partName];
                const values = Object.values(spec.values[partType]);
                parts[partName] = values[Math.floor(Math.random() * values.length)];
            }
        });
        setPartChoices(parts);
    };

    // Cargar los datos de la API al montar el componente
    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/api/avatar/spec`) // Usar variable de entorno
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(
                (result) => {
                    console.log('Datos del backend:', result); // Log para depuración
                    setSpec(result);
                    randomizeChoices(result); // Inicializa opciones al azar
                    setLoading(false);
                },
                (error) => {
                    console.error('Error al obtener datos:', error); // Log de errores
                    setError(error);
                    setLoading(false);
                }
            );
    }, []);

    // Manejar cambios en las elecciones de partes
    const onPartChoice = (name, value) => {
        setPartChoices({ ...partChoices, [name]: value });
    };

    // Actualizar la URL del avatar al cambiar las opciones
    useEffect(() => {
        if (loading) {
            setAvatarURL(null);
            return;
        }
        setAvatarURL(`${import.meta.env.VITE_API_URL}/api/avatar?` + new URLSearchParams(partChoices));
    }, [partChoices, loading]);

    // Renderizado del componente
    if (error) {
        return <div>Failed to load: {error.message || 'Unknown error'}</div>; // Manejo mejorado del error
    } else if (loading) {
        return <div>Loading...</div>;
    } else {
        return (
            <>
                <div className={"avatar-wrapper"}>
                    <img className={"avatar"} src={avatarURL} alt="Your Tilt Avatar" />
                </div>
                <Parts spec={spec} choices={partChoices} onChange={onPartChoice} />
            </>
        );
    }
}

export default App;

