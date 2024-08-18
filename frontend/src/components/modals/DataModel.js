import React from 'react';

const DataModal = ({ show, onClose, children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative bg-black p-4 rounded shadow-red">
                <button 
                    className="absolute top-2 right-2 text-white hover:text-red-600"
                    onClick={onClose}
                >
                    ✖
                </button>
                {children}
            </div>
        </div>
    );
};

export default DataModal;
