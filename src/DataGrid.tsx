import * as React from 'react';
import {
  DataGrid,
  GridToolbar,
  GridRowsProp,
  GridColDef,
} from '@material-ui/data-grid';
import { useSelector } from 'react-redux'
import { RootState } from './reducer';

export default function CustomLocaleTextGrid() {
  const rows = useSelector<RootState, GridRowsProp>(state => state.reducer.rows)
  const columns = useSelector<RootState, GridColDef[]>(state => state.reducer.columns)

  return (
    <div style={{ height: 800, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        localeText={{
          toolbarDensity: 'Size',
          toolbarDensityLabel: 'Size',
          toolbarDensityCompact: 'Small',
          toolbarDensityStandard: 'Medium',
          toolbarDensityComfortable: 'Large',
        }}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
}
