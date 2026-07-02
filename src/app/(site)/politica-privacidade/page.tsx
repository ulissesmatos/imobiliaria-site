import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Política de Privacidade",
};

export default async function PrivacyPolicyPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const siteName = settings?.siteName ?? "Sua Imobiliária";

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-6 py-12 text-muted-foreground">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Política de Privacidade
      </h1>

      <p>
        A {siteName} coleta os dados enviados por você (nome, e-mail,
        telefone e mensagem) exclusivamente através do formulário de contato
        do site, com a finalidade de responder à sua solicitação e, quando
        aplicável, relacioná-la ao imóvel de seu interesse.
      </p>

      <p>
        Esses dados não são vendidos, compartilhados ou usados para
        finalidade diferente do atendimento comercial solicitado, e ficam
        armazenados apenas pelo tempo necessário para esse atendimento.
      </p>

      <p>
        Você pode solicitar a atualização ou exclusão dos seus dados a
        qualquer momento entrando em contato pelos canais informados na
        página de Contato.
      </p>

      {settings?.contactEmail && (
        <p>
          Dúvidas sobre esta política podem ser enviadas para{" "}
          {settings.contactEmail}.
        </p>
      )}
    </div>
  );
}
