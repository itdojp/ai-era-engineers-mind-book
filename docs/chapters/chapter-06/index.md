---
title: "第6章：危機管理と問題解決 - AI 固有インシデントへの運用統制"
subtitle: "AI 固有インシデントへの運用統制"
description: "prompt injection、誤操作、権限逸脱、provider outage、コスト暴走、retrieval / citation failure、approval bypass を、kill switch、quarantine、rollback、escalation、postmortem へ接続する章"
layout: book
chapter: 6
---

# 第6章：危機管理と問題解決 - AI 固有インシデントへの運用統制

AI を含むシステムでは、従来型の障害対応だけでは足りない。サービス停止や性能劣化に加えて、prompt injection、誤った外部操作、権限逸脱、情報漏えい、誤った要約、誤判断の連鎖、retrieval failure、citation failure、MCP authorization failure、approval bypass、コスト暴走、モデル / プロバイダ障害といった、AI 特有の事故が起きる。

これらの事故は、発生後に「AI が間違えた」と説明しても責任を果たせない。人とシステムが、どこまで自動化してよいか、どこで実行前承認を要求するか、どの証跡で事後監査するか、いつ kill switch を押すか、どの状態なら quarantine し、どう rollback し、誰へ escalation するかを、事前に決めておく必要がある。

本章では、第3章の threat model / eval plan / approval gate、第4章の release readiness / rollback、第5章の risk register / communication template を受け取り、AI incident runbook と postmortem へ落とす。目的は、事故をゼロにすることではない。事故が起きたときに、止める、隔離する、復旧する、説明する、学習する、再発防止するという一連の統制を、現場で実行できる状態にすることである。

## この章で扱う判断

本章で扱う判断は、次の8つである。

1. 従来型インシデントと AI 固有インシデントを、severity、影響範囲、説明責任でどう分類するか。
2. prompt injection、tool misuse、retrieval failure、citation failure、stale knowledge、approval bypass をどの証跡で検知するか。
3. kill switch、quarantine、rollback、manual takeover、escalation をどの条件で発動するか。
4. どこまで自動化してよいかを、Human-in-the-loop / Human-on-the-loop / Full automation の境界としてどう明文化するか。
5. 実行前承認と事後監査を両立させるために、approval、audit、trace、change log をどう残すか。
6. hallucination rate proxy、tool error rate、approval rejection rate、citation coverage、latency distribution、token / cost anomaly、fallback rate、manual takeover rate、audit completeness をどう観測するか。
7. incident timeline、communication template、postmortem template を、社内 / 顧客 / 経営向けにどう使い分けるか。
8. 事故後に guardrail、eval、runbook、教育、契約、権限をどう更新するか。

## 誰向けか

- **SRE / DevOps**: AI を含む運用で、停止、隔離、復旧、監査、再発防止の標準手順を作りたい人。
- **Security**: prompt injection、権限逸脱、情報漏えい、tool misuse、approval bypass をインシデントとして扱いたい人。
- **Tech Lead / Architect**: 第3章の AI system ADR と threat model を、運用時の incident response へ接続したい人。
- **EM / 現場責任者**: AI 誤動作時の現場判断、manual takeover、顧客連絡、教育、再発防止を管理したい人。
- **Compliance / 監査 / Legal**: 実行前承認、事後監査、証跡、責任分界、顧客説明を確認したい人。

## 章末に残るもの

この章を読み終えた時点で、次の成果物を作れる状態を目指す。

- AI incident runbook
- postmortem template
- severity matrix
- communication template（社内 / 顧客 / 経営向け）
- operational guardrail checklist
- incident timeline template
- kill switch / quarantine / rollback 手順
- AI incident metrics dashboard

## よくある失敗

| 失敗 | 何が起きるか | 防止策 |
| --- | --- | --- |
| AI 誤回答を通常の品質問題として扱う | 顧客影響、監査、説明責任が過小評価される | AI 固有の severity matrix と communication template を用意する（§6.1、§6.7） |
| 自動化の停止条件がない | 誤自動化や誤った外部操作が拡大する | kill switch、quarantine、manual takeover を runbook に入れる（§6.3） |
| 実行前承認だけで安心する | 承認後の挙動、証跡、例外処理が追えない | 実行前承認と事後監査をセットで設計する（§6.4） |
| ログはあるが説明できない | 入力、出力、tool 実行、承認、修正履歴がつながらない | incident timeline と audit trail を同じ ID で紐づける（§6.5、§6.7） |
| provider outage を想定しない | モデル / プロバイダ障害時に業務が止まる | degrade gracefully、fallback、manual takeover を定義する（§6.3、§6.8） |
| postmortem が責任追及になる | 現場が事実を隠し、再発防止が弱くなる | blameless だが accountable な postmortem を採用する（§6.6） |

## 本章と AI 協働の標準手順（SOP）

本章は、[AI 協働の標準手順（SOP）](../../introduction/ai-collaboration-sop/) のうち、特に次の工程に対応する。

- Issue 化: 事故の症状、影響範囲、対象システム、AI 関与の有無、意思決定者を明文化する。
- 情報分類: ログ、顧客情報、個人情報、契約情報、prompt、tool 引数、出力、監査証跡を分類する。
- Plan 作成: Incident Commander、Technical Lead、Communication Lead、Security / Legal reviewer、escalation 先を決める。
- 入力設計: AI に渡してよいログ、渡してはいけない顧客データ、要約時の根拠、出力 schema を定義する。
- 評価設計: hallucination rate proxy、citation coverage、tool error rate、audit completeness、fallback rate を観測する。
- 反映: AI incident runbook、incident timeline、postmortem、communication template、operational guardrail checklist を更新する。
- レビュー・承認: kill switch、rollback、policy exception、顧客連絡、経営報告、監査記録を確認する。

AI は、インシデント対応中の要約、仮説出し、ログ分類、communication draft、postmortem draft を支援できる。一方で、顧客影響の判断、リスク受容、本番操作、外部連絡、法務判断、原因確定は、人が責任を持つ。

## 6.1 AI incident の severity と初動を決める {#section-6-1}

AI incident は、サービス停止だけでなく、誤った判断や統制逸脱も含む。severity は、技術的な異常の大きさではなく、顧客影響、情報影響、権限影響、法務・監査影響、事業継続影響を合わせて決める。

### 6.1.1 severity matrix

| Severity | AI 固有の例 | 影響 | 初動 | 通知先 |
| --- | --- | --- | --- | --- |
| SEV-1 | 機密情報の外部送信、誤った外部操作、重大な approval bypass、広範な誤自動化 | 顧客・法務・監査・事業継続に重大影響 | kill switch、quarantine、Incident Commander 起動 | 経営、Security、Legal、監査、顧客窓口 |
| SEV-2 | 限定範囲の情報漏えい疑い、重大誤回答、provider outage による業務停止、コスト急増 | 限定顧客または主要業務に影響 | 対象機能停止、manual takeover、証跡保全 | 事業責任者、Security、SRE、現場責任者 |
| SEV-3 | citation failure、retrieval failure、stale knowledge による軽微な誤回答 | 業務手戻りや利用者混乱 | 対象回答の停止、再評価、FAQ 更新 | EM、Tech Lead、Support |
| SEV-4 | eval drift、latency distribution 悪化、軽微な token / cost anomaly | 直接影響は小さいが将来リスクあり | backlog 化、定期レビュー、guardrail 改善 | Owner、SRE、Data / ML 担当 |

この表の数値や名称はモデルケースである。実際には、サービスの SLO、契約、規制、顧客影響、運用体制に応じて調整する。ただし、AI 固有の誤回答、情報漏えい、権限逸脱、承認 bypass を severity 判断に入れることは必須である。

### 6.1.2 初動の役割分担

初動では、調査と復旧と説明を同じ人に集中させない。

| Role | 責務 | AI incident で追加する確認 |
| --- | --- | --- |
| Incident Commander | 優先順位、停止判断、escalation、復旧方針 | AI 機能を止めるか、対象業務を quarantine するか |
| Technical Lead | 原因仮説、修正、rollback、検証 | prompt、retrieval、tool 実行、MCP authorization、eval drift |
| Security Lead | 情報漏えい、権限逸脱、攻撃可能性 | prompt injection、data exfiltration、secret 露出、least privilege |
| Communication Lead | 社内 / 顧客 / 経営向け説明 | AI 出力の誤用、未確定事項、顧客影響範囲 |
| Legal / Compliance | 契約、規制、監査、証跡 | データ越境、通知義務、証跡保存、責任分界 |
| Field Owner | 現場対応、manual takeover、顧客個別対応 | 利用停止範囲、手動復旧、再処理、教育 |

AI がログ要約やタイムライン草案を作る場合でも、Incident Commander は AI 出力を事実として採用しない。一次ログ、監視データ、操作履歴、承認履歴で確認する。

### 6.1.3 incident declaration の基準

次のいずれかに該当する場合は、通常の改善チケットではなく、AI incident として扱う。

- AI 出力が顧客、契約、請求、医療・金融・法務相当の判断、セキュリティ判断へ影響した。
- prompt injection や tool misuse により、意図しないデータ取得、外部操作、通知、変更が行われた。
- 権限逸脱 / 情報漏えい、またはその疑いがある。
- retrieval failure、stale knowledge、citation failure により、誤った根拠が提示された。
- MCP authorization failure、approval bypass、誤自動化により、承認なしの操作が実行された。
- モデル / プロバイダ障害により、業務が停止または degraded mode へ移行した。
- token / cost anomaly が発生し、予算上限、SLO、顧客影響に波及する可能性がある。

incident declaration を遅らせると、証跡保全と顧客説明が難しくなる。迷う場合は軽い severity で宣言し、後から downgrade するほうが安全である。

## 6.2 AI 固有の障害モードを分類する {#section-6-2}

AI incident の根本原因分析では、「モデルが間違えた」で止めない。AI システムは、入力、retrieval、tool、approval、model、post-processing、human review、運用手順が連鎖して動く。障害モードを分けなければ、再発防止策が曖昧になる。

### 6.2.1 障害モード分類表

| 障害モード | 症状 | 主な原因 | 代表的な証跡 |
| --- | --- | --- | --- |
| prompt injection | 外部文書や入力が AI の指示を上書きする | 信頼境界の未定義、入力検査不足 | raw input、prompt、retrieved document、output |
| 誤った外部操作 | AI または agent が誤った tool を実行する | tool 権限過大、approval gate 不足 | tool call log、承認ログ、実行結果 |
| 権限逸脱 / 情報漏えい | 本来見えない情報が出力または外部送信される | data boundary 不備、least privilege 不足 | access log、DLP alert、data classification |
| モデル / プロバイダ障害 | 応答不能、品質劣化、latency 悪化 | provider outage、API 変更、quota | provider status、latency distribution、error rate |
| コスト暴走 | token / API cost が急増する | loop、retry storm、入力肥大、攻撃 | usage log、token / cost anomaly、retry log |
| 誤った要約 / 誤判断の連鎖 | 一次情報と異なる要約が後続判断へ使われる | source hierarchy 不備、review 不足 | summary、source、decision memo、review note |
| retrieval failure | 必要文書を検索できない | index stale、権限境界、query 設計不備 | query log、retrieved IDs、missing source |
| stale knowledge | 古い規程、古い仕様、廃止手順を使う | 更新漏れ、cache、学習時点依存 | document version、timestamp、cache log |
| citation failure | 根拠なし、誤引用、引用先不一致 | citation validation 不足 | cited source、span、answer、review result |
| MCP authorization failure | connector / tool の認可が誤る | scope 過大、token 管理不備、policy drift | MCP log、token scope、policy change |
| approval bypass | 承認が必要な操作が承認なしで進む | workflow 条件漏れ、例外処理不備 | approval log、workflow run、policy exception |
| 誤自動化 | 人が判断すべき領域まで自動処理する | automation boundary 未定義 | automation rule、runbook、manual takeover log |

この分類は、postmortem の章立てとしても使える。原因が複数ある場合は、最も近い直接原因だけでなく、設計、運用、教育、承認、監査の寄与要因を分ける。

### 6.2.2 事実と仮説を分ける

インシデント対応中は、AI が自然な説明を出しても、それを事実として扱わない。タイムラインには、事実、仮説、判断、実行、結果を分けて記録する。

| 種別 | 例 | 記録方法 |
| --- | --- | --- |
| 事実 | 10:04 に tool `send_customer_email` が実行された | 実行ログ、trace ID、承認 ID |
| 仮説 | prompt injection により tool 選択が歪んだ可能性 | 仮説 ID、根拠、検証方法 |
| 判断 | 顧客通知機能を quarantine する | 判断者、理由、代替案 |
| 実行 | 対象 connector の権限を read-only に変更した | 変更 ID、実行者、rollback 手順 |
| 結果 | 誤送信は止まったが、手動対応が増えた | metric、現場報告、残課題 |

AI に要約を依頼する場合は、事実と仮説を混ぜない schema を使う。根拠のない断定、時刻の補完、存在しない引用、未確認の原因確定を禁止する。

### 6.2.3 情報分類と入力制限

インシデント対応では、ログや顧客情報を AI に渡したくなる。しかし、事故対応中ほど情報分類が重要である。

- 顧客データ、個人情報、契約情報、秘密情報、認証情報は、AI 投入前にマスキングまたは除外する。
- prompt、tool 引数、retrieved document、出力、承認ログは、監査証跡として保存する。
- 外部 AI へ投入できないログは、社内環境で分析するか、人手で要約する。
- AI 要約を顧客や経営へそのまま転用しない。Communication Lead が一次情報で確認する。
- 調査用権限は、incident scope に限定し、終了後に剥奪する。

情報分類を省略すると、事故対応そのものが二次事故になる。

## 6.3 kill switch / quarantine / rollback / escalation を設計する {#section-6-3}

AI incident では、原因究明より先に拡大防止が必要な場合がある。誤回答、誤操作、コスト暴走、情報漏えい疑いでは、まず止める、隔離する、手動へ切り替える、証跡を保全する。

### 6.3.1 containment option

| Option | 使う条件 | 実施内容 | 注意点 |
| --- | --- | --- | --- |
| kill switch | 被害拡大中、誤操作中、情報漏えい疑い、コスト暴走 | AI 機能、agent、tool 実行、外部連携を停止する | 停止による業務影響を Communication Lead へ渡す |
| quarantine | 影響範囲を限定したい、特定データや特定利用者だけ危険 | 対象 workflow、connector、データセット、利用者を隔離する | 隔離範囲と解除条件を記録する |
| rollback | 新しい prompt、model、retrieval index、tool 定義、権限変更が原因候補 | 直前の安全な version へ戻す | rollback 後の eval と監査証跡を残す |
| manual takeover | 自動判断や自動実行を止め、人が処理する | 現場手順、承認者、問い合わせ先を有効化する | 現場負荷と SLO を再見積もりする |
| degrade gracefully | provider outage や品質劣化時に機能を縮退する | 検索のみ、回答停止、読み取り専用、遅延許容へ切替 | 利用者へ制限内容を明示する |
| escalation | 組織外や上位判断が必要 | 経営、法務、監査、顧客窓口、ベンダーへ連絡 | 未確定事項と確定事項を分ける |

containment は、完全な原因確定を待たない。発動条件と解除条件を runbook に書き、発動した事実を incident timeline に残す。

### 6.3.2 automation boundary

「どこまで自動化してよいか」は、平時に決める。incident 中に決めると、復旧を急ぐ圧力で境界が甘くなる。

| 自動化レベル | 許可すること | 禁止または承認必須にすること | 監査要件 |
| --- | --- | --- | --- |
| Human-in-the-loop | AI は提案のみ。人が実行する | 本番変更、顧客連絡、外部操作、権限変更 | 提案、承認者、実行者、結果を記録 |
| Human-on-the-loop | AI が限定操作を行い、人が監視・停止できる | 破壊的操作、広範囲通知、データ削除、契約判断 | kill switch、操作ログ、事後レビュー |
| Full automation | 低リスク・可逆・限定範囲の処理 | 顧客影響、不可逆操作、機密データ処理 | SLO、alert、定期監査、上限 |

AI incident 対応では、通常時に Full automation を許可している処理でも、一時的に Human-in-the-loop へ落とす判断が必要になる。

### 6.3.3 rollback と解除条件

rollback は、戻すことでは終わらない。戻した後に、二次影響がないことを確認し、いつ解除するかを決める。

| 対象 | rollback 例 | 解除条件 |
| --- | --- | --- |
| prompt | 前回承認済み prompt へ戻す | eval pass、review pass、誤回答再現なし |
| retrieval index | 直近の正常 index へ戻す | citation coverage 回復、missing source 解消 |
| tool definition | read-only または disabled へ戻す | approval gate 修正、tool error rate 安定 |
| model / provider | fallback provider または static response へ切替 | provider status 回復、品質確認、cost 安定 |
| policy | automation を Human-in-the-loop へ戻す | postmortem action 完了、監査承認 |

解除条件を曖昧にすると、一時的な手当が恒久化し、技術負債と運用負荷が増える。

## 6.4 実行前承認と事後監査を両立する {#section-6-4}

AI を含む運用では、承認を厳しくすると復旧が遅くなる。承認を緩くすると誤操作や統制逸脱が増える。必要なのは、実行前承認と事後監査の組み合わせである。

### 6.4.1 approval matrix

| 操作 | 平時 | incident 中 | 必要な証跡 |
| --- | --- | --- | --- |
| ログ要約 | AI 利用可。ただし機密マスク | SEV-1/2 では Security 確認後 | 入力範囲、マスク方法、出力、確認者 |
| read-only 調査 | 自動化可 | 原則可。ただし権限は incident scope 限定 | query、実行者、対象、時刻 |
| 本番設定変更 | 承認必須 | Incident Commander 承認で実行 | 変更 ID、承認者、rollback |
| 外部通知 | Communication Lead / Legal 確認 | SEV-1/2 は経営・法務確認 | 文面、承認者、送信先、時刻 |
| 顧客データ参照 | 最小権限、目的限定 | Security / Legal の条件付き承認 | ticket、目的、範囲、保持期間 |
| tool 実行 | risk level に応じて承認 | destructive / external は承認必須 | tool call、引数、承認、結果 |
| AI による自動復旧 | 低リスクのみ | 原則停止し Human-in-the-loop | 停止判断、手動実行、検証 |

承認は、速度を落とすためではなく、誰が何を受け入れたかを記録するためにある。緊急時の例外承認も、後から監査できる形で残す。

### 6.4.2 audit trail の最小項目

AI incident の audit trail には、次を残す。

| 項目 | 内容 |
| --- | --- |
| Incident ID | すべてのログ、判断、連絡、変更を紐づける ID |
| Input | AI へ渡した情報、マスク方法、禁止情報の有無 |
| Output | AI の回答、要約、提案、生成された文面 |
| Source | 参照したログ、文書、retrieval result、citation |
| Tool call | tool 名、引数、実行者、権限、結果、error |
| Approval | 承認者、承認理由、承認時刻、例外条件 |
| Change | 実施した変更、rollback 手順、検証結果 |
| Communication | 社内、顧客、経営向けの文面と承認履歴 |
| Review | postmortem、action item、再発防止、完了証跡 |

AI 出力だけを保存しても、監査証跡としては弱い。入力、根拠、tool 実行、承認、結果がつながっている必要がある。

### 6.4.3 approval bypass の扱い

approval bypass は、障害ではなく統制逸脱である。実害が出ていなくても incident として扱う。

- 承認が必要な操作が承認なしに実行された。
- 承認条件が workflow の分岐漏れで回避された。
- 例外承認が期限切れのまま利用された。
- agent が承認者の代わりに判断した。
- MCP / connector の scope が意図より広く、承認対象外の操作が可能だった。

approval bypass が見つかった場合は、対象 workflow を quarantine し、承認条件、policy、test、監査ログを修正するまで拡大利用しない。

## 6.5 AI incident metrics を観測する {#section-6-5}

AI incident を運用で扱うには、通常の availability や error rate だけでは足りない。AI 出力の根拠、tool 実行、承認、コスト、手動引き継ぎ、監査証跡を観測する必要がある。

### 6.5.1 観測項目

| Metric | 見ること | incident での使い方 |
| --- | --- | --- |
| hallucination rate proxy | 根拠なし回答、誤引用、レビュー修正率 | 誤回答の増加、モデル変更影響を検知する |
| tool error rate | tool 実行失敗、権限エラー、外部 API 失敗 | 誤操作、MCP authorization failure、provider issue を見る |
| approval rejection rate | 承認却下率、差し戻し理由 | automation boundary の誤設計を検知する |
| citation coverage | 回答に必要な引用がある割合 | citation failure、retrieval failure を検知する |
| latency distribution | P50/P95/P99 の応答遅延 | provider outage、degrade 判断に使う |
| token / cost anomaly | token、API cost、retry、loop | コスト暴走と攻撃兆候を検知する |
| fallback rate | fallback provider、検索のみ、手動処理への切替率 | 品質劣化や障害頻度を見る |
| manual takeover rate | 人が引き取った割合と理由 | 自動化範囲の妥当性を評価する |
| audit completeness | 必須証跡が揃っている割合 | 監査可能性と説明責任を確認する |

metric は、単独で真実を示さない。例えば hallucination rate proxy は代理指標であり、業務ごとに定義が変わる。重要なのは、定義、測定方法、閾値、対応を runbook に残すことである。

### 6.5.2 AI incident metrics dashboard

最小 dashboard は次のように作る。

| 領域 | 指標 | 閾値 | Alert | Owner |
| --- | --- | --- | --- | --- |
| Quality | citation coverage | 重要回答で 100% 必須 | 下回ったら回答停止 | Tech Lead |
| Safety | approval rejection rate | 急増または特定操作で増加 | workflow quarantine | Security / EM |
| Tool | tool error rate | 通常比 2倍 | tool 実行を Human-in-the-loop へ | SRE |
| Cost | token / cost anomaly | 予算上限の 80% | rate limit、kill switch 検討 | Owner / CFO |
| Reliability | latency distribution | P95 が SLO 超過 | degrade gracefully | SRE |
| Operations | manual takeover rate | pilot 想定超過 | 対象業務を縮小 | 現場責任者 |
| Audit | audit completeness | 必須項目 100% | リリース停止 / 監査対応 | Compliance |

閾値は組織ごとに設定する。ここで重要なのは、AI 固有の品質、統制、コスト、運用負荷を一つの運用画面で見ることである。

### 6.5.3 trace と timeline の紐づけ

incident timeline は、trace ID、request ID、approval ID、change ID、communication ID と紐づける。

| 時刻 | 事象 | 種別 | ID | 判断 / 結果 |
| --- | --- | --- | --- | --- |
| 10:02 | 誤回答がサポートへ報告される | 事実 | ticket-123 | SEV-2 仮判定 |
| 10:05 | 対象回答機能を停止 | 実行 | change-456 | kill switch 発動 |
| 10:08 | prompt injection 可能性を仮説化 | 仮説 | hyp-01 | raw input を保全 |
| 10:20 | 顧客影響範囲を確認 | 事実 | query-789 | 12件影響疑い |
| 10:40 | 顧客向け一次連絡を承認 | 判断 | comm-001 | Legal 確認済み |

timeline は、誰が悪かったかを探す資料ではない。復旧と説明責任に必要な順序、判断、証跡を残す資料である。

## 6.6 根本原因分析と postmortem を運用する {#section-6-6}

AI incident の postmortem は、モデル、データ、tool、approval、人間レビュー、運用手順、組織判断を一体で扱う。単一原因に収束させると、再発防止策が弱くなる。

### 6.6.1 postmortem template

```markdown
# AI incident postmortem

## Summary
- Incident ID:
- Severity:
- 発生日 / 検知時刻 / 復旧時刻:
- 影響範囲:
- 現在状態:

## Customer / business impact
- 顧客影響:
- 業務影響:
- 法務 / 監査 / 契約影響:
- コスト影響:

## Timeline
- 時刻、事象、判断、実行、証跡 ID を記録する。

## AI involvement
- prompt / input:
- retrieval / citation:
- model / provider:
- tool / MCP / connector:
- approval / audit:
- human review:

## Root causes and contributing factors
- 直接原因:
- 技術的寄与要因:
- 運用上の寄与要因:
- 組織・教育・契約上の寄与要因:

## Detection and response
- どう検知したか:
- 何が早かったか:
- 何が遅れたか:
- kill switch / quarantine / rollback / escalation の実績:

## Corrective actions
- guardrail:
- eval / regression:
- approval / audit:
- runbook:
- training:
- contract / vendor:

## Follow-up owner and due date
- Action:
- Owner:
- Due date:
- Evidence of completion:
```

postmortem には、AI が生成した文章をそのまま貼らない。AI を使って草案を作る場合も、Incident Commander、Technical Lead、Security、Communication Lead が事実と責任表現を確認する。

### 6.6.2 blameless だが accountable にする

blameless postmortem は、責任を曖昧にするためのものではない。個人攻撃を避けながら、設計、運用、承認、教育、監査のどこに改善責任があるかを明確にするための方法である。

| 避ける表現 | 書き換える表現 |
| --- | --- |
| 担当者が確認しなかった | 確認が必須になる workflow gate が存在しなかった |
| AI が嘘をついた | citation validation がなく、根拠なし回答を検知できなかった |
| 現場が誤って使った | 禁止条件と manual takeover 手順が教育されていなかった |
| ベンダー障害だから仕方ない | provider outage 時の fallback と顧客説明が未定義だった |
| 承認者が見落とした | approval request に必要な risk context が含まれていなかった |

accountable にするとは、action item に owner、期限、完了証跡を持たせることである。

### 6.6.3 再発防止を成果物へ反映する

postmortem の action item は、文書で終わらせない。次の成果物へ反映する。

| 発見 | 反映先 |
| --- | --- |
| prompt injection を検知できなかった | threat model、input validation、eval dataset |
| citation failure が漏れた | citation coverage check、acceptance criteria、review checklist |
| tool 権限が広すぎた | tool approval matrix、least privilege、MCP scope |
| approval bypass が起きた | workflow test、approval matrix、audit rule |
| コスト暴走が遅れて検知された | cost alert、rate limit、kill switch |
| 現場が manual takeover できなかった | runbook、training、drill、communication template |

再発防止策は、実施して終わりではない。次の eval、release readiness、監査レビューで確認できる形にする。

## 6.7 communication template を使い分ける {#section-6-7}

AI incident では、説明の粒度を誤ると二次被害が起きる。社内には作業に必要な詳細を共有する。顧客には確定事実、影響、対応、次回連絡を明確にする。経営には意思決定、リスク、外部影響、必要な支援を示す。

### 6.7.1 社内向け communication template

```markdown
# Internal incident update

- Incident ID:
- Severity:
- 現在状態: investigating / contained / recovering / resolved
- 影響範囲:
- AI involvement:
  - prompt / retrieval / tool / model / provider / approval のどれが関与しているか
- 実施済み containment:
  - kill switch / quarantine / rollback / manual takeover
- 現在の仮説:
  - 確定事実と仮説を分ける
- 次の作業:
- 必要な支援:
- 次回更新時刻:
```

社内向けでも、未確認の原因を断定しない。AI 要約を使う場合は、source と確認者を明記する。

### 6.7.2 顧客向け communication template

```markdown
# Customer communication

- 発生している事象:
- 影響を受ける可能性がある範囲:
- お客様にお願いしたいこと:
- 当社で実施済みの対応:
- データ / セキュリティ影響の現時点評価:
- 次回更新予定:
- 問い合わせ先:
```

顧客向け説明では、AI の内部構造を詳述しすぎない。重要なのは、影響、対応、再発防止、次回連絡、問い合わせ先である。情報漏えいや契約影響が疑われる場合は、Legal / Security の確認を経る。

### 6.7.3 経営向け communication template

```markdown
# Executive incident brief

## Decision needed
- 継続 / 停止 / 顧客通知 / 外部公表 / 追加予算 / ベンダー escalation など

## Current assessment
- Severity:
- 顧客影響:
- 事業影響:
- 法務 / 監査 / 契約影響:
- コスト影響:

## Actions taken
- kill switch:
- quarantine:
- rollback:
- manual takeover:
- external communication:

## Risks and options
- Option A:
- Option B:
- 推奨:

## Next update
- 時刻:
- Owner:
```

経営向けには、技術詳細よりも、意思決定が必要な事項、事業影響、外部説明、リスク受容、追加支援を示す。

## 6.8 operational guardrail と訓練を継続する {#section-6-8}

AI incident 対応は、runbook を作って終わりではない。guardrail が動くか、alert が届くか、manual takeover が実行できるか、顧客説明が承認されるかを定期的に訓練する。

### 6.8.1 operational guardrail checklist

- [ ] prompt injection を想定した eval / regression がある。
- [ ] retrieval failure、stale knowledge、citation failure を検知する check がある。
- [ ] tool 実行は least privilege で、destructive / external 操作には approval gate がある。
- [ ] MCP / connector の scope と token が定期レビューされている。
- [ ] kill switch、quarantine、rollback、manual takeover の手順が最新である。
- [ ] provider outage 時の fallback と degrade gracefully が定義されている。
- [ ] token / cost anomaly の alert、上限、停止条件がある。
- [ ] audit completeness を確認する項目が release readiness に入っている。
- [ ] communication template が社内 / 顧客 / 経営向けに分かれている。
- [ ] postmortem action item が次の eval、runbook、training に反映される。

この checklist は、リリース前だけでなく、モデル変更、prompt 変更、retrieval index 更新、tool 追加、権限変更、契約変更のたびに確認する。

### 6.8.2 tabletop exercise

AI incident の訓練では、実際に次を確認する。

| シナリオ | 確認すること |
| --- | --- |
| prompt injection を含む文書が retrieval される | 検知、回答停止、citation validation、postmortem |
| agent が誤った外部操作を提案する | approval gate、tool 権限、Human-in-the-loop |
| provider outage が発生する | fallback、degrade gracefully、顧客説明 |
| token / cost anomaly が発生する | alert、rate limit、kill switch、CFO 連絡 |
| approval bypass が見つかる | quarantine、policy 修正、監査証跡 |
| citation failure が顧客回答に混入する | 回答回収、顧客連絡、eval dataset 更新 |

訓練では、成功した手順だけでなく、迷った判断、探せなかった証跡、古い連絡先、実行できなかった rollback を記録する。

### 6.8.3 runbook の陳腐化を防ぐ

AI incident runbook は、モデル、provider、connector、業務、契約、規程の変化で陳腐化する。次のタイミングで更新する。

- 新しい tool / connector / MCP server を追加したとき。
- model / provider / retrieval index / prompt を変更したとき。
- approval matrix、権限、契約、データ越境条件が変わったとき。
- postmortem で新しい failure mode が見つかったとき。
- tabletop exercise で手順不備が見つかったとき。
- 監査、法務、セキュリティから指摘を受けたとき。

runbook の更新は、ドキュメント作業ではなく、運用統制の変更である。Owner、reviewer、承認、次回訓練日を持たせる。

## 6.9 章末成果物を作る {#section-6-9}

本章の成果物は、事故対応をその場の判断にしないための運用セットである。

### 6.9.1 成果物の接続

| 成果物 | 主な利用者 | 入力 | 出力 |
| --- | --- | --- | --- |
| AI incident runbook | SRE / EM / Security | threat model、approval matrix、risk register | 初動、停止、隔離、復旧、連絡手順 |
| severity matrix | Incident Commander | 影響、データ、権限、契約、顧客影響 | SEV 判定、通知先、初動 |
| incident timeline template | Incident team | trace、log、approval、change、communication | 事実、仮説、判断、実行、結果 |
| communication template | Communication Lead | 影響範囲、確定事実、未確定事項 | 社内 / 顧客 / 経営向け説明 |
| postmortem template | Incident team / 監査 | timeline、root cause、metric、action | 再発防止、owner、完了証跡 |
| operational guardrail checklist | Tech Lead / Security | eval、tool、approval、runbook | リリース前・変更前の確認 |
| metrics dashboard | SRE / Owner | quality、tool、cost、approval、audit | 異常検知、改善判断 |

成果物は、別々に作ると矛盾する。severity matrix の通知先、runbook の escalation、communication template の承認者、postmortem の owner は、同じ責任設計に基づく必要がある。

### 6.9.2 AI incident runbook skeleton

```markdown
# AI incident runbook

## Scope
- 対象システム:
- 対象 AI 機能:
- 対象 tool / connector / MCP:

## Severity
- SEV 判定基準:
- incident declaration 条件:

## Roles
- Incident Commander:
- Technical Lead:
- Security Lead:
- Communication Lead:
- Legal / Compliance:
- Field Owner:

## Detection
- alerts:
- metrics:
- manual reports:

## Containment
- kill switch:
- quarantine:
- rollback:
- manual takeover:
- degrade gracefully:

## Approval and audit
- 実行前承認:
- 事後監査:
- 必須証跡:

## Communication
- internal:
- customer:
- executive:

## Recovery and validation
- 復旧条件:
- eval / regression:
- audit completeness:

## Postmortem
- 開催条件:
- template:
- action item tracking:
```

runbook は、印刷して読める説明書ではなく、incident 中に実行できる作業手順である。リンク切れ、担当者不在、承認者不明、古い rollback 手順がある runbook は、事故時には機能しない。

### 6.9.3 章末ミニケース

```text
対象: 社内ナレッジアシスタント
事象: 引用なしの古い規程回答を現場が顧客対応に利用した
分類: stale knowledge + citation failure + human review 不足
severity: SEV-2（限定顧客影響、契約影響は調査中）
containment: 回答生成を停止し、検索のみへ degrade。対象回答を quarantine
初動: 顧客影響範囲を確認し、Communication Lead が一次連絡を準備
証跡: query log、retrieved document、citation check、回答、利用者、顧客対応履歴
再発防止: citation coverage 必須化、stale document alert、manual takeover training、postmortem action
```

このケースでは、原因を「AI が古い情報を出した」で終わらせない。retrieval index 更新、citation validation、現場レビュー、顧客説明、runbook、教育をまとめて改善する。

## まとめ

AI を含むシステムの危機管理では、従来の障害対応に加えて、誤回答、誤操作、権限逸脱、情報漏えい、承認 bypass、provider outage、コスト暴走、retrieval / citation failure を扱う必要がある。これらは、技術問題であると同時に、説明責任、監査、法務、現場運用の問題である。

重要なのは、事故発生後に正しい文章を書くことではない。平時から severity matrix、AI incident runbook、kill switch、quarantine、rollback、approval、audit、communication template、postmortem、operational guardrail checklist を用意し、訓練し、更新することである。

AI は、incident response を支援できる。しかし、何を止め、何を顧客へ説明し、どのリスクを受容し、どの再発防止を完了とみなすかは、人と組織が責任を持つ判断である。

## この章のまとめとチェックリスト

### この章のまとめ

- AI incident は、サービス停止だけでなく、誤回答、誤操作、権限逸脱、情報漏えい、approval bypass、コスト暴走、retrieval / citation failure を含む。
- severity は、顧客影響、情報影響、権限影響、法務・監査影響、事業継続影響で決める。
- kill switch、quarantine、rollback、manual takeover、escalation は、原因確定前に発動できるようにする。
- どこまで自動化してよいかを、Human-in-the-loop / Human-on-the-loop / Full automation の境界として明文化する。
- 実行前承認と事後監査は対立しない。承認ログ、tool call、trace、communication、postmortem を紐づける。
- postmortem は blame を避けつつ、owner、期限、完了証跡を持つ accountable な改善にする。

### この章を読み終えたら確認したいこと

- [ ] severity matrix に AI 固有の誤回答、情報漏えい、権限逸脱、approval bypass、コスト暴走が入っている。
- [ ] prompt injection、retrieval failure、stale knowledge、citation failure、MCP authorization failure を検知する evidence が定義されている。
- [ ] kill switch、quarantine、rollback、manual takeover、degrade gracefully、escalation の発動条件と解除条件がある。
- [ ] Human-in-the-loop / Human-on-the-loop / Full automation の境界が runbook に書かれている。
- [ ] 実行前承認と事後監査のために、input、output、source、tool call、approval、change、communication が残る。
- [ ] hallucination rate proxy、tool error rate、approval rejection rate、citation coverage、latency distribution、token / cost anomaly、fallback rate、manual takeover rate、audit completeness を観測している。
- [ ] AI incident runbook、postmortem template、communication template、incident timeline template が存在する。
- [ ] operational guardrail checklist が、リリース前、model / prompt / tool / connector 変更前、postmortem 後に使われている。
- [ ] postmortem action item に owner、期限、完了証跡がある。

### 関連する付録・テンプレート

- [付録A：実務成果物テンプレート集](../../appendices/templates/) - AI incident runbook、postmortem、severity matrix、communication template の雛形として利用する。
- [付録B：ケーススタディ](../../appendices/case-studies/) - 社内ナレッジアシスタント、agent-assisted delivery、障害調査支援を incident response の観点で読み直す。
- [付録C：推奨読書リスト](../../appendices/reading-list/) - OWASP LLM Top 10、MITRE ATLAS、Google SRE など、security / incident / reliability の参照元を確認する。
- [付録D：更新方針と更新履歴](../../appendices/update-notes/) - モデル、provider、API、UI、価格、契約条件の変化を本文に固定しすぎない方針を確認する。
