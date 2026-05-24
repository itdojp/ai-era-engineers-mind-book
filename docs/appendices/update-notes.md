---
title: "付録D：更新履歴とメンテナンス方針"
description: "変動要素の隔離方針、レビュー観点、差分記録、陳腐化対応、更新履歴"
layout: book
---

# 付録D：更新履歴とメンテナンス方針

本書は、特定モデル、特定ツール、価格、UI、API細部に依存しすぎないように維持する。本文には長く使う判断原則、責任境界、検証方法、統制観点を残し、変化しやすい情報は付録、更新ノート、または公式情報への参照へ寄せる。

付録Dは、本文を書き換えるための履歴置き場ではない。読者が「この記述はいつ、どの前提で、何を根拠に更新されたのか」を確認し、執筆者が次の更新時に同じ品質ゲートを再現するための運用基準である。

## D.1 本文に残すもの / 付録へ寄せるもの

| 区分 | 本文に残す | 付録・更新ノート・外部参照へ寄せる |
| --- | --- | --- |
| モデル / ベンダー | 選定時に見る判断軸、exit strategy、vendor portability | モデル名、料金、ベンチマーク値、UI手順、契約条件の最新版 |
| API / ツール | approval、audit、rollback、least privilege、isolation の原則 | API細部、引数一覧、画面キャプチャ、SDK固有の実装例 |
| 評価 | eval plan、acceptance criteria、regression、trace-based evaluation の考え方 | 評価データセット名、実測値、製品固有 dashboard の最新版 |
| セキュリティ | データ分類、権限、監査ログ、threat model、インシデント対応 | 個別製品の設定画面、ポリシー画面、設定手順 |
| 運用 | fallback、manual takeover、kill switch、postmortem、training の構造 | 監視サービス固有の設定項目、アラート名、通知先の実名 |
| 組織 / 契約 | decision rights、risk acceptance、buy / build / partner の判断軸 | 契約条項の全文、価格表、ベンダー固有の利用規約変更履歴 |

本文に残してよい固有名は、判断原則の説明に必要な代表例に限る。固有名を出す場合も、代替可能な抽象概念、確認すべき公式情報、更新時の確認 owner を併記する。

## D.2 変化の速い論点の扱い

| 論点 | 本文での扱い | 更新時に確認する証跡 |
| --- | --- | --- |
| モデル名 / provider | 例示に留め、model / provider outage、exit strategy、品質劣化時の判断を本文へ残す | 公式ドキュメント、利用規約、変更履歴、社内採用基準 |
| 価格 / quota / rate limit | cost budget、cost anomaly、TCO、上限設定の考え方を本文へ残す | 公式料金ページ、契約見積、利用量 dashboard、再計算日 |
| UI / 画面手順 | 画面操作ではなく、誰が何を承認し、何を監査ログに残すかを本文へ残す | 公式手順、スクリーンショット取得日、確認者 |
| API / SDK / connector | schema、validation、approval、audit、rollback を本文へ残す | 公式API reference、SDK version、breaking change note |
| セキュリティ分類 | データ分類、least privilege、tool approval、incident response を本文へ残す | 社内規程、法務確認、監査要件、例外承認記録 |
| eval / benchmark | benchmark値ではなく、acceptance criteria、regression、評価データ更新手順を本文へ残す | eval dataset version、run id、失敗例、承認者 |

変化の速い論点を更新するときは、本文の一般原則を先に確認する。一般原則を変える必要がある場合だけ本文を変更し、単なる最新版追従は付録、脚注、または外部参照へ寄せる。

## D.3 更新時のレビュー観点

Issue #127 以降の各 PR では、次を確認する。

- 章または付録が、思考法、意思決定、説明責任、運用統制のいずれかに接続している。
- 「AIに任せる」「人がレビューする」「人が最終責任を持つ」を明示している。
- security、privacy、compliance、approval、audit、rollback の観点を確認している。
- agent、workflow、tool、approval、guardrail、eval、audit の用語を章間で揃えている。
- 例が、権限分離、監査ログ、納期、予算、既存システム、組織内調整などの現実的制約を含む。
- 成果物として、Issue、ADR、PR、eval plan、risk register、runbook、postmortem などに落ちる。
- 断定が強い箇所には、前提条件、適用範囲、例外、検証方法を添えている。
- 変化しやすい情報を本文へ固定しすぎていない。
- 隣接書籍と重複する詳細実装は、判断原則を述べたうえで参照導線へ寄せている。
- 章末の「関連する章・付録」から、読者が次の成果物へ移動できる。

## D.4 更新の進め方

更新は、次の最小単位で進める。

1. 影響範囲を特定する。対象章、付録、目次、関連リンク、成果物テンプレート、`book-config.json` を確認する。
2. 変更方針を明文化する。本文に残す判断原則と、付録へ寄せる変動情報を分ける。
3. 差分をレビュー可能な粒度に分ける。1つの PR で複数章を不用意に混在させない。
4. 用語と導線を確認する。agent、workflow、tool、approval、guardrail、eval、audit、rollback の表記とリンク先を確認する。
5. 検証を実施する。リンク、Jekyll build、Book QA、公開ページの主要導線を確認する。
6. 記録を残す。関連 Issue、PR、検証結果、review thread 対応、CI、公開確認を更新履歴へ反映する。

PR本文またはIssueコメントには、少なくとも次を残す。

- 変更対象と変更しなかった対象
- 判断原則として本文へ残したもの
- 変動情報として付録または外部参照へ寄せたもの
- 実行した検証コマンド
- Copilot review / 人間レビューで対応した指摘
- main merge commit と Pages 公開確認結果

## D.5 陳腐化しやすい節の扱い

| 節の種類 | 陳腐化の兆候 | 対応 |
| --- | --- | --- |
| モデル / provider の説明 | 固有名が判断原則より目立つ、価格や制限が古い | 固有情報を削るか付録へ移し、選定軸とexit strategyを残す |
| API / UI 手順 | 画面名、ボタン名、引数名の変更に弱い | 手順ではなく、approval、audit、rollback の責任境界へ書き換える |
| セキュリティ対策 | 製品設定だけで説明している | threat model、data classification、least privilege、incident response へ一般化する |
| eval / benchmark | 単一スコアで品質を説明している | acceptance criteria、失敗例、regression、trace-based evaluation へ分解する |
| 事例 / ケース | 成功例だけで、統制不備や失敗時挙動がない | 失敗例、監査ログ、rollback、残す成果物を追加する |
| 組織運用 | 役割名だけでdecision rightsがない | owner、approver、escalation、risk acceptance を明記する |

陳腐化しやすい節は、削除を先に検討する。残す場合は、固有情報の確認日、参照先、適用条件、更新 owner を併記する。

## D.6 2026年版リライト完了時の最終監査

Issue #127 を閉じる前に、次の証跡を確認する。

| 監査項目 | 確認方法 | 完了条件 |
| --- | --- | --- |
| 変動情報の隔離 | `価格`、`UI手順`、`API細部`、モデル名、provider名を検索する | 本文は判断原則中心で、固有情報は例示または付録/外部参照へ寄っている |
| 章間リンク | 全章末の「関連する章・付録」を確認する | 章、付録A〜D、SOP、シリーズ内書籍への導線が切れていない |
| 用語統一 | agent、workflow、tool、approval、guardrail、eval、audit、rollback を検索する | 同じ概念を別語で呼んでいない |
| 成果物接続 | 各章の章末成果物と付録A/B/C/Dの対応を見る | 読者がテンプレート、ケース、読書、更新方針へ移動できる |
| 商用品質 | 未完了印、仮置き表現、整理前メモ、断定過多を検索する | 執筆途中のメモがなく、断定には前提や検証方法が添えられている |
| 検証 | Book QA、リンクチェック、Jekyll build、公開 smoke を確認する | PR head と main merge commit の両方で成功している |

この監査は、完璧な網羅を保証するものではない。少なくとも、Issue #127 の Definition of Done を閉じるための再現可能な証跡を残すための最小監査である。

## D.7 更新履歴（Changelog）

### Unreleased

- 付録Dをメンテナンス方針として強化し、本文に残すもの / 付録へ寄せるもの、変化の速い論点、更新時レビュー観点、変更差分の記録ルール、陳腐化しやすい節の扱い、2026年版リライト完了時の最終監査を明文化した（2026-05-24）。
- 付録Cを推奨読書リストとして現代化し、古典的な書籍を残しつつ、NIST AI RMF、NIST AI RMF Generative AI Profile、ISO/IEC 42001、OWASP LLM Top 10、MITRE ATLAS、MCP、OpenAI Evals、GitHub Copilot、Google SRE、Diátaxis、シリーズ内関連書籍、役割別おすすめ順へ再編した（2026-05-24）。
- 付録Bを2026年の実務ケーススタディとして全面刷新し、社内ナレッジアシスタント、GitHub 上の agent-assisted delivery、障害調査 / 運用支援 copilot について、成功例、失敗例、統制不備、現実的な測定指標、残す成果物、章・付録導線を整理した（2026-05-24）。
- 付録Aを実務成果物テンプレート集として全面刷新し、AI system PRD / requirements brief、AI system ADR、eval spec、eval dataset design sheet、threat model、tool approval matrix、data classification sheet、vendor selection matrix、AI incident postmortem、executive memo、cost / reliability dashboard、verification record、model / tool change impact checklist を追加した（2026-05-24）。
- 第6章を AI固有インシデントへの運用統制として全面リライトし、prompt injection、誤った外部操作、権限逸脱 / 情報漏えい、モデル / プロバイダ障害、コスト暴走、retrieval / citation failure、MCP authorization failure、approval bypass、kill switch / quarantine / rollback / escalation、実行前承認と事後監査、AI incident runbook、postmortem template を接続した（2026-05-24）。
- 第5章を AI投資・統制・説明責任の合意形成として全面リライトし、CFO / 法務 / セキュリティ / 監査 / 現場責任者の関心、productivity benefit と verification cost、buy / build / partner、PoC 採算設計、vendor concentration、契約 / データ越境 / 退出戦略、AI literacy / responsible use、稟議資料を接続した（2026-05-24）。
- 第4章を AI-native SDLC / Agent-assisted delivery として全面リライトし、Issue 起点の実装計画、agent に渡せるタスク / 渡せないタスク、coding agent / IDE agent / CI上の agent、AIレビュー、テスト生成、静的解析、セキュリティ検査、trunk-based / PR-based 運用、documentation freshness、delivery metrics、skill degradation、release readiness を接続した（2026-05-24）。
- 第3章を workflow / agent 時代の設計判断として全面リライトし、通常機能 / RAG / workflow / agent の使い分け、MCP / connector / function calling、schema-driven validation、threat model、eval harness、latency / cost / quality / reliability budget、vendor portability、exit strategy を接続した（2026-05-24）。
- 第2章を AIを含む要求境界の設計として全面リライトし、requirements brief、acceptance criteria、data / permission boundary table、Human-in-the-loop / Human-on-the-loop / Full automation、KPI と guardrail metric、fallback / manual override を接続した（2026-05-24）。
- 第1章を AIネイティブ環境における意思決定OSとして全面リライトし、context engineering、schema-first thinking、source hierarchy、delegate / review / own、decision rights を接続した（2026-05-24）。
- Issue #127 の 2026年版リライトに向けて、トップページ、まえがき、AI協働SOP、更新方針の基礎契約を定義した（2026-05-24）。
- Phase 6 実務接続レビューゲートを追加し、AI協働SOP、判断責任の3層モデル、AI活用判断メモ、PRレビュー項目を接続した（2026-05-23）。

### 1.0.0（2026-01-19）

- AI協働SOPと前作接続ページを追加（[PR #83](https://github.com/itdojp/ai-era-engineers-mind-book/pull/83)）。
- LLM/生成AIアプリ設計の典型論点を第3章に追加（[PR #84](https://github.com/itdojp/ai-era-engineers-mind-book/pull/84)）。
- 第2/4/6章でSOPから成果物への落とし込みを追加（[PR #85](https://github.com/itdojp/ai-era-engineers-mind-book/pull/85)）。
- 付録テンプレート拡充、ケーススタディ改善、ルーブリックを追加（[PR #86](https://github.com/itdojp/ai-era-engineers-mind-book/pull/86)）。
- ライセンスFAQ、更新履歴、陳腐化耐性を追加（[PR #87](https://github.com/itdojp/ai-era-engineers-mind-book/pull/87)）。
