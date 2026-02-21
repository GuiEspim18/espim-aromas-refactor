import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminBanners() {
  // --- State ---
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    link: '',
  });

  // --- TRPC Hooks ---
  const bannersQuery = trpc.banners.list.useQuery();
  const createMutation = trpc.banners.create.useMutation();
  const updateMutation = trpc.banners.update.useMutation();
  const deleteMutation = trpc.banners.delete.useMutation();

  const banners = bannersQuery.data ?? [];
  const isLoading = bannersQuery.isLoading;

  // --- Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      // Reset
      setFormData({ title: '', imageUrl: '', link: '' });
      setEditingId(null);
      setShowForm(false);

      bannersQuery.refetch();
    } catch (err) {
      console.error('Erro ao salvar banner:', err);
      alert('Erro ao salvar banner. Tente novamente.');
    }
  };

  const handleEdit = (banner: typeof banners[number]) => {
    setFormData({
      title: banner.title ?? '',
      imageUrl: banner.imageUrl ?? '',
      link: banner.link ?? '',
    });

    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este banner?')) return;

    try {
      await deleteMutation.mutateAsync({ id });
      bannersQuery.refetch();
    } catch (err) {
      console.error('Erro ao remover banner:', err);
      alert('Erro ao remover banner. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', imageUrl: '', link: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Banners</h2>
            <p className="text-gray-600 mt-1">
              Gerencie os banners promocionais da página inicial
            </p>
          </div>

          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Banner
            </Button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Editar Banner' : 'Novo Banner'}
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
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
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
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link (opcional)
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Banner'
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

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : banners.length > 0 ? (
          <div className="space-y-4">
            {banners.map((banner) => (
              <Card
                key={banner.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {banner.title}
                    </h3>

                    {banner.link && (
                      <p className="text-sm text-gray-600 mt-1">
                        Link: {banner.link}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg">
              Nenhum banner cadastrado ainda.
            </p>

            <Button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeiro Banner
            </Button>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}