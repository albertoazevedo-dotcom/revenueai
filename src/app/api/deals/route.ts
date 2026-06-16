const byMonth = [
  { month: 'Jan', ganhos: 3, perdidos: 7, aberto: 12, wonAmount: 87500 },
  { month: 'Fev', ganhos: 4, perdidos: 6, aberto: 14, wonAmount: 112000 },
  { month: 'Mar', ganhos: 5, perdidos: 8, aberto: 11, wonAmount: 145000 },
  { month: 'Abr', ganhos: 3, perdidos: 9, aberto: 15, wonAmount: 78000 },
  { month: 'Mai', ganhos: 6, perdidos: 7, aberto: 10, wonAmount: 198000 },
  { month: 'Jun', ganhos: 4, perdidos: 6, aberto: 13, wonAmount: 123000 },
  { month: 'Jul', ganhos: 5, perdidos: 8, aberto: 9, wonAmount: 165000 },
  { month: 'Ago', ganhos: 3, perdidos: 7, aberto: 14, wonAmount: 92000 },
  { month: 'Set', ganhos: 4, perdidos: 9, aberto: 11, wonAmount: 134000 },
  { month: 'Out', ganhos: 2, perdidos: 8, aberto: 16, wonAmount: 58000 },
  { month: 'Nov', ganhos: 3, perdidos: 7, aberto: 10, wonAmount: 98000 },
  { month: 'Dez', ganhos: 2, perdidos: 7, aberto: 12, wonAmount: 110000 },
];

const openDeals = [
  { id: '1', name: 'Expansão ERP - Módulo Financeiro', company: 'Grupo Votorantim', stage: 'negociacao', amount: 148000, probability: 75, closeDate: '2025-03-31' },
  { id: '2', name: 'Plataforma BI Corporativo', company: 'Itaú Unibanco S.A.', stage: 'proposta', amount: 120000, probability: 60, closeDate: '2025-02-28' },
  { id: '3', name: 'Sistema de Gestão de Frotas', company: 'JSL Logística', stage: 'demo', amount: 85000, probability: 45, closeDate: '2025-04-15' },
  { id: '4', name: 'CRM Enterprise Licenças', company: 'Natura &Co', stage: 'fechamento', amount: 95000, probability: 88, closeDate: '2025-01-31' },
  { id: '5', name: 'Automação de Marketing B2B', company: 'Embraer S.A.', stage: 'proposta', amount: 67000, probability: 55, closeDate: '2025-03-15' },
  { id: '6', name: 'Integração SAP + Salesforce', company: 'WEG Equipamentos', stage: 'negociacao', amount: 112000, probability: 70, closeDate: '2025-02-14' },
  { id: '7', name: 'Plataforma de RH Digital', company: 'Ambev Brasil', stage: 'qualificacao', amount: 43000, probability: 25, closeDate: '2025-05-30' },
  { id: '8', name: 'Segurança Cibernética Enterprise', company: 'Bradesco Seguros', stage: 'demo', amount: 78000, probability: 40, closeDate: '2025-04-01' },
  { id: '9', name: 'Data Lake & Analytics', company: 'Petrobras Distribuidora', stage: 'proposta', amount: 135000, probability: 65, closeDate: '2025-03-20' },
  { id: '10', name: 'ERP Cloud Migration', company: 'Marfrig Global Foods', stage: 'negociacao', amount: 99000, probability: 72, closeDate: '2025-02-28' },
  { id: '11', name: 'Plataforma de E-commerce B2B', company: 'Magazine Luiza Corp', stage: 'fechamento', amount: 55000, probability: 85, closeDate: '2025-01-25' },
  { id: '12', name: 'Sistema de Controle de Qualidade', company: 'Gerdau Metalúrgica', stage: 'demo', amount: 38000, probability: 35, closeDate: '2025-05-10' },
  { id: '13', name: 'BI Operacional - Linha de Produção', company: 'Braskem Petroquímica', stage: 'proposta', amount: 72000, probability: 58, closeDate: '2025-03-31' },
  { id: '14', name: 'Gestão de Contratos Digitais', company: 'Engie Brasil Energia', stage: 'qualificacao', amount: 29000, probability: 20, closeDate: '2025-06-15' },
  { id: '15', name: 'Plataforma de Treinamento Corporativo', company: 'Totvs S.A.', stage: 'negociacao', amount: 47000, probability: 68, closeDate: '2025-02-20' },
  { id: '16', name: 'Integração Marketplace + WMS', company: 'Via Varejo Multicanal', stage: 'proposta', amount: 63000, probability: 50, closeDate: '2025-04-30' },
  { id: '17', name: 'Automação de Processos RPA', company: 'Localfrio Logística', stage: 'demo', amount: 31000, probability: 30, closeDate: '2025-05-20' },
  { id: '18', name: 'Customer Success Platform', company: 'Nubank Enterprise', stage: 'fechamento', amount: 88000, probability: 90, closeDate: '2025-01-20' },
  { id: '19', name: 'Solução de Compliance Fiscal', company: 'XP Investimentos', stage: 'negociacao', amount: 74000, probability: 62, closeDate: '2025-03-10' },
  { id: '20', name: 'Portal do Fornecedor Digital', company: 'Suzano Papel e Celulose', stage: 'proposta', amount: 42000, probability: 45, closeDate: '2025-04-25' },
  { id: '21', name: 'Plataforma de Compras Eletrônicas', company: 'Cosan Combustíveis', stage: 'qualificacao', amount: 36000, probability: 15, closeDate: '2025-07-01' },
  { id: '22', name: 'Sistema de Manutenção Preditiva', company: 'Tupy Fundições', stage: 'demo', amount: 58000, probability: 38, closeDate: '2025-05-05' },
  { id: '23', name: 'Gestão de Ativos Digitais', company: 'Localiza Hertz', stage: 'negociacao', amount: 82000, probability: 76, closeDate: '2025-02-10' },
  { id: '24', name: 'Plataforma Omnichannel', company: 'Lojas Renner S.A.', stage: 'proposta', amount: 51000, probability: 52, closeDate: '2025-03-28' },
  { id: '25', name: 'Consultoria Transformação Digital', company: 'Oi Telefonia Corp', stage: 'qualificacao', amount: 24000, probability: 10, closeDate: '2025-08-15' },
  { id: '26', name: 'Analytics Preditivo de Vendas', company: 'Havaianas Internacional', stage: 'demo', amount: 45000, probability: 42, closeDate: '2025-04-18' },
  { id: '27', name: 'ERP Módulo Supply Chain', company: 'BRF Foods Global', stage: 'fechamento', amount: 103000, probability: 82, closeDate: '2025-01-30' },
];

const lossReasons = [
  { reason: 'Budget/Preço Alto', count: 28 },
  { reason: 'Perdeu para Concorrente', count: 22 },
  { reason: 'Sem necessidade no momento', count: 14 },
  { reason: 'Timing ruim', count: 11 },
  { reason: 'Falta de aprovação interna', count: 8 },
  { reason: 'Produto não atende', count: 4 },
  { reason: 'Sem resposta', count: 2 },
];

export async function GET() {
  const totalWon = byMonth.reduce((s, m) => s + m.ganhos, 0);
  const totalLost = byMonth.reduce((s, m) => s + m.perdidos, 0);
  const totalOpen = openDeals.length;
  const totalDeals = totalWon + totalLost + totalOpen;
  const wonAmount = byMonth.reduce((s, m) => s + m.wonAmount, 0);
  const conversionRate = +((totalWon / (totalWon + totalLost)) * 100).toFixed(1);

  return Response.json({
    summary: {
      totalDeals,
      won: totalWon,
      lost: totalLost,
      open: totalOpen,
      wonAmount,
      conversionRate,
    },
    byMonth,
    openDeals,
    lossReasons,
  });
}
