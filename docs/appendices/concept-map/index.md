---
title: "付録E：成果物連鎖の概念マップ"
description: "第1章から第6章までの判断・要求・設計・delivery・合意・運用を成果物の依存関係で読み替える概念マップ"
layout: book
---

# 付録E：成果物連鎖の概念マップ

## このマップの使い方

このページは章の一覧ではない。読者が「いま作る成果物は、次の誰の、どの判断を可能にするか」を確認するための、テキストベースの概念マップである。JavaScript に依存せず、各セルから章、SOP、テンプレートへ移動できる。

6章は、次の成果物依存でつながる。

```text
第1章 判断
  → 第2章 要求
    → 第3章 設計
      → 第4章 delivery
        → 第5章 合意
          → 第6章 運用
            ↺ 事後記録を第1章の判断と第2章の要求へ戻す
```

矢印は「前の章を読まないと次へ進めない」という意味ではない。前段の成果物が未確定なら、後段の判断は仮説として扱い、未確定事項、owner、検証条件を残すという意味である。

## 6章の成果物依存

| 段階 | 章と役割 | この段階で作る成果物 | 次へ渡す判断材料 | 次に読む |
| --- | --- | --- | --- | --- |
| 1. 判断 | [第1章：エンジニアの思考 OS](../../chapters/chapter-01/) | 判断メモ、前提・仮説ログ、[source hierarchy](../glossary/#term-source-hierarchy)、検証記録 | 問い、非目標、根拠の強さ、不確実性、decision owner | [第2章の要求境界](../../chapters/chapter-02/#section-2-1) |
| 2. 要求 | [第2章：要件定義の認知プロセス](../../chapters/chapter-02/) | [requirements brief](../glossary/#term-requirements-brief)、[acceptance criteria](../glossary/#term-acceptance-criteria)、data / permission boundary table | 解く問題、自動化境界、失敗時挙動、承認条件 | [第3章の設計比較](../../chapters/chapter-03/#section-3-1) |
| 3. 設計 | [第3章：アーキテクチャ設計の意思決定](../../chapters/chapter-03/) | [AI system ADR](../glossary/#term-ai-system-adr)、architecture decision matrix、[threat model](../glossary/#term-threat-model)、eval plan | 採用理由、control point、品質・コスト・信頼性の予算、rollback 条件 | [第4章の delivery](../../chapters/chapter-04/#section-4-1) |
| 4. delivery | [第4章：開発/構築フェーズの最適化思考](../../chapters/chapter-04/) | Issue / Plan、AI 利用記録付き PR、review checklist、release readiness | 変更差分、[verification cost](../glossary/#term-verification-cost)、残存リスク、リリース可否、handoff | [第5章の合意形成](../../chapters/chapter-05/#section-5-8) |
| 5. 合意 | [第5章：ステークホルダーマネジメント](../../chapters/chapter-05/) | 1ページ提案メモ、[risk register](../glossary/#term-risk-register)、ROI / TCO / control cost 表、approval log | 効果と確認コスト、責任分界、契約・越境・退出条件、意思決定 | [第6章の運用統制](../../chapters/chapter-06/#section-6-3) |
| 6. 運用 | [第6章：危機管理と問題解決](../../chapters/chapter-06/) | AI incident runbook、severity matrix、incident timeline、[postmortem](../glossary/#term-postmortem) | 停止・隔離・復旧の条件、監査証跡、再発防止、次の要求変更 | [第1章の検証ループ](../../chapters/chapter-01/#section-1-6) |

各成果物の最小手順は [AI 協働の標準手順（SOP）](../../introduction/ai-collaboration-sop/) に対応する。SOP の10ステップは、Issue 化、情報分類、Plan、入力設計、生成・探索、評価設計、反映、レビュー・承認、リリース・運用、事後記録の順である。

## 受け渡し条件を読む

### 判断から要求へ

第1章の判断メモは、AI の回答を採用する文書ではない。問題、非目標、根拠、仮説、検証責任を固定し、第2章が要求境界を決めるための入力にする。根拠が弱い場合は、requirements brief に「未確定」として渡し、精度の断定で穴埋めしない。

- [第1章：調査 → 判断 → 検証の最小ループ](../../chapters/chapter-01/#section-1-6)
- [第2章：問題設定と要求境界](../../chapters/chapter-02/#section-2-1)
- [付録A：requirements brief のテンプレート](../templates/#a2-ai-system-prd--requirements-brief)

### 要求から設計へ

第2章の acceptance criteria と data / permission boundary table が、第3章の設計比較の制約になる。「AI を使うこと」は要求ではなく、問題を解くために必要な選択肢の一つである。fallback、manual override、rollback が要求に含まれていない場合、設計の安全性を評価できない。

- [第2章：acceptance criteria を評価可能にする](../../chapters/chapter-02/#section-2-5)
- [第3章：architecture decision matrix](../../chapters/chapter-03/#section-3-2)
- [付録A：AI system ADR](../templates/#a3-ai-system-adr)

### 設計から delivery へ

第3章の ADR、threat model、eval plan は、実装者が変更範囲と検証範囲を判断するための契約になる。第4章では、agent に渡せる作業と人が持つ検証責任を分け、PR と release readiness に証跡を残す。

- [第3章：AI system ADR と control point checklist](../../chapters/chapter-03/#section-3-9)
- [第4章：Issue 起点で実装計画を作る](../../chapters/chapter-04/#section-4-1)
- [AI 協働 SOP：反映、レビュー・承認](../../introduction/ai-collaboration-sop/#成果物への落とし込み先)

### delivery から合意へ

第4章の実装結果は、生成量の報告ではなく、変更差分、verification cost、残存リスク、rollback の実行可能性として第5章へ渡す。第5章は productivity benefit だけでなく、確認・統制・運用のコストを同じ表に載せて意思決定する。

- [第4章：生成コードの検証責任](../../chapters/chapter-04/#section-4-4)
- [第5章：productivity benefit と verification cost](../../chapters/chapter-05/#section-5-2)
- [付録A：ROI / TCO / control cost 表](../templates/#a113-roi--tco--control-cost-表)

### 合意から運用へ

第5章の approval、risk acceptance、契約・データ境界・退出条件は、第6章の runbook に運用可能な条件として現れる。合意が「導入する」で止まる場合、停止条件、manual takeover、監査、復旧の責任者が欠落する。

- [第5章：法務・セキュリティ・監査と合意する](../../chapters/chapter-05/#section-5-5)
- [第6章：kill switch / quarantine / rollback / escalation](../../chapters/chapter-06/#section-6-3)
- [付録A：AI incident runbook](../templates/#a161-ai-incident-runbook)

### 運用から次の判断へ

incident timeline と postmortem は、障害を閉じるだけの記録ではない。どの前提、要求、設計、承認、監視が不十分だったかを判断へ戻し、requirements brief、ADR、runbook、training を更新するための入力である。

- [第6章：根本原因分析と postmortem](../../chapters/chapter-06/#section-6-6)
- [第1章：前提・仮説ログ](../../chapters/chapter-01/#section-1-6)
- [付録D：更新時のレビュー観点](../update-notes/#d3-更新時のレビュー観点)

## 役割・目的別のルート

章を順番に読む代わりに、自分が持つ判断と成果物から入口を選べる。どのルートでも、最終判断と説明責任は人間と組織が持つ。

| 役割 | まず解く目的 | 入口 | 次に使う成果物 |
| --- | --- | --- | --- |
| IC / Tech Lead | AI 出力を根拠付きの判断と実装差分へ変換する | [第1章](../../chapters/chapter-01/) → [第4章](../../chapters/chapter-04/) | 判断メモ、PR、verification record |
| PM / 要件担当 | 問題・要求・自動化境界を合意可能にする | [第2章](../../chapters/chapter-02/) → [第5章](../../chapters/chapter-05/) | requirements brief、acceptance criteria、提案メモ |
| Architect / Security | 構成候補、脅威、権限、評価を設計判断へ落とす | [第3章](../../chapters/chapter-03/) → [第6章](../../chapters/chapter-06/) | ADR、threat model、tool approval matrix、runbook |
| EM / 経営・法務窓口 | 効果、確認コスト、契約、責任分界を説明する | [第5章](../../chapters/chapter-05/) → [SOP](../../introduction/ai-collaboration-sop/) | risk register、ROI / TCO / control cost、approval log |
| SRE / DevOps / Security 運用 | 逸脱を止め、隔離し、復旧し、再発防止を追跡する | [第6章](../../chapters/chapter-06/) → [第1章](../../chapters/chapter-01/#section-1-6) | severity matrix、incident timeline、postmortem |
| 全ロール | 用語と図版から必要な章へジャンプする | [付録F：用語集](../glossary/) → [付録G：図表索引](../figure-index/) | 用語の定義、図版の用途、関連章 |

## 迷ったときの最小ルート

1. [SOP の Issue 化](../../introduction/ai-collaboration-sop/#全体像10ステップ) で、目的、利用者、判断点、成功条件を書く。
2. [第1章の source hierarchy](../../chapters/chapter-01/#section-1-3) で、根拠と不確実性を分ける。
3. [第2章の要求境界](../../chapters/chapter-02/#section-2-1) で、データ、権限、失敗時挙動を決める。
4. [第3章の ADR](../../chapters/chapter-03/#section-3-9) と [第4章の検証責任](../../chapters/chapter-04/#section-4-4) で、実装・評価・承認を接続する。
5. [第5章の合意形成](../../chapters/chapter-05/#section-5-8) と [第6章の運用統制](../../chapters/chapter-06/#section-6-3) で、導入後の責任分界と停止条件を残す。

このルートで使う用語は [付録F：用語集](../glossary/)、本文中の図版を探す場合は [付録G：図表索引](../figure-index/) を参照する。
