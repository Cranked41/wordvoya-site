// Gizlilik politikası ve kullanım şartları: Brezilya Portekizcesi çevirisi (kaynak: Privacy.tsx / Terms.tsx İngilizce).
// JSX'te satır sonu ile etiket arasındaki boşluk düşer: metinle bağlantıyı aynı satırda tut.
import { DocPage, Mail } from '../../Layout';
import { PATHS } from '../../site';

export function Privacy() {
  return (
    <DocPage
      lang="pt"
      page="privacy"
      title="Política de Privacidade"
      updated="30 de setembro de 2026"
      description="O Wordvoya não exige conta e os dados do seu jogo ficam no seu dispositivo. Os anúncios são exibidos pelo Google AdMob e as compras são feitas pelo Google Play."
    >
      <p className="note">
        Esta é uma tradução fornecida por conveniência; se houver divergência em relação à <a href={PATHS.en.privacy}>versão em inglês</a>, prevalece a versão em inglês.
      </p>
      <p>
        Esta política explica quais dados são tratados quando você usa o app Android <strong>Wordvoya: Jogo de palavras</strong> (<code>com.cranked.wordvoya</code>) e este site.
      </p>
      <p className="lead">
        <strong>Em resumo:</strong> o Wordvoya não exige conta e não envia dados aos nossos servidores; os dados do seu
        jogo ficam no seu dispositivo. O app exibe anúncios do Google AdMob, e o Google pode usar o ID de publicidade do
        seu dispositivo e algumas informações técnicas para exibi-los. A compra de “Remover anúncios” é feita pelo
        Google Play.
      </p>

      <h2>Dados que coletamos</h2>
      <ul>
        <li>
          <strong>Sem conta:</strong> O app não pede que você se cadastre nem faça login e não recebe o seu nome, o seu
          endereço de e-mail nem qualquer outro identificador.
        </li>
        <li>
          <strong>Dados do jogo no seu dispositivo:</strong> O progresso nos níveis, as palavras encontradas, a sequência
          de dias e a meta diária, os diamantes e as configurações são armazenados somente no seu dispositivo e não são
          enviados a nós.
        </li>
        <li>
          <strong>Anúncios (Google AdMob):</strong> Para exibir e medir anúncios e para prevenir fraudes, o Google pode
          tratar o ID de publicidade do seu dispositivo, o endereço IP (localização aproximada), informações sobre o
          dispositivo e o app e as suas interações com os anúncios. Esses dados vão diretamente para o Google; nós não
          temos acesso a eles.
        </li>
        <li>
          <strong>Compras:</strong> Os pacotes de diamantes e a remoção de anúncios são comprados pelo Google Play
          Billing. Nunca temos acesso aos seus dados de pagamento (número do cartão etc.); o app só fica sabendo, pelo
          Google Play, o que foi comprado e armazena essa informação no seu dispositivo (incluindo o token de compra,
          para que a mesma compra não seja contada duas vezes).
        </li>
        <li>
          <strong>Ranking (Google Play Games, opcional):</strong> Seus pontos se acumulam no seu dispositivo. Se você
          entrar com o Google Play Games, seus pontos totais e semanais, o nível que você alcançou, o número de palavras
          que você encontrou e o tempo que você levou para concluir o seu último nível são enviados ao Google junto com o
          nome do seu perfil do Play Games e exibidos para outros jogadores no ranking. Se você não entrar, nada disso é
          enviado. Você pode controlar quem vê o seu perfil, e excluir os dados do seu jogo, nas configurações do Play
          Games.
        </li>
      </ul>

      <h2>Suas escolhas de anúncios</h2>
      <ul>
        <li>
          <strong>Espaço Econômico Europeu, Reino Unido e Suíça:</strong> Antes de qualquer anúncio ser exibido, aparece
          o formulário de consentimento do Google e você pode permitir ou recusar anúncios personalizados. Você pode
          alterar a sua escolha depois, no app, em <em>Configurações &gt; Loja e anúncios &gt; Opções de privacidade de anúncios</em>.
        </li>
        <li>
          <strong>ID de publicidade:</strong> Você pode redefinir ou excluir o seu ID de publicidade nas configurações
          do dispositivo (Google &gt; Anúncios).
        </li>
        <li>
          <strong>Jogo sem anúncios:</strong> A compra de “Remover anúncios” ou de “Sem anúncios + 500 diamantes” remove
          os anúncios entre os níveis. Os anúncios com recompensa para tempo extra ou uma vida são sempre opcionais.
        </li>
      </ul>

      <h2>Como os dados são usados</h2>
      <p>
        Os dados no seu dispositivo são usados somente para fazer o jogo funcionar: para lembrar o seu nível atual e as
        palavras que você encontrou e para contar a sua sequência de dias e a meta diária. Eles nunca são enviados a nós
        nem a terceiros e nunca são vendidos. Os dados de anúncios são tratados pelo Google para as finalidades descritas
        acima.
      </p>

      <h2>Serviços de terceiros</h2>
      <ul>
        <li>
          <strong>Google AdMob</strong> (anúncios): consulte <a href="https://policies.google.com/technologies/partner-sites?hl=pt-BR">como o Google usa dados de apps de parceiros</a> e a <a href="https://policies.google.com/privacy?hl=pt-BR">política de privacidade</a> do Google.
        </li>
        <li>
          <strong>Google Play</strong> (distribuição e Billing): aplica-se a política de privacidade do Google.
        </li>
        <li>
          <strong>Backup do Android:</strong> Se o backup do Android estiver ativado, o sistema pode incluir os dados do
          seu jogo no backup da sua Conta do Google e restaurá-los em um novo dispositivo. Esse backup é gerenciado pelo
          Google; nós não temos acesso a ele.
        </li>
      </ul>

      <h2>Este site</h2>
      <p>
        Este site não usa cookies e não carrega recursos de terceiros (fontes, ferramentas de análise ou anúncios). Nosso
        servidor pode manter, por um curto período, registros de acesso padrão (endereço IP, informações do navegador,
        página solicitada, horário) por motivos de segurança e solução de problemas; eles não são usados para nenhuma
        outra finalidade.
      </p>

      <h2>Retenção e exclusão de dados</h2>
      <p>
        Os dados do seu jogo ficam no seu dispositivo. Para excluí-los, desinstale o app ou use <em>Configurações &gt; Dados &gt; Zerar progresso</em> no app. Não mantemos nenhuma conta nem registro de jogo sobre você em nossos servidores. Os dados tratados pelo Google
        para anúncios estão sujeitos às políticas do Google; você pode gerenciá-los na <a href="https://myadcenter.google.com/">Minha Central de Anúncios</a>.
      </p>

      <h2>Privacidade de crianças</h2>
      <p>
        O app é destinado ao público em geral e não é direcionado a crianças menores de 13 anos. Não coletamos
        intencionalmente dados pessoais de crianças menores de 13 anos.
      </p>

      <h2>Alterações</h2>
      <p>
        Quando esta política é alterada, a nova versão é publicada nesta página e a data de “última atualização” é
        modificada. Se um novo recurso que trate dados for adicionado ao app, esta página será atualizada antes do
        lançamento desse recurso.
      </p>

      <h2>Contato</h2>
      <p>
        Em caso de dúvidas: <Mail />
      </p>
    </DocPage>
  );
}

export function Terms() {
  return (
    <DocPage
      lang="pt"
      page="terms"
      title="Termos de Uso"
      updated="1º de outubro de 2026"
      description="Termos de uso do app Wordvoya — Jogo de palavras."
    >
      <p className="note">
        Esta é uma tradução fornecida por conveniência; se houver divergência em relação à <a href={PATHS.en.terms}>versão em inglês</a>, prevalece a versão em inglês.
      </p>
      <p>
        Ao baixar ou usar o app <strong>Wordvoya: Jogo de palavras</strong>, você concorda com os termos a seguir.
      </p>

      <h2>Licença</h2>
      <p>
        O app é fornecido a você sob uma licença limitada e intransferível, para uso pessoal e não comercial. Você não
        pode copiar, modificar, fazer engenharia reversa nem redistribuir o app. O conteúdo de palavras com licença
        aberta descrito abaixo está excluído dessa restrição.
      </p>

      <h2>Conteúdo de palavras e fontes</h2>
      <ul>
        <li>
          Os significados das palavras são adaptados do trabalho dos colaboradores do <a href="https://www.wiktionary.org/">Wikcionário</a>: o Wikcionário próprio de cada idioma dos quebra-cabeças e o Wikcionário em inglês, principalmente por meio da extração do <a href="https://kaikki.org/">kaikki.org</a>.
        </li>
        <li>
          As frequências das palavras vêm das listas <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (OpenSubtitles) e <a href="https://github.com/rspeer/wordfreq">wordfreq</a>.
        </li>
        <li>
          As listas de palavras e os pacotes de níveis derivados dessas fontes são fornecidos sob a licença <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt">CC BY-SA 4.0</a>. O código do app, o design e o nome Wordvoya não são abrangidos por essa licença.
        </li>
        <li>
          Os significados foram revisados um a um, mas não há garantia de que estejam completos ou livres de erros. O app
          tem fins de entretenimento e não substitui um dicionário oficial. Se você encontrar uma palavra errada,
          avise-nos.
        </li>
      </ul>

      <h2>Diamantes</h2>
      <p>
        Os diamantes são itens virtuais usados somente no jogo, para dicas e para tempo extra nos níveis com tempo
        limite. Você os obtém jogando (recompensas por palavras bônus; concluir um nível rende pontos, não diamantes) ou
        comprando-os pelo Google Play; os anúncios não dão diamantes. Eles não têm valor monetário, não podem ser
        trocados por dinheiro, não são reembolsáveis (exceto quando a lei exigir de outra forma e sem prejuízo das
        políticas de reembolso do Google Play) e não podem ser transferidos a outra pessoa.
      </p>
      <p>
        Os diamantes são armazenados somente no seu dispositivo; como não há conta, eles não podem ser transferidos para
        outro dispositivo. Zerar o progresso mantém os seus diamantes, mas desinstalar o app ou limpar os dados dele
        exclui todos os diamantes, inclusive os comprados, e eles não podem ser restaurados.
      </p>

      <h2>Anúncios</h2>
      <p>
        O app é gratuito e mantido por anúncios do Google AdMob: um anúncio em tela cheia pode ser exibido entre alguns
        níveis, e assistir a um anúncio com recompensa para ganhar tempo extra ou uma vida é sempre opcional. Os
        anunciantes e o Google são responsáveis pelo conteúdo dos anúncios. Os sites e apps que você acessa por meio de
        um anúncio são regidos por seus próprios termos.
      </p>

      <h2>Compras</h2>
      <p>
        Todas as compras são feitas na <em>Loja</em> do app pelo Google Play; pagamento, reembolsos e cobrança estão
        sujeitos aos termos do Google Play.
      </p>
      <ul>
        <li>
          <strong>Os pacotes de diamantes</strong> são consumíveis: os diamantes são adicionados ao seu saldo
          imediatamente e se esgotam à medida que você os gasta. Como os diamantes são armazenados no seu dispositivo,
          eles não são restaurados após a desinstalação do app (veja Diamantes).
        </li>
        <li>
          <strong>“Remover anúncios”</strong> e <strong>“Sem anúncios + 500 diamantes”</strong> são compras únicas que
          removem os anúncios entre os níveis. Os anúncios com recompensa opcionais continuam disponíveis para quem
          quiser tempo extra ou uma vida. A remoção dos anúncios está vinculada à sua Conta do Google e, após reinstalar o app ou em um novo dispositivo, você pode recuperá-la em <em>Loja &gt; Restaurar compras</em> (os 500 diamantes do pacote são concedidos uma única vez).
        </li>
      </ul>

      <h2>Disponibilidade</h2>
      <p>
        Não garantimos que o app funcione sem interrupções ou erros. Recursos, níveis e conteúdo de palavras podem ser
        adicionados, alterados ou removidos sem aviso prévio.
      </p>

      <h2>Limitação de responsabilidade</h2>
      <p>
        O app é fornecido “no estado em que se encontra”. Na medida permitida pela lei aplicável, o desenvolvedor não é
        responsável por danos indiretos decorrentes do uso do app.
      </p>

      <h2>Privacidade</h2>
      <p>
        O app não exige conta e os dados do seu jogo ficam no seu dispositivo; consulte a <a href={PATHS.pt.privacy}>Política de Privacidade</a> para mais detalhes, inclusive os dados que o Google trata para anúncios.
      </p>

      <h2>Alterações</h2>
      <p>
        Quando estes termos mudam, a nova versão é publicada nesta página. Continuar a usar o app após uma atualização
        significa que você aceita os novos termos.
      </p>

      <h2>Contato</h2>
      <p>
        Para dúvidas e para informar uma palavra errada: <Mail />
      </p>
    </DocPage>
  );
}
