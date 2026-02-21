import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Users } from 'lucide-react';

export default function AdminUsuarios() {
  const [showInfo, setShowInfo] = useState(true);

  // Mock users data - in a real app, this would come from the database
  const mockUsers = [
    {
      id: 1,
      name: 'Administrador Principal',
      email: 'admin@espimaromas.com',
      role: 'admin',
      createdAt: '2026-01-15',
      lastSignedIn: '2026-02-20',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Usuários Administradores</h2>
          <p className="text-gray-600 mt-1">
            Gerencie os usuários com acesso à área administrativa
          </p>
        </div>

        {/* Info Box */}
        {showInfo && (
          <Card className="p-6 bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2">Como adicionar novos administradores</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Para adicionar um novo usuário como administrador, você precisa:
                </p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>O usuário deve fazer login na plataforma primeiro</li>
                  <li>Acessar a página de gerenciamento de usuários</li>
                  <li>Atualizar o papel do usuário para "admin" no banco de dados</li>
                </ol>
                <p className="text-xs text-blue-700 mt-3">
                  Alternativamente, você pode usar o painel de banco de dados para atualizar diretamente a coluna "role" na tabela "users".
                </p>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold mt-3 underline"
                >
                  Fechar
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Current Admins */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Administradores Atuais
          </h3>

          <div className="space-y-4">
            {mockUsers.map((user) => (
              <Card key={user.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{user.name}</h4>
                    <p className="text-gray-600 text-sm mb-3">{user.email}</p>
                    <div className="flex gap-4 text-xs text-gray-600">
                      <span>
                        <span className="font-semibold">Papel:</span> Administrador
                      </span>
                      <span>
                        <span className="font-semibold">Cadastrado em:</span> {user.createdAt}
                      </span>
                      <span>
                        <span className="font-semibold">Último acesso:</span> {user.lastSignedIn}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold">
                      Ativo
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <Card className="p-6 bg-gray-50">
          <h3 className="font-bold text-gray-900 mb-4">Instruções para Gerenciar Administradores</h3>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">1. Adicionar um novo administrador</h4>
              <p className="text-gray-600">
                O usuário deve fazer login na plataforma. Após o login, você pode promovê-lo a administrador através do banco de dados.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">2. Remover um administrador</h4>
              <p className="text-gray-600">
                Altere o papel do usuário de "admin" para "user" no banco de dados. O usuário continuará podendo fazer login, mas não terá acesso à área administrativa.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Acessar o banco de dados</h4>
              <p className="text-gray-600">
                Use a seção "Database" no painel de gerenciamento para acessar diretamente a tabela "users" e fazer alterações no campo "role".
              </p>
            </div>
          </div>
        </Card>

        {/* Security Notice */}
        <Card className="p-6 bg-yellow-50 border border-yellow-200">
          <h3 className="font-bold text-yellow-900 mb-2">⚠️ Aviso de Segurança</h3>
          <p className="text-sm text-yellow-800">
            Tenha cuidado ao adicionar novos administradores. Apenas usuários de confiança devem ter acesso à área administrativa, pois podem modificar produtos, pedidos e outras informações importantes da loja.
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
}
