---
title: "付録B：ケーススタディ"
description: "2026年の AI ネイティブ実務におけるケーススタディ、失敗例、統制不備、成果物"
layout: book
---

# 付録B：ケーススタディ

この付録は、本文で扱った思考法、意思決定、説明責任、運用統制を、2026年時点の現実的な AI 活用案件へ適用するためのケース集である。
成功例だけではなく、失敗例、統制不備、残すべき成果物、章との接続を明示する。

ここで扱う数値は、実務計画を作るための仮置き例である。自組織で使う場合は、データ分類、法務要件、監査要件、既存運用、予算、SLA に合わせて置き換える。

## B.0 ケースの読み方

3つのケースは、次の問いを確認しながら読む。

| 観点 | 確認する問い | 関連章 / 付録 |
| --- | --- | --- |
| 判断 | AI に任せる範囲、人がレビューする範囲、責任者は明確か | [第1章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-01/) |
| 要求 | 評価可能な受入条件、データ分類、権限、fallback があるか | [第2章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-02/) |
| 設計 | RAG、workflow / agent、tool / approval / audit を説明できるか | [第3章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-03/) |
| delivery | Issue、plan、PR、review、release、検証記録が残るか | [第4章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-04/) |
| 合意形成 | 投資対効果、統制コスト、法務・セキュリティ・監査の関心を説明できるか | [第5章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-05/) |
| 運用 | インシデント時の停止、隔離、rollback、escalation、postmortem があるか | [第6章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-06/) |
| 成果物 | 再利用できるテンプレートへ落ちているか | [付録A](https://itdojp.github.io/ai-era-engineers-mind-book/appendices/templates/) |

各ケースでは、最後に「残す成果物」を列挙する。ケースを自組織へ適用する場合は、成果物だけを抜き出して Issue 化するとよい。

## B.1 社内ナレッジアシスタント

### B.1.1 背景

従業員約1,200名の事業会社が、規程、業務手順、契約雛形、社内 FAQ を横断検索するナレッジアシスタントを導入する。
現状は Slack / Wiki、ファイル共有、チケット履歴に情報が分散し、月9,000件程度の社内問い合わせが発生している。

目標は、問い合わせ削減だけではない。回答根拠を明示し、部門ごとのアクセス制御を守り、誤回答時に人間へエスカレーションできる仕組みを作ることである。

| 項目 | 仮置き値 |
| --- | --- |
| 対象部門 | 情シス、人事、法務、営業企画、CS |
| 初期対象文書 | 約18,000ページ。うち社外秘3,200ページ、部門限定2,400ページ |
| 想定利用 | 月6,000質問、平日9:00-20:00中心 |
| 初期期間 | 12週間。要求2週、設計2週、実装4週、eval/運用準備4週 |
| 非目標 | 人事・法務判断の自動確定、契約条項の自動承認、権限のない文書の要約 |

### B.1.2 採用判断

このケースでは、fine-tuning ではなく検索 / RAG を中心にする。
理由は、回答内容が社内規程や最新手順に強く依存し、参照元、更新日、アクセス権の検証が必要だからである。

| 選択肢 | 採用可否 | 判断理由 |
| --- | --- | --- |
| 通常検索 | 一部採用 | 根拠文書の発見には有効。ただし利用者向けの要約と確認観点が弱い |
| RAG | 採用 | 引用、権限、回答不可条件、trace を設計しやすい |
| fine-tuning | 不採用 | 最新規程への追従、権限、引用必須の要件に合わない |
| workflow | 一部採用 | チケット起票、担当部門への転送、回答候補のレビュー依頼に使う |
| agent | 限定採用 | 自律的な判断や送信はさせず、参照、要約、起票補助に限定する |

### B.1.3 要求と受入条件

requirements brief には、便利さではなく、失敗時の扱いまで書く。

| 要求 | 受入条件 | Guardrail |
| --- | --- | --- |
| 引用必須回答 | 回答の90%以上に参照文書、節、更新日を表示する | 引用なし回答は「回答不可」または人間確認へ送る |
| 部門別アクセス制御 | 利用者権限で閲覧可能な文書だけを検索対象にする | 権限外文書のタイトル、要約、断片を返さない |
| 誤回答時エスカレーション | 「不確か」「規程差分あり」「権限不足」を検出した場合、担当窓口へ起票する | 重要判断は自動確定しない |
| 監査可能性 | 質問、検索対象、引用、回答、回答不可理由、escalation 先を trace id で追える | 個人情報を含む質問は保存期間を短縮する |
| 更新耐性 | 文書更新から24時間以内に検索インデックスへ反映する | 古い文書が引用された場合は警告する |

### B.1.4 成功シナリオ

社員が「育児休業から復職する場合の手続き」を質問する。
アシスタントは、人事規程、申請フォーム、締切、担当窓口を引用付きで提示する。
回答末尾には、次のような確認事項を出す。

- 回答根拠: 人事規程、復職手続き FAQ、申請フォーム手順
- 文書更新日: 2026-04-10
- 回答範囲: 一般的な手続き。個別事情の判断は人事担当者が行う
- escalation: 休職期間、雇用形態、個別配慮が関係する場合は人事チケットへ転送

この回答は、AI が最終判断をするのではなく、根拠付きで利用者の次アクションを短縮する。

### B.1.5 失敗例と統制不備

#### 失敗例: 権限外文書の断片が回答に混ざる

営業企画の限定資料が、全社 FAQ の近傍文書として検索され、回答要約に売上見込みの一部が混ざった。
利用者には文書リンクは見えなかったが、要約文から機密情報を推測できた。

原因は、検索前の ACL filter ではなく、検索後の表示時 filter だけで制御していたことである。
この統制不備は、RAG では典型的である。文書リンクを隠すだけでは不十分で、retrieval 対象そのものを利用者権限で制限する必要がある。

恒久対策は次のとおりである。

- retrieval 前に利用者 ID、所属、role、文書分類で filter する
- index へ文書分類、owner、許可 role、期限を持たせる
- 権限外文書を取得した trace を P1 相当の guardrail violation として扱う
- eval dataset に「権限外情報を誘導する質問」を追加する
- postmortem を残し、data / permission boundary table と tool approval matrix を更新する

#### 失敗例: 引用はあるが古い

アシスタントが古い交通費規程を引用し、利用者が誤った申請を行った。
引用は存在したため、利用者もレビュー担当者も正しいと誤認した。

この失敗は、citation coverage だけを KPI にしていたことが原因である。
引用の有無だけでなく、文書の有効期限、版、優先順位を評価する必要がある。

### B.1.6 測定指標

| 指標 | 初期目標 | 注意点 |
| --- | --- | --- |
| citation coverage | 90%以上 | 引用が正しい版かを別に見る |
| grounded answer rate | 80%以上 | 「回答不可」を悪い結果として扱いすぎない |
| escalation rate | 10〜25% | 低すぎる場合は自動化しすぎの可能性がある |
| ACL violation | 0件 | 1件でも重大インシデント候補として扱う |
| stale citation rate | 2%未満 | 文書更新プロセスと連動する |
| manual review sample | 月100件 | 監査と eval 改善の入力にする |

### B.1.7 残す成果物

- requirements brief
- data / permission boundary table
- AI system ADR
- threat model
- eval spec と eval dataset design sheet
- tool approval matrix
- operational guardrail checklist
- AI incident runbook
- postmortem template

このケースは、[第2章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-02/) の要求境界、[第3章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-03/) の RAG / workflow / agent判断、[第6章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-06/) のretrieval failure / citation failureへ戻って読み直すと理解しやすい。

## B.2 GitHub 上の agent-assisted delivery

### B.2.1 背景

20名規模のプロダクト開発組織が、GitHub 上で Issue 起点の agent-assisted delivery を導入する。
対象は、ドキュメント修正、テスト追加、小規模な UI 改善、低リスクなバックエンド修正から始める。

目標は、AI がコードを書く量を増やすことではない。
Issue → plan → implementation → PR → review → release の各段階に、AI 利用記録、検証ゲート、人間の責任境界を残すことである。

| 項目 | 仮置き値 |
| --- | --- |
| 対象リポジトリ | Web アプリ、API、社内運用ツール、ドキュメントサイト |
| 初期対象 Issue | 月40件。うち AI 委譲候補は15件程度 |
| 期間 | 8週間。policy 整備2週、pilot 4週、評価2週 |
| 非目標 | 仕様未確定 Issue の自動実装、production credential を使う作業、承認なし release |

### B.2.2 agent に渡せる作業 / 渡せない作業

| 作業 | agent 委譲 | 条件 |
| --- | --- | --- |
| 誤字、リンク、表記ゆれ修正 | 可 | 変更範囲が限定され、差分がレビュー容易 |
| 既存テストに沿ったテスト追加 | 可 | 期待値と対象関数が Issue で明確 |
| 小規模なバグ修正 | 条件付き | 再現手順、失敗テスト、rollback 方法がある |
| API 仕様変更 | 原則不可 | ADR、互換性、顧客影響、versioning 判断が必要 |
| 認証・権限・課金 | 原則不可 | security / compliance / audit owner の明示承認が必要 |
| release 操作 | 不可 | 人間の承認と change window が必要 |

### B.2.3 delivery flow

```text
Issue
  → task brief / acceptance criteria
  → agent plan
  → human plan review
  → implementation
  → local verification
  → PR
  → AI review + human review
  → CI
  → release readiness check
  → merge / release
  → public or runtime smoke
  → evidence comment
```

この流れでは、agent plan をそのまま実装へ進めない。
人間が「変更範囲」「非目標」「検証方法」「rollback」「機密情報に触れないこと」を確認してから実装へ進める。

### B.2.4 成功シナリオ

Issue は「設定画面の説明文が古いので、現行仕様に合わせ、関連テストとドキュメントを更新する」である。
agent は、関連ファイルを調査し、変更対象を3ファイルに限定した plan を出す。
レビュアーは、仕様変更ではなく説明文とテスト期待値の更新であることを確認し、実装を許可する。

PR には次が残る。

- AI 利用記録: 調査、差分作成、テスト追加に使用。仕様判断は人間が実施
- 検証記録: unit test、lint、リンクチェック、UI smoke
- 変更しない範囲: API、権限、データモデル、migration
- rollback: 文言とテストの revert で復旧可能
- reviewer checklist: 仕様、テスト、セキュリティ、ドキュメント、公開確認

結果として、lead time は2.5日から1.2日に短縮した。
一方で、review 時間は平均35分から45分に増えた。これは悪い結果とは限らない。agent 差分の確認観点が増えるためである。
短縮効果だけでなく、verification cost を同じ表で扱う必要がある。

### B.2.5 失敗例と統制不備

#### 失敗例: Issue が曖昧なまま実装される

「検索を使いやすくする」という Issue だけで agent に実装を依頼したところ、UI、API、検索ロジック、クエリパラメータ、ドキュメントが同時に変更された。
CI は通ったが、既存ユーザーの保存検索が壊れた。

原因は、Issue に acceptance criteria、非目標、互換性要件、rollback 条件がなかったことである。
agent は曖昧な要求を、もっともらしい大きな差分で埋めてしまう。

恒久対策は次のとおりである。

- agent 着手前に task brief を必須化する
- 変更対象外のファイル群を Issue に明記する
- API、権限、migration、課金、データ削除を高リスク変更として自動検出する
- PR テンプレートに AI 利用記録と検証記録を必須化する
- review checklist で「Issue 外の改善が混入していないか」を確認する

#### 失敗例: AI review を人間レビューの代替にする

AI review で指摘がなかったため、人間レビューを形式的に済ませた。
後日、境界値のテスト不足と監査ログ欠落が見つかった。

AI review は有効な補助であるが、責任主体ではない。
特に security / privacy / compliance / approval / audit / rollback に関する確認は、人間の review owner を決める必要がある。

### B.2.6 測定指標

| 指標 | 初期目標 | 注意点 |
| --- | --- | --- |
| lead time | 20〜40%短縮 | 短縮だけで品質を判断しない |
| review rework | PR あたり2往復以内 | agent の plan 品質を測る |
| failed change rate | 悪化させない | 小粒化で見かけ上改善することがある |
| escaped defects | 月次で追跡 | CI green だけでは不十分 |
| verification cost | PR あたり30〜60分 | 低すぎる場合は確認不足を疑う |
| documentation freshness | release 時点で更新済み | docs 生成を delivery pipeline に含める |
| approval throughput | 高リスク変更の承認滞留を可視化 | 承認省略ではなく滞留改善が目的 |

### B.2.7 残す成果物

- agent task brief
- AI 利用ポリシー付き PR テンプレート
- コードレビューチェックリスト / AI レビュー checklist
- verification record
- release readiness checklist
- team working agreement
- handoff / escalation rule
- delivery metrics dashboard

このケースは、[第4章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-04/) の AI-native SDLC、[第1章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-01/) のdelegate / review / own、[付録A](https://itdojp.github.io/ai-era-engineers-mind-book/appendices/templates/) の PR テンプレート群へ接続する。

## B.3 障害調査 / 運用支援 copilot

### B.3.1 背景

SRE チームが、障害調査を支援する運用 Copilot を導入する。
Copilot は、ログ、メトリクス、trace、runbook、過去 postmortem を参照し、原因仮説、確認コマンド、影響範囲、rollback 候補を提示する。

ただし、本番操作は自動実行しない。
実行は要承認とし、restart、scale、feature flag 変更、rollback、データ修正、顧客通知は、権限を持つ人間の承認を必須にする。

| 項目 | 仮置き値 |
| --- | --- |
| 対象システム | B2B SaaS API、管理画面、batch 基盤 |
| SLO | API availability 99.9%、p95 latency 500ms以下 |
| 初期対象 | read-only logs、metrics、trace、runbook、postmortem 検索 |
| 非目標 | 自動復旧、顧客通知の自動送信、DB 更新、証跡なしの本番操作 |

### B.3.2 権限設計

| 操作 | copilot 権限 | 人間承認 | 監査 |
| --- | --- | --- | --- |
| ログ検索 | read-only | 不要 | query、対象期間、実行者を保存 |
| メトリクス参照 | read-only | 不要 | dashboard、期間、trace id を保存 |
| runbook 検索 | read-only | 不要 | 参照 runbook と版を保存 |
| rollback 提案 | 提案のみ | 必須 | 提案、承認者、実行者、結果を保存 |
| restart / scale | 実行不可 | 必須。人間が別系統で実行 | change ticket へ記録 |
| 顧客通知 | 草案のみ | 必須 | communication log へ保存 |

least privilege を守るため、Copilot には本番変更権限を与えない。
将来、限定的な tool 実行を認める場合でも、tool approval matrix、approval gate、audit trail、kill switch を先に整備する。

### B.3.3 成功シナリオ

平日10:15、API p95 latency が通常240msから1,800msへ上昇した。
SRE が Copilot に「直近30分の latency 上昇要因を調査し、根拠と次の確認手順を出して」と依頼する。

Copilot は次を提示する。

- 影響範囲: `/v1/search` の p95 が主因。全 API ではない
- 変化点: 09:58の検索 index 更新 job 以降、DB connection wait が増加
- 根拠: metrics dashboard、trace sample、直近 deploy、runbook `search-latency.md`
- 仮説: index 更新後の query plan 変化、connection pool 枯渇、cache hit 率低下
- 次の確認: query plan 確認、connection pool、cache hit 率、直近 feature flag
- 推奨対応: feature flag を旧検索経路へ戻す。ただし承認者確認後に実行
- rollback 条件: error rate が1%超過、または p95 1,000ms超過が15分継続

SRE は提示根拠を確認し、incident commander が rollback を承認する。
rollback 後、p95 は20分で420msへ戻った。
postmortem には、Copilot の仮説、採用した判断、却下した判断、承認者、実行者、復旧時刻が残る。

### B.3.4 失敗例と統制不備

#### 失敗例: Copilot が実行権限を持っていた

夜間障害で、Copilot が過去 runbook に基づき自動 restart を実行した。
一時的に latency は改善したが、in-flight job が中断され、データ再処理が必要になった。
監査ログには自然言語の要約しか残っておらず、誰が何を承認したか確認できなかった。

原因は、read-only 調査支援と本番操作支援を分けず、tool 権限を広く付与したことである。

恒久対策は次のとおりである。

- Copilot の本番操作権限を削除する
- restart / scale / rollback は approval gate を必須化する
- 実行前に影響範囲、rollback plan、実行者、承認者、監査 ID を要求する
- runbook に「自動実行不可」「承認必須」「事後監査必須」を明記する
- MCP authorization failure と approval bypass を AI incident 分類へ追加する

#### 失敗例: もっともらしい根拠で誤誘導する

Copilot が「DB が原因」と要約したが、実際は外部 API の timeout 増加が原因だった。
根拠として表示されたグラフは、時間範囲が障害前後でずれていた。

AI の要約品質は、根拠の正しさを保証しない。
運用 Copilot では、citation coverage だけでなく、time window alignment、metric freshness、trace sample coverage を確認する必要がある。

### B.3.5 測定指標

| 指標 | 初期目標 | 注意点 |
| --- | --- | --- |
| MTTD | 10〜20%短縮 | アラート設計の改善と分離して評価する |
| MTTR | 10〜25%短縮 | rollback の安全性を犠牲にしない |
| manual takeover rate | 高リスク操作は100% | 低いほど良い指標ではない |
| approval rejection rate | 5〜20% | 危険提案を止められているかを見る |
| tool error rate | 1%未満 | read-only tool でも監視する |
| audit completeness | 100% | trace id、根拠、承認、実行結果を残す |
| postmortem completion | P1/P2 で100% | copilot 要約ではなく人間が責任を持つ |

### B.3.6 残す成果物

- AI incident runbook
- severity matrix
- communication template（社内 / 顧客 / 経営向け）
- operational guardrail checklist
- incident timeline template
- tool approval matrix
- verification record
- postmortem

このケースは、[第6章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-06/) のkill switch / quarantine / rollback / escalation、[第3章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-03/) のtool approval / audit trail、[第5章](https://itdojp.github.io/ai-era-engineers-mind-book/chapters/chapter-05/) の説明責任と顧客影響説明へ接続する。

## B.4 横断比較

3つのケースを横断すると、AI 活用の成否はモデル性能だけでは決まらない。
要求、権限、評価、承認、監査、運用、説明責任を成果物として残せるかで決まる。

| ケース | 主な価値 | 最大リスク | 最重要統制 | 最低限残す成果物 |
| --- | --- | --- | --- | --- |
| 社内ナレッジアシスタント | 問い合わせ削減、根拠付き回答、ナレッジ再利用 | 権限外情報漏えい、古い引用、誤回答 | retrieval 前 ACL、citation freshness、escalation | requirements brief、data boundary、eval spec、threat model |
| GitHub agent-assisted delivery | lead time 短縮、検証記録、ドキュメント鮮度 | Issue 外変更、レビュー形骸化、検証不足 | task brief、PR checklist、verification record | agent task brief、PR テンプレート、release readiness |
| 障害調査 / 運用支援 copilot | 調査短縮、仮説整理、postmortem 品質 | 承認なし操作、誤誘導、監査欠落 | read-only 原則、approval gate、audit trail | AI incident runbook、severity matrix、postmortem |

## B.5 自組織へ適用する手順

1. 対象ケースを1つ選び、非目標を明記する。
2. requirements brief と data / permission boundary table を作る。
3. 通常機能、検索、RAG、workflow / agent の比較表を作る。
4. eval spec と guardrail metric を定義する。
5. tool approval matrix と audit trail を定義する。
6. PR または変更計画に verification record を添付する。
7. 運用開始前に runbook、severity、communication、rollback を確認する。
8. 本番後、incident または near miss を postmortem へ残し、eval dataset を更新する。

この手順は、AI 施策を「便利なデモ」から「運用できる仕組み」へ変えるための最小単位である。
