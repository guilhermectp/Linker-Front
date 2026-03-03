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

      <!-- editar informações base e  senha do portal do cliente-->
      <!-- ativar/desativar cliente -->

      <ClientEditPersonalInformation :client-to-edit="client" />
    </div>

    <UCard variant="subtle">
      <template #header>
        <h3 class="font-semibold">Informações Pessoais</h3>
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
          <span v-else>Informações de assinatura</span>
        </h3>
        <ClientEditAddConnectionPoint />
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
                <UDropdownMenu :items="getPontoActions(ponto)">
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
import ConnectionPointAddress from "~/components/Client/Edit/ConnectionPointAddress.vue";
import ConnectionPointPlan from "~/components/Client/Edit/ConnectionPointPlan.vue";
import { STATUS_CLIENT } from "~/constants/enumClient";
import { STATUS_POINT } from "~/constants/enumConnectionPoint";
import { clientesMock } from "~/mocks/clientes";
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

const getPontoActions = (ponto: TGetPontoConexao) => [
  [
    {
      label: "Editar Plano",
      icon: "i-heroicons-pencil",
      onSelect: () => {
        const modal = overlay.create(ConnectionPointPlan);
        modal.open({
          clientToEdit: {
            pontoId: ponto.id,
            planoId: ponto.plano.id!,
            diaVencimento: ponto.diaVencimento,
            loginMK: ponto.loginMK,
          },
        });
      },
    },
    {
      label: "Editar Endereço",
      icon: "i-heroicons-map",
      onSelect: () => {
        const modal = overlay.create(ConnectionPointAddress);
        modal.open({ clientToEdit: { pontoId: ponto.id, ...ponto.endereco } });
      },
    },
  ],
  [
    {
      label: "Cancelar Ponto",
      icon: "i-heroicons-trash",
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
