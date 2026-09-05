<template>
  <UModal title="Ordem de Serviço" :ui="{ content: 'max-w-lg' }">
    <template #body="{ close }">
      <UForm :validate="validate" :state="state" @submit="handleSubmit(close)">
        <div class="space-y-4">
          <UFormField label="Cliente" name="cliente">
            <UISelectClient
              v-model="state.idCliente"
              placeholder="Selecione o cliente"
              class="w-full"
            />
          </UFormField>

          <UFormField>
            <UIRequestLoader v-if="isLoadingAddress" />
            <UIRequestError
              v-if="errorAddress"
              :error="errorAddress"
              @retry="getAddress"
            />
            <template v-else>
              <UFormField label="Endereço" />
              <div v-for="address in dataAddress">
                <UCard
                  :key="address.id"
                  :class="[
                    address.pontos?.length > 1 &&
                      'cursor-pointer transition-all duration-200',
                    address.pontos?.length > 1 &&
                      state.idPontoConexao === address.id &&
                      'ring-2 ring-primary',
                    address.pontos?.length > 1 &&
                      'hover:light:bg-elevated hover:dark:bg-elevated/80 hover:shadow-md',
                  ]"
                  @click="
                    address.pontos?.length > 1 &&
                    (state.idPontoConexao = address.id)
                  "
                >
                  <span v-if="address.endereco.tipoEndereco === 'URBANO'">
                    <p class="font-bold">
                      {{ address.endereco.rua }},
                      {{ address.endereco.numero }} -
                      {{ address.endereco.bairro }}
                    </p>
                    <p class="text-sm text-muted">
                      {{ address.endereco.complemento }}
                    </p>
                    <p class="text-sm text-muted">
                      {{ address.endereco.cep }} •
                      {{ address.endereco.cidade }}
                    </p>
                  </span>
                  <span v-else>
                    <p class="font-medium">
                      {{ address.endereco.nomeLocal }} -
                      {{ address.endereco.cidadeReferencia }}
                    </p>
                    <p class="text-sm text-gray-400">
                      {{ address.endereco.complemento }}
                    </p>
                  </span>
                </UCard>
              </div>
            </template>
          </UFormField>

          <template v-if="!errorAddress">
            <UFormField label="Tipo" name="tipo">
              <USelectMenu
                v-model="state.tipoServico"
                :items="supportTypeItems"
                label-key="label"
                value-key="value"
                placeholder="Tipo de suporte"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Descrição (opcional)" name="observacao">
              <UTextarea
                v-model="state.observacao"
                placeholder="Detalhe o motivo do atendimento"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Data agendada" name="data">
              <UCalendar v-model="state.dataAgendada" :min-value="minDate" />
            </UFormField>

            <USeparator />

            <div class="w-full flex justify-between items-center gap-4">
              <UButton
                label="Cancelar"
                variant="ghost"
                color="neutral"
                @click="close"
              />
              <UButton label="Criar" type="submit" />
            </div>
          </template>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormError } from "@nuxt/ui";
import type {
  FormOrdemServico,
  PostOrdemServico,
  TServiceOrderType,
} from "~/types/serviceOrder";
import { getLocalTimeZone, today } from "@internationalized/date";
import { connectionPointService } from "~/services/connectionPoint";
import type { IGetPontoConexaoCliente } from "~/types/connectionPoint";
import { serviceService } from "~/services/service";
const emit = defineEmits(["refresh"]);

const supportTypeItems: { label: string; value: TServiceOrderType }[] = [
  // { label: "Instalação", value: "INSTALACAO" }, // deve ser gerado automaticamente pelo sistema ao cadastrar novo cliente ou novo ponto de conexão
  { label: "Suporte", value: "SUPORTE" },
  { label: "Troca de endereço", value: "TROCA_ENDERECO" },
  { label: "Cancelamento", value: "CANCELAMENTO" },
];

const minDate = today(getLocalTimeZone());

const state = shallowReactive<FormOrdemServico>({
  idCliente: "",
  idPontoConexao: "",
  tipoServico: undefined,
  observacao: "",
  dataAgendada: undefined,
});

type Schema = typeof state;

const validate = (state: Partial<Schema>): FormError[] => {
  const errors = [];

  if (!state.idCliente)
    errors.push({ name: "cliente", message: "Obrigatório." });

  if (!state.tipoServico) errors.push({ name: "tipo", message: "Obrigatório" });

  if (!state.observacao)
    errors.push({ name: "observacao", message: "Obrigatório" });

  if (!state.dataAgendada)
    errors.push({ name: "data", message: "Obrigatório" });

  return errors;
};

const isLoadingAddress = ref<boolean>(false);
const dataAddress = ref<any>([]);
const errorAddress = ref<any>(null);
const isLoadingSubmit = ref<boolean>(false);

watch(
  () => state.idCliente,
  (newValue) => {
    if (newValue) getAddress();
  },
);

const getAddress = async () => {
  try {
    isLoadingAddress.value = true;
    dataAddress.value = [];
    errorAddress.value = null;

    const res = (await connectionPointService.getByClientId(
      state.idCliente,
    )) as IGetPontoConexaoCliente;

    if (res && res.pontos.length > 0) {
      dataAddress.value = res.pontos;
      console.log(dataAddress.value);
      state.idPontoConexao = res.pontos[0]!.id as string;
    }
  } catch (error) {
    errorAddress.value = error;
  } finally {
    isLoadingAddress.value = false;
  }
};

const handleSubmit = async (close: () => void) => {
  const body: PostOrdemServico = {
    ...state,
    dataAgendada: dateValueToIso(state.dataAgendada),
  };

  try {
    isLoadingSubmit.value = true;
    await serviceService.create(body);
    Toast.success("Ordem de Serviço gerado com sucesso.");
    emit("refresh");
    close();
  } catch (error) {
    Toast.error(error);
  } finally {
    isLoadingSubmit.value = false;
  }
};
</script>

<style scoped></style>
