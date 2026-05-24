---
layout: book
title: "AI時代のプロフェッショナルITエンジニアの思考法"
subtitle: "AIネイティブな実務における意思決定・説明責任・運用統制の実践書"
description: "AIネイティブな実務を前提に、シニアエンジニア、テックリード、アーキテクト、EM、SRE、DevOps リーダー、Security 担当者が、意思決定・説明責任・運用統制を成果物として残すための実践書"
author: "株式会社アイティードゥ"
version: "1.0.0"
order: 1
permalink: /
---

# {{ page.title }}

{{ page.subtitle }}
{: .fs-6 .fw-300 }

---

## 2026年版の位置づけ

生成AI、workflow、agent、外部 connector は、実務の一部になりつつある。一方で、成果物の速度だけを見て導入すると、レビュー不能な変更、権限逸脱、監査証跡の欠落、事故時の説明不能という形で負債が残る。

本書は、AIを使うかどうかではなく、AIを含む業務・プロダクト・運用を **誰が、どの根拠で、どこまで自動化し、どこで止めるか** という意思決定の問題として扱う。主な読者は、シニアエンジニア、テックリード、アーキテクト、EM、SRE、DevOps リーダー、Security 担当者である。

## 本書の守備範囲

| 区分 | 本書で扱うこと | 本書で深掘りしないこと |
| --- | --- | --- |
| 思考法 | 問い、前提、根拠、制約、失敗条件を分ける方法 | 汎用的な論理思考そのものの全体系 |
| 意思決定 | delegate / review / own、decision rights、escalation | 特定ツールの画面操作や価格比較 |
| AI協働 | Issue → Plan → ADR → PR → Eval → Runbook / Postmortem の運用 | 個別モデルやベンダーの網羅カタログ |
| 統制 | security、privacy、compliance、approval、audit、rollback | 法務判断や監査判断の代替 |
| 運用 | incident、fallback、manual takeover、postmortem | 各クラウド・各SaaSの詳細実装手順 |

詳細実装は必要に応じて隣接書籍へ誘導する。本書は、実装手順の再掲ではなく、実装・運用・統制の前後で必要になる判断原則と成果物を扱う。

## 本書で得られる成果物

本書の各章と付録は、読み物ではなく実務成果物へ接続する。代表的な成果物は次のとおりである。

| 成果物 | 主な利用場面 | 関連章 |
| --- | --- | --- |
| 判断メモ / 前提・仮説ログ | 調査結果を採用判断へ変換する | 第1章 |
| requirements brief / acceptance criteria | AIを含む業務・プロダクトの要求を確定する | 第2章 |
| data / permission boundary table | 利用データ、権限、禁止情報を明確にする | 第2章・第3章 |
| AI system ADR / architecture decision matrix | workflow、agent、RAG、tool 実行の採否を説明する | 第3章 |
| eval plan / threat model / tool approval matrix | 品質、安全、権限、監査を設計時点で扱う | 第3章 |
| AI利用ポリシー付き PR / review checklist | AI支援開発の検証責任を PR に残す | 第4章 |
| risk register / ROI・TCO・control cost 整理表 | 経営、法務、セキュリティ、監査へ説明する | 第5章 |
| AI incident runbook / postmortem | AI固有の障害・誤動作・統制逸脱へ対応する | 第6章 |

## 対象読者と読み方

| 役割 | 先に読む章 | 重点観点 |
| --- | --- | --- |
| IC / Senior Engineer | 第1章 → 第2章 → 第4章 | 問いの設計、検証責任、PRで残す証跡 |
| Tech Lead | 第1章 → 第3章 → 第4章 | decision rights、レビュー境界、作業分割 |
| Architect | 第3章 → 第1章 → 第6章 | workflow / agent の選択、評価、脅威、復旧性 |
| EM | 第5章 → 第4章 → 第1章 | 生産性、レビュー負荷、学習劣化、説明責任 |
| SRE / DevOps | 第6章 → 第3章 → 第4章 | fallback、rollback、監査ログ、運用負荷 |
| Security | 第3章 → 第6章 → 第2章 | 権限、データ分類、approval、audit、インシデント |

すべてを順番に読む必要はない。ただし、AI出力を実務へ反映する場合は、[AI協働の標準手順（SOP）](introduction/ai-collaboration-sop/) を先に確認することを推奨する。

## 章構成とリライト契約

Issue #127 の 2026年版リライトでは、各章の冒頭に「この章で扱う判断」「誰向けか」「章末に何が残るか」「よくある失敗」を揃える。初回スライスでは、以降の章リライトがぶれないように章ごとの契約を次のように固定する。

| 章 | この章で扱う判断 | 主な読者 | 章末に残る成果物 | よくある失敗 |
| --- | --- | --- | --- | --- |
| [第1章：エンジニアの思考OS](chapters/chapter-01/) | AIネイティブ環境で、何を問い、何を根拠に判断するか | IC、Tech Lead、Architect | 判断メモ、前提・仮説ログ、調査→判断→検証の最小ループ | AIの文章品質を正しさと誤認する |
| [第2章：要件定義の認知プロセス](chapters/chapter-02/) | AIを含む業務・プロダクト・社内ツールの要求境界をどう決めるか | IC、Tech Lead、PM、Security | requirements brief、acceptance criteria、data / permission boundary table | 「精度が高い」を要件にして失敗時挙動を書かない |
| [第3章：アーキテクチャ設計の意思決定](chapters/chapter-03/) | 通常機能、RAG、workflow、agent をどう使い分けるか | Architect、Tech Lead、Security、SRE | AI system ADR、threat model、eval plan、tool approval matrix | AIを使うために不要な複雑性を増やす |
| [第4章：開発/構築フェーズの最適化思考](chapters/chapter-04/) | AI-assisted delivery をどの粒度で任せ、どう検証するか | Tech Lead、IC、EM、DevOps | AI利用ポリシー付き PR、review checklist、release readiness checklist | 生成量だけを追い、確認コストで相殺される |
| [第5章：ステークホルダーマネジメント](chapters/chapter-05/) | 効果、費用、統制、失敗時責任をどう説明して合意するか | EM、Architect、Tech Lead | 1ページ提案メモ、risk register、ROI / TCO / control cost 表 | productivity benefit だけを示し verification cost を隠す |
| [第6章：危機管理と問題解決](chapters/chapter-06/) | AI固有の障害・誤動作・統制逸脱をどう止め、復旧し、説明するか | SRE、DevOps、Security、EM | AI incident runbook、postmortem、severity matrix、incident timeline | 自動化の停止条件と manual takeover を定義しない |

## 目次

### はじめに

- [まえがき](introduction/preface/) - 2026年版の位置づけ、対象読者、役割別の読み方
- [ライセンスFAQ](introduction/license-faq/) - 利用条件と商用利用時の確認点
- [AI協働の標準手順（SOP）](introduction/ai-collaboration-sop/) - Issue から Postmortem までの成果物連鎖
- [前作（論理思考ガイド）との接続](introduction/bridge-logical-thinking-guide/) - 汎用スキルとの役割分担

### 本編

- [第1章：エンジニアの思考OS](chapters/chapter-01/)
- [第2章：要件定義の認知プロセス](chapters/chapter-02/)
- [第3章：アーキテクチャ設計の意思決定](chapters/chapter-03/)
- [第4章：開発/構築フェーズの最適化思考](chapters/chapter-04/)
- [第5章：ステークホルダーマネジメント](chapters/chapter-05/)
- [第6章：危機管理と問題解決](chapters/chapter-06/)

### 付録

- [実務成果物テンプレート集](appendices/templates/)
- [ケーススタディ](appendices/case-studies/)
- [推奨読書リスト](appendices/reading-list/)
- [更新履歴とメンテナンス方針](appendices/update-notes/)

## シリーズ内の関連書籍

本書は、思考法・意思決定・説明責任に主軸を置く。実装や個別運用の詳細は、次の書籍と組み合わせて確認する。

- 汎用的な問題設定・論理構成: [AI時代に差がつく論理的思考と表現力](https://itdojp.github.io/LogicalThinking-AI-Era-Guide/)
- agent 実装と運用設計: [AI Agent Engineering Book](https://itdojp.github.io/ai-agent-engineering-book/)
- AgentOps: [GitHub AgentOps Book](https://itdojp.github.io/GitHub-AgentOps-book/)
- GitHub workflow / Issue / PR 運用: [GitHub Workflow Book](https://itdojp.github.io/github-workflow-book/)
- AIテスト戦略: [AI Testing Strategy Book](https://itdojp.github.io/ai-testing-strategy-book/)
- エンジニアリングドキュメント: [Engineering Documentation Book](https://itdojp.github.io/engineering-documentation-book/)
- セキュリティとプライバシー: [Security Privacy Literacy Book](https://itdojp.github.io/security-privacy-literacy-book/)

## 安全に使うための注意

- 本書のフレームワークは、判断を代替するものではない。設計判断、リスク受容、説明責任は人間が担う前提で使う。
- 要件、障害情報、レビュー指摘、顧客情報を外部AIへ投入する場合は、機密区分、契約、社内規程、学習利用ポリシーを事前に確認する。
- ROI、リスク、技術選定の評価軸はそのまま流用せず、組織の責任分界、監査要件、承認権限に合わせて調整する。
- AIの出力は、一次情報、実測、テスト、レビュー、再現手順で検証する。文章が自然であることは、根拠が正しいことを意味しない。

## 利用と更新情報

- 公開ページ: [https://itdojp.github.io/ai-era-engineers-mind-book/](https://itdojp.github.io/ai-era-engineers-mind-book/)
- リポジトリ: [https://github.com/itdojp/ai-era-engineers-mind-book](https://github.com/itdojp/ai-era-engineers-mind-book)
- 2026年版リライトの方針と差分管理は [付録D：更新履歴とメンテナンス方針](appendices/update-notes/) を参照する。

## 著者について

**ITDO Inc.**
株式会社アイティードゥは、ITエンジニアの技術力向上と組織の成長を支援する企業です。

## ライセンス

本書は **Creative Commons BY-NC-SA 4.0** ライセンスで公開しています。
教育・研究・個人学習での利用は自由ですが、商用利用は別途契約（事前許諾）が必要です。

[詳細なライセンス条件](https://github.com/itdojp/it-engineer-knowledge-architecture/blob/main/LICENSE.md)

[ライセンスFAQ](introduction/license-faq/)

{% include page-navigation.html %}
