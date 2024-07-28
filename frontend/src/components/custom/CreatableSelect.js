import React, { useState, useEffect } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';

const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'black',
    borderColor: 'transparent',
    borderBottomWidth: '2px',
    borderBottomColor: '#dc2626',
    borderRadius: 0,
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'transparent',
      borderBottomColor: '#b91c1c',
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#dc2626' : state.isFocused ? '#dc2626' : 'black',
    color: 'white',
    '&:active': {
      backgroundColor: '#dc2626',
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'black',
    color: 'white',
    borderColor: '#dc2626',
    borderWidth: '2px',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white',
  }),
  placeholder: (base) => ({
    ...base,
    color: 'gray',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#b91c1c',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'white',
  }),
  input: (base) => ({
    ...base,
    color: 'white',
  }),
};

const CreatableSelect = ({ onChange, value, url }) => {
  const [options, setOptions] = useState([]);
  const [initialLoad, setInitialLoad] = useState(false);

  const loadOptions = async (inputValue) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search: inputValue }),
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  useEffect(() => {
    if (!initialLoad) {
      const fetchInitialOptions = async () => {
        const initialOptions = await loadOptions('');
        setOptions(initialOptions);
      };
      fetchInitialOptions();
      setInitialLoad(true);
    }
  }, [initialLoad]);

  const handleFocus = () => {
    if (!initialLoad) {
      loadOptions('').then((initialOptions) => {
        setOptions(initialOptions);
        setInitialLoad(true);
      });
    }
  };

  return (
    <AsyncCreatableSelect
      isClearable
      isMulti
      styles={customStyles}
      loadOptions={loadOptions}
      defaultOptions={options}
      onChange={onChange}
      onFocus={handleFocus}
      value={value}
    />
  );
};

export default CreatableSelect;
