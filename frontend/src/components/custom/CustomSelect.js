import React, { useState } from 'react';
import Select from 'react-select';


export default function CustomSelect({options, onChange}) {

const [selectedOption, setSelectedOption] = useState({ value: 'user', label: 'User' });

const customStyles = 
{
 control: (provided, state) => ({
    ...provided,
     backgroundColor: 'black',
    color: 'white',
    boxShadow: 'none',
    borderColor: 'none',
    outline: state.isFocused ? 'none' : 'none',
    border: state.isFocused ? "2px solid #DC2626" : 0,
    borderBottom: "2px solid #DC2626",
    borderRadius: 0,
    padding: 0,
     '&:hover': 
     {
     borderColor: "#DC2626"
     }
        }),
        container: provided => ({
            ...provided,
            outline: 'none'
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#DC2626' : 'black',
            fontSize: "14px",
        }),
        singleValue: (provided) => ({
            ...provided,
            fontSize: "14px",
            color: 'white',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'black',
            border: "1px solid #DC2626"
        })
    };

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        onChange(selectedOption)
    };

    return (
        <Select
            
        options={options}
        styles={customStyles}
        onChange={handleChange}
         value={selectedOption}
        placeholder="Select User Type"
        // menuIsOpen={true}
        />
    );
}
