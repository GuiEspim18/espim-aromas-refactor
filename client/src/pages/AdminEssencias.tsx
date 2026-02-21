import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Plus, Edit2, Trash2, X } from 'lucide-react';

type Essence = {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;
};

export default function AdminEssencias() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  const { data: essences, isLoading } = trpc.essences.list.useQuery();
  const createMutation = trpc.essences.create.useMutation();
  const updateMutation = trpc.essences.update.useMutation();
  const deleteMutation = trpc.essences.delete.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }

      setFormData({ name: '', description: '', imageUrl: '' });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar essência:', error);
      alert('Erro ao salvar essência. Tente novamente.');
    }
  };

  const handleEdit = (essence: Essence) => {
    setFormData({
      name: essence.name,
      description: essence.description || '',
      imageUrl: essence.imageUrl || '',
    });
    setEditingId(essence.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover esta essência?')) {
      try {
        await deleteMutation.mutateAsync({ id });
      } catch (error) {
        console.error('Erro ao remover essência:', error);
        alert('Erro ao remover essência. Tente novamente.');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', imageUrl: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Essências</h2>
            <p className="text-gray-600 mt-1">
              Gerencie as essências disponíveis para seus produtos
            </p>
          </div>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nova Essência
            </Button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Editar Essência' : 'Nova Essência'}
              </h3>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Essência *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Ex: Lavanda, Rosa, Limão"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Descrição da essência..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Essência'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Essences List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : essences && essences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {essences.map((essence) => (
              <Card key={essence.id} className="p-6 hover:shadow-lg transition-shadow">
                {/* Essence Image */}
                <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
                  {essence.imageUrl ? (
                    <img
                      src={essence.imageUrl}
                      alt={essence.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-xs text-purple-700 text-center px-2">
                      Sem Imagem
                    </span>
                  )}
                </div>

                {/* Essence Info */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {essence.name}
                </h3>
                {essence.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {essence.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(essence)}
                    className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(essence.id)}
                    className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remover
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg">
              Nenhuma essência cadastrada ainda.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeira Essência
            </Button>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
