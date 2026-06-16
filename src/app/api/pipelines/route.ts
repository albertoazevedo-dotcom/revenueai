export async function GET() {
  return Response.json([
    {
      id: 'default',
      label: 'Pipeline Principal',
      stages: [
        { id: 'qualificacao', label: 'Qualificação' },
        { id: 'demo', label: 'Demo Agendada' },
        { id: 'proposta', label: 'Proposta Enviada' },
        { id: 'negociacao', label: 'Em Negociação' },
        { id: 'fechamento', label: 'Fechamento' },
        { id: 'ganho', label: 'Ganho' },
        { id: 'perdido', label: 'Perdido' },
      ],
    },
  ]);
}
