// -------------------------------------------------------------------
// PONTO DE CONEXÃO
// -------------------------------------------------------------------

// Status	      Significado
// ATIVO	    → internet funcionando
// REDUZIDO	  → velocidade limitada por atraso a X dias
// BLOQUEADO	→ sem acesso, velocidade bloqueada por atraso Y dias
// CANCELADO	→ serviço encerrado (equipamento retirado ou contrato encerrado)

// CANCELADO pode acontecer por:
// - cliente pediu cancelamento     → retirada de equipamento
// - inadimplência por muito tempo  → retirada de equipamento
// - mudança de endereço -- validar como funciona

// Ou seja: CANCELADO = esse ponto não existe mais como serviço ativo.

// -------------------------------------------------------------------
// CLIENTE
// -------------------------------------------------------------------

// Status     Significado
// ATIVO      → cliente tem ao menos 1 ponto ATIVO
// SUSPENSO   → cliente tem todos os pontos BLOQUEADOS
// INATIVO    → cliente tem todos os pontos CANCELADOS

// -------------------------------------------------------------------
// EXEMPLO
// -------------------------------------------------------------------

// Ponto 1    Ponto 2     Status Cliente
// ATIVO      ATIVO       ATIVO
// ATIVO      REDUZIDO    ATIVO
// ATIVO      BLOQUEADO   ATIVO
// ATIVO      CANCELADO   ATIVO
// REDUZIDO   REDUZIDO    ATIVO
// REDUZIDO   BLOQUEADO   ATIVO
// REDUZIDO   CANCELADO   ATIVO
// BLOQUEADO  BLOQUEADO	  SUSPENSO
// BLOQUEADO  CANCELADO	  SUSPENSO
// CANCELADO  CANCELADO	  INATIVO
