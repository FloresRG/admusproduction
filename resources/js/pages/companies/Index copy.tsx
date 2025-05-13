// resources/js/Pages/Companies/Index.tsx

import React, { useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Company, CompanyCategory } from './types'; // Ajusta la ruta según sea necesario
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';

interface Props {
  companies: Company[];
  categories: CompanyCategory[];
}

const Index: React.FC<Props> = ({ companies, categories }) => {
  const [rowData, setRowData] = useState<Company[]>(companies);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({});

  const gridRef = useRef<AgGridReact<Company>>(null);

  const columnDefs: ColDef<Company>[] = [
    { headerName: 'Nombre', field: 'name' as keyof Company, editable: true },
    { headerName: 'Categoría', field: 'category.name' as keyof Company },
    { headerName: 'Duración', field: 'contract_duration' as keyof Company, editable: true },
    { headerName: 'Descripción', field: 'description' as keyof Company, editable: true },
    {
      headerName: 'Acciones',
      cellRenderer: (params: any) => (
        <button onClick={() => openModal(params.data)}>Editar</button>
      ),
    },
  ];

  const openModal = (data: Company) => {
    setFormData(data);
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!formData.id) return;

    try {
      const response = await fetch(`/companies/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la empresa');
      }

      alert('Empresa actualizada exitosamente.');
      setModalOpen(false);
      // Actualizar los datos de la tabla después de la actualización
      const updatedCompany = await response.json();
      setRowData((prev) =>
        prev.map((company) => (company.id === updatedCompany.id ? updatedCompany : company))
      );
    } catch (error) {
      console.error(error);
      alert('Hubo un error al intentar actualizar la empresa.');
    }
  };

  return (
    <>
      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          domLayout="autoHeight"
        />
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Empresa</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <label>Nombre:
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </label>
              <label>Categoría:
                <select
                  value={formData.company_category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, company_category_id: Number(e.target.value) })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </label>
              <label>Duración:
                <input
                  type="number"
                  value={formData.contract_duration || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, contract_duration: Number(e.target.value) })
                  }
                />
              </label>
              <label>Descripción:
                <textarea
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </label>
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setModalOpen(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
