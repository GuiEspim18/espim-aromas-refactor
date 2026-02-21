import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminPedidos() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "paid" | "cancelled"
  >("all");

  const utils = trpc.useUtils();

  const { data: orders, isLoading } = trpc.orders.list.useQuery();

  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      utils.orders.list.invalidate();
    },
  });

  const handleStatusChange = async (
    orderId: string,
    newStatus: "pending" | "paid" | "cancelled"
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: orderId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do pedido.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendente",
      paid: "Pago",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  const filteredOrders =
    orders?.filter((order) => {
      if (statusFilter === "all") return true;
      return order.status === statusFilter;
    }) ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Pedidos</h2>
          <p className="text-gray-600 mt-1">
            Gerencie todos os pedidos da sua loja
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todos ({orders?.length || 0})
          </button>

          {(["pending", "paid", "cancelled"] as const).map((status) => {
            const count =
              orders?.filter((o) => o.status === status).length || 0;

            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {getStatusLabel(status)} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === order.id ? null : order.id
                    )
                  }
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900">
                      Pedido #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {order.customerName} • {order.customerEmail}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        R$ {parseFloat(order.totalAmount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.createdAt
                          ? new Date(
                              order.createdAt as any
                            ).toLocaleDateString("pt-BR")
                          : "-"}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>

                    {expandedId === order.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </button>

                {/* Details */}
                {expandedId === order.id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">
                        Informações do Cliente
                      </h4>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Nome</p>
                          <p className="font-semibold">
                            {order.customerName}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600">Email</p>
                          <p className="font-semibold">
                            {order.customerEmail}
                          </p>
                        </div>

                        {order.customerPhone && (
                          <div>
                            <p className="text-gray-600">Telefone</p>
                            <p className="font-semibold">
                              {order.customerPhone}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">
                        Endereço
                      </h4>

                      <p className="text-sm">
                        {order.addressStreet},{" "}
                        {order.addressNumber}
                        {order.addressComplement &&
                          ` - ${order.addressComplement}`}
                      </p>
                      <p className="text-sm">
                        {order.addressCity} - {order.addressState}
                      </p>
                      <p className="text-sm">
                        CEP: {order.addressZip}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">
                        Atualizar Status
                      </h4>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as
                              | "pending"
                              | "paid"
                              | "cancelled"
                          )
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="pending">
                          Pendente
                        </option>
                        <option value="paid">Pago</option>
                        <option value="cancelled">
                          Cancelado
                        </option>
                      </select>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg">
              Nenhum pedido encontrado.
            </p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}