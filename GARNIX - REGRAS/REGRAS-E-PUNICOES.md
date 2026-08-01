# Regras da Rede Garnix e tabela de punições

> Documento interno de regras e dosimetria, escrito para casar 1:1 com o **garnix-punishments**.
> A versão pública para o jogador é o `index.html` desta mesma pasta.
> Última atualização: **01/08/2026** · Versão: **3.0 (proposta)**

---

## Princípio da dosimetria

**Só o aviso escala. Todo o resto tem punição única.**

| | Como funciona |
|---|---|
| **Aviso** | Único tipo com progressão. Os avisos acumulam e disparam sozinhos a escada do §1.2. |
| **Mute, ban e ban de IP** | Punição **fixa e definitiva** por artigo. A mesma infração recebe **sempre a mesma punição**, na primeira vez e em todas as seguintes. |

Consequências que valem para todo o documento:

1. **A duração publicada não é "a da primeira vez"** — é a punição do artigo, calibrada como sanção definitiva.
2. **Quando um fato admite dois desfechos, eles são artigos separados** (nick da conta × apelido do `/nick`), cada um com sua punição fixa.
3. **Um artigo, um motivo, uma duração.** É o que o plugin suporta nativamente e o que mantém os menus dentro do limite de slots.
4. A gravidade só progride pela escada de avisos ou pela **mudança de artigo** — provocar vira ofender, e quem entra em outra conta durante a punição passa a responder pelo §7.5.

---

## 0. Disposições gerais

**0.1 — Jurisdição.** Valem no **Lobby**, no **Rankup**, no chat global e local, em `/tell`, nomes de item, placas, nomes de plot, nomes de clã, nomes de leilão e no **Discord oficial**. Infração grave em um canal produz punição no outro.

**0.2 — Responsabilidade pela conta.** A punição recai sobre a **conta**, não sobre quem estava no teclado. "Meu irmão usou" e "emprestei para um amigo" **não** são defesa. Exceção única: invasão comprovada com ticket aberto **antes** da infração (§7.6).

**0.3 — Desconhecimento não isenta.**

**0.4 — VIP não é imune.** Rank, tag ou compra não anulam nem reduzem punição, e banimento não gera reembolso.

**0.5 — Regras mudam.** Vale a versão publicada na data do fato.

**0.6 — Filtros automáticos não são perdão.** Anti-divulgação, anti-capslock e filtro de palavras são **camada de mitigação, não garantia**. O que foi dito ou feito é punível mesmo que o filtro tenha bloqueado, trocado ou deixado passar. O log do filtro serve como prova, nunca como atenuante.

**0.7 — Boa-fé.** Conduta claramente abusiva e não prevista é tratada pelo §8.5, por analogia e com aprovação de cargo sênior.

**0.8 — O que o servidor libera, o jogador pode usar.** Nenhum comando ou recurso disponível ao jogador é infração por si só. `/tell` e os demais existem para serem usados; a regra pune o que se faz com eles, nunca o simples fato de usá-los. **Não invente infração a partir de função liberada** — se algo não deveria ser possível durante uma punição, isso se resolve na configuração, não no artigo.

---

## 1. Como a punição funciona

### 1.1 Tipos

| Tipo | Efeito | Durações usadas | Escala? |
|---|---|---|:--:|
| **Aviso** | Nenhuma restrição direta. Alimenta a escada. | expira em `7d` | **Sim** |
| **Mute temporário** | Bloqueia o chat. | `6h` · `12h` · `1d` | Não |
| **Mute** | Bloqueia o chat. Sanção terminal, restrita a cargo sênior. | permanente | Não |
| **Ban temporário** | Bloqueia o login em toda a rede. | `3d` · `7d` · `15d` · `30d` | Não |
| **Ban** | Bloqueia o login em toda a rede. | permanente | Não |
| **Ban de IP** | Bloqueia **todas as contas** do endereço. | permanente | Não |

### 1.2 A escada de avisos

| Estágio | Avisos | Punição |
|:--:|:--:|---|
| 1 | 5 | Mute **5m** |
| 2 | 3 | Mute **30m** |
| 3 | 2 | Ban **1d** |
| 4 | 1 | **Ban permanente** |

1. **Os avisos somam entre si.** O contador é único, independentemente do motivo.
2. **Cada aviso expira em 7 dias**, mas o **estágio não regride**. Quem chegou ao estágio 4 recebe ban permanente no próximo aviso.
3. A punição do estágio é aplicada pelo sistema com o motivo "Reincidência de avisos" e é revisável.

### 1.3 Código público

Toda punição gera um **código** (ex.: `A1B-2C3`), exibido na tela de ban e no aviso de mute. **É a única chave de atendimento**: ticket sem código não é analisado.

> **O jogador só tem o código.** `/checkid` é comando de **staff** — não pode ser divulgado como se fosse recurso do jogador. O texto público orienta a anotar ou printar o código antes de fechar a tela.

### 1.4 Prova

Punição pelo menu exige **URL de prova**. Padrão mínimo em §9.1. A punição gerada pela escada não carrega URL — a prova são os avisos que a originaram, visíveis no `/check`.

### 1.5 Sanções acessórias

Confisco, rollback, devolução, remoção de construção e remoção de apelido **não são punições do plugin** — são medidas administrativas registradas **no ticket**, com responsável identificado.

### 1.6 Regras de aplicação para a equipe

- **Nunca aplique aviso em jogador já mutado ou banido.** A punição do estágio falha contra a punição ativa e o jogador **perde os avisos e sobe de estágio sem receber sanção**. Aplique a punição direta do artigo.
- **Aplique avisos pelo `/punir`**, não pelo `/warn` — o comando grava motivo genérico e a punição perde o vínculo com o artigo.
- **Não se soma punição da mesma família.** Mute sobre mute e ban sobre ban são recusados; ban temporário sobre mute ativo funciona.
- **Reincidência não muda a punição.** Mesmo motivo, mesma duração.

---

## 2. Chat e convivência

| Art. | Infração | Exemplo | Punição |
|:--:|---|---|---|
| **2.1** | Flood | `vendo cristal` 4× em 20 segundos | **Aviso** |
| **2.2** | Spam de caracteres | `asdasdasdasdasd` · `!!!!!!!!!!!!!!` | **Aviso** |
| **2.3** | Insistir no caps lock | Reescrever `V E N D O  A G O R A` após o filtro já ter corrigido duas vezes | **Aviso** |
| **2.4** | Poluição visual | Mensagem feita para ocupar a tela e atrapalhar a leitura do chat | **Aviso** |
| **2.5** | Usar o canal errado | Conversa privada de 20 mensagens no global | **Aviso** |
| **2.6** | Provocação e toxicidade | Continuar debochando da mesma pessoa depois de ela pedir para parar | **Aviso** |
| **2.7** | Assunto inadequado | Debate político ou religioso inflamado após pedido da equipe para encerrar | **Aviso** |
| **2.8** | Ofensa a jogador | `vc é um lixo de jogador, morre` | **Mute 6h** |
| **2.9** | Flood combinado | Combinar com outros para encher o global (pune quem organiza) | **Mute 12h** |
| **2.10** | Informação falsa | `digita /hub e ganha VIP grátis` · `o servidor vai fechar amanhã` | **Mute 12h** |
| **2.11** | Burlar o filtro de palavras | `ma&0caco` ou `m a c a c o` para a palavra passar pelo filtro | **Ban 3d** |

### Detalhamento

**§2.1 Flood.** Três ou mais mensagens **iguais ou de mesmo sentido** em menos de **30 segundos**, no mesmo canal.
- É infração: o mesmo anúncio 3× em 15 segundos; revezar global e local para repetir sem esperar.
- Não é infração: reanunciar **1 vez a cada 5 minutos**; três mensagens que continuam a mesma frase.

**§2.2 a §2.6 — os números.**
- **Spam:** sequência sem sentido ou repetição a partir de ~15 caracteres.
- **Caps:** o filtro corrige sozinho, então gritar uma vez não é punição. É infração insistir ou burlar.
- **Poluição visual:** mais de 3 linhas coladas de uma vez, ou formatação que deixa o chat ilegível.
- **Provocação:** alfinetada isolada **não é infração**. Vira infração ao insistir na mesma pessoa depois do pedido para parar — em regra, a partir da terceira mensagem dirigida a ela.

**§2.6 × §2.8 × §3.1 — onde está a linha.**

| Situação | Artigo | Punição |
|---|---|---|
| `esse preço tá ridículo` | nenhum | — |
| `vc joga muito mal, desiste` — dito uma vez | nenhum | — |
| A mesma provocação repetida depois do pedido para parar | §2.6 | Aviso |
| `vc é um lixo, seu bosta` | §2.8 | Mute 6h |
| `vc é um lixo, seu [xingamento racial/homofóbico]` | **§3.1** | **Ban de IP** |

Carga discriminatória **sempre prevalece** sobre ofensa comum, inclusive velada. Na dúvida entre §2.8 e §3.1, encaminhe para cargo sênior.

**§2.11 Burlar o filtro.** É infração escrever a palavra bloqueada de forma torta — código de cor, símbolo ou letra separada — só para passar pelo filtro. **Não é infração** usar `/tell` ou qualquer comando liberado durante o mute (§0.8). Entrar em outra conta é §7.5.

---

## 3. Conduta grave

> **Toda esta seção é ban de IP nos artigos 3.1 a 3.6.** São as condutas que não voltam em nenhuma conta.

| Art. | Infração | Exemplo | Punição |
|:--:|---|---|---|
| **3.1** | Discurso de ódio e discriminação | Xingamento racial, homofóbico, xenofóbico ou capacitista · símbolo de ódio em construção | **Ban de IP** |
| **3.2** | Assédio e conteúdo sexual | Insistir em conteúdo sexual com quem recusou · qualquer conteúdo sexual envolvendo menor | **Ban de IP** |
| **3.3** | Apologia | Incentivar suicídio ou automutilação · exaltar terrorismo · incentivar uso de drogas | **Ban de IP** |
| **3.4** | Ameaça virtual | `vou derrubar sua internet` · `vou invadir sua conta` | **Ban de IP** |
| **3.5** | Ameaça à pessoa ou ao servidor | `sei onde vc mora` · ameaça de agressão · ameaçar derrubar o servidor | **Ban de IP** |
| **3.6** | Expor dados pessoais | Publicar endereço, telefone, CPF, foto ou rede social sem autorização | **Ban de IP** |
| **3.7** | Perseguição | Seguir o jogador para atrapalhar depois de ele pedir para parar | **Ban 15d** |
| **3.8** | Chantagem | `me paga 50k ou eu te denuncio` | **Ban 30d** |
| **3.9** | Construção ou placa ofensiva | Conteúdo sexual no plot · placa com xingamento | **Aviso** + remoção |
| **3.10** | Atrapalhar de propósito | Bloquear NPC, loja ou entrada da mina · sabotar evento oficial | **Aviso** + correção |
| **3.11** | Ajudar quem infringiu | Receber e revender itens sabendo que vieram de dupe ou golpe | **Ban 15d** + confisco |

### Detalhamento

**§3.2 —** conteúdo sexual envolvendo menor é ban de IP e **não aceita revisão**.

**§3.4 × §3.5 —** §3.4 é ameaça ao **acesso** (internet, conta, dispositivo); §3.5 é ameaça à **pessoa** ou ao **servidor**. Ambos são ban de IP; a distinção existe para o registro. **Não é ameaça** a provocação dentro da ficção do jogo.

**§3.7 —** só há perseguição depois de pedido explícito para parar ou aviso da equipe.

**§3.11 —** só há infração com **ciência da origem**: preço muito abaixo do mercado, quantidade impossível para o rank, ou aviso público prévio da equipe.

---

## 4. Divulgação e links

| Art. | Infração | Exemplo | Punição |
|:--:|---|---|---|
| **4.1** | Divulgação com IP, link ou convite | `entra em jogar.outroservidor.com` · convite de Discord de concorrente | **Ban 30d** |
| **4.2** | Citação de outro servidor sem endereço | `no servidor X isso é melhor` | **Mute 12h** |
| **4.3** | Divulgação de conteúdo próprio | Canal, live ou loja pessoal sem autorização | **Aviso** + remoção |
| **4.4** | Link malicioso, phishing ou IP-logger | Link que rouba conta, coleta IP ou instala arquivo | **Ban permanente** · **+ ban de IP** se comprometeu contas |

**§4.1 — onde vale.** Qualquer canal: global, local, `/tell`, placa, livro, nome de item, plot, clã, leilão, nick e Discord oficial. Conta letra espaçada, "ponto com" escrito por extenso, cor no meio do domínio e nome de concorrente sem link. **Conta mesmo que a mensagem tenha sido bloqueada** — o log serve de prova.

---

## 5. Economia e patrimônio

| Art. | Infração | Exemplo | Punição |
|:--:|---|---|---|
| **5.1** | Golpe | Combinar `pago depois`, receber o item e não pagar | **Ban 30d** + devolução |
| **5.2** | Tentativa de golpe | Tentar receber primeiro e ser pego antes de entregar | **Ban 7d** |
| **5.3** | Abuso de confiança | Receber permissão no plot e esvaziar o armazém · saquear baú de clã | **Ban 30d** + devolução |
| **5.4** | Anúncio enganoso | Anunciar item, quantidade ou preço diferente do que vai entregar | **Ban 7d** + confisco |
| **5.5** | Oferecer venda por dinheiro real | Anunciar coins, itens ou plot por PIX ou cartão | **Ban 15d** |
| **5.6** | Venda por dinheiro real concluída | Transação comprovada, com pagamento e entrega | **Ban permanente** + confisco |
| **5.7** | Vender, trocar ou alugar conta | Anunciar a conta VIP à venda · usar conta alugada | **Ban 30d** |
| **5.8** | Estorno de compra | Abrir disputa depois de receber o produto | **Ban permanente** + remoção dos benefícios |
| **5.9** | Causar lag de propósito | Estrutura ou acúmulo de entidades feito para travar o servidor | **Ban 30d** + remoção |
| **5.10** | Esconder patrimônio na apuração | Passar coins e itens para outra pessoa ao perceber que será punido | **Ban 30d** + confisco |
| **5.11** | Manipular o mercado | Transferências em cadeia para esconder origem de coins de dupe · compras cruzadas para inflar o TOP | **Ban 30d** + confisco |
| **5.12** | Mentir no suporte | Ticket alegando perda por bug só para ganhar reposição | **Ban 15d** |

### Detalhamento

**§5.1 — o que a equipe reverte.** Só com **vídeo de tela cheia, contínuo**, mostrando os dois inventários, os nicks e a negociação inteira. Não reverte acordo de palavra, print recortado, empréstimo, aposta por fora nem "sociedade". A rede **não medeia** empréstimo, juros e sociedade — mas calote comprovado em vídeo continua sendo golpe.

**§5.5 × §5.6 — a linha.** Proibida qualquer troca envolvendo dinheiro real, PIX, cartão, gift card, conta de outro jogo ou serviço externo. **Liberado** serviço pago em coins dentro do jogo; calote nele é §5.1. A punição alcança **as duas partes**.

**§5.8 Chargeback.** Punição permanente, **revogável** se a disputa terminar em favor da Rede Garnix — e essa revogação **não tem prazo**, corre fora da janela do §9.3.

**§5.9 Lag de propósito.** Depende de **intenção** e de **impacto medido**. Farm grande e estrutura pesada não são infração; é infração a montagem que só existe para derrubar o desempenho, com a queda correlacionada àquela construção e registrada na prova.

---

## 6. Trapaça

| Art. | Infração | Exemplo | Punição |
|:--:|---|---|---|
| **6.1** | Hack / client alterado | Fly, speed, nuker, auto-mine, scaffold, freecam, chest ESP, timer | **Ban permanente** |
| **6.2** | Assumir o hack antes da prova | Admitir o uso antes de ser confrontado com a evidência | **Ban 30d** |
| **6.3** | Mod fora da lista permitida | Minimapa com entidades · schematica com printer · auto-tool | **Ban 7d** |
| **6.4** | Macro e automação | Programa, script ou peso executando ações por você · conta rodando sozinha | **Ban permanente** + confisco |
| **6.5** | Abusar de bug ou duplicar itens | Repetir falha para ganhar vantagem em vez de reportar · criar valor do nada | **Ban de IP** + rollback |
| **6.6** | Atrapalhar a apuração | Apagar prova · destruir a estrutura apurada · deslogar na verificação | **Ban 30d** |
| **6.7** | Ataque ao servidor | Enxurrada de conexões · crash por pacote, item ou livro · exploração de falha da rede | **Ban de IP** |

### Detalhamento

**§6.4 — o que conta como macro.** É infração qualquer programa, script, dispositivo ou peso que **execute a ação no lugar do jogador** — clicar, minerar, andar, vender ou manter a conta produzindo sozinha. **Bot é macro.** Não é infração clicar rápido com a mão, **deixar a conta parada em AFK**, nem usar função que o próprio servidor oferece.

**§6.5 — bug e duplicação são o mesmo artigo.** Tanto faz se a falha deu vantagem ou fez o item existir duas vezes. **Reportar isenta:** quem avisa na hora por ticket, sem usar e sem repassar, não é punido e pode ser recompensado. Usar e depois avisar não isenta; omitir agrava.

**§6.6 — como a rede apura.** Por **log e histórico do servidor**. A Rede Garnix **não exige** screenshare, acesso remoto nem inspeção do computador do jogador — isso precisa estar dito no texto público, senão o artigo vira porta para abuso.

---

## 7. Conta e identidade

| Art. | Infração | Exemplo | Punição |
|:--:|---|---|---|
| **7.1** | Skin ou capa ofensiva | Skin com conteúdo sexual ou símbolo de ódio | **Aviso** + 24h para trocar |
| **7.2** | Nick da conta ofensivo | O nome com que entra na rede tem xingamento | **Ban 7d** corretivo |
| **7.3** | Apelido ofensivo no `/nick` | Xingamento, termo obsceno ou divulgação no apelido | **Aviso** + remoção do apelido |
| **7.4** | Se passar por staff para golpe | Dizer que é da equipe para dar ordem, intimidar ou pedir itens | **Ban permanente** |
| **7.5** | Fugir da punição em outra conta | Entrar em qualquer outra conta durante mute ou ban ativo | **Ban permanente** na alt · reinicia o prazo |
| **7.6** | Invadir conta de outro | Usar senha de terceiro · phishing | **Ban de IP** |

### Detalhamento

**§7.1 × §7.2 × §7.3 — por que as três diferem.**
- **Apelido do `/nick` (§7.3):** a equipe remove na hora e o jogador segue jogando. Por isso é só aviso.
- **Skin (§7.1):** sai quando o jogador troca. Aviso com prazo de 24h.
- **Nick da conta (§7.2):** a equipe não tem como trocar por ele. O bloqueio é **corretivo** — volta ao trocar o nick, via ticket.

Em qualquer um dos três, conteúdo discriminatório, sexual ou apologia vai direto para §3.1, §3.2 ou §3.3 — e aí é ban de IP.

**§7.5 —** vale para **qualquer** punição ativa, do mute de 5 minutos ao ban permanente. A conta usada leva permanente e a principal **reinicia o prazo**.

> **Atenção técnica:** reiniciar o prazo exige **revogar e reaplicar**, o que gera **código novo**. Informe o novo código ao jogador, senão o ticket dele morre.

**§7.5 — identidade da rede.** A identidade é o **nick** (rede offline-mode). Trocar de nick cria identidade nova; o único elo entre contas é o **IP**, via `/dupeip` e aba de alts do `/check`. O texto público não promete que "a punição segue a pessoa".

---

## 8. Denúncias e suporte

| Art. | Infração | Exemplo | Punição |
|:--:|---|---|---|
| **8.1** | Desacato à equipe | Xingar o staff que aplicou a punição · ofender quem atende o ticket | **Mute 1d** |
| **8.2** | Denúncia mentirosa | Acusar de hack sabendo que é mentira | **Aviso** |
| **8.3** | Prova falsificada contra outro | Editar print ou vídeo para acusar alguém | **Ban permanente** |
| **8.4** | Prova falsificada na própria revisão | Editar prova para derrubar a própria punição | **Ban 30d** + perde a revisão daquele código |
| **8.5** | Má-fé não prevista | Conduta claramente abusiva que nenhum artigo cobre | **Ban 15d**, com aprovação sênior registrada |

**§8.1 Desacato ≠ reclamação.** `demorou 3 dias pra responder`, `esse preço tá abusivo` e `discordo da punição` **não** são infração. É infração o ataque pessoal e a difamação com dados pessoais. **Ninguém é punido por criticar a administração.**

**§8.5 Cláusula aberta.** Só quando **nenhum** artigo cobre o fato, com o aprovador registrado no ticket. Conduta que se repete é sinal de que **falta artigo**, não de que a pena é baixa.

---

## 9. Prova, denúncia e revisão

### 9.1 Padrão de prova

**Print e vídeo precisam ser sempre de tela cheia** — sem recorte, sem janela isolada, sem zoom só na mensagem.

| Família | Prova mínima |
|---|---|
| Chat e conduta | Print de **tela cheia**, com nick, mensagem, data e horário visíveis |
| Economia | **Vídeo de tela cheia**, sem corte, com os dois inventários, os nicks e a negociação inteira |
| Trapaça | Vídeo de tela cheia ou registro do próprio servidor |
| Construção e patrimônio | Print de tela cheia com coordenadas visíveis |

**Recusado de plano:** qualquer print ou vídeo que não seja de tela cheia, recorte só da mensagem, janela do jogo isolada, foto de celular apontada para o monitor, imagem editada, vídeo cortado no momento decisivo, print de conversa fora dos canais oficiais sem contexto.

### 9.2 Denúncia

Canal único: **ticket no Discord**, categoria *Denúncias*. `/reportar` no jogo mostra o passo a passo. Sem prova, nada é analisado; prova forjada é punida (§8.3 e §8.4).

### 9.3 Revisão

- Somente por **ticket com o código**. Sem código, não é analisado.
- **Prazo: 5 dias corridos.** Depois, só com fato ou prova nova.
- **Não são revisáveis** punições de até **1 hora** — exclui os mutes de 5 e 30 minutos da escada.
- **É revisável** a punição automática da escada, e o jogador pode contestar **um aviso** individual.
- **A prova não é entregue ao punido**, para preservar quem denunciou. Ele tem direito ao artigo, à data, ao tipo e à duração.
- Exceção de prazo: revogação por chargeback resolvido em favor da rede (§5.8).

### 9.4 Reincidência

**Não há agravamento por reincidência fora dos avisos.** Mesma infração, mesma punição, mesma duração. O histórico do `/check` serve de contexto, não para elevar a pena.

### 9.5 Contenção do ban de IP

Usado em dois grupos, e só neles:

- **Conduta grave:** §3.1 a §3.6.
- **Ataque à integridade da rede:** §6.5 (bug/dupe), §6.7 (ataque ao servidor) e §7.6 (invasão de conta).
- **Como acessório:** §4.4 quando o link chegou a comprometer contas de terceiros.

Limitações técnicas que a equipe precisa conhecer:
- Atinge apenas o **último IP conhecido**; quem trocou de IP não é alcançado.
- Falha se o alvo nunca teve IP registrado.
- É recusado por inteiro se houver conta **isenta** online no mesmo IP.
- Atinge **todas as contas** do endereço. Quem for atingido por engano não tem código — aceitar contestação **por nick**.
- **`/perdoar` remove todos os bans de IP** ligados ao jogador. Nunca use em conta coberta por ban de IP.

---

## 10. Código de conduta da equipe

1. **A equipe responde pelas mesmas regras** e, além da punição do artigo, **perde o cargo**.
2. **Punição sem prova anexada é falta disciplinar.** O bypass existe para emergência, não para pular a prova.
3. **Conflito de interesse é vedado** — não punir rival de plot, sócio, cliente ou parte de negociação própria.
4. **Punição silenciosa** é para casos que não devem ser divulgados, não para esconder erro.
5. **Isenção não é privilégio.** Conta isenta online derruba o ban de IP inteiro do endereço.
6. **Revogação e edição são auditadas.** Editar a duração preserva o código; revogar e reaplicar gera código novo e exige avisar o jogador.
7. **Console é sempre silencioso e não registra artigo.** Use o menu sempre que houver artigo aplicável.
8. **`/checkid` é ferramenta interna.** Não oriente jogador a usá-lo — ele só tem o código.

---

## Anexo A — Mapa técnico regra → reason

> **Não aplicado.** Referência de configuração; nada foi alterado no `garnix-punishments`.

Cada artigo vira **exatamente um motivo**. Todo `id` é único em toda a pasta `reasons/` (o plugin indexa num mapa global). A duração é fixa por motivo, o que coincide com o modelo de punição única.

### Ocupação dos menus

| Arquivo | Motivos | Folga (de ~53 slots) |
|---|:--:|:--:|
| `warn.yml` | 13 | 40 |
| `temp-mute.yml` | 7 | 46 |
| `temp-ban.yml` | 22 | 31 |
| `ban.yml` | 9 | 44 |
| `mute.yml` | 1 | 52 |
| `ip-ban.yml` | 10 | 43 |

### `warn.yml`

`flood` 2.1 · `spam` 2.2 · `caps` 2.3 · `poluicao` 2.4 · `mau-uso-canal` 2.5 · `toxicidade` 2.6 · `assunto-inadequado` 2.7 · `construcao-ofensiva` 3.9 · `anti-jogo` 3.10 · `divulgacao-propria` 4.3 · `skin-ofensiva` 7.1 · `apelido-nick` 7.3 · `denuncia-falsa` 8.2

### `temp-mute.yml`

| id | Artigo | Duração |
|---|:--:|:--:|
| `warn_stage_1` | 1.2 | 5m |
| `warn_stage_2` | 1.2 | 30m |
| `ofensa` | 2.8 | 6h |
| `flood-organizado` | 2.9 | 12h |
| `informacao-falsa` | 2.10 | 12h |
| `divulgacao-nome` | 4.2 | 12h |
| `desacato` | 8.1 | 1d |

### `temp-ban.yml`

| id | Artigo | Duração |
|---|:--:|:--:|
| `warn_stage_3` | 1.2 | 1d |
| `burlar-filtro` | 2.11 | 3d |
| `perseguicao` | 3.7 | 15d |
| `chantagem` | 3.8 | 30d |
| `cumplicidade` | 3.11 | 15d |
| `divulgacao-ip` | 4.1 | 30d |
| `scam` | 5.1 | 30d |
| `scam-tentativa` | 5.2 | 7d |
| `abuso-confianca` | 5.3 | 30d |
| `anuncio-enganoso` | 5.4 | 7d |
| `rmt-oferta` | 5.5 | 15d |
| `venda-conta` | 5.7 | 30d |
| `lag-proposital` | 5.9 | 30d |
| `ocultacao-patrimonio` | 5.10 | 30d |
| `manipulacao-mercado` | 5.11 | 30d |
| `fraude-suporte` | 5.12 | 15d |
| `hack-confesso` | 6.2 | 30d |
| `mod-proibido` | 6.3 | 7d |
| `obstrucao` | 6.6 | 30d |
| `nick-ofensivo` | 7.2 | 7d |
| `prova-forjada-propria` | 8.4 | 30d |
| `ma-fe` | 8.5 | 15d |

### `ban.yml`

`warn_stage_final` 1.2 · `link-malicioso` 4.4 · `rmt-consumado` 5.6 · `chargeback` 5.8 · `hack` 6.1 · `macro` 6.4 · `falsa-identidade-golpe` 7.4 · `evasao-punicao` 7.5 · `prova-forjada` 8.3

### `mute.yml`

`chat-terminal` — sanção perpétua de chat, fora de qualquer ladder, **restrita a cargo sênior** e sempre com justificativa no ticket.

### `ip-ban.yml`

`discriminacao` 3.1 · `assedio` 3.2 · `apologia` 3.3 · `ameaca-virtual` 3.4 · `ameaca-grave` 3.5 · `doxxing` 3.6 · `abuso-bug` 6.5 · `ataque-servidor` 6.7 · `invasao-conta` 7.6 · `link-malicioso-ip` 4.4 (acessório)

### Permissões sugeridas

- **Moderação júnior:** todo `warn.yml`, todo `temp-mute.yml` e os `temp-ban` de 3d e 7d.
- **Restrito a sênior** via `punishments.reason.<id>`: todo `ban.yml`, `ip-ban.yml`, `mute.yml` e os `temp-ban` de 15d e 30d.
- Usar também `punishments.duration.max.<tempo>` por cargo — restringir só por motivo deixa a júnior aplicando qualquer duração dos motivos liberados.

### Migração do que já existe

| Motivo atual | Arquivo | Destino |
|---|---|---|
| `divulgacao` | ban.yml | `divulgacao-ip` em temp-ban.yml (4.1) |
| `hack` | temp-ban.yml (30d) | `hack` em ban.yml (6.1) |
| `killaura` | temp-ban.yml (30d) | **remover** — não corresponde a nenhum artigo |
| `ban-evasion` · `hack-alt` | ip-ban.yml | `evasao-punicao` em ban.yml (7.5) |
| `ofensa` | mute.yml | `ofensa` em temp-mute.yml, 6h (2.8) |
| `flood` | temp-mute.yml (1h) | `flood` em warn.yml (2.1) |
| `conduta` | warn.yml | dissolvido nos artigos específicos |

---

## Anexo B — Limitações do plugin que a redação respeita

Verificado no código-fonte; nada foi alterado.

1. **Duração é fixa por motivo** — casa com o modelo de punição única.
2. **`reasonId` é global.** O mesmo id em dois tipos colapsa em um só (vence o último na ordem `BAN → TEMPBAN → MUTE → TEMPMUTE → WARN → IPBAN`).
3. **Menu de motivos não pagina.** Slots fixos, `rows` máximo 6.
4. **Duração inválida vira permanente** — duração ausente ou mal escrita é lida como nula.
5. **Não se empilha punição da mesma família.**
6. **A escada consome antes de aplicar** — se a punição do estágio falhar por duplicata, o jogador perde os avisos e sobe de estágio sem punição.
7. **O estágio nunca regride** e o último se repete.
8. **Avisos têm expiração única** (7 dias para todos os motivos).
9. **A punição da escada não tem URL de prova.**
10. **`/warn` grava motivo genérico** e é só para jogador.
11. **Punição por console é sempre silenciosa e sem `reasonId`.**
12. **Não existem** kick, confisco, rollback, remoção de benefício nem punição condicional como tipo registrável.
13. **Ban de IP** usa só o último IP conhecido, falha sem IP registrado, é recusado com conta isenta online, e `/perdoar` derruba todos os bans de IP do nome.
14. **A identidade é o nick** (offline-mode, case-insensitive).
15. **Punição espelhada no Discord não é executável** pelo plugin — só há webhook de auditoria.

---

## Anexo C — Decisões pendentes

1. **Lista de mods permitidos.** Bloqueia o §6.3: sem whitelist nominal publicada, o artigo é inaplicável e a defesa "não sabia" prevalece.
2. **Como se mede "lag de propósito" (§5.9).** Definir o indicador que a equipe anexa como prova — queda de TPS, contagem de entidades, o que for.
3. **A equipe consegue remover o apelido de outro jogador?** O §7.3 pressupõe um comando para isso. Se não existir, o artigo precisa virar bloqueio como o §7.2.
4. **Idade mínima e reembolso pedido por responsável.** Hoje um pedido feito pelos pais cai direto no permanente do §5.8.
5. **Venda de unban ou unmute.** Recomendação: **não adotar** — conflita com o modelo de punição única e com o sistema de códigos.
6. **Decaimento do estágio de aviso.** O estágio nunca regride: um jogador antigo pode receber permanente por um aviso de caps meses depois. Escolher entre publicar assim, criar reset periódico, ou restringir o aviso a menos artigos.
7. **Destino do patrimônio de conta banida permanentemente** — plot, armazém, spawners, sócios com trust, leilões abertos e mail pendente.
8. **Idioma obrigatório no chat global.** Sem artigo por falta de posição da rede.
