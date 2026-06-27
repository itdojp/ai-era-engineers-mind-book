---
title: "付録C：推奨読書リスト"
description: "AI ネイティブ実務に必要な書籍、標準、公式ドキュメント、シリーズ内関連書籍、役割別学習順"
layout: book
---

# 付録C：推奨読書リスト

この付録は、AI 時代のプロフェッショナル IT エンジニアが継続的に参照するための読書・公式ドキュメントリストである。
古典的な思考法・設計・組織論は残しつつ、2026年時点の実務で重要な **公式ドキュメント / 標準 / セキュリティ / 評価 / 運用** に寄せて再編する。

本文で扱う判断原則は比較的長く使える。一方で、モデル名、API、UI、価格、個別ツールの制限は変わりやすい。
そのため、本付録では「変わりにくい書籍」と「最新版を確認すべき公式情報」を分けて扱う。

## C.0 読み方

| 種別 | 読む目的 | 更新時の扱い |
| --- | --- | --- |
| 書籍 | 思考法、設計原則、組織運営など長く使える土台を作る | 版や翻訳状況を確認し、本文の原則と接続する |
| 標準 / ガイド | governance、risk、security、audit、management system の判断軸を得る | 必ず公式ページで最新版を確認する |
| 公式ドキュメント | MCP、eval、agent、Copilot など実装・運用に直結する仕様を確認する | UI/API/制限は本文へ固定せず、公式リンクへ逃がす |
| シリーズ内関連書籍 | 本書で扱わない実装詳細、運用詳細、文書化詳細へ進む | 重複を避け、役割別に読む順番を決める |

読む順番は、最初から網羅しようとしない。
まず担当する意思決定に必要な1カテゴリを選び、成果物へ落とす。
たとえば、AI 社内ツールの要件定義なら、NIST AI RMF、OWASP LLM Top 10、付録Aの requirements brief / threat model / eval spec を組み合わせる。

## C.1 書籍：残すべき古典と実務基盤

### C.1.1 思考法・意思決定

| 書籍 | 主な用途 | 本書との接続 |
| --- | --- | --- |
| 「考える技術・書く技術」バーバラ・ミント | 論点を構造化し、経営層・監査・関係者へ説明する | 第1章の問い、source hierarchy、判断メモ |
| 「イシューからはじめよ」安宅和人 | 解くべき問題を選び、AI で高速化する前に論点を絞る | 第2章の問題設定、非目標、open question |
| 「仮説思考」内田和成 | 不確実性下で仮説を置き、検証計画へ落とす | 第1章の前提 / 仮説ログ、調査 → 判断 → 検証 |
| 「ファスト&スロー」ダニエル・カーネマン | 認知バイアスと判断ミスを理解する | AI の文章品質を正しさと誤認しないための補助線 |
| "Thinking in Systems" Donella H. Meadows | 複雑な組織・技術・運用の相互作用を捉える | 第3章の設計トレードオフ、第6章のインシデント連鎖 |

### C.1.2 ソフトウェア設計・アーキテクチャ

| 書籍 | 主な用途 | 本書との接続 |
| --- | --- | --- |
| 「リーダブルコード」Dustin Boswell / Trevor Foucher | 人間がレビューできるコードと説明の基礎 | 第4章のレビュー責任、AI 生成コード検証 |
| "Clean Code" Robert C. Martin | 保守可能性、可読性、技術的負債の基礎 | AI 支援で差分が増える場合の品質基準 |
| 「ドメイン駆動設計」Eric Evans | 業務概念と設計を接続する | 第2章の要求境界、第3章の ADR |
| "Designing Data-Intensive Applications" Martin Kleppmann | データ、分散システム、信頼性の設計 | RAG、ログ、trace、監査データ設計 |
| "Building Evolutionary Architectures" Neal Ford 他 | 変化に強いアーキテクチャと fitness function | eval、regression、architecture decision matrix |
| 「ソフトウェアアーキテクチャの基礎」Mark Richards / Neal Ford | アーキテクチャ特性とトレードオフ分析 | 第3章の latency / cost / quality / reliability budget |

### C.1.3 Delivery・組織・マネジメント

| 書籍 | 主な用途 | 本書との接続 |
| --- | --- | --- |
| "Accelerate" Nicole Forsgren 他 | delivery performance と組織能力を測る | 第4章の lead time、failed change、recovery、verification cost |
| "Team Topologies" Matthew Skelton / Manuel Pais | チーム境界、認知負荷、platform 設計 | AI 利用の team working agreement、approval throughput |
| "The Manager's Path" Camille Fournier | IC、Tech Lead、EM の責任遷移を理解する | 第5章のステークホルダー合意、decision rights |
| "High Output Management" Andrew S. Grove | マネジメントの基礎、レバレッジ、会議設計 | AI 投資、統制、説明責任の運用リズム |
| "Team Geek" Brian W. Fitzpatrick / Ben Collins-Sussman | HRT、レビュー文化、チーム協働 | AI review を人間レビューの代替にしない文化 |
| "The Mythical Man-Month" Frederick P. Brooks Jr. | 複雑なソフトウェア開発の古典的制約 | AI 導入で人月制約が消えたと誤認しないための補助線 |

## C.2 標準 / ガイド：governance・risk・security の基準

AI 機能を本番化する場合、技術設計だけでなく、リスク管理、監査、説明責任、管理システムが必要になる。
次の標準 / ガイドは、本文の security / privacy / compliance / approval / audit / rollback の観点を補強する。

| リソース | 位置づけ | 使いどころ |
| --- | --- | --- |
| [NIST AI Risk Management Framework (AI RMF)](https://www.nist.gov/itl/ai-risk-management-framework) | AI リスク管理の基礎フレームワーク | AI 施策のrisk register、govern / map / measure / manage の整理 |
| [NIST AI RMF Generative AI Profile](https://doi.org/10.6028/NIST.AI.600-1) | 生成 AI 向けのリスクプロファイル | hallucination、data leakage、misuse、incident response を整理する |
| [ISO/IEC 42001:2023](https://www.iso.org/standard/42001) | AI management system の国際規格 | AI を組織として管理・監査する必要がある場合の基準 |
| [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) | LLM アプリケーションの代表的リスク | prompt injection、insecure output handling、supply chain、data leakage の脅威分析 |
| [MITRE ATLAS](https://atlas.mitre.org/) | AI システムに対する攻撃戦術・技術の知識ベース | threat model、red team、security review の観点整理 |
| [Guidelines for Secure AI System Development](https://www.ncsc.gov.uk/collection/guidelines-secure-ai-system-development) | NCSC、CISA、NSA等によるsecure AI 開発ガイド | secure by design、secure development、secure deployment、secure operation の確認 |
| [CISA Roadmap for AI](https://www.cisa.gov/resources-tools/resources/roadmap-ai) | 重要インフラとサイバー防衛における AI リスク整理 | critical infrastructure、SRE、security leadership の合意形成 |

これらは「読んだら終わり」ではない。
付録Aの threat model、tool approval matrix、data classification sheet、verification record へ反映して初めて、実務成果物になる。

## C.3 公式ドキュメント：変化が速い領域

API、agent、MCP、評価基盤、AI 支援開発ツールは変化が速い。
本文には一般化した判断原則を置き、具体的な仕様は公式ドキュメントで確認する。

| 領域 | 公式リソース | 確認すること |
| --- | --- | --- |
| MCP / tool integration | [Model Context Protocol documentation](https://modelcontextprotocol.io/docs/getting-started/intro) | client / server / tool / resource / prompt の責任境界、権限、transport、security notes |
| OpenAI evals | [OpenAI Evals guide](https://developers.openai.com/api/docs/guides/evals) | eval 設計、data source、grader、run、regressionの運用方法 |
| Agent evaluation | [OpenAI Agent evals guide](https://developers.openai.com/api/docs/guides/agent-evals) | agent workflow の評価、trace、grader、failure analysis |
| AI-assisted delivery | [GitHub Copilot coding agent best practices](https://docs.github.com/en/copilot/tutorials/cloud-agent/get-the-best-results) | Issue の書き方、taskの切り方、review 前提の使い方 |
| Responsible use | [Responsible use of GitHub Copilot coding agent](https://docs.github.com/en/copilot/responsible-use-of-github-copilot-features/responsible-use-of-copilot-coding-agent-on-githubcom) | 人間の責任、制限、レビュー、利用上の注意 |
| Reliability / incident response | [Google SRE: Emergency Response](https://sre.google/sre-book/emergency-response/) | incident response、rollback、communication、訓練 |
| Postmortem | [Google SRE Workbook: Postmortem Culture](https://sre.google/workbook/postmortem-culture/) | blameless postmortem、学習機会、再発防止 |
| Documentation architecture | [Diátaxis](https://diataxis.fr/) | tutorial、how-to、reference、explanation の分離 |

公式ドキュメントを読むときは、次を記録する。

- 確認日
- 対象バージョンまたはページ URL
- 採用した前提
- 本文へ残す一般原則
- 付録または更新ノートへ逃がす変動情報
- 変更が必要な成果物テンプレート

## C.4 優先カテゴリ別の読み方

Issue #127 の付録Cでは、次のカテゴリを優先する。
各カテゴリは、読むだけでなく成果物へ接続する。

| 優先カテゴリ | まず読む | 残す成果物 |
| --- | --- | --- |
| secure AI / LLM application security | OWASP LLM Top 10、MITRE ATLAS、Guidelines for Secure AI System Development | threat model、tool approval matrix、security review checklist |
| evals / agent evaluation | OpenAI Evals guide、OpenAI Agent evals guide、NIST AI RMF Measure | eval spec、eval dataset design sheet、verification record |
| MCP / tool integration | Model Context Protocol documentation、OWASP LLM Top 10、MITRE ATLAS | AI system ADR、tool approval matrix、audit trail design |
| AI-assisted software delivery | GitHub Copilot coding agent best practices、Responsible use of Copilot coding agent、Accelerate | agent task brief、PR テンプレート、review checklist、delivery metrics dashboard |
| incident / reliability / governance | Google SRE、NIST AI RMF、NIST AI RMF Generative AI Profile、CISA Roadmap for AI | AI incident runbook、severity matrix、postmortem、risk register |
| documentation / evidence / traceability | Diátaxis、付録A、engineering documentation 系のシリーズ内書籍 | ADR、decision log、verification record、update notes |

## C.5 シリーズ内の関連書籍

本書は「思考法・意思決定・説明責任」に主軸を置く。
実装や運用の詳細は、シリーズ内の関連書籍で補完する。

| 読みたいテーマ | 関連書籍 | 使いどころ |
| --- | --- | --- |
| Issue / PR 運用 | [Issue 駆動開発 実践ガイド](https://itdojp.github.io/issue-driven-work-book/) | Issue → plan → PR → review の運用詳細 |
| GitHub workflow | [GitHub Workflow Book](https://itdojp.github.io/github-workflow-book/) | branch、PR、CI、review、release の運用 |
| AgentOps | [GitHub AgentOps Book](https://itdojp.github.io/GitHub-AgentOps-book/) | agent運用、監査、権限、レビューゲート |
| AI テスト戦略 | [AI Testing Strategy Book](https://itdojp.github.io/ai-testing-strategy-book/) | eval、regression、test generation、品質測定 |
| エンジニアリング文書 | [Engineering Documentation Book](https://itdojp.github.io/engineering-documentation-book/) | ADR、runbook、decision log、traceability |
| 証跡・判断根拠 | [Evidence-Based Engineering Book](https://itdojp.github.io/evidence-based-engineering-book/) | evidence、measurement、decision record |
| セキュリティ / プライバシー | [Security Privacy Literacy Book](https://itdojp.github.io/security-privacy-literacy-book/) | data classification、privacy、risk communication |
| インシデント対応 | [Incident Response Basics Book](https://itdojp.github.io/incident-response-basics-book/) | severity、escalation、communication、postmortem |

シリーズ内の書籍を読むときは、本書の章と付録Aの成果物へ戻す。
たとえば、AgentOps の詳細を読んだ場合は、tool approval matrix、AI incident runbook、verification record を更新する。

## C.6 役割別おすすめ順

### IC / Senior Engineer

1. 第1章と第2章を読み、判断メモと requirements brief を作る。
2. 「イシューからはじめよ」「仮説思考」で問題設定を補強する。
3. OWASP LLM Top 10 と OpenAI Evals guide を読み、最低限の threat model と eval spec を作る。
4. GitHub Copilot coding agent best practices を読み、PR 単位の AI 利用記録を残す。
5. Engineering Documentation Book で ADR と verification record の書き方を補う。

### Tech Lead / Architect

1. 第3章を読み、architecture decision matrix と AI system ADR を作る。
2. NIST AI RMF、NIST AI RMF Generative AI Profile、ISO/IEC 42001 を読み、governance と設計判断を接続する。
3. MCP documentation と MITRE ATLAS を読み、tool 権限と threat model を更新する。
4. "Designing Data-Intensive Applications" と "Building Evolutionary Architectures" でデータ・評価・変化耐性を補強する。
5. AgentOps Book と AI Testing Strategy Book へ進む。

### EM / Engineering Manager

1. 第5章を読み、stakeholder map、risk register、ROI / TCO / control cost 表を作る。
2. "Accelerate"、"Team Topologies"、"High Output Management" を読み、組織能力と測定指標を整理する。
3. ISO/IEC 42001 と CISA Roadmap for AI を読み、責任体制、承認、監査、教育計画を確認する。
4. GitHub Copilot responsible use を読み、チーム利用ルールと review 責任を明文化する。
5. #152 などの portfolio-level sprint で、書籍・チーム・成果物の更新状況を追跡する。

### SRE / DevOps / Platform

1. 第6章を読み、AI incident runbook、severity matrix、communication template を作る。
2. Google SRE の Emergency Response と Postmortem Culture を読み、incident 運用を補強する。
3. NIST AI RMF、NIST AI RMF Generative AI Profile、MITRE ATLAS を読み、AI 固有 incident の分類を整える。
4. MCP documentation を読み、read-only tool、approval gate、audit trail を設計する。
5. Incident Response Basics Book と GitHub AgentOps Book で運用詳細を補う。

### Security / Privacy / Compliance

1. OWASP LLM Top 10、MITRE ATLAS、Guidelines for Secure AI System Development を読む。
2. NIST AI RMF、NIST AI RMF Generative AI Profile、ISO/IEC 42001 を読み、governance、risk、audit の言葉に変換する。
3. 第2章の data / permission boundary table と第3章の threat model をレビューする。
4. 第6章の postmortem と incident timeline に、approval bypass、MCP authorization failure、data exfiltration を含める。
5. Security Privacy Literacy Book と Evidence-Based Engineering Book で説明責任を補強する。

### Documentation Owner / Tech Writer

1. Diátaxis を読み、tutorial、how-to、reference、explanation を分ける。
2. Engineering Documentation Book を読み、ADR、runbook、decision log、update notes を整備する。
3. 本書の付録Aテンプレートを使い、成果物の粒度と命名を揃える。
4. 第1章の source hierarchy を使い、AI 要約と一次情報の区別を明示する。
5. 変化しやすい情報は付録D へ寄せ、本文に固定しすぎない。

## C.7 読書を成果物へ変換する

推奨読書リストは、積読リストではない。
読んだ内容は、次のいずれかへ変換する。

- 判断メモ
- requirements brief
- AI system ADR
- threat model
- eval spec
- tool approval matrix
- data classification sheet
- verification record
- runbook
- postmortem
- update notes

1冊または1つの公式ドキュメントを読んだら、次を記録する。

```text
Resource:
URL / edition:
Read date:
Relevant chapter:
Adopted principle:
Rejected or deferred item:
Artifact updated:
Next review date:
```

これにより、学習を個人の理解で止めず、チームの判断根拠、監査証跡、運用改善へ接続できる。
