import React from 'react';
import COUNTRIES from './countries';

const CountrySelection = field => (
  <div className={field.className}>
    <label htmlFor={field.id}>
      {field.label}
      {field.meta.touched && field.meta.error && <span className="error">{field.meta.error}</span>}
    </label>
    <select
      {...field.input}
      placeholder={field.placeholder}
      type={field.type}
      id={field.id}
      className={field.meta.touched && field.meta.error ? 'invalid' : ''}
    >
      {Object.keys(COUNTRIES).map(item => (
        <option key={`country-${item}`} value={item}>
          {item} - {COUNTRIES[item]}
        </option>
      ))}
    </select>
  </div>
);

export default CountrySelection;
