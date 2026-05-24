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

- Issue #127 の 2026年版リライトに向けて、トップページ、まえがき、AI協働SOP、更新方針の基礎契約を定義した（2026-05-24）。
- Phase 6 実務接続レビューゲートを追加し、AI協働SOP、判断責任の3層モデル、AI活用判断メモ、PRレビュー項目を接続した（2026-05-23）。

### 1.0.0（2026-01-19）

- AI協働SOPと前作接続ページを追加（[PR #83](https://github.com/itdojp/ai-era-engineers-mind-book/pull/83)）。
- LLM/生成AIアプリ設計の典型論点を第3章に追加（[PR #84](https://github.com/itdojp/ai-era-engineers-mind-book/pull/84)）。
- 第2/4/6章でSOPから成果物への落とし込みを追加（[PR #85](https://github.com/itdojp/ai-era-engineers-mind-book/pull/85)）。
- 付録テンプレート拡充、ケーススタディ改善、ルーブリックを追加（[PR #86](https://github.com/itdojp/ai-era-engineers-mind-book/pull/86)）。
- ライセンスFAQ、更新履歴、陳腐化耐性を追加（[PR #87](https://github.com/itdojp/ai-era-engineers-mind-book/pull/87)）。
