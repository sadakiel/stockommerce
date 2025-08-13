import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Users, Shield, Eye, EyeOff } from 'lucide-react';
import { UserWithRole, CustomUserRole, availablePermissions, UserPermission } from '../types/roles';

interface UserManagementProps {
  users: UserWithRole[];
  customRoles: CustomUserRole[];
  onCreateUser: (user: Omit<UserWithRole, 'id' | 'tenantId' | 'created_at'>) => void;
  onUpdateUser: (id: string, updates: Partial<UserWithRole>) => void;
  onDeleteUser: (id: string) => void;
  onCreateRole: (role: Omit<CustomUserRole, 'id' | 'tenantId' | 'created_at'>) => void;
  onUpdateRole: (id: string, updates: Partial<CustomUserRole>) => void;
  onDeleteRole: (id: string) => void;
}

export function UserManagement({
  users,
  customRoles,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onCreateRole,
  onUpdateRole,
  onDeleteRole
}: UserManagementProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [editingRole, setEditingRole] = useState<CustomUserRole | null>(null);
  
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'vendedor' as const,
    customRoleId: '',
    active: true
  });

  const [roleForm, setRoleForm] = useState({
    name: '',
    permissions: [] as string[],
    active: true
  });

  const handleCreateUser = () => {
    onCreateUser(userForm);
    resetUserForm();
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      onUpdateUser(editingUser.id, userForm);
      resetUserForm();
    }
  };

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      role: 'vendedor',
      customRoleId: '',
      active: true
    });
    setEditingUser(null);
    setShowUserModal(false);
  };

  const handleCreateRole = () => {
    onCreateRole(roleForm);
    resetRoleForm();
  };

  const handleUpdateRole = () => {
    if (editingRole) {
      onUpdateRole(editingRole.id, roleForm);
      resetRoleForm();
    }
  };

  const resetRoleForm = () => {
    setRoleForm({
      name: '',
      permissions: [],
      active: true
    });
    setEditingRole(null);
    setShowRoleModal(false);
  };

  const openEditUser = (user: UserWithRole) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      customRoleId: user.customRoleId || '',
      active: user.active
    });
    setShowUserModal(true);
  };

  const openEditRole = (role: CustomUserRole) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      permissions: role.permissions,
      active: role.active
    });
    setShowRoleModal(true);
  };

  const togglePermission = (permissionId: string) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, UserPermission[]>);

  const categoryNames = {
    dashboard: 'Dashboard',
    inventory: 'Inventario',
    sales: 'Ventas',
    reports: 'Reportes',
    documents: 'Documentos',
    settings: 'Configuración'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">Administra usuarios y permisos del sistema</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'users', label: 'Usuarios', icon: Users },
            { id: 'roles', label: 'Roles y Permisos', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowUserModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Usuario</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Rol</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                          {user.customRoleId 
                            ? customRoles.find(r => r.id === user.customRoleId)?.name || user.role
                            : user.role
                          }
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditUser(user)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteUser(user.id)}
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
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowRoleModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Rol</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customRoles.map((role) => (
              <div key={role.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-500">{role.permissions.length} permisos</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    role.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {role.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {Object.entries(categoryNames).map(([category, name]) => {
                    const categoryPermissions = role.permissions.filter(p => 
                      availablePermissions.find(ap => ap.id === p)?.category === category
                    );
                    if (categoryPermissions.length === 0) return null;
                    
                    return (
                      <div key={category} className="text-sm">
                        <span className="font-medium text-gray-700">{name}:</span>
                        <span className="text-gray-600 ml-1">{categoryPermissions.length}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditRole(role)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => onDeleteRole(role.id)}
                    className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button onClick={resetUserForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="cajero">Cajero</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              
              {customRoles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol Personalizado (Opcional)</label>
                  <select
                    value={userForm.customRoleId}
                    onChange={(e) => setUserForm({...userForm, customRoleId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sin rol personalizado</option>
                    {customRoles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="user-active"
                  checked={userForm.active}
                  onChange={(e) => setUserForm({...userForm, active: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="user-active" className="ml-2 text-sm font-medium text-gray-700">
                  Usuario Activo
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={resetUserForm}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingUser ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingRole ? 'Editar Rol' : 'Nuevo Rol'}
                </h3>
                <button onClick={resetRoleForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Rol</label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ej. Almacenista"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="role-active"
                    checked={roleForm.active}
                    onChange={(e) => setRoleForm({...roleForm, active: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="role-active" className="ml-2 text-sm font-medium text-gray-700">
                    Rol Activo
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Permisos</h4>
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <div key={category} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        {categoryNames[category as keyof typeof categoryNames]}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              id={permission.id}
                              checked={roleForm.permissions.includes(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                            />
                            <div className="flex-1">
                              <label htmlFor={permission.id} className="text-sm font-medium text-gray-700 cursor-pointer">
                                {permission.name}
                              </label>
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={resetRoleForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={editingRole ? handleUpdateRole : handleCreateRole}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingRole ? 'Actualizar' : 'Crear'} Rol</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}