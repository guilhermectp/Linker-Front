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

      <div
        :class="
          client.pontos?.length > 1
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
            : 'flex-1'
        "
      >
        <UCard
          variant="subtle"
          v-for="ponto in client.pontos"
          :key="ponto.id"
          :class="[
            client.pontos?.length > 1 &&
              'cursor-pointer transition-all duration-200',
            client.pontos?.length > 1 &&
              selectedPoint === ponto.id &&
              'ring-2 ring-primary',
            client.pontos?.length > 1 &&
              'hover:light:bg-elevated hover:dark:bg-elevated/80 hover:shadow-md',
          ]"
          @click="client.pontos?.length > 1 && (selectedPoint = ponto.id)"
        >
          <template #header>
            <div class="flex justify-between gap-4 items-start">
              <div>
                <span v-if="ponto.endereco.tipoEndereco === 'URBANO'">
                  <p class="font-bold">
                    {{ ponto.endereco.rua }}, {{ ponto.endereco.numero }} -
                    {{ ponto.endereco.bairro }}
                  </p>
                  <p class="text-sm text-muted">
                    {{ ponto.endereco.complemento }}
                  </p>
                  <p class="text-sm text-muted">
                    {{ ponto.endereco.cep }} •
                    {{ ponto.endereco.cidade }}
                  </p>
                </span>
                <span v-else>
                  <p class="font-medium">
                    {{ ponto.endereco.nomeLocal }} -
                    {{ ponto.endereco.cidadeReferencia }}
                  </p>
                  <p class="text-sm text-gray-400">
                    {{ ponto.endereco.complemento }}
                  </p>
                </span>
              </div>

              <div class="flex items-center gap-3">
                <UBadge
                  :color="STATUS_POINT[ponto.status]?.color"
                  variant="subtle"
                >
                  {{ STATUS_POINT[ponto.status]?.label }}
                </UBadge>
                <UDropdownMenu :items="getPointActions(ponto)">
                  <UButton
                    icon="i-heroicons-ellipsis-vertical"
                    color="neutral"
                    variant="ghost"
                  />
                </UDropdownMenu>
              </div>
            </div>
          </template>

          <dl
            class=""
            :class="
              client.pontos?.length > 1
                ? 'grid grid-cols-1 xs:grid-cols-2 gap-4 sm:grid-cols-1 lg:grid-cols-2 '
                : 'grid sm:grid-cols-2 lg:grid-cols-4 gap-4'
            "
          >
            <div>
              <dt
                class="text-xs text-muted font-medium tracking-wide uppercase"
              >
                Plano
              </dt>
              <dd
                class="font-medium py-2 px-4 bg-muted light:bg-accented rounded"
              >
                {{ ponto.plano.nome }}
              </dd>
              <dd class="text-muted text-sm">
                ↓ {{ ponto.plano.downloadMB }}M ↑ {{ ponto.plano.uploadMB }}M
              </dd>
            </div>

            <div>
              <dt class="text-xs text-muted tracking-wide uppercase">
                Vencimento todo dia
              </dt>
              <dd
                class="font-medium py-2 px-4 bg-muted light:bg-accented rounded"
              >
                {{ ponto.diaVencimento }}
              </dd>
            </div>

            <div>
              <dt class="text-xs text-muted tracking-wide uppercase">
                Último Pagamento
              </dt>
              <dd
                class="font-medium py-2 px-4 bg-muted light:bg-accented rounded"
              >
                {{ ponto.diaUltimoPagamento || "dd/mm/yyyy" }}
              </dd>
            </div>

            <div>
              <dt class="text-xs text-muted tracking-wide uppercase">
                Login Microtik
              </dt>
              <dd
                class="font-medium py-2 px-4 bg-muted light:bg-accented rounded"
              >
                {{ ponto.loginMK }}
              </dd>
            </div>
          </dl>
        </UCard>
      </div>
    </UCard>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ClientInvoiceList />
      <ClientServiceOrderList />
    </div>
  </div>
</template>

<script setup lang="ts">
import ConnectionPoint from "~/components/Client/ConnectionPoint.vue";
import EditAccess from "~/components/Client/EditAccess.vue";
import EditAddress from "~/components/Client/EditAddress.vue";
import EditPassword from "~/components/Client/EditPassword.vue";
import EditPersonalInfo from "~/components/Client/EditPersonalInfo.vue";
import EditPlan from "~/components/Client/EditPlan.vue";
import { STATUS_CLIENT } from "~/constants/enumClient";
import {
  ENUM_STATUS_POINT,
  STATUS_POINT,
} from "~/constants/enumConnectionPoint";
import type { GetCliente } from "~/types/clients";
import type { TGetPontoConexao } from "~/types/connectionPoint";
const overlay = useOverlay();
const route = useRoute();

const id = computed(() => route.params.id);

const {
  data: client,
  status,
  error,
  refresh,
} = await useAsyncApi<GetCliente>(
  `get-client-id-${id.value}`,
  `/clientes/${id.value}`,
);

const selectedPoint = ref<string | null>(null);

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
  const modal = overlay.create(ConnectionPoint);
  modal.open({
    clientId: id.value as string,
    onRefresh: async () => {
      await refresh();
    },
  });
};

const getPointActions = (ponto: TGetPontoConexao) => {
  const actions: any[] = [];

  const mainActions = [
    {
      label: "Alterar Plano",
      icon: "lucide:wifi",
      onSelect: () => {
        const modal = overlay.create(EditPlan);
        modal.open({
          connectionPointId: ponto.id as string,
          currentPlan: {
            planoId: ponto.plano.id!,
            diaVencimento: ponto.diaVencimento,
          },
        });
      },
    },
    {
      label: "Editar Endereço",
      icon: "lucide:map-pin",
      onSelect: () => {
        const modal = overlay.create(EditAddress);
        modal.open({
          connectionPointId: ponto.id as string,
          currentAddress: ponto.endereco,
        });
      },
    },

    {
      label: "Alterar Acesso",
      icon: "lucide:lock-keyhole",
      onSelect: () => {
        const modal = overlay.create(EditAccess);
        modal.open({
          connectionPointId: ponto.id as string,
          currentLogin: ponto.loginMK,
        });
      },
    },
  ];

  if (
    ponto.status === ENUM_STATUS_POINT.REDUZIDO ||
    ponto.status === ENUM_STATUS_POINT.BLOQUEADO
  ) {
    mainActions.push({
      label: "Liberar Acesso",
      icon: "lucide:house-wifi",
      onSelect: () => {
        console.log("Liberar acesso", ponto);
      },
    });
  }

  actions.push(mainActions);

  const secondaryActions = [];

  if (ponto.status !== ENUM_STATUS_POINT.CANCELADO) {
    secondaryActions.push({
      label: "Cancelar Ponto",
      icon: "lucide:trash-2",
      onSelect: () => {
        console.log("Cancelar ponto", ponto);
      },
    });
  }

  if (ponto.status === ENUM_STATUS_POINT.CANCELADO) {
    secondaryActions.push({
      label: "Reativar Ponto",
      icon: "lucide:rotate-ccw",
      onSelect: () => {
        console.log("Reativar ponto", ponto);
      },
    });
  }

  if (secondaryActions.length) actions.push(secondaryActions);

  return actions;
};

const formatCPF = (cpf: string) => {
  if (!cpf) return "";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};
</script>
