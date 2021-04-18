import React from 'react';
import DataGrid from './DataGrid'
import FilterSection from './FilterSection'

export default function Display() {
  return (
    <div
      style={{
        width: '100%',
        display: "flex",
        flexDirection: "column",
        margin: "1em"
      }}
    >
      <div style={{
        width: "800px",
        alignSelf: 'center',
      }}>
        <FilterSection />
      </div>
      <div style={{
        width: "800px",
        alignSelf: 'center',
      }}>
        <DataGrid />
      </div>
    </div>
  );
}
