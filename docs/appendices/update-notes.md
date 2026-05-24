---
title: "付録D：更新履歴とメンテナンス方針"
description: "変動要素の隔離方針、2026年版リライト方針、更新履歴"
layout: book
---

# 付録D：更新履歴とメンテナンス方針

本書は、特定モデルや特定ツールの固有名、価格、UI、API細部に依存しすぎないように記述する。変化しやすい情報は本文へ固定せず、付録または外部の公式情報へ逃がし、本文には判断原則、責任境界、検証方法、統制観点を残す。

## D.1 本文に残すもの / 付録へ寄せるもの

| 区分 | 本文に残す | 付録・更新ノート・外部参照へ寄せる |
| --- | --- | --- |
| モデル / ベンダー | 選定時に見る判断軸、exit strategy、vendor portability | モデル名、料金、ベンチマーク値、UI手順 |
| API / ツール | approval、audit、rollback、least privilege の原則 | API細部、引数一覧、画面キャプチャ |
| 評価 | eval plan、acceptance criteria、regression の考え方 | 具体的な評価データセット名や実測値の最新版 |
| セキュリティ | データ分類、権限、監査ログ、インシデント対応 | 個別製品の設定画面や手順 |
| 運用 | fallback、manual takeover、postmortem の構造 | 監視サービス固有の設定項目 |

## D.2 2026年版リライトのレビュー観点

Issue #127 の各 PR では、次を確認する。

- 章または付録が、思考法・意思決定・説明責任・運用統制のいずれかに接続している。
- 「AIに任せる」「人がレビューする」「人が最終責任を持つ」を明示している。
- security、privacy、compliance、approval、audit、rollback の観点を確認している。
- 例が、権限分離、監査ログ、納期、予算、既存システム、組織内調整などの現実的制約を含む。
- 成果物として、Issue、ADR、PR、Eval plan、Risk register、Runbook、Postmortem などに落ちる。
- 断定が強い箇所には、前提条件、適用範囲、例外、検証方法を添えている。
- 変化しやすい情報を本文へ固定しすぎていない。
- 隣接書籍と重複する詳細実装は、判断原則を述べたうえで参照導線へ寄せている。

## D.3 更新の進め方

更新は、次の最小単位で進める。

1. 影響範囲を特定する。対象章、付録、目次、関連リンク、成果物テンプレートを確認する。
2. 変更方針を明文化する。本文に残す判断原則と、付録へ寄せる変動情報を分ける。
3. 差分をレビュー可能な粒度に分ける。1つの PR で複数章を不用意に混在させない。
4. 検証を実施する。リンク、Jekyll build、Book QA、公開ページの主要導線を確認する。
5. 記録を残す。関連 Issue、PR、検証結果、レビュー対応、公開確認を更新履歴へ反映する。

## D.4 更新履歴（Changelog）

### Unreleased

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
