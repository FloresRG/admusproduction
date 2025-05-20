import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  useTheme,
  useMediaQuery,
  Box,
  TextField,
  IconButton,
  Checkbox,
  Tooltip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const ResponsiveTable = ({ columns, rows }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  // Manejadores de eventos para paginación
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtro por búsqueda
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Selección de filas con checkbox
  const handleRowSelect = (rowId) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(rowId)
        ? prevSelected.filter((id) => id !== rowId)
        : [...prevSelected, rowId]
    );
  };

  // Selección global de todas las filas
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(filteredRows.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const filteredRows = rows.filter((row) => {
    return columns.some((column) =>
      row[column.id]?.toString().toLowerCase().includes(searchQuery)
    );
  });

  // Determina si todas las filas están seleccionadas
  const isAllSelected = filteredRows.length > 0 && selectedRows.length === filteredRows.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < filteredRows.length;

  return (
    <Box sx={{ padding: 2 }}>
      {/* Buscador */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ marginRight: 2 }}
          InputProps={{
            startAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          overflowX: 'auto',
          maxHeight: 'calc(100vh - 200px)',
        }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }}>
          {/* Cabecera de la tabla */}
          <TableHead>
            <TableRow>
              {/* Checkbox global */}
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                  color="primary"
                />
              </TableCell>

              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.common.white,
                    padding: isMobile ? '8px' : '16px',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                  }}
                  aria-label={column.label}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {column.label}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Cuerpo de la tabla */}
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? theme.palette.grey[50] : theme.palette.common.white,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      color="primary"
                    />
                  </TableCell>

                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{
                        padding: isMobile ? '8px' : '16px',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                      }}
                    >
                      {row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Paginación */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
            sx={{
              '& .MuiTablePagination-select': {
                fontSize: isMobile ? '0.875rem' : '1rem',
              },
              '& .MuiTablePagination-actions': {
                fontSize: isMobile ? '0.875rem' : '1rem',
              },
            }}
          />
        </Box>
      </TableContainer>
    </Box>
  );
};

export default ResponsiveTable;
