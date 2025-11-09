import { useState, useEffect } from 'react';
import { useToast } from './useToast';

interface User {
  id: number;
  name: string;
  email?: string;
  username: string;
  role: string;
  created_at: string;
}

interface NewUser {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

interface EditUser {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

interface DeleteConfirm {
  userId: number;
  username: string;
}

// Helper para obtener headers de autenticación con JWT (fuera del hook)
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export function useUsersData() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'user'
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditUser>({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'user'
  });

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    console.log('🔍 UsersList: Iniciando fetchUsers...');
    try {
      setLoading(true);
      console.log('🔍 UsersList: Haciendo fetch a /api/users');
      const response = await fetch('/api/users', {
        headers: getAuthHeaders()
      });
      console.log('🔍 UsersList: Response status:', response.status);
      if (!response.ok) throw new Error('Error al cargar usuarios');
      const data = await response.json();
      console.log('🔍 UsersList: Datos recibidos:', data);
      const sortedUsers = data.sort((a: User, b: User) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      setUsers(sortedUsers);
    } catch (err) {
      console.error('🔍 UsersList: Error en fetchUsers:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error en la búsqueda');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.name.trim() || !newUser.username.trim() || !newUser.password.trim()) {
      setError('Nombre, username y contraseña son requeridos');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNewUser({ name: '', email: '', username: '', password: '', role: 'user' });
        fetchUsers();
        setError(null);
        showToast('Usuario creado correctamente', 'success');
        setTimeout(() => hideToast(), 3000);
      } else {
        setError(result.message);
        showToast(result.message, 'error');
        setTimeout(() => hideToast(), 3000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear usuario';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setTimeout(() => hideToast(), 3000);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email || '',
      username: user.username,
      password: '',
      role: user.role
    });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser || !editForm.name.trim() || !editForm.username.trim()) {
      setError('Nombre y username son requeridos');
      return;
    }

    setIsUpdating(true);

    try {
      const updateData = {
        name: editForm.name,
        email: editForm.email,
        username: editForm.username,
        role: editForm.role,
        ...(editForm.password.trim() && { password: editForm.password })
      };

      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Check if the updated user is the current logged-in user
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          const currentUserData = JSON.parse(currentUser);
          if (currentUserData.id === editingUser.id) {
            // Fetch updated user data from database to ensure data integrity
            try {
              const userResponse = await fetch(`/api/users/${editingUser.id}`, {
                headers: getAuthHeaders()
              });

              if (userResponse.ok) {
                const updatedUser = await userResponse.json();
                // Update localStorage with verified data from database
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Dispatch event to notify other components
                window.dispatchEvent(new Event('userUpdated'));
              }
            } catch (err) {
              console.error('Error fetching updated user data:', err);
            }
          }
        }

        setEditingUser(null);
        setEditForm({ name: '', email: '', username: '', password: '', role: 'user' });
        fetchUsers();
        setError(null);
        showToast('Usuario actualizado correctamente', 'success');
        setTimeout(() => hideToast(), 3000);
      } else {
        setError(result.message);
        showToast(result.message, 'error');
        setTimeout(() => hideToast(), 3000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar usuario';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setTimeout(() => hideToast(), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirm) return;

    // Guardar el username antes de limpiar deleteConfirm
    const deletedUsername = deleteConfirm.username;

    try {
      const response = await fetch(`/api/users/${deleteConfirm.userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Cerrar modal primero
        setDeleteConfirm(null);
        
        // Limpiar errores
        setError(null);
        
        // Actualizar lista de usuarios
        fetchUsers();
        
        // Mostrar toast de éxito
        showToast(`Usuario "${deletedUsername}" eliminado correctamente`, 'success');
        
        // Ocultar toast después de 3 segundos
        setTimeout(() => hideToast(), 3000);
      } else {
        setError(result.message);
        showToast(result.message, 'error');
        setTimeout(() => hideToast(), 3000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setTimeout(() => hideToast(), 3000);
    }
  };

  const clearError = () => setError(null);

  const closeEditModal = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', username: '', password: '', role: 'user' });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return {
    users: filteredUsers,
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
  };
}