---
title: "第5章：ステークホルダーマネジメント - AI投資・統制・説明責任の合意形成"
subtitle: "AI投資・統制・説明責任の合意形成"
description: "CFO、法務、セキュリティ、監査、現場責任者の関心を整理し、AI投資、ROI / TCO / control cost、vendor concentration、契約、データ越境、退出戦略を意思決定メモへ落とす章"
layout: book
chapter: 5
---

# 第5章：ステークホルダーマネジメント - AI投資・統制・説明責任の合意形成

AI活用の提案は、技術的に優れているだけでは通らない。経営層は投資対効果と事業リスクを見ている。CFO は予算、TCO、採算、撤退条件を確認する。法務は契約、データ越境、責任分界を確認する。セキュリティは権限、監査ログ、情報漏えい、prompt injection を確認する。監査は証跡、承認、統制の継続性を確認する。現場責任者は業務負荷、例外処理、教育、失敗時の顧客影響を確認する。

AI時代のステークホルダーマネジメントは、反対者を説得する技術ではない。異なる関心を、同じ意思決定資料の中で比較できる形へ変換し、採用、保留、縮小、撤退のいずれも説明できる状態を作る活動である。

本章では、第2章の requirements brief、第3章の AI system ADR / threat model / eval plan、第4章の delivery metrics / release readiness を、経営・法務・セキュリティ・監査・現場が合意できる資料へ変換する方法を扱う。中心に置くのは、productivity benefit だけではない。verification cost、control cost、training cost、incident cost、vendor concentration、exit strategy を同時に示し、失敗時の説明責任まで含めて判断することである。

## この章で扱う判断

本章で扱う判断は、次の8つである。

1. CFO、法務、セキュリティ、監査、現場責任者の関心をどう分け、誰をどの順序で巻き込むか。
2. productivity benefit と verification cost、control cost を同じ単位でどう示すか。
3. buy / build / partner のどれを選び、どの条件なら再判断するか。
4. PoC 止まりを避けるために、採算、運用移行、承認、撤退条件をどう先に置くか。
5. 失敗時の説明責任、顧客影響、社内報告、監査証跡を誰が持つか。
6. ベンダー集中リスク、契約、データ越境、退出戦略をどこまで意思決定前に確認するか。
7. AI literacy / responsible use を、研修ではなく組織統制としてどう運用するか。
8. 稟議・合意形成で通る資料を、経営層向け説明と現場向け説明にどう分けるか。

## 誰向けか

- **EM / Tech Lead**: AI活用の提案を、現場の生産性だけでなく、費用、統制、承認、運用移行まで説明したい人。
- **Architect**: buy / build / partner、vendor portability、exit strategy を、AI system ADR から投資判断へ接続したい人。
- **SRE / DevOps**: reliability、incident response、rollback、manual takeover、運用負荷を事前合意したい人。
- **Security / Compliance / Legal**: データ分類、契約、データ越境、監査ログ、責任分界、policy exception を確認したい人。
- **CFO / 事業責任者向けに説明する人**: ROI、TCO、control cost、採算ライン、撤退条件を1ページで示したい人。

## 章末に残るもの

この章を読み終えた時点で、次の成果物を作れる状態を目指す。

- 1ページ提案メモ
- 役員向け意思決定メモ
- ステークホルダーマップ
- リスク登録票
- ROI / TCO / control cost 整理表
- 反対意見への回答テンプレ
- buy / build / partner 判断表
- 稟議前レビュー checklist

## よくある失敗

| 失敗 | 何が起きるか | 防止策 |
| --- | --- | --- |
| productivity benefit だけを示す | CFO、監査、セキュリティが verification cost と control cost を後から指摘し、稟議が戻る | benefit、TCO、control cost、risk exposure を同じ表に置く（§5.2） |
| PoC の成功を本番採用の根拠にする | 業務移行、教育、監査、運用費用が未計上で止まる | PoC 前に採算ライン、運用移行、撤退条件を定義する（§5.4） |
| 法務・セキュリティ・監査を後工程に置く | 契約、データ越境、監査ログ不足で導入直前に止まる | stakeholder map と risk register へ早期に入れる（§5.1、§5.5） |
| buy / build / partner を好みで選ぶ | ベンダー集中、内製保守不能、責任分界の曖昧さが残る | 判断表と exit strategy を意思決定メモに入れる（§5.3、§5.6） |
| 失敗時の説明責任を書かない | 誤回答、漏えい、誤操作時に承認者、報告先、補償範囲が不明になる | accountability matrix、communication template、rollback を合意する（§5.5、§5.9） |
| 経営層向け説明と現場向け説明を混ぜる | 経営層には詳細すぎ、現場には抽象的すぎる資料になる | 意思決定メモと現場運用説明を分ける（§5.8） |

## 本章とAI協働の標準手順（SOP）

本章は、[AI協働の標準手順（SOP）](../../introduction/ai-collaboration-sop/) のうち、特に次の工程に対応する。

- Issue化: AI活用の目的、対象業務、意思決定者、承認者、反対意見、非目標を明文化する。
- 情報分類: 契約情報、顧客データ、個人情報、営業秘密、監査対象情報を分ける。
- Plan作成: stakeholder map、decision owner、reviewer、escalation、approval gate、撤退条件を定義する。
- 入力設計: 経営層向け、法務向け、セキュリティ向け、現場向けの資料粒度を分ける。
- 評価設計: productivity benefit、verification cost、control cost、risk exposure、fallback cost を測る。
- 反映: 1ページ提案メモ、役員向け意思決定メモ、risk register、ROI / TCO / control cost 表へ落とす。
- レビュー・承認: 契約、データ越境、audit、rollback、responsible use、失敗時説明責任を確認する。

本章の目的は、AI投資を通すための飾り資料を作ることではない。採用しない判断、段階導入する判断、撤退する判断も含めて、説明可能な合意形成を行うことである。

## 5.1 ステークホルダーの関心を分ける {#section-5-1}

AI活用の合意形成では、全員へ同じ説明をしても進まない。ステークホルダーごとに、見ている損益、リスク、責任、成功条件が異なるためである。

最初に行うべきことは、賛成者と反対者を分けることではない。意思決定に必要な関心を分解し、どの成果物で回答するかを対応付けることである。

### 5.1.1 関心と回答成果物

| ステークホルダー | 主な関心 | よくある質問 | 回答する成果物 |
| --- | --- | --- | --- |
| CFO | ROI、TCO、control cost、採算ライン、撤退条件 | いつ投資回収するか。検証と統制の費用は含まれているか | ROI / TCO / control cost 整理表、1ページ提案メモ |
| 法務 | 契約、責任分界、データ越境、知財、補償、利用規約 | 入力データと出力物の権利はどう扱うか。事故時の責任は誰が負うか | 契約確認表、risk register、役員向け意思決定メモ |
| セキュリティ | データ分類、アクセス権、least privilege、監査ログ、情報漏えい | 個人情報や秘密情報は投入されないか。権限逸脱をどう防ぐか | data / permission boundary table、tool approval matrix、risk register |
| 監査 | 承認証跡、変更履歴、例外処理、職務分掌、継続的統制 | 誰が承認し、どの証跡が残るか。例外はどう記録するか | approval matrix、audit trail 設計、稟議前レビュー checklist |
| 現場責任者 | 業務負荷、教育、例外処理、手戻り、顧客影響 | 現場の作業は本当に減るか。失敗時に誰が止めるか | 現場向け説明資料、runbook、反対意見への回答テンプレ |
| 経営層 | 事業価値、競争優位、主要リスク、意思決定期限 | 今決める理由は何か。失敗しても説明できるか | 役員向け意思決定メモ、1ページ提案メモ |

この表は、説明順序を決めるためにも使う。法務やセキュリティの確認が前提になる案件では、CFO 向けの採算説明より先に、データ利用境界と契約制約を確認する。現場の例外処理が成立しない案件では、経営層の承認があっても本番導入しない。

### 5.1.2 ステークホルダーマップ

ステークホルダーマップは、人物一覧ではなく、意思決定の詰まりどころを可視化する道具である。少なくとも、次の項目を持たせる。

| 項目 | 書くこと |
| --- | --- |
| Role | CFO、法務、セキュリティ、監査、現場責任者、事業責任者など |
| Decision right | 承認、助言、拒否権、運用責任、説明責任のどれを持つか |
| Concern | 金額、契約、情報管理、監査、業務負荷、顧客影響など |
| Evidence needed | ROI 表、契約確認、threat model、audit trail、runbook など |
| Timing | PoC 前、本番前、契約前、リリース前、定期レビュー時 |
| Escalation | 合意不能な場合の相談先、決裁者、リスク受容者 |

例を次に示す。

| Role | Decision right | Concern | Evidence needed | Timing | Escalation |
| --- | --- | --- | --- | --- | --- |
| CFO | 予算承認 | 年間TCOと採算ライン | ROI / TCO / control cost 表 | PoC 予算前、本番投資前 | 事業責任者 |
| 法務 | 契約レビュー | データ越境、責任分界、知財 | 契約確認表、データ分類 | 契約締結前 | 法務責任者 |
| セキュリティ | 利用可否レビュー | 権限、ログ、情報漏えい | threat model、tool approval matrix | PoC 前、本番前 | CISO または委任先 |
| 監査 | 統制確認 | 承認証跡、例外処理 | audit trail 設計、approval matrix | 本番前、四半期レビュー | 内部監査責任者 |
| 現場責任者 | 運用受入 | 教育、例外処理、停止手順 | runbook、現場向け説明 | pilot 前、本番前 | EM / 事業責任者 |

ステークホルダーマップは、提案資料の付録に置くだけでは不十分である。Plan の初期段階で作り、反対意見、未解決事項、必要な evidence を risk register と連動させる。

### 5.1.3 AIに任せる作業と人が持つ判断

ステークホルダー整理では、AIに任せてよい作業と、人が持つべき判断を分ける。

| 区分 | AIに任せてよい作業 | 人がレビューすること | 人が最終責任を持つこと |
| --- | --- | --- | --- |
| 関心整理 | 会議メモから論点候補を抽出する | 抽出漏れ、誤分類、機密情報の扱い | 誰を承認者にするか |
| 反対意見整理 | 反対意見をカテゴリ化する | 背景、政治的制約、法務・監査観点の妥当性 | 反対意見を受け入れるか、条件付きで進めるか |
| 資料草案 | 1ページ提案メモの構成案を作る | 数値、根拠、表現、責任分界 | 経営層へ提示する結論 |
| risk register | リスク候補を列挙する | 重大度、発生確率、所有者、緩和策 | リスク受容、撤退、延期の判断 |

AIが会議記録から「関係者の温度感」を要約できても、それは意思決定権限の確認にはならない。承認者、拒否権、説明責任者は、人が組織構造と規程に基づいて確認する。

## 5.2 productivity benefit と verification cost を同じ表で示す {#section-5-2}

AI投資の説明で最も多い失敗は、生産性向上を時間削減だけで語ることである。時間削減は重要だが、AI活用では確認、修正、監査、教育、例外処理の費用が増える場合がある。

経営に示すべきなのは、gross benefit ではなく、net benefit である。net benefit は、productivity benefit から verification cost、control cost、training cost、incident cost、運用移行費を引いた後に残る価値である。

### 5.2.1 ROI / TCO / control cost 整理表

次の表は、稟議前に最低限そろえる項目である。金額がまだ確定していない場合も、未確定欄として残す。空欄のまま承認に進めない。

| 区分 | 項目 | 見積もる内容 | Evidence | Owner |
| --- | --- | --- | --- | --- |
| Benefit | productivity benefit | 作業時間短縮、処理件数増、リードタイム短縮、品質向上 | 現行業務の実測、pilot 結果、作業ログ | 事業責任者 / EM |
| Benefit | risk reduction | 誤作業削減、検索漏れ削減、レビュー観点の標準化 | 既存 incident、品質記録、監査指摘 | EM / SRE |
| Cost | service / license | 利用料、追加 seat、API 利用、環境費 | 見積書、契約条件 | CFO / Procurement |
| Cost | implementation | 要件定義、連携開発、移行、テスト、セキュリティ対応 | 見積、WBS、過去実績 | Tech Lead |
| Cost | verification cost | eval、レビュー、手動確認、誤回答検証、regression | eval plan、受入条件、検証記録 | QA / Tech Lead |
| Cost | control cost | 承認、監査ログ、権限管理、policy exception、定期レビュー | control checklist、監査要求 | Compliance / Security |
| Cost | training cost | AI literacy、responsible use、現場教育、運用定着 | 研修計画、受講対象 | EM / 現場責任者 |
| Cost | fallback / rollback | 手動運用、切戻し、停止、再処理、顧客連絡 | runbook、rollback plan | SRE / 現場責任者 |
| Risk | incident exposure | 情報漏えい、誤判断、誤操作、契約違反の影響 | threat model、risk register | Security / Legal |
| Risk | vendor concentration | 価格改定、機能停止、契約変更、乗り換え費用 | exit strategy、代替案 | Architect / Procurement |

この表は、CFO に対して「費用も見ています」と示すだけの資料ではない。導入判断を延期すべき条件、PoC の成功条件、本番移行の条件、撤退条件を決めるための土台である。

### 5.2.2 net benefit の説明

net benefit は、次の形で説明すると合意しやすい。

```text
net benefit = productivity benefit + risk reduction
              - service / license cost
              - implementation cost
              - verification cost
              - control cost
              - training cost
              - fallback / rollback cost
              - expected incident exposure
```

この式は、厳密な会計式ではない。議論から漏れやすい費用とリスクを同じ画面に載せるための整理式である。CFO へ提示する場合は、会計上の扱い、資本化可否、償却、契約期間、解約条件を別途確認する。

AI導入の効果は、短期の工数削減だけではない。レビュー品質の標準化、属人性の低減、ナレッジ検索の改善、障害調査の初動短縮も benefit になり得る。ただし、これらを主張する場合は、測定方法と guardrail metric を同時に置く。

| 主張したい効果 | 対になる確認 | guardrail metric |
| --- | --- | --- |
| 問い合わせ回答時間が短縮する | 誤回答率、引用 coverage、escalation 率 | 誤回答の重大度、manual takeover rate |
| PR作成が速くなる | review rework、escaped defects、security finding | failed change rate、rollback rate |
| 障害調査が速くなる | 誤った要約、誤った外部操作、承認 bypass | approval rejection rate、audit completeness |
| 文書作成が速くなる | 古い情報の混入、根拠欠落、責任表現の誤り | documentation freshness、review correction rate |

productivity benefit を語るときは、必ず「何を速くするか」と「何が悪化していないことを確認するか」を対にする。

### 5.2.3 CFO 向けの説明粒度

CFO 向け説明では、技術詳細よりも次を優先する。

1. 投資の目的: どの事業指標、業務リスク、品質指標を改善するか。
2. 金額の範囲: 初期費用、継続費用、検証費、統制費、教育費、撤退費。
3. 期間: PoC、pilot、本番、効果測定、契約更新の時期。
4. 採算条件: どの条件を満たせば拡大し、満たせなければ縮小または撤退するか。
5. 主要リスク: 失敗時の最大損失、契約上の責任、顧客影響、監査指摘。
6. 代替案: 現状維持、既存ツール改善、buy / build / partner の比較。

CFO へは「AIだから投資すべき」と説明しない。「この業務リスクと機会に対して、AIを含む選択肢の中で、この段階投資が最も説明可能である」と説明する。

## 5.3 buy / build / partner を意思決定する {#section-5-3}

AI活用では、buy、build、partner の選択が早期に曖昧なまま進みやすい。PoC では外部サービスを使い、本番では内製連携が必要になり、責任分界と費用が再計算になることがある。

buy / build / partner は、技術選定ではなく、責任、費用、速度、統制、退出可能性の選択である。

### 5.3.1 判断表

| 選択肢 | 向いている条件 | 主なリスク | 必ず確認すること |
| --- | --- | --- | --- |
| buy | 汎用業務、標準機能で足りる、導入速度を優先する | ベンダー集中、契約制約、データ越境、カスタマイズ限界 | 利用規約、データ利用、監査ログ、SLA、解約条件 |
| build | 差別化領域、独自データ、厳格な権限・監査要件がある | 開発・運用負荷、評価基盤不足、属人化 | eval harness、運用体制、セキュリティ設計、保守予算 |
| partner | 業務知識や導入支援が必要、短期で現場定着したい | 責任分界の曖昧さ、再委託、知識移転不足 | RACI、成果物所有権、データ取扱、引き継ぎ条件 |
| hybrid | 標準機能と独自統制を組み合わせる | 複雑性、障害時切り分け、二重コスト | アーキテクチャ境界、監査ログ統合、fallback |

判断表では、採用理由だけでなく、採用しない理由も残す。例えば buy を選ぶ場合は、内製しない理由と、ベンダー退出時に保持すべきデータ、設定、評価結果、運用手順を明記する。

### 5.3.2 decision memo への落とし込み

役員向け意思決定メモでは、buy / build / partner を次の形式で示す。

| 項目 | buy | build | partner | 推奨 |
| --- | --- | --- | --- | --- |
| 初期速度 | 高い | 低いから中程度 | 中程度 | buy で pilot |
| 長期TCO | 契約次第 | 内製運用費が高い | 支援契約が継続 | pilot 後に再評価 |
| 統制 | ベンダー機能に依存 | 自社設計可能 | 契約と運用で分担 | 監査ログ要件を条件化 |
| データ越境 | 要確認 | 自社制御しやすい | 再委託を含め要確認 | 法務レビュー前提 |
| 退出戦略 | 必須 | 技術負債の整理が必要 | 知識移転が必須 | 契約に export と移行支援を入れる |
| 失敗時責任 | 契約と自社運用で分かれる | 自社責任が大きい | RACI が重要 | RACI を承認条件にする |

推奨欄には、単一の答えではなく、段階判断を書いてよい。例えば「buy で pilot、6週間後に eval と TCO を再計算し、データ越境が解消できなければ中止」と書く。この書き方は、AI活用の不確実性を前提にした説明として有効である。

### 5.3.3 判断を変える条件

意思決定メモには、判断を変える条件を明記する。

| 条件 | 判断への影響 | 事前に決める対応 |
| --- | --- | --- |
| verification cost が benefit を上回る | 拡大しない、用途を限定する | 受入条件を再設定し、手動確認範囲を縮小できるか確認する |
| データ越境や契約条件が満たせない | buy / partner を止める | 国内処理、匿名化、別サービス、build を検討する |
| 監査ログが必要粒度で残らない | 本番導入しない | ログ追加、権限分離、承認フローを追加する |
| ベンダー価格が大幅に上がる | TCO を再計算する | 契約更新前に代替案を評価する |
| 現場の例外処理が増える | 運用設計を見直す | runbook、教育、対象業務の絞り込みを行う |

AI投資は、初回判断で固定しない。再判断条件を置くことで、CFO、法務、セキュリティ、現場責任者が、リスクを受け入れやすくなる。

## 5.4 PoC 止まりを避ける採算設計を作る {#section-5-4}

PoC は、技術的に動くことを確認する活動ではない。PoC は、本番採用に進めるか、縮小するか、中止するかを判断するための evidence を集める活動である。

PoC 止まりになる案件では、採算、運用移行、承認、データ、セキュリティ、教育、契約のいずれかが後回しになっている。

### 5.4.1 PoC 前に決めること

| 項目 | 決める内容 | 決めない場合の問題 |
| --- | --- | --- |
| Decision to make | PoC 後に何を判断するか | 「動いた」で終わる |
| Success criteria | どの数値・品質・統制を満たすか | 主観的な成功判定になる |
| Stop criteria | どの条件なら中止するか | 失敗を認められず費用が増える |
| Scope | 対象業務、対象データ、対象利用者 | 本番範囲へ外挿できない |
| Evidence | 測定するログ、eval、利用記録、監査証跡 | CFO や監査へ説明できない |
| Operational handoff | runbook、問い合わせ先、manual takeover | 現場受入で止まる |
| Approval | 本番前に誰が承認するか | 後工程で拒否される |
| Exit | データ、設定、評価結果、契約をどう閉じるか | ベンダー依存や残存データが残る |

PoC の成功条件には、quality だけでなく cost と control を入れる。例えば「回答正確性が一定以上」だけでは不十分である。「引用 coverage、manual takeover rate、verification cost、監査ログ completeness、現場教育時間」が同時に見える必要がある。

### 5.4.2 採算ラインを設定する

採算ラインは、事業価値と統制コストの境界である。PoC 前に、次のように定義する。

| 指標 | 採算ラインの例 | 見る理由 |
| --- | --- | --- |
| 処理時間 | 現行比 20% 以上の短縮 | productivity benefit を確認する |
| 誤回答対応 | 重大誤回答 0、軽微誤回答は運用で吸収可能 | 失敗時の説明責任を確認する |
| verification cost | 1件あたり確認時間が benefit の半分以下 | 確認コストで相殺されないか見る |
| manual takeover | 例外処理の手動引き継ぎが定義済み | 現場が止められるか見る |
| control cost | 承認、監査、権限管理が運用可能な工数内 | 統制が継続可能か見る |
| adoption | 対象利用者の利用率と教育完了率 | 現場定着を確認する |

ここで示す数値は、組織や業務によって変わる。重要なのは、数字の大きさではなく、事前に合意し、測定方法を決め、未達の場合に判断を変えることである。

### 5.4.3 pilot から本番への移行条件

PoC から pilot、本番へ進める条件は、次のように段階化する。

| 段階 | 目的 | 進む条件 | 止める条件 |
| --- | --- | --- | --- |
| PoC | 技術・データ・業務仮説を確認する | eval と業務ログで仮説が確認できる | データ制約、契約、重大リスクが解消できない |
| Pilot | 限定業務で運用と統制を確認する | runbook、approval、audit、training が回る | 例外処理が増え、現場負荷が高い |
| Production | 標準業務へ組み込む | SLO、support、incident response、定期レビューが定義済み | TCO、control cost、risk exposure が受容不可 |
| Scale | 対象部門やユースケースを拡大する | 成果、統制、教育が再利用できる | ベンダー集中やデータ境界が拡大に耐えない |

本番移行条件は、経営層向け資料と現場向け資料の両方に入れる。経営層には投資判断の段階ゲートとして、現場には作業受入と停止条件として説明する。

## 5.5 法務・セキュリティ・監査と合意する {#section-5-5}

AI活用では、法務・セキュリティ・監査を「承認してもらう相手」として後から呼ぶと失敗しやすい。これらの専門家は、導入を止めたいのではなく、事業として説明できる条件を確認している。

早期に合意すべき論点は、契約、データ、権限、監査、責任、例外処理である。

### 5.5.1 合意論点チェック

| 領域 | 確認すること | 合意できない場合の対応 |
| --- | --- | --- |
| 契約 | 利用規約、責任制限、補償、再委託、知財、出力物の扱い | 条項修正、利用範囲限定、別案検討 |
| データ越境 | 入力データ、ログ、メタデータ、サポートアクセスの所在 | 匿名化、国内処理、投入禁止、データ分離 |
| privacy | 個人情報、要配慮情報、同意、目的外利用 | 利用目的の明確化、DPIA 相当の確認、マスキング |
| security | least privilege、MFA、監査ログ、暗号化、secret 管理 | 権限設計変更、ログ追加、導入延期 |
| compliance | 規程、業界ルール、社内ポリシー、保存期間 | policy exception、承認記録、対象業務の限定 |
| audit | 誰がいつ何を承認したか、AI出力をどう利用したか | approval workflow、変更履歴、検証記録を追加 |
| rollback | 停止、手動復旧、顧客連絡、再処理 | runbook と communication template を整備 |

この表は、risk register と連動させる。合意できない項目は、単なる宿題ではない。採用判断を変える可能性があるリスクとして扱う。

### 5.5.2 失敗時の説明責任

AI活用の提案では、成功時の効果だけでなく、失敗時に誰が何を説明するかを明記する。

| 失敗シナリオ | 初動責任 | 説明先 | 必要な証跡 | 事前対策 |
| --- | --- | --- | --- | --- |
| 誤回答により顧客対応を誤る | 現場責任者 / EM | 顧客、事業責任者 | 入力、出力、参照元、承認者、修正履歴 | 引用必須、manual takeover、回答禁止条件 |
| 機密情報が外部AIへ投入される | Security / EM | 経営、法務、監査、顧客 | 入力ログ、利用者、データ分類、アクセス権 | data boundary、DLP、投入前チェック |
| tool 実行で誤操作が発生する | SRE / Tech Lead | 事業責任者、監査 | 実行ログ、承認ログ、rollback 記録 | approval gate、least privilege、dry-run |
| 契約違反やデータ越境が判明する | Legal / Compliance | 経営、監査、取引先 | 契約、データフロー、ベンダー回答 | 契約レビュー、データ所在確認 |
| コストが急増する | CFO / Owner | 経営、事業責任者 | 利用量、請求、予算閾値、変更履歴 | cost alert、利用上限、停止条件 |

説明責任は、事故後に作れない。利用ログ、承認ログ、評価結果、変更履歴、契約確認、risk register がそろって初めて、説明可能になる。

### 5.5.3 risk register の作り方

risk register（リスク登録票）は、リスク一覧ではなく、判断と所有者を持つ運用台帳である。

| ID | Risk | Cause | Impact | Owner | Mitigation | Evidence | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-01 | 顧客情報の外部投入 | 入力境界が曖昧 | privacy / 契約違反 | Security | データ分類、投入禁止、DLP | data boundary table | PoC 前に解消 |
| R-02 | 誤回答を現場が採用 | 引用不足、確認手順不足 | 顧客対応ミス | 現場責任者 | 引用必須、manual takeover | eval、運用ログ | pilot で測定 |
| R-03 | 監査ログ不足 | ツールのログ粒度不足 | 監査指摘、導入延期 | Compliance | ログ要件、approval matrix | audit trail 設計 | 本番前に解消 |
| R-04 | ベンダー集中 | データ・設定が移行困難 | TCO増、交渉力低下 | Architect | export、代替案、契約条項 | exit strategy | 契約前に合意 |
| R-05 | verification cost 超過 | 手動確認が多い | 採算悪化 | EM | 対象業務の絞り込み、eval 改善 | ROI 表、検証ログ | 拡大判断で再評価 |

各リスクには owner を置く。owner がないリスクは、会議で認識されても運用では解消されない。

## 5.6 vendor concentration と exit strategy を説明する {#section-5-6}

AI活用では、特定ベンダーや特定モデルへの依存が短期間で大きくなることがある。依存自体が悪いわけではない。問題は、依存範囲、代替可能性、契約変更時の影響、退出手順が説明できないことである。

vendor concentration は、技術リスク、財務リスク、法務リスク、運用リスクをまたぐ論点である。

### 5.6.1 ベンダー集中リスクの分解

| リスク | 具体例 | 確認する evidence |
| --- | --- | --- |
| 技術依存 | 特定API、独自workflow、専用データ形式に依存する | architecture decision matrix、export 仕様 |
| データ依存 | 会話ログ、embedding、評価データ、設定が移行しにくい | data inventory、バックアップ、削除手順 |
| 契約依存 | 価格改定、利用規約変更、SLA 変更の影響が大きい | 契約条項、更新条件、解約条件 |
| 運用依存 | 監査ログ、権限、承認フローが特定製品に閉じる | audit trail、権限設計、運用手順 |
| 人材依存 | 特定ツール前提の運用知識しか残らない | training plan、runbook、引き継ぎ資料 |

この分解により、「ベンダーロックインが怖い」という抽象論を、具体的なコントロールへ変換できる。

### 5.6.2 契約 / データ越境 / 退出戦略

契約前に、次の checklist を確認する。

| 項目 | 確認する質問 | 必要な対応 |
| --- | --- | --- |
| データ利用 | 入力、出力、ログ、メタデータは学習や改善に使われるか | 利用停止条項、投入禁止情報、匿名化 |
| データ越境 | データ保存、処理、サポートアクセスはどの地域で行われるか | 法務確認、顧客契約確認、利用範囲限定 |
| 削除 | 契約終了時にデータを削除できるか | 削除証明、保存期間、バックアップ扱い |
| export | 会話ログ、設定、評価結果、運用記録を取り出せるか | export 手順、形式、頻度、責任者 |
| SLA | 障害、性能劣化、サポート、通知の条件は何か | degrade gracefully、fallback、顧客連絡 |
| 監査 | 監査ログ、第三者報告、証跡提出は可能か | audit 要件、証跡保管、アクセス権 |
| 再委託 | サブプロセッサや外部連携先は誰か | 再委託先一覧、変更通知、拒否権 |
| 責任制限 | 損害、補償、免責、知財侵害の扱いは何か | risk acceptance、保険、利用範囲限定 |

退出戦略は、契約をやめる時の手続きだけではない。導入時点から、データ、設定、評価結果、利用ログ、運用手順、教育資料を自社側に残す設計である。

### 5.6.3 exit strategy note

意思決定メモには、次の exit strategy note を入れる。

```markdown
## Exit strategy note

- 退出が必要になる条件:
  - 価格、契約、データ越境、SLA、監査、品質、セキュリティのいずれが閾値を超えた場合か。
- 退出時に保持するもの:
  - 設定、prompt、workflow 定義、評価データ、評価結果、利用ログ、runbook、教育資料。
- 代替案:
  - 現状維持、別サービス、内製、partner 支援、対象業務縮小。
- 移行の見積:
  - 期間、費用、停止時間、顧客影響、再教育、監査対応。
- 承認者:
  - 退出判断者、予算承認者、法務、セキュリティ、現場責任者。
```

exit strategy が書けない場合、その時点では本番導入ではなく、PoC または限定 pilot に留める判断が妥当である。

## 5.7 AI literacy / responsible use を組織設計に入れる {#section-5-7}

AI literacy は、プロンプトの書き方を学ぶ研修だけではない。組織として、AIに任せる作業、人がレビューする作業、人が最終責任を持つ判断を共有し、逸脱を検知し、改善する仕組みである。

responsible use は、理念ではなく運用で確認する。利用者が禁止情報、承認条件、引用、検証、顧客説明、監査ログを理解していなければ、AI活用は統制されない。

### 5.7.1 組織面の設計項目

| 項目 | 設計する内容 | Evidence |
| --- | --- | --- |
| 利用ポリシー | 利用可能業務、禁止情報、承認条件、記録義務 | AI use policy、training material |
| role-based training | IC、Tech Lead、EM、Security、現場向けに粒度を分ける | 受講記録、理解度確認 |
| approval | どの操作、どのデータ、どの外部連携で承認が必要か | approval matrix、tool approval matrix |
| monitoring | 利用量、例外、誤回答、policy exception を確認する | dashboard、audit log |
| feedback loop | 現場の反対意見、事故、誤回答、改善案を集める | retrospective、risk register 更新 |
| sanctions / correction | 逸脱時の是正、停止、再教育、権限変更 | incident record、access review |

研修の完了は、利用可能の十分条件ではない。対象業務のリスク、利用者の権限、データ分類、運用責任によって、使ってよい機能と承認条件を変える。

### 5.7.2 responsible use checklist

現場展開前に、次を確認する。

- AIへ投入してよい情報と禁止情報を、利用者が説明できる。
- AI出力をそのまま顧客、経営、監査、契約文書へ転記しないルールがある。
- 引用、根拠、確認者、修正履歴を残す手順がある。
- 誤回答、情報漏えい、誤操作、コスト急増の報告先が明確である。
- approval、audit、rollback、manual takeover の手順が runbook にある。
- policy exception の申請、承認、期限、再評価が定義されている。
- AIを使わない選択肢や手動手順が残っている。

この checklist は、経営層への安心材料ではなく、現場の防御線である。使い方を誤った場合に、利用者だけの責任にしないための組織設計でもある。

### 5.7.3 skill degradation への対応

AI活用が進むと、現場の設計、調査、レビュー、説明能力が弱くなる可能性がある。第4章で扱った skill degradation は、ステークホルダー説明でも重要である。

| 兆候 | 影響 | 対応 |
| --- | --- | --- |
| AI出力を根拠として扱う | 説明責任が弱くなる | source hierarchy と一次情報確認を徹底する |
| レビュー観点をAIに丸投げする | 見落としと責任不在が増える | human review checklist と採否理由を残す |
| 現場が例外処理できない | 障害時に業務が止まる | manual takeover drill、runbook 訓練を行う |
| 数値だけで採用を拡大する | 現場負荷や統制費が増える | feedback loop と risk register を定期更新する |

AI literacy は、利用促進だけでなく、利用制限、停止、手動復旧を含む。

## 5.8 稟議・合意形成で通る資料を作る {#section-5-8}

稟議で通る資料とは、良く見える資料ではない。意思決定者が、何を承認し、どのリスクを受容し、どの条件なら止めるかを理解できる資料である。

AI活用の資料は、経営層向け説明と現場向け説明を分ける必要がある。

### 5.8.1 経営層向け説明と現場向け説明の違い

| 観点 | 経営層向け説明 | 現場向け説明 |
| --- | --- | --- |
| 目的 | 投資判断、リスク受容、優先順位決定 | 使い方、例外処理、停止条件、問い合わせ先 |
| 粒度 | 1ページ提案、意思決定メモ、主要リスク | runbook、FAQ、操作手順、チェックリスト |
| 数値 | ROI、TCO、control cost、採算ライン | 作業時間、確認手順、手戻り、教育時間 |
| リスク | 事業影響、契約、監査、レピュテーション | 誤回答、手動引き継ぎ、顧客対応、権限 |
| 結論 | 採用、段階導入、延期、撤退 | いつ使うか、いつ使わないか、誰へ escalate するか |
| Evidence | pilot 結果、risk register、契約確認、budget | 具体例、禁止事項、運用ログ、問い合わせ履歴 |

経営層向け資料に操作手順を入れすぎると、判断点がぼやける。現場向け資料に経営メッセージだけを書くと、利用者が失敗時に動けない。資料は同じ根拠から作るが、目的と粒度を分ける。

### 5.8.2 1ページ提案メモ

1ページ提案メモは、稟議前の合意形成に使う。詳細資料への入口であり、議論の焦点を合わせるための成果物である。

```markdown
# 1ページ提案メモ

## 提案
- 対象業務:
- 提案内容:
- 今回決めたいこと:

## 背景と問題
- 現行課題:
- 影響を受ける利用者:
- 放置した場合のリスク:

## 期待効果
- productivity benefit:
- risk reduction:
- 測定方法:

## 費用と統制
- 初期費用:
- 継続費用:
- verification cost:
- control cost:
- training / rollback cost:

## 主要リスク
- 契約 / データ越境:
- security / privacy:
- audit / approval:
- vendor concentration:
- 現場負荷:

## 判断案
- 推奨:
- 代替案:
- 進める条件:
- 止める条件:
- 次の decision date:
```

このメモでは、効果と費用を同じ密度で書く。効果だけが具体的で、費用や統制が抽象的なメモは、CFO、法務、セキュリティ、監査のレビューで戻る。

### 5.8.3 役員向け意思決定メモ

役員向け意思決定メモは、承認のためだけでなく、後から説明責任を果たすための記録である。

| セクション | 書く内容 |
| --- | --- |
| Decision requested | 採用、pilot、本番移行、予算、契約、撤退など、今回決めること |
| Recommendation | 推奨案と理由。buy / build / partner の比較を添える |
| Business case | productivity benefit、risk reduction、ROI、TCO、control cost |
| Governance | security、privacy、compliance、approval、audit、rollback |
| Legal / contract | 契約、データ越境、責任制限、再委託、知財、解約条件 |
| Operational readiness | runbook、support、training、manual takeover、incident response |
| Risks and mitigations | risk register の主要項目、owner、未解決リスク |
| Exit strategy | 退出条件、データ export、移行費用、代替案 |
| Decision log | 承認者、反対意見、条件、次回レビュー日 |

意思決定メモでは、反対意見を隠さない。反対意見を、リスク、条件、未解決事項、代替案として整理することで、承認後の監査証跡になる。

### 5.8.4 反対意見への回答テンプレ

反対意見への回答は、相手を論破するためではなく、懸念を判断可能な形に変えるために使う。

| 反対意見 | 背景にある関心 | 回答に必要な evidence | 回答案 | 残る判断 |
| --- | --- | --- | --- | --- |
| AIは誤回答するので危険 | 品質、顧客影響、責任 | eval、引用 coverage、manual takeover | 対象業務を限定し、重大回答は人が承認する | どの誤回答を受容不可にするか |
| コストが読めない | 予算、TCO、価格変動 | 利用量上限、cost alert、契約条件 | 上限、段階投資、再判断日を設定する | 上限超過時に止める権限 |
| データ越境が不安 | 法務、privacy、契約 | データフロー、保存地域、再委託 | 投入データを限定し、契約レビュー後に進める | 条件を満たさない場合の代替案 |
| 現場が使いこなせない | 業務負荷、教育、例外処理 | training plan、runbook、pilot log | 対象者を限定し、manual takeover を訓練する | 本番展開の教育完了条件 |
| 監査に耐えない | 承認、証跡、職務分掌 | audit trail、approval matrix | 承認ログと変更履歴を必須化する | ログ粒度が不足する場合の判断 |
| ベンダー依存が大きい | 退出、交渉力、継続性 | exit strategy、export、代替案 | データ export と契約終了手順を条件にする | 乗り換え費用をどこまで受容するか |

反対意見の中には、正当なリスクが含まれる。回答できない反対意見は、説得材料ではなく、採用判断を保留する根拠として扱う。

## 5.9 章末成果物を作る {#section-5-9}

本章の成果物は、提案、判断、統制、反対意見をつなぐためのセットである。個別に作るのではなく、同じ根拠から更新する。

### 5.9.1 成果物の接続

| 成果物 | 主な利用者 | 入力 | 出力 |
| --- | --- | --- | --- |
| ステークホルダーマップ | EM / Tech Lead | 組織図、権限、会議ログ、Issue | 誰へ何を説明するか |
| ROI / TCO / control cost 整理表 | CFO / 事業責任者 | 実測、見積、eval、運用計画 | 採算と再判断条件 |
| risk register | Security / Legal / Compliance / EM | threat model、契約、データ分類 | owner 付きリスクと対応 |
| 1ページ提案メモ | 経営層 / 関係者 | 上記3点の要約 | 合意形成の入口 |
| 役員向け意思決定メモ | 承認者 | 提案メモ、判断表、risk register | 採用、保留、撤退の判断記録 |
| 反対意見への回答テンプレ | 提案者 / 現場責任者 | レビューコメント、懸念、反対意見 | 回答案、残る判断、追加 evidence |

資料が増えるほど、整合性が崩れやすい。単一の source of truth を決める。数値は ROI 表、リスクは risk register、承認条件は意思決定メモ、現場手順は runbook に置く。

### 5.9.2 稟議前レビュー checklist

稟議や役員会に出す前に、次を確認する。

- CFO 向けに、productivity benefit、verification cost、control cost、TCO、撤退費が同じ表で示されている。
- 法務向けに、契約、データ越境、責任分界、知財、再委託、解約条件が整理されている。
- セキュリティ向けに、データ分類、アクセス権、least privilege、監査ログ、情報漏えい対策が整理されている。
- 監査向けに、approval、audit trail、例外処理、職務分掌、変更履歴が整理されている。
- 現場責任者向けに、runbook、manual takeover、教育、問い合わせ先、停止条件が整理されている。
- buy / build / partner の比較と、判断を変える条件が書かれている。
- PoC、pilot、本番、scale の段階ゲートと、止める条件が書かれている。
- vendor concentration、exit strategy、export、データ削除、代替案が書かれている。
- responsible use、AI literacy、policy exception、再教育、権限変更が書かれている。
- 反対意見が、risk register、回答テンプレ、意思決定メモのいずれかに反映されている。

この checklist に未完了がある場合、稟議に進めないという意味ではない。未完了を条件、未解決リスク、次回判断事項として明記する。

### 5.9.3 章末ミニケース

次の例で、本章の成果物を組み合わせる。

```text
対象: 社内ナレッジアシスタント
目的: 問い合わせ一次回答のリードタイム短縮
選択肢: buy で pilot、重要回答は人が承認
主要リスク: 顧客情報投入、引用不足、ベンダー集中、現場の例外処理
進む条件: 引用 coverage、manual takeover、audit log、verification cost が採算ライン内
止める条件: データ越境条件を満たせない、誤回答の重大度が高い、現場負荷が増える
成果物: 1ページ提案メモ、risk register、ROI / TCO / control cost 表、runbook
```

このケースでは、AIの回答精度だけで判断しない。契約、データ、監査、現場運用、退出戦略まで含めて、pilot の範囲と本番移行条件を決める。

## まとめ

AI時代のステークホルダーマネジメントは、技術説明から投資判断、統制、説明責任の設計へ広がっている。提案者は、AIの可能性を語るだけでなく、費用、検証、契約、監査、運用、撤退、失敗時の説明責任を同じ資料で扱う必要がある。

合意形成の中心は、説得ではなく evidence である。ステークホルダーマップで関心を分け、ROI / TCO / control cost 表で採算を示し、risk register で所有者を決め、意思決定メモで承認条件と撤退条件を残す。この一連の成果物があれば、採用、段階導入、延期、撤退のいずれも説明できる。

## この章のまとめとチェックリスト

### この章のまとめ

- CFO、法務、セキュリティ、監査、現場責任者は、同じAI活用でも異なるリスクと成功条件を見ている。
- productivity benefit は、verification cost、control cost、training cost、fallback / rollback cost と同時に示す。
- buy / build / partner は、速度ではなく、責任、統制、費用、退出可能性で判断する。
- PoC は「動くこと」の証明ではなく、本番へ進むか止めるかを判断するための evidence 収集である。
- responsible use と AI literacy は、研修だけでなく、承認、監査、停止、再教育、権限管理を含む組織設計である。
- 稟議資料は、経営層向け説明と現場向け説明を分け、反対意見を判断可能なリスクとして扱う。

### この章を読み終えたら確認したいこと

- [ ] ステークホルダーマップに、CFO、法務、セキュリティ、監査、現場責任者の関心と decision right が入っている。
- [ ] ROI / TCO / control cost 整理表に、verification cost、control cost、training cost、fallback / rollback cost が入っている。
- [ ] buy / build / partner の比較と、判断を変える条件が意思決定メモに書かれている。
- [ ] PoC、pilot、本番、scale の段階ゲートと、止める条件が決まっている。
- [ ] 契約、データ越境、vendor concentration、exit strategy が法務・セキュリティ・監査のレビュー対象になっている。
- [ ] 失敗時の説明責任、報告先、必要な証跡、rollback が整理されている。
- [ ] AI literacy / responsible use が、利用ポリシー、承認、監査、教育、是正まで含んでいる。
- [ ] 経営層向け説明と現場向け説明が分かれている。
- [ ] 反対意見への回答テンプレに、必要な evidence と残る判断が入っている。

### 関連する付録・テンプレート

- [付録A：思考ツールテンプレート集](../../appendices/templates/) - 1ページ提案メモ、意思決定メモ、risk register、ROI / TCO / control cost 表の雛形として利用する。
- [付録B：ケーススタディ](../../appendices/case-studies/) - 社内ナレッジアシスタントや agent-assisted delivery を、ステークホルダー合意の観点で読み直す。
- [付録D：更新履歴とメンテナンス方針](../../appendices/update-notes/) - 契約、価格、モデル名、UIなど変動しやすい情報を本文へ固定しすぎない方針を確認する。
