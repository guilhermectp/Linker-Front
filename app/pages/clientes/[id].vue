<template>
  <div class="space-y-6">
    <!-- Header com ações -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UButton
          icon="i-heroicons-arrow-left"
          color="neutral"
          variant="ghost"
          to="/clientes"
        />
        <h1 class="text-2xl font-medium">{{ client.nome }}</h1>
        <UBadge
          :color="client.status === 'ATIVO' ? 'primary' : 'neutral'"
          size="lg"
        >
          {{ STATUS_CLIENT[client.status]?.label }}
        </UBadge>
      </div>

      <UButton
        :label="
          client.status === 'ATIVO' ? 'Desativar Cliente' : 'Ativar Cliente'
        "
        variant="soft"
        :color="client.status === 'ATIVO' ? 'error' : 'primary'"
        @click="openDisableClient"
      />
    </div>

    <!--

    1 - editar informações pessoais
    2 - editar senha central do cliente
    3 - ativar/desativar cliente // desativa os pontos ou nao permite enquanto tiver ponto ativo?

    4 - adicionar ponto de conexão
    5 - editar ponto de conexão (plano e endereço) || reusar componente de adicionar ponto de conexão (?)
    6 - cancelar ponto de conexão
    7 - liberar internet de ponto de conexão // se reduzido ou bloqueado

    8 - visualizar suportes
    9 - criar suporte
    10 - imprimir suporte


    11 - visualizar boletos
    12 - gerar boletos
    13 - imprimir boletos
    -->
    <UCard variant="subtle">
      <template #header>
        <div class="flex justify-between items-center gap-4">
          <h3 class="font-semibold">Informações Pessoais</h3>

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

    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">
          <span v-if="client.pontos?.length > 1">
            Pontos de Conexão ({{ client.pontos?.length }})
          </span>
          <span v-else>Plano e Endereço</span>
        </h3>
        <UButton
          icon="i-heroicons-plus"
          label=" Adicionar Ponto"
          @click="openAddConnectionPoint"
        />
      </div>

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
                {{ ponto.diaUltimoPagamento }}
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

      <UTabs v-model="selectedTab" :items="tabs">
        <template #boletos>
          <div class="py-6">
            <p class="text-gray-500">
              {{ selectedPoint }}
              Listagem de boletos em desenvolvimento...
            </p>
          </div>
        </template>

        <template #suporte>
          <div class="py-6">
            <p class="text-gray-500">
              {{ selectedPoint }}
              Tickets de suporte em desenvolvimento...
            </p>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import ConnectionPoint from "~/components/Client/ConnectionPoint.vue";
import EditPassword from "~/components/Client/EditPassword.vue";
import EditPersonalInfo from "~/components/Client/EditPersonalInfo.vue";
import { STATUS_CLIENT } from "~/constants/enumClient";
import { STATUS_POINT } from "~/constants/enumConnectionPoint";
import { clientesMock } from "~/mocks/clientes";
import type { TClientUpdateFullForm } from "~/schema/client.update";
import type { TGetCliente } from "~/types/clients";
import type { TGetPontoConexao } from "~/types/connectionPoint";

const overlay = useOverlay();
const route = useRoute();
const id = route.params.id;

const client = ref<TGetCliente>({} as TGetCliente);
const selectedPoint = ref<string | null>(null);
const selectedTab = ref("boletos");

const tabs = [
  {
    label: "Boletos",
    value: "boletos",
    slot: "boletos",
    icon: "i-heroicons-currency-dollar",
  },
  {
    label: "Suporte",
    value: "suporte",
    slot: "suporte",
    icon: "i-heroicons-chat-bubble-left-right",
  },
];

const openDisableClient = () => {
  // const modal = overlay.create(ConnectionPointPlan);
  // modal.open({
  //   clientToEdit: {
  //     pontoId: ponto.id,
  //     planoId: ponto.plano.id!,
  //     diaVencimento: ponto.diaVencimento,
  //     loginMK: ponto.loginMK,
  //   },
  // });
};

const openEditPassword = () => {
  const modal = overlay.create(EditPassword);
  modal.open({
    clientId: client.value.id,
  });
};

const openEditPersonalInfo = () => {
  const modal = overlay.create(EditPersonalInfo);
  modal.open({
    clientToEdit: client.value,
    onUpdated: () => {
      // refresh()
    },
  });
};

const openAddConnectionPoint = () => {
  const modal = overlay.create(ConnectionPoint);
  modal.open();
};

const getFormattedPoint = (point: TGetPontoConexao): TClientUpdateFullForm => {
  const { plano, ...rest } = point;
  return {
    ponto: {
      planoId: plano.id!,
      ...rest,
    },
  };
};

const getPointActions = (ponto: TGetPontoConexao) => [
  [
    {
      label: "Editar Ponto",
      icon: "lucide:pencil",
      onSelect: () => {
        const modal = overlay.create(ConnectionPoint);
        modal.open({
          pointToEdit: getFormattedPoint(ponto),
        });
      },
    },
    {
      label: "Liberar Acesso", // somente se reduzido ou bloqueado
      icon: "lucide:house-wifi",
      onSelect: () => {},
    },
  ],
  [
    {
      label: "Cancelar Ponto",
      icon: "lucide:trash-2",
      onSelect: () => console.log("Cancelar ponto", ponto),
    },
  ],
];

const formatCPF = (cpf: string) => {
  if (!cpf) return "";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

onBeforeMount(() => {
  const foundClient = clientesMock.find((c) => c.id === id);
  if (foundClient) {
    client.value = foundClient;

    if (foundClient.pontos && foundClient.pontos.length > 0) {
      selectedPoint.value = foundClient.pontos[0]!.id;
    }
  }
});
</script>
