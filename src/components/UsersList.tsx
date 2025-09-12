import { Icon } from '@iconify/react';
import { useUsersData } from '../hooks/useUsersData';
import { useTranslation } from '../hooks/useTranslation';
import UserCard from './UserList/UserCard';
import EditUserModal from './UserList/EditUserModal';
import DeleteUserModal from './UserList/DeleteUserModal';
import UsersSkeleton from './UserList/UsersSkeleton';
import CreateUserForm from './UserList/CreateUserForm';

export default function UsersList() {
  const { t } = useTranslation();
  const {
    users,
    loading,
    error,
    searchQuery,
    newUser,
    editingUser,
    editForm,
    deleteConfirm,
    showCreateForm,
    toast,
    isUpdating,
    setSearchQuery,
    setNewUser,
    setEditForm,
    setDeleteConfirm,
    setShowCreateForm,
    hideToast,
    handleSearch,
    handleCreateUser,
    handleEditUser,
    handleUpdateUser,
    handleDeleteUser,
    clearError,
    closeEditModal
  } = useUsersData();

  if (loading) return <UsersSkeleton />;

  return (
    <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="ml-2 text-red-400 hover:text-red-300"
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Botón para mostrar/ocultar formulario de crear usuario */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-4">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={`flex items-center gap-3 px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm lg:text-base ${
            showCreateForm
              ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
          }`}
        >
          <Icon 
            icon={showCreateForm ? 'mdi:close' : 'mdi:account-plus'} 
            className="w-5 h-5" 
          />
          {showCreateForm ? t('config.usersList.cancelButton') : t('config.usersList.newUserButton')}
        </button>
      </div>

      {showCreateForm && (
        <CreateUserForm
          newUser={newUser}
          onUserChange={setNewUser}
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      
      <div>
        
        {users.length === 0 ? (
          <div className="text-center py-12 bg-dark-card rounded-2xl border border-dark-hover">
            <Icon icon="mdi:account-off" className="w-16 h-16 text-dark-secondary mx-auto mb-4" />
            <p className="text-dark-secondary text-lg">{t('config.usersList.emptyState.title')}</p>
            <p className="text-dark-secondary text-sm mt-2">{showCreateForm ? t('config.usersList.emptyState.subtitleWithForm') : t('config.usersList.emptyState.subtitleWithoutForm')}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {users.map((user) => (
              <UserCard 
                key={user.id}
                user={user}
                onEdit={handleEditUser}
                onDeleteConfirm={setDeleteConfirm}
              />
            ))}
          </div>
        )}
      </div>

      {editingUser && (
        <EditUserModal
          editingUser={editingUser}
          editForm={editForm}
          isUpdating={isUpdating}
          onFormChange={setEditForm}
          onSubmit={handleUpdateUser}
          onClose={closeEditModal}
        />
      )}

      {deleteConfirm && (
        <DeleteUserModal
          deleteConfirm={deleteConfirm}
          onConfirm={handleDeleteUser}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {toast && (
        <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-right duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-sm ${
            toast.type === 'success' 
              ? 'bg-green-900/80 border-green-600/30 text-green-100' 
              : toast.type === 'error'
              ? 'bg-red-900/80 border-red-600/30 text-red-100'
              : 'bg-yellow-900/80 border-yellow-600/30 text-yellow-100'
          }`}>
            <Icon 
              icon={toast.type === 'success' ? 'mdi:check-circle' : toast.type === 'error' ? 'mdi:alert-circle' : 'mdi:alert'} 
              className={`w-6 h-6 ${
                toast.type === 'success' ? 'text-green-400' : 
                toast.type === 'error' ? 'text-red-400' : 'text-yellow-400'
              }`} 
            />
            <span className="font-medium">{toast.message}</span>
            <button 
              onClick={hideToast}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <Icon icon="mdi:close" className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}