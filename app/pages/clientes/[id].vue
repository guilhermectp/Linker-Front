<template>
  <template v-if="status === 'pending'">
    <UIRequestLoader message="Buscando dados do cliente..." />
  </template>

  <template v-if="error">
    <UIRequestError :error="error" @retry="refresh" />
  </template>

  <div v-if="client" class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <UButton
        icon="i-heroicons-arrow-left"
        color="neutral"
        variant="ghost"
        to="/clientes"
      />
      <UBadge
        :color="client.status === 'ATIVO' ? 'primary' : 'neutral'"
        size="xl"
      >
        {{ STATUS_CLIENT[client.status]?.label }}
      </UBadge>
    </div>

    <UCard variant="subtle">
      <template #header>
        <div class="flex justify-between items-center gap-4">
          <h3 class="font-semibold">Informações do Cliente</h3>

          <div class="flex gap-4 items-center">
            <UButton
              label="Alterar senha central do cliente"
              variant="ghost"
              icon="lucide:lock"
              @click="openEditPassword"
            />
            <USeparator orientation="vertical" class="h-8" />
            <UButton
              icon="lucide:user-pen"
              variant="ghost"
              label="Editar Cliente"
              @click="openEditPersonalInfo"
            />
          </div>
        </div>
      </template>
      <dl class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div>
          <dt class="text-sm text-gray-500">Nome</dt>
          <dd class="font-medium">{{ client.nome }}</dd>
        </div>
        <div>
          <dt class="text-sm text-gray-500">CPF</dt>
          <dd class="font-medium">{{ formatCPF(client.cpf) }}</dd>
        </div>
        <div>
          <dt class="text-sm text-gray-500">Email</dt>
          <dd class="font-medium">{{ client.email }}</dd>
        </div>
        <div>
          <dt class="text-sm text-gray-500">Telefone</dt>
          <dd class="font-medium">{{ client.telefone }}</dd>
        </div>
      </dl>
    </UCard>

    <UCard variant="subtle">
      <template #header>
        <div class="flex justify-between items-center gap-4">
          <h3 class="font-semibold">
            <span v-if="client.pontos?.length > 1">
              Pontos de Conexão ({{ client.pontos?.length }})
            </span>
            <span v-else>Plano e Endereço</span>
          </h3>

          <UButton
            icon="i-heroicons-plus"
            variant="ghost"
            label=" Adicionar Ponto"
            @click="openAddConnectionPoint"
          />
        </div>
      </template>

      <ClientConnection :client="client" />
    </UCard>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ClientInvoiceList />
      <SupportList />
    </div>
  </div>
</template>

<script setup lang="ts">
import AddConnectionPoint from "~/components/Client/AddConnectionPoint.vue";
import EditPassword from "~/components/Client/EditPassword.vue";
import EditPersonalInfo from "~/components/Client/EditPersonalInfo.vue";
import { STATUS_CLIENT } from "~/constants/enumClient";
import type { Cliente } from "~/types/clients";
const overlay = useOverlay();
const route = useRoute();

const id = computed(() => route.params.id);

const {
  data: client,
  status,
  error,
  refresh,
} = await useAsyncApi<Cliente>(
  `get-client-id-${id.value}`,
  `/clientes/${id.value}`,
);

const openEditPassword = () => {
  if (!client.value) return;
  const modal = overlay.create(EditPassword);
  modal.open({
    clientId: client.value!.id,
  });
};

const openEditPersonalInfo = () => {
  if (!client.value) return;
  const modal = overlay.create(EditPersonalInfo);
  modal.open({
    clientId: client.value.id,
    clientToEdit: client.value,
    onRefresh: async () => {
      await refresh();
    },
  });
};

const openAddConnectionPoint = () => {
  if (!client.value) return;
  const modal = overlay.create(AddConnectionPoint);
  modal.open({
    clientId: id.value as string,
    onRefresh: async () => {
      await refresh();
    },
  });
};

const formatCPF = (cpf: string) => {
  if (!cpf) return "";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};
</script>
