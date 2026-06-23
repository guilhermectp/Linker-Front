<template>
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
            <UBadge :color="STATUS_POINT[ponto.status]?.color" variant="subtle">
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
          <dt class="text-xs text-muted font-medium tracking-wide uppercase">
            Plano
          </dt>
          <dd class="font-medium py-2 px-4 bg-muted light:bg-accented rounded">
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
          <dd class="font-medium py-2 px-4 bg-muted light:bg-accented rounded">
            {{ ponto.diaVencimento }}
          </dd>
        </div>

        <div>
          <dt class="text-xs text-muted tracking-wide uppercase">
            Último Pagamento
          </dt>
          <dd class="font-medium py-2 px-4 bg-muted light:bg-accented rounded">
            {{ ponto.diaUltimoPagamento || "dd/mm/yyyy" }}
          </dd>
        </div>

        <div>
          <dt class="text-xs text-muted tracking-wide uppercase">
            Login Microtik
          </dt>
          <dd class="font-medium py-2 px-4 bg-muted light:bg-accented rounded">
            {{ ponto.loginMK }}
          </dd>
        </div>
      </dl>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import {
  ENUM_STATUS_POINT,
  STATUS_POINT,
} from "~/constants/enumConnectionPoint";
import { connectionPointService } from "~/services/connectionPoint";
import type { GetCliente } from "~/types/clients";
import type { TGetPontoConexao } from "~/types/connectionPoint";
import EditPlan from "~/components/Client/Connection/EditPlan.vue";
import EditAccess from "~/components/Client/Connection/EditAccess.vue";
import EditAddress from "~/components/Client/Connection/EditAddress.vue";
import UIConfirmStatus from "~/components/UI/ConfirmStatus.vue";

const overlay = useOverlay();

const prosp = defineProps({
  client: { type: Object as PropType<GetCliente>, required: true },
});

const selectedPoint = ref<string | null>(null);

// alterar plano e data vencimento - ok
// alterar loginMK e senha MK - ok
// alterar endereço - ok
// cancelar ponto - ok
// reativar ponto - AINDA NAO
// liberar acesso - AINDA NAO

const isLoadingDelete = ref<boolean>(false);

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
        const modal = overlay.create(UIConfirmStatus);
        modal.open({
          itemType: "point",
          onConfirm: async () => {
            try {
              isLoadingDelete.value = true;

              await connectionPointService.delete(ponto.id);
              Toast.success("Plano cancelado");
            } catch (error) {
              Toast.error(error);
            } finally {
              isLoadingDelete.value = false;
            }
          },
        });
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
</script>

<style scoped></style>
