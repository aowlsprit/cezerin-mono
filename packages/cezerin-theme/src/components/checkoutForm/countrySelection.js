import React from 'react';

const CountrySelection = field => (
  <div className={field.className}>
    <label htmlFor={field.id}>
      {field.label}
      {field.meta.touched && field.meta.error && (
        <span className="error">{field.meta.error}</span>
      )}
    </label>
    <select
      {...field.input}
      placeholder={field.placeholder}
      type={field.type}
      id={field.id}
      className={field.meta.touched && field.meta.error ? 'invalid' : ''}
    >
      <option value="BE">Belgie</option>
      <option value="NL">Nederland</option>
      <option value="Other">Andere</option>
    </select>
  </div>
);

export default CountrySelection;
