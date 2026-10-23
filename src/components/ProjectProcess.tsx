import { useId, useState } from "react";
import { Lightbulb, LayoutTemplate, Database, Workflow, Globe, ArrowRight } from "lucide-react";

const steps = [
  { name: "Ideia", Icon: Lightbulb, title: "Uma ideia com propósito", text: "Reunir minha trajetória, formações e projetos em um portfólio que eu pudesse atualizar e que tivesse minha identidade." },
  { name: "Interface", Icon: LayoutTemplate, title: "Pensar a experiência", text: "Uma interface em React com navegação por seções, adaptação ao celular e modo noturno. Cada escolha conecta a apresentação ao jeito de explorar os projetos." },
  { name: "Dados", Icon: Database, title: "Organizar a informação viva", text: "Perfil, experiências, formações, projetos e competências organizados no Supabase, com acesso de edição restrito à conta administradora." },
  { name: "Integrações", Icon: Workflow, title: "Conectar as partes", text: "A interface lê o conteúdo publicado. A área admin permite editar, enquadrar imagens e publicar as informações, conectando front-end, back-end e banco de dados." },
  { name: "Publicação", Icon: Globe, title: "Da construção ao site no ar", text: "Projeto versionado no GitHub e publicado na Vercel, com prévias para testar e revisar a experiência antes de atualizar o site principal." },
];
export function ProjectProcess() {
  const [active, setActive] = useState(0);
  const id = useId();
  return (
    <section className="project-process" aria-labelledby={`${id}-title`}>
      <div className="process-heading"><span className="eyebrow">Meu processo</span><h3 id={`${id}-title`}>Uma ideia. Todas as conexões.</h3><p>Minha primeira experiência com vibe coding, do conceito à publicação.</p></div>
      <div className="process-steps" role="group" aria-label="Explorar etapas da construção">
        {steps.map(({ name, Icon }, index) => <button key={name} aria-pressed={active === index} aria-controls={`${id}-detail`} onClick={() => setActive(index)}>
          <span className="process-number">0{index + 1}</span><Icon size={19} aria-hidden="true" /><span>{name}</span>{index < steps.length - 1 && <ArrowRight className="process-arrow" size={14} aria-hidden="true" />}
        </button>)}
      </div>
      <div className="process-detail" id={`${id}-detail`} role="status" aria-live="polite" aria-atomic="true"><strong>{steps[active].title}</strong><p>{steps[active].text}</p></div>
    </section>
  );
}
