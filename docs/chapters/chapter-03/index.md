---
title: "第3章：アーキテクチャ設計の意思決定 - workflow / agent 時代の設計判断"
subtitle: "workflow / agent 時代の設計判断"
description: "通常機能、RAG、workflow / agent、MCP / connector / function calling を、eval、threat model、approval、audit、rollback と接続して設計判断へ落とす章"
layout: book
chapter: 3
---

# 第3章：アーキテクチャ設計の意思決定 - workflow / agent 時代の設計判断

AI ネイティブなアーキテクチャ設計では、「AI を入れるかどうか」よりも、「どの業務判断に、どの自動化レベルを、どの統制で接続するか」が重要になる。
通常機能で十分な箇所に agent を入れると、複雑性、検証コスト、監査負荷、障害時の説明責任が増える。
逆に、人間だけでは追跡できない検索、分類、候補生成、運用支援を設計から外すと、実務の速度と品質を上げる機会を失う。

本章では、第2章で定義した requirements brief、data / permission boundary table、acceptance criteria をもとに、通常機能、検索付き機能、RAG、tool 実行型 workflow、自律度の高い agent をどう使い分けるかを扱う。
設計判断は、図や構成案ではなく、AI system ADR、threat model、eval plan、tool approval matrix、control point checklist として残す。

## この章で扱う判断

本章で扱う判断は、次の6つである。

1. 通常機能、検索付き機能、RAG、workflow / agent のどれを採用するか。
2. MCP、connector、function calling、外部 API をどの権限・承認・監査で接続するか。
3. schema-driven input / output、validation、output validation をどこへ置くか。
4. prompt injection、tool misuse、data exfiltration、権限逸脱をどう防ぐか。
5. offline eval、trace-based evaluation、regression test をどう設計に含めるか。
6. latency、cost、quality、reliability、vendor portability、exit strategy、degrade gracefully をどう予算化するか。

## 誰向けか

- **Architect**: workflow / agent、RAG、tool 実行の採否を、ADR として説明したい人。
- **Tech Lead**: 実装チームへ、入力 schema、出力 schema、承認境界、評価観点を渡したい人。
- **Security / Compliance**: least privilege、isolation、audit trail、prompt injection 対策、data exfiltration 対策を設計時点で確認したい人。
- **SRE / DevOps**: fallback、rollback、provider outage、degrade gracefully、運用監視を設計に組み込みたい人。
- **EM / Product Owner**: 速度、品質、リスク、コスト、運用性のトレードオフを合意形成したい人。

## 章末に残るもの

この章を読み終えた時点で、次の成果物を作れる状態を目指す。

- architecture decision matrix
- AI system ADR
- threat model
- eval plan
- tool approval matrix
- control point checklist
- latency / cost / quality / reliability budget
- exit strategy / rollback note

## よくある失敗

| 失敗 | 何が起きるか | 防止策 |
| --- | --- | --- |
| AI を使うことが目的になる | 通常機能で十分な箇所が agent 化され、運用と監査が重くなる | まず通常機能、検索付き機能、RAG、workflow / agent を比較する（§3.1） |
| RAG で権限境界を忘れる | 見えてはいけない文書が検索・引用される | data / permission boundary table と検索権限を一致させる（§3.3、§3.5） |
| tool 実行を直接許可する | 誤操作、削除、外部送信、コスト暴走が起きる | approval gate、least privilege、allowlist、audit trail を置く（§3.4、§3.5） |
| eval を後回しにする | PoC は動くが、品質劣化や回帰を検知できない | offline eval、trace-based evaluation、regression test を設計に含める（§3.6） |
| provider outage を想定しない | モデル・検索・connector 障害で業務が止まる | fallback、degrade gracefully、manual takeover、exit strategy を決める（§3.7、§3.8） |
| ベンダー固有機能へ寄せすぎる | 移行不能、価格変更、仕様変更に弱くなる | abstraction boundary、vendor portability、exportable logs を設計する（§3.8） |

## 本章と AI 協働の標準手順（SOP）

本章は、[AI 協働の標準手順（SOP）](../../introduction/ai-collaboration-sop/) のうち、特に次の工程に対応する。

- Plan 作成: decision owner、reviewer、approval、escalation、停止条件を決める。
- 入力設計: schema、source hierarchy、data / permission boundary、禁止事項を構造化する。
- 評価設計: eval plan、guardrail metric、manual review、regression を設計する。
- 実装 / PR: AI system ADR、tool approval matrix、control point checklist を PR に残す。
- 運用: audit trail、fallback、rollback、provider outage 時の縮退手順を runbook へ接続する。

本章の目的は、AI システムの構成要素を網羅することではない。要求境界を、責任ある設計判断として残すことである。

## 3.1 採用候補を5段階で比較する {#section-3-1}

AI を含む提案では、最初から RAG や agent が候補に挙がりやすい。
しかし、設計判断では、通常機能、検索付き機能、RAG、tool 実行型 workflow、自律度の高い agent を同じ表で比較する。

### 3.1.1 採用候補の基本形

| 選択肢 | 何をするか | 適した場面 | 避ける場面 | 主な成果物 |
| --- | --- | --- | --- | --- |
| 通常機能 | ルール、フォーム、検索条件、固定ロジックで処理する | 要件が安定し、判定条件が明確 | 例外が多く、自然言語の解釈が中心 | 通常設計書、テストケース |
| 検索付き機能 | 文書・DB・FAQ を検索して利用者へ提示する | 利用者が自分で判断できる | 回答の統合や要約が必要 | 検索設計、権限設計 |
| RAG | 検索結果を引用しながら回答を生成する | 文書量が多く、引用付き回答が必要 | 権限や文書品質が未整備 | RAG 設計、引用要件、eval plan |
| workflow | 決まった手順で tool を呼び出し、承認を挟む | 手順、権限、停止条件を定義できる | 手順が曖昧で、判断が都度変わる | tool approval matrix、runbook |
| agent | 状況に応じて計画し、複数 tool を使い分ける | 探索、調査、運用支援など変動が大きい | 高リスク操作、監査不能、評価不能 | AI system ADR、threat model、trace eval |

原則は、単純な選択肢から検討することである。
通常機能で要求を満たせるなら、AI は不要である。
検索付き機能で十分なら、生成は不要である。
RAG で十分なら、tool 実行は不要である。
workflow で十分なら、自律度の高い agent は不要である。

### 3.1.2 RAG vs fine-tuning vs workflow vs agent

| 比較軸 | RAG | fine-tuning | workflow | agent |
| --- | --- | --- | --- | --- |
| 主目的 | 外部知識を引用して回答する | 出力傾向や形式を調整する | 決まった手順を安全に実行する | 目的に向けて手順を選びながら進める |
| 強み | 文書更新を反映しやすい。引用を残しやすい | 表現、分類、形式の安定化に使える | approval、audit、rollback を設計しやすい | 探索、調査、複数 tool 連携に強い |
| 弱み | 検索品質と権限管理に依存する | 最新知識や権限管理の代替ではない | 例外が多いとフローが肥大化する | 評価、監査、停止条件が難しい |
| 必須統制 | search permission、citation、retrieval eval | 学習データ管理、更新方針、評価データ | tool allowlist、approval gate、runbook | planning trace、tool sandbox、human override |
| 向かない場面 | 文書が未整備、引用が不要 | 知識更新・権限更新が主目的、データ権利が不明 | 判断基準が未定義 | 本番高リスク操作を自動化したいだけ |
| 成果物 | RAG 設計、eval plan、引用方針 | model change note、評価結果 | tool approval matrix、control checklist | AI system ADR、threat model、trace-based eval |

fine-tuning は、RAG の代替ではない。
社内文書を最新状態で参照したい場合は、検索、権限、引用、文書更新の設計が必要である。
workflow と agent も同じではない。workflow は手順を固定しやすく、agent は探索性を持つ。その分、agent には強い評価、監査、停止条件が必要になる。

### 3.1.3 「AI を使うから複雑化しているだけ」のアンチパターン

次の兆候がある場合、AI 採用ではなく要求・設計を戻して確認する。

- 既存検索と FAQ 整備で解ける問題に、RAG と agent を同時に入れている。
- 利用者が必要としているのは根拠文書なのに、自然文回答だけを改善している。
- 失敗時に人が判断する前提なのに、tool 実行だけ自動化している。
- eval plan がないまま、モデル選定や prompt 改善に時間を使っている。
- 権限境界が不明な文書を、検索 index にまとめて投入している。
- 監査ログを残せない connector に、本番操作権限を与えている。

AI を使わない判断も、良いアーキテクチャ判断である。
本章では、AI の採用理由だけでなく、不採用理由、保留条件、追加検証条件も ADR に残す。

## 3.2 architecture decision matrix を作る {#section-3-2}

architecture decision matrix は、複数の構成案を、価値、リスク、統制、運用性で比較する表である。
目的は、流行や好みではなく、requirements brief と acceptance criteria に基づいて判断することである。

### 3.2.1 評価軸

最低限、次の評価軸を使う。

| 評価軸 | 問うこと | 証拠 |
| --- | --- | --- |
| user value | 利用者の意思決定や業務負荷を改善するか | requirements brief、ユーザーシナリオ |
| quality | 正確性、再現性、説明可能性を評価できるか | eval plan、test case、review result |
| risk | 誤回答、誤操作、権限逸脱、情報漏えいを抑えられるか | threat model、risk register |
| cost | 開発、推論、検索、監視、レビュー、運用の費用は許容範囲か | cost budget、TCO、運用見積もり |
| latency | 利用者体験または業務 SLA に合うか | latency budget、PoC measurement |
| reliability | provider outage、検索障害、tool 障害時に縮退できるか | fallback plan、runbook |
| operability | 監視、ログ、rollback、manual takeover が可能か | runbook、audit log design |
| portability | ベンダー移行、モデル変更、検索基盤変更が可能か | exit strategy、abstraction boundary |

### 3.2.2 decision matrix の例

社内ナレッジアシスタントを例に、3案を比較する。

| 評価軸 | 通常検索 + FAQ | RAG | RAG + workflow |
| --- | --- | --- | --- |
| user value | 規程文書を見つけやすくなる | 引用付きで要約できる | 例外時にチケット化まで誘導できる |
| quality | 利用者判断に依存 | citation eval が必要 | citation eval + workflow test が必要 |
| risk | 低い。誤回答は少ない | 誤要約と引用漏れがある | tool misuse と権限逸脱が追加される |
| cost | 低 | 中。検索基盤とモデル利用料 | 高。tool 実行、承認、監査が必要 |
| latency | 低 | 中 | 中〜高 |
| reliability | 既存検索に依存 | 検索 index とモデルに依存 | workflow / connector 障害も考慮 |
| operability | 既存運用で対応しやすい | eval とログ設計が必要 | runbook と approval が必須 |
| portability | 高 | 検索 index と prompt を移行できれば中 | connector 依存が強いと低下 |
| 判断 | 初期導入に適する | 引用付き回答が必要なら採用候補 | 例外処理の成熟後に検討 |

matrix は点数表にしてもよいが、点数だけで決めない。
重大な guardrail 違反がある案は、総合点が高くても採用しない。

### 3.2.3 speed / quality / risk / cost / operability の比較

| 観点 | 速度を優先した構成 | 品質を優先した構成 | リスク低減を優先した構成 | 運用性を優先した構成 |
| --- | --- | --- | --- | --- |
| 設計例 | 生成回答を早く返す | 引用、再ランキング、review を追加 | 高リスク領域を回答不可にする | 検索、回答、承認、rollback を分離する |
| 利点 | UX が軽い。PoC が早い | 誤回答を見つけやすい | 事故を抑えやすい | 障害対応と改善がしやすい |
| 代償 | 誤回答や監査不足が起きやすい | レイテンシと評価コストが増える | 回答不可や escalation が増える | 初期設計が重くなる |
| 使う条件 | 低リスク、内部限定、手動確認前提 | 知識回答や意思決定支援 | 個人情報、契約、外部送信を扱う | 継続運用、本番導入、監査対象 |
| 必須証跡 | PoC 記録 | eval result | threat model | runbook / audit trail |

アーキテクチャ判断は、単一の最適解ではない。
速度を取る場合は、何を犠牲にするかを明記する。
リスクを下げる場合は、どの業務価値が遅れるかを明記する。

## 3.3 schema-driven input / output と validation を設計する {#section-3-3}

AI システムでは、自然言語をそのまま入出力にすると、検証と監査が難しくなる。
schema-driven input / output は、AI に自由作文をさせる前に、入力項目、出力項目、許容値、必須根拠、未確定欄、拒否条件を定義する設計である。

### 3.3.1 入力 schema

入力 schema では、AI へ渡す文脈を分類する。

| 項目 | 内容 | validation |
| --- | --- | --- |
| task | 何を判断・生成するか | 空欄不可。要求境界に存在する task だけ許可 |
| user role | 利用者の役割 | 権限テーブルと照合 |
| data class | 入力データ分類 | 禁止分類は遮断またはマスキング |
| source | 参照文書、版数、取得時刻 | source hierarchy と照合 |
| constraints | 納期、予算、法務、運用制約 | requirements brief と照合 |
| allowed actions | AI が提案してよい操作 | tool approval matrix と照合 |
| disallowed actions | 禁止操作 | allowlist / denylist で検査 |
| output schema | 期待する出力形式 | schema version を指定 |

入力 validation は、利用者を疑うためではない。
誤入力、過剰入力、機密混入、権限外操作を、AI へ届く前に止めるための統制である。

### 3.3.2 出力 schema と output validation

出力 schema では、回答、判断、tool 提案を検証可能にする。

| 項目 | 必須理由 | validation |
| --- | --- | --- |
| answer | 利用者に返す要約 | 禁止語、過度な断定、形式を検査 |
| citations | 根拠文書、版数、引用箇所 | 引用なしなら高リスク回答を拒否 |
| assumptions | 成立条件 | 前提なしの断定を拒否 |
| uncertainty | 未確定事項 | 不明を不明として残す |
| risk | 品質、安全、運用、法務リスク | threat model のカテゴリへ分類 |
| proposed action | 実行候補 | tool approval matrix と照合 |
| approval required | 承認要否 | decision rights と照合 |
| fallback | 失敗時の誘導 | runbook と照合 |

output validation は、AI の回答を「きれいに整える」工程ではない。
採用してよい出力と、回答不可・要確認・escalation に回す出力を分ける工程である。

### 3.3.3 schema versioning

schema は運用中に変わる。
出力形式、必須項目、禁止事項、評価項目が変わった場合は、schema version を上げ、過去ログと比較できるようにする。

最低限、次を記録する。

- schema version
- prompt version
- retrieval index version
- tool definition version
- model / provider setting
- eval dataset version
- approval policy version

この記録がないと、障害時に「いつから挙動が変わったか」を追跡できない。

## 3.4 tool 実行と MCP / connector / function calling を統制する {#section-3-4}

AI システムが tool を実行する場合、設計の中心は「呼び出せるか」ではなく「何を許可し、何を止め、何を記録するか」になる。
MCP、connector、function calling、外部 API は、便利な接続面であると同時に、権限逸脱、誤操作、data exfiltration の経路にもなる。

### 3.4.1 接続方式の位置づけ

| 方式 | 位置づけ | 主なリスク | 必須統制 |
| --- | --- | --- | --- |
| function calling | アプリ内部で定義した関数を構造化して呼ぶ | 引数誤り、過剰権限、出力未検証 | schema validation、allowlist、unit test |
| connector | SaaS や業務システムへ接続する | 権限範囲の過大化、外部送信、監査不足 | least privilege、audit trail、approval |
| MCP | tool / resource / prompt を共通プロトコルで接続する | tool 境界の混同、意図しない resource 参照 | server allowlist、isolation、capability review |
| 外部 API | 既存 API を直接呼ぶ | 破壊的操作、レート制限、契約違反 | API gateway、rate limit、rollback |

接続方式の名前よりも、権限、入力、出力、承認、監査、停止条件を確認する。

### 3.4.2 tool approval matrix

| Tool / action | Allowed scope | Approval | Audit | Rollback / fallback |
| --- | --- | --- | --- | --- |
| 規程検索 | 利用者が閲覧可能な文書のみ | 不要 | query、document id、citation | 検索不可なら回答不可 |
| チケット作成 | 指定プロジェクトの draft 作成のみ | Human-on-the-loop | draft 内容、作成者、元入力分類 | draft 削除または手動修正 |
| FAQ 更新 | PR 作成まで | reviewer approval 必須 | diff、reviewer、merge commit | PR close / revert |
| 本番設定変更 | 原則禁止。Runbook 内操作のみ候補提示 | Human-in-the-loop + SRE approval | command、target、承認者、時刻 | rollback runbook |
| 外部送信 | 個別審査 | Legal / Security approval | payload classification、送信先 | 送信停止、通知、incident handling |

この表は、実装チームだけでなく、Security、SRE、Compliance、運用責任者と合意する。

### 3.4.3 least privilege と isolation

AI に与える権限は、利用者権限と同じか、それより狭くする。
「AI だから広い権限が必要」という主張は、原則として採用しない。

設計では次を確認する。

- tool ごとに read / write / delete / external send を分ける。
- 本番環境と検証環境を分離する。
- tenant、workspace、repository、project の境界を分ける。
- secret、token、credential を AI context に渡さない。
- tool 実行は sandbox または gateway を経由する。
- high-risk action は human approval なしに実行しない。

isolation は、障害を小さく閉じ込めるための設計である。
AI が誤った計画を立てても、権限と環境が分離されていれば、被害を限定できる。

## 3.5 threat model を設計へ組み込む {#section-3-5}

AI システムの threat model は、通常の Web アプリケーション脅威に加えて、AI 特有の入力、出力、tool 実行、検索、ログのリスクを扱う。
脅威をセキュリティレビューの直前に洗い出すのではなく、アーキテクチャ判断の段階で扱う。

### 3.5.1 主要な脅威

| 脅威 | 何が起きるか | 主な対策 |
| --- | --- | --- |
| prompt injection | 外部文書や利用者入力が AI への命令として解釈される | 命令と資料の分離、input guardrail、引用ブロック化 |
| tool misuse | AI が意図しない tool、引数、対象へ操作する | tool allowlist、parameter validation、approval gate |
| data exfiltration | 機密情報や個人情報が外部へ出る | data classification、egress control、redaction |
| retrieval leakage | 権限外文書が検索・引用される | search permission、document ACL、tenant isolation |
| output overtrust | 自然な回答を正しいと誤認する | citation、uncertainty、review gate、eval |
| model / provider outage | モデルや provider 障害で業務が止まる | fallback、degrade gracefully、manual takeover |
| cost anomaly | ループや大量入力で費用が暴走する | budget limit、rate limit、circuit breaker |
| audit gap | 後から判断理由や操作履歴を説明できない | audit trail、trace id、approval log |

### 3.5.2 control point

制御点は、AI の前後だけではない。

```text
User input
  -> input validation
  -> data classification
  -> retrieval permission check
  -> prompt / context assembly
  -> model call
  -> output validation
  -> tool proposal validation
  -> approval gate
  -> tool execution gateway
  -> audit trail
  -> fallback / rollback
```

各 control point で、止める条件、記録する情報、責任者を決める。
「ログは後で見る」ではなく、「どのログがなければ本番化できないか」を要件・設計に含める。

### 3.5.3 audit trail

監査ログには、次を残す。

- request id / trace id
- user role と権限
- input classification
- retrieval source と document version
- prompt / schema / policy version
- model / provider setting
- output と validation result
- proposed tool action と approval result
- actual tool execution result
- fallback、manual override、rollback の有無

ログには機密情報をそのまま残さない。
監査可能性とデータ最小化は両立させる必要がある。

## 3.6 eval harness と regression を設計する {#section-3-6}

AI システムは、コードが変わらなくても、model、prompt、retrieval index、tool、外部文書、policy の変更で挙動が変わる。
そのため、eval harness をアーキテクチャの一部として扱う。

### 3.6.1 eval harness の構成要素

| 要素 | 内容 | 目的 |
| --- | --- | --- |
| offline eval | 固定データセットで変更前後を比較する | 本番前に品質劣化を検出する |
| trace-based evaluation | 実運用 trace を匿名化・分類して評価する | 現実の利用傾向を反映する |
| regression test | 過去の失敗、禁止ケース、境界ケースを再確認する | 同じ事故の再発を防ぐ |
| golden set | 代表質問、期待引用、期待動作 | 合格基準を共有する |
| adversarial set | prompt injection、権限外要求、禁止情報混入 | guardrail を検証する |
| human review set | 判断が難しいケースを reviewer が確認する | 自動評価の限界を補う |

評価対象は正確性だけではない。
引用、再現性、説明可能性、安全性、フェイルセーフ、承認、監査、rollback も評価対象にする。

### 3.6.2 eval plan の最小 schema

```text
Scope:
Target users / tasks:
Data sources and versions:
Evaluation datasets:
Required cases:
Prohibited cases:
Metrics:
Guardrail metrics:
Human review criteria:
Regression cases:
Pass / fail conditions:
Release blocker:
Owner / reviewer:
Update cadence:
```

release blocker は必ず書く。
たとえば、引用なし回答率、権限外引用、禁止情報の出力、approval bypass、tool 実行失敗、監査ログ欠落は、KPI が良くても release を止める条件になる。

### 3.6.3 trace-based evaluation の注意点

trace-based evaluation では、実利用ログを使うため、privacy、compliance、契約、社内規程を確認する。

- 個人情報や契約情報を評価データへ残さない。
- 評価用に匿名化・マスキングした trace を使う。
- 低頻度だが重大な失敗を平均値に埋もれさせない。
- 評価データの版数、抽出条件、除外条件を記録する。
- human review の判断基準を文書化する。

評価は、モデルの順位付けではなく、運用してよいかの判断材料である。

## 3.7 latency / cost / quality / reliability を予算化する {#section-3-7}

AI システムでは、品質を上げるほど、検索回数、モデル呼び出し、validation、human review が増えやすい。
一方で、コストやレイテンシを削りすぎると、品質、説明可能性、安全性が下がる。
そのため、設計段階で予算を決める。

### 3.7.1 予算表

| 予算 | 決めること | 例 |
| --- | --- | --- |
| latency budget | どこに何秒使うか | 検索 800ms、rerank 500ms、model 3s、validation 500ms |
| cost budget | 1リクエスト、1ユーザー、1部門あたりの上限 | 月額上限、token budget、tool 実行回数制限 |
| quality budget | どの品質を必須にするか | 必須カテゴリは引用付き回答、低リスクカテゴリは回答不可許容 |
| reliability budget | どの障害を許容し、どう縮退するか | provider outage 時は検索のみへ縮退 |
| review budget | 人間レビューに使える時間 | 高リスクカテゴリは全件レビュー、低リスクはサンプリング |
| audit budget | どこまで記録するか | trace id、source、validation、approval は必須 |

予算表の数値は、読者が分解粒度を理解するための例であり、推奨値や標準値ではない。
実際の値は、利用者の待機許容、業務時間、SLO、監査要件、provider outage 時の縮退設計から逆算する。

予算は、設計の制約である。
「可能なら速く」「なるべく安く」「できるだけ正確に」は、設計判断にならない。

### 3.7.2 managed service vs self-hosted / hybrid

| 比較軸 | managed service | self-hosted | hybrid |
| --- | --- | --- | --- |
| 初期速度 | 速い | 遅い | 中 |
| 運用負荷 | 低い | 高い | 中 |
| security / compliance | 契約と設定に依存 | 自組織で統制しやすい | データ分類で分けやすい |
| cost predictability | 従量課金に注意 | 固定費と運用費に注意 | 複雑になりやすい |
| vendor portability | 抽象化しないと低い | 高くしやすいが運用負荷あり | 境界設計次第 |
| latency | 外部通信に依存 | 近接配置しやすい | 経路設計次第 |
| audit | サービス機能に依存 | 自前で設計可能 | 両方の統合が必要 |
| 向く場面 | PoC、低〜中リスク、速度重視 | 高統制、データ制約、特殊要件 | データ感度や用途で分ける場合 |

managed service を使う場合も、本文に特定サービスの UI や価格を固定しない。
本文に残すのは、選定軸、責任境界、exit strategy、評価方法である。

### 3.7.3 degrade gracefully

degrade gracefully とは、モデル、検索、connector、provider の一部が失敗しても、安全側へ縮退して業務を継続する設計である。

| 障害 | 縮退動作 | 利用者表示 | 運用対応 |
| --- | --- | --- | --- |
| model outage | 生成回答を止め、検索結果のみ表示 | 現在、要約回答は利用できません | provider status 確認、代替 provider 検討 |
| retrieval failure | 回答不可にし、問い合わせへ誘導 | 根拠文書を確認できません | index / ACL /文書更新を確認 |
| tool failure | tool 実行を止め、手動手順へ誘導 | 操作は自動実行されません | runbook に従い手動実行 |
| validation failure | 出力を返さず、再生成または escalation | 回答の安全性を確認できません | schema / prompt / policy を確認 |
| cost anomaly | circuit breaker で停止 | 一時的に利用制限中です | ループ、入力肥大、利用急増を確認 |

縮退時に「何も返さない」だけでは不十分である。
利用者へ何が起きたか、次に何をすべきか、誰が対応しているかを示す。

## 3.8 vendor portability と exit strategy を決める {#section-3-8}

AI システムは、model、provider、検索基盤、connector、評価基盤、ログ基盤に依存しやすい。
すべてを完全に抽象化する必要はないが、どこを差し替え可能にするか、どこはロックインを受け入れるかを明示する。

### 3.8.1 abstraction boundary

| 境界 | 固定しすぎると起きること | 抽象化の例 |
| --- | --- | --- |
| model API | provider 変更時に全体改修が必要 | model gateway、共通 request / response schema |
| prompt / schema | 評価とログの比較が難しい | prompt version、schema version、template 管理 |
| retrieval index | 文書移行や ACL 変更が難しい | document id、metadata、ACL を共通化 |
| tool connector | SaaS 変更で workflow が壊れる | tool interface、capability model、adapter |
| audit log | 監査・移行・postmortem が困難 | trace schema、export format、retention policy |
| eval dataset | provider 比較ができない | provider independent test set |

抽象化はコストである。
ロックイン回避のために過度な abstraction を入れると、開発速度と運用性が落ちる。
ADR には、抽象化する境界と、意図的に依存を受け入れる境界の両方を書く。

### 3.8.2 exit strategy

exit strategy には、少なくとも次を含める。

- model / provider を変更する条件。
- 代替 provider または非 AI fallback の候補。
- prompt、schema、eval dataset、trace log の export 可否。
- retrieval index と document metadata の移行方法。
- connector 権限と audit log の移行方法。
- 契約、データ削除、ログ保持、学習利用停止の確認事項。
- rollback できる単位と、できない単位。

exit strategy は、将来のための理想論ではない。
価格変更、API 変更、障害、契約変更、規制対応、品質劣化が起きたときの実務上の保険である。

## 3.9 AI system ADR と control point checklist に落とす {#section-3-9}

アーキテクチャ設計は、会議で決めた構成図ではなく、後から説明できる判断として残す。
本章では、AI system ADR と control point checklist を最小成果物にする。

### 3.9.1 AI system ADR の最小 schema

```text
Title:
Status: Proposed / Accepted / Rejected / Superseded
Context:
Requirements brief reference:
Data / permission boundary reference:
Decision:
Options considered:
Why not normal feature:
Why not search-only:
Why RAG / workflow / agent:
Schema and validation:
Tool permissions and approval:
Threat model summary:
Eval plan summary:
Latency / cost / quality / reliability budget:
Fallback / rollback / degrade gracefully:
Vendor portability / exit strategy:
Audit trail:
Decision owner:
Reviewers:
Date:
```

この schema は、すべての AI システムに同じ粒度で使う必要はない。
ただし、重要判断では、採用理由だけでなく、却下理由、保留条件、追加検証条件を残す。

### 3.9.2 control point checklist

- [ ] 通常機能、検索付き機能、RAG、workflow / agent を比較した。
- [ ] `AI を使うから複雑化しているだけ` のアンチパターンに該当しないことを確認した。
- [ ] data / permission boundary table と検索・tool 権限が一致している。
- [ ] input schema、output schema、schema version を定義した。
- [ ] output validation と回答不可条件を定義した。
- [ ] MCP / connector / function calling の権限、approval、audit を定義した。
- [ ] least privilege、isolation、secret 非投入を確認した。
- [ ] prompt injection、tool misuse、data exfiltration、retrieval leakage を threat model に含めた。
- [ ] offline eval、trace-based evaluation、regression test、human review を eval plan に含めた。
- [ ] latency、cost、quality、reliability、review、audit の予算を定義した。
- [ ] provider outage 時の degrade gracefully、fallback、manual takeover を定義した。
- [ ] vendor portability と exit strategy を ADR に残した。
- [ ] rollback 可能な変更と、rollback できない変更を分けた。
- [ ] audit trail に必要な trace id、source、validation、approval、tool execution を定義した。

チェックリストを満たせない場合、設計を止める必要があるとは限らない。
ただし、満たせない項目は risk register または open question として owner と期限を付ける。

## まとめ

アーキテクチャ設計は、AI の構成要素を増やす工程ではない。
第2章で定義した要求境界を、実装、評価、承認、監査、運用、復旧へつなぐ意思決定の工程である。
通常機能で足りるものは通常機能にする。検索で足りるものは検索にする。RAG、workflow / agent は、価値、リスク、評価、統制、運用性が説明できる場合に採用する。

**要点**：

- 通常機能、検索付き機能、RAG、workflow / agent を同じ表で比較し、AI 採用と不採用の理由を残す。
- MCP、connector、function calling は、tool 実行能力ではなく、権限、approval、audit、rollback の境界として設計する。
- schema-driven input / output と validation を使い、AI 出力を採用可能、回答不可、要確認、escalation に分類する。
- prompt injection、tool misuse、data exfiltration、retrieval leakage を threat model に含める。
- eval harness、offline eval、trace-based evaluation、regression test をアーキテクチャの一部として扱う。
- latency、cost、quality、reliability、review、audit を予算化し、provider outage 時には degrade gracefully で縮退する。
- vendor portability と exit strategy を、将来の理想論ではなく、現在の設計判断として ADR に残す。

次章では、これらの設計判断を、Issue 起点の実装計画、AI-assisted delivery、PR レビュー、検証責任へ接続する。

次に読む： [第4章：開発/構築フェーズの最適化思考](../chapter-04/) / [目次（トップ）](../../)

---

## この章のまとめとチェックリスト

### この章のまとめ

- AI 時代のアーキテクチャ設計では、通常機能、検索付き機能、RAG、workflow / agent の使い分けを、価値、リスク、評価、統制、運用性で判断する。
- 設計判断は、architecture decision matrix、AI system ADR、threat model、eval plan、tool approval matrix、control point checklist として残す。
- provider outage、コスト暴走、権限逸脱、監査欠落、vendor lock-in は、設計段階で扱う。

### この章を読み終えたら確認したいこと

- [ ] 最近扱った AI 機能について、通常機能、検索付き機能、RAG、workflow / agent の比較表を作ったか。
- [ ] MCP / connector / function calling の権限、approval、audit、rollback を説明できるか。
- [ ] prompt injection、tool misuse、data exfiltration を threat model に含めたか。
- [ ] eval plan に offline eval、trace-based evaluation、regression test を含めたか。
- [ ] provider outage 時の fallback、degrade gracefully、manual takeover を定義したか。
- [ ] AI system ADR に、採用理由、却下理由、保留条件、exit strategy を残したか。

### 関連する章・付録

- 要求境界、データ分類、自動化境界は、[第2章：要件定義の認知プロセス](../chapter-02/) を参照する。
- AI 支援開発と PR での検証責任は、[第4章：開発/構築フェーズの最適化思考](../chapter-04/) を参照する。
- AI 固有インシデント、fallback、rollback、postmortem は、[第6章：危機管理と問題解決](../chapter-06/) を参照する。
- 成果物テンプレートは、[付録A：実務成果物テンプレート集](../../appendices/templates/) を参照する。
- 標準 / ガイド / 公式ドキュメントの読み方は、[付録C：推奨読書リスト](../../appendices/reading-list/) を参照する。
- RAG、workflow / agent、tool approval の実例は、[付録B：ケーススタディ](../../appendices/case-studies/) を参照する。
- provider、API、connector、価格、UI など変化しやすい情報の扱いは、[付録D：更新履歴とメンテナンス方針](../../appendices/update-notes/) を参照する。
