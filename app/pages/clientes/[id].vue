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
        <h1 class="text-2xl font-bold">{{ client.nome }}</h1>
        <UBadge
          :color="client.status === 'ATIVO' ? 'primary' : 'neutral'"
          size="lg"
        >
          {{ STATUS_CLIENT[client.status]?.label }}
        </UBadge>
      </div>

      <!-- editar informações base -->
      <!-- editar senha do portal do cliente -->
      <!-- ativar/desativar cliente -->

      <UButton icon="i-heroicons-pencil" color="neutral">
        Editar Cliente
      </UButton>
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
        <UButton icon="i-heroicons-plus" label="Adicionar Ponto" />
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
          <div class="flex items-start justify-between gap-8">
            <div class="flex-1">
              <div
                :class="
                  client.pontos?.length > 1
                    ? 'grid grid-cols-1 lg:grid-cols-2 gap-4'
                    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4'
                "
              >
                <div>
                  <p class="text-sm text-gray-500">Endereço</p>
                  <span v-if="ponto.endereco.tipoEndereco === 'URBANO'">
                    <p class="font-medium">
                      {{ ponto.endereco.rua }}, {{ ponto.endereco.bairro }}
                    </p>
                    <p class="text-sm text-gray-400">
                      {{ ponto.endereco.complemento }}
                    </p>
                    <p class="text-sm text-gray-400">
                      {{ ponto.endereco.cidade }} - CEP:
                      {{ ponto.endereco.cep }}
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

                <div :class="{ 'xl:mx-auto': client.pontos?.length === 1 }">
                  <p class="text-sm text-gray-500">Vencimento</p>
                  <p class="font-medium">Dia {{ ponto.diaVencimento }}</p>
                </div>

                <div :class="{ 'xl:mx-auto': client.pontos?.length === 1 }">
                  <p class="text-sm text-gray-500">Plano</p>
                  <p class="font-medium">
                    {{ ponto.plano.nome }}
                  </p>
                  <p class="text-sm text-gray-400">
                    Down/Up: {{ ponto.plano.downloadMB }}M/{{
                      ponto.plano.uploadMB
                    }}M
                  </p>
                </div>

                <div :class="{ 'xl:mx-auto': client.pontos?.length === 1 }">
                  <p class="text-sm text-gray-500">Login Microtik</p>
                  <p class="font-medium">
                    {{ ponto.loginMK }}
                  </p>
                </div>

                <div :class="{ 'xl:mx-auto': client.pontos?.length === 1 }">
                  <p class="text-sm text-gray-500">Situação</p>
                  <UBadge
                    :color="STATUS_POINT[ponto.status]?.color"
                    variant="subtle"
                    size="lg"
                    class="mt-1.5"
                  >
                    {{ STATUS_POINT[ponto.status]?.label }}
                  </UBadge>
                </div>
              </div>
            </div>

            <UDropdownMenu :items="getPontoActions(ponto)">
              <UButton
                icon="i-heroicons-ellipsis-vertical"
                color="neutral"
                variant="ghost"
              />
            </UDropdownMenu>
          </div>
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
import { STATUS_CLIENT } from "~/constants/enumClient";
import { STATUS_POINT } from "~/constants/enumConnectionPoint";
import { clientesMock } from "~/mocks/clientes";
import type { TClient } from "~/types/clients";

const route = useRoute();
const id = route.params.id;
const client = ref<TClient>({} as TClient);
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

const getPontoActions = (ponto: any) => [
  [
    {
      label: "Editar Plano",
      icon: "i-heroicons-pencil",
      click: () => console.log("Editar plano", ponto),
    },
    {
      label: "Editar Endereço",
      icon: "i-heroicons-map",
      click: () => console.log("Editar endereço", ponto),
    },
  ],
  [
    {
      label: "Cancelar Ponto",
      icon: "i-heroicons-trash",
      click: () => console.log("Cancelar ponto", ponto),
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
