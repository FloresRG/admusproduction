import { useState, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { Company, CompanyCategory } from './types';
import { ColDef } from 'ag-grid-community';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Modal from 'react-modal';

// Registrar módulo requerido por AG Grid
ModuleRegistry.registerModules([ClientSideRowModelModule]);

// Estilos de AG Grid (asegúrate de tener estos archivos en tu proyecto)
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface Props {
  companies: Company[];
  categories: CompanyCategory[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Company',
    href: '/companies',
  },
];

const Dashboard: React.FC<Props> = ({ companies, categories }) => {
  const [rowData, setRowData] = useState<Company[]>(companies);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [isCreating, setIsCreating] = useState(false);

  const gridRef = useRef<AgGridReact<Company>>(null);

  const columnDefs: ColDef<Company>[] = [
    { headerName: 'Nombre', field: 'name', editable: true },
    { headerName: 'Categoría', field: 'category.name' },
    { headerName: 'Duración', field: 'contract_duration', editable: true },
    { headerName: 'Descripción', field: 'description', editable: true },
    {
      headerName: 'Acciones',
      cellRenderer: (params: any) => (
        <button onClick={() => openModal(params.data)} className="btn btn-warning">Editar</button>
      ),
    },
  ];

  const openModal = (data: Company | null = null) => {
    setFormData(data || {});
    setIsCreating(data === null);
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

      if (!response.ok) throw new Error('Error al actualizar');

      const updatedCompany = await response.json();
      setRowData((prev) =>
        prev.map((company) => (company.id === updatedCompany.id ? updatedCompany : company))
      );
      setModalOpen(false);
      alert('Empresa actualizada correctamente.');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar empresa.');
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al crear');

      const newCompany = await response.json();
      setRowData((prev) => [...prev, newCompany]);
      setModalOpen(false);
      alert('Empresa creada correctamente.');
    } catch (error) {
      console.error(error);
      alert('Error al crear empresa.');
    }
  };

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      width: '90%',
      maxWidth: '500px',
    },
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="p-6">
        <button onClick={() => openModal()} className="btn btn-primary mb-4">Crear Empresa</button>

        <div className="ag-theme-alpine" style={{ height: 500 }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            domLayout="autoHeight"
            suppressRowClickSelection={true}
            rowSelection="single"
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={customModalStyles}
        contentLabel={isCreating ? 'Crear Empresa' : 'Editar Empresa'}
      >
        <h2 className="text-xl font-bold mb-4">{isCreating ? 'Crear Empresa' : 'Editar Empresa'}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            isCreating ? handleCreate() : handleUpdate();
          }}
        >
          <div className="mb-4">
            <label className="block">Nombre:</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block">Categoría:</label>
            <select
              value={formData.company_category_id || ''}
              onChange={(e) =>
                setFormData({ ...formData, company_category_id: Number(e.target.value) })
              }
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block">Duración:</label>
            <input
              type="number"
              value={formData.contract_duration || ''}
              onChange={(e) =>
                setFormData({ ...formData, contract_duration: Number(e.target.value) })
              }
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block">Descripción:</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {isCreating ? 'Crear' : 'Guardar'}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default Dashboard;
