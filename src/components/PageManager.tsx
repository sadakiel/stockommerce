import React, { useState } from 'react';
import { Plus, Edit, Eye, Trash2, Save, X, Menu } from 'lucide-react';
import { CustomPage } from '../types/pages';

interface PageManagerProps {
  pages: CustomPage[];
  onCreatePage: (page: Omit<CustomPage, 'id' | 'tenantId' | 'created_at' | 'updated_at'>) => void;
  onUpdatePage: (id: string, updates: Partial<CustomPage>) => void;
  onDeletePage: (id: string) => void;
}

export function PageManager({ pages, onCreatePage, onUpdatePage, onDeletePage }: PageManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    content: '',
    menuPosition: 1,
    isPublic: false,
    showInMenu: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPage) {
      onUpdatePage(editingPage.id, pageForm);
    } else {
      onCreatePage(pageForm);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setPageForm({
      title: '',
      slug: '',
      content: '',
      menuPosition: 1,
      isPublic: false,
      showInMenu: true
    });
    setEditingPage(null);
    setShowModal(false);
  };

  const openEditModal = (page: CustomPage) => {
    setEditingPage(page);
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      menuPosition: page.menuPosition,
      isPublic: page.isPublic,
      showInMenu: page.showInMenu
    });
    setShowModal(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setPageForm({
      ...pageForm,
      title,
      slug: generateSlug(title)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Páginas</h1>
          <p className="text-gray-600 mt-1">
            Crea páginas personalizadas para políticas, información técnica y knowledge base
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Página</span>
        </button>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Título</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Slug</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Posición</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Visibilidad</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{page.title}</td>
                  <td className="py-3 px-4 text-gray-600 font-mono text-sm">/{page.slug}</td>
                  <td className="py-3 px-4 text-gray-600">{page.menuPosition}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {page.isPublic && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Pública
                        </span>
                      )}
                      {page.showInMenu && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          En Menú
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Activa
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(page)}
                        className="text-purple-600 hover:text-purple-800 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeletePage(page.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingPage ? 'Editar Página' : 'Nueva Página'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la Página *
                  </label>
                  <input
                    type="text"
                    required
                    value={pageForm.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Políticas de Venta"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pageForm.slug}
                    onChange={(e) => setPageForm({...pageForm, slug: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="politicas-de-venta"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido de la Página
                </label>
                <textarea
                  value={pageForm.content}
                  onChange={(e) => setPageForm({...pageForm, content: e.target.value})}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Escribe el contenido de la página aquí. Puedes usar HTML básico para formato."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posición en Menú
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pageForm.menuPosition}
                    onChange={(e) => setPageForm({...pageForm, menuPosition: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={pageForm.isPublic}
                    onChange={(e) => setPageForm({...pageForm, isPublic: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublic" className="ml-2 text-sm font-medium text-gray-700">
                    Página Pública
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showInMenu"
                    checked={pageForm.showInMenu}
                    onChange={(e) => setPageForm({...pageForm, showInMenu: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="showInMenu" className="ml-2 text-sm font-medium text-gray-700">
                    Mostrar en Menú
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPage ? 'Actualizar' : 'Crear'} Página</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}