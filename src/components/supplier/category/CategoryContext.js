'use client';

import { useState, createContext } from 'react';

const CategoryContext = createContext();

const CategoryProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    return (
        <CategoryContext.Provider value={{ formData, setFormData }}>
            {children}
        </CategoryContext.Provider>
    );
};

export { CategoryProvider, CategoryContext };
