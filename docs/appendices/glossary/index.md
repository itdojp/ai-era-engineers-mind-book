---
title: "付録F：用語集"
description: "本書で使うAIネイティブな実務用語を、関連章・SOP・付録とともに確認する用語集"
layout: book
---

<!-- markdownlint-disable MD033 -->

# 付録F：用語集

この用語集は、単なる英単語の翻訳表ではない。本書で用語が指す判断、成果物、責任境界を短く定義し、関連する章、[AI 協働の標準手順（SOP）](../../introduction/ai-collaboration-sop/)、付録へ移動できるようにしている。製品名やモデル名ではなく、複数の実装に適用できる概念を優先する。

## 判断・要求

| 用語 | 本書での定義 | 関連章 | SOP / 付録 |
| --- | --- | --- | --- |
| <a id="term-context-engineering"></a>context engineering | 問い、前提、根拠、制約、出力 schema を、判断に必要な文脈として設計すること。プロンプトを長くすることとは異なる。 | [第1章 §1.1](../../chapters/chapter-01/#section-1-1) | [SOP：入力設計](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録E](../concept-map/#判断から要求へ) |
| <a id="term-schema-first-thinking"></a>schema-first thinking | 自由作文を先に求めず、必要な項目、型、欠損時の扱い、検証条件を先に定義する考え方。 | [第1章 §1.2](../../chapters/chapter-01/#section-1-2) | [SOP：評価設計](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/#a2-ai-system-prd--requirements-brief) |
| <a id="term-source-hierarchy"></a>source hierarchy | 一次情報、実測、テスト、レビュー、AI 要約など、根拠の優先順位を明示して不確実性を管理する方法。 | [第1章 §1.3](../../chapters/chapter-01/#section-1-3) | [SOP：入力設計](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録E](../concept-map/#判断から要求へ) |
| <a id="term-delegate-review-own"></a>delegate / review / own | AI に任せる支援作業、 人が検証する作業、人が最終責任を持つ判断を分ける責任モデル。 | [第1章 §1.4](../../chapters/chapter-01/#section-1-4) | [SOP：Delegate / Review / Own](../../introduction/ai-collaboration-sop/#delegate--review--own) / [付録A](../templates/) |
| <a id="term-decision-rights"></a>decision rights | 誰が決め、誰がレビューし、誰が承認し、誰へ escalation するかを定義した権限境界。 | [第1章 §1.5](../../chapters/chapter-01/#section-1-5) | [SOP：Plan 作成](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/) |
| <a id="term-requirements-brief"></a>requirements brief | 問題、利用者、対象範囲、データ・権限境界、自動化境界、受入条件、失敗時挙動を合意する要求文書。 | [第2章 §2.2](../../chapters/chapter-02/#section-2-2) | [SOP：反映](../../introduction/ai-collaboration-sop/#成果物への落とし込み先) / [付録A](../templates/#a2-ai-system-prd--requirements-brief) |
| <a id="term-acceptance-criteria"></a>acceptance criteria | 成果物や機能を受け入れられるかを、測定方法と責任者を含めて判定できる条件。 | [第2章 §2.5](../../chapters/chapter-02/#section-2-5) | [SOP：評価設計](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/#a2-ai-system-prd--requirements-brief) |
| <a id="term-human-in-the-loop"></a>Human-in-the-loop | AI の提案や実行の各対象について、人が確認してから次の処理へ進める自動化境界。 | [第2章 §2.4](../../chapters/chapter-02/#section-2-4) | [SOP：レビュー・承認](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/) |
| <a id="term-fallback"></a>fallback / manual override / rollback | AI が使えない、誤る、または危険な場合に、代替処理へ切り替える、手動で上書きする、変更を戻すための三つの制御。 | [第2章 §2.7](../../chapters/chapter-02/#section-2-7) | [SOP：リリース・運用](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/) |
| <a id="term-guardrail-metric"></a>guardrail metric | 便利さや売上などの KPI とは別に、安全性、品質、コスト、権限逸脱などの許容範囲を監視する指標。 | [第2章 §2.6](../../chapters/chapter-02/#section-2-6) | [SOP：評価設計](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/) |

## 設計・評価

| 用語 | 本書での定義 | 関連章 | SOP / 付録 |
| --- | --- | --- | --- |
| <a id="term-rag"></a>RAG | 検索・取得した根拠を生成処理へ渡し、回答と参照元を結び付ける構成。取得できることは、根拠が正しいことを保証しない。 | [第3章 §3.1](../../chapters/chapter-03/#section-3-1) | [SOP：入力設計](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録B](../case-studies/) |
| <a id="term-workflow-agent"></a>workflow / agent | workflow は定めた手順をつなぐ構成、agent は状況に応じて次の行動や tool 呼び出しを選ぶ構成。本書では両者を同じ統制対象として比較する。 | [第3章 §3.1](../../chapters/chapter-03/#section-3-1) | [SOP：生成・探索](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録E](../concept-map/#要求から設計へ) |
| <a id="term-mcp"></a>MCP（Model Context Protocol） | AI applicationと外部systemのcontext交換に使うopenなclient-server protocol。hostはclientを通じてserverへ接続し、serverはtool、resource、promptを公開できる。特定製品のconnector名ではない。 | [第3章 §3.4](../../chapters/chapter-03/#section-3-4) | [SOP：approval / audit / rollback](../../introduction/ai-collaboration-sop/#approval--audit--rollback-の確認観点) / [付録C](../reading-list/) |
| <a id="term-connector"></a>connector | 製品やplatformがSaaS・業務systemとの認証、data取得、操作をまとめて提供する統合面。本書での総称であり、業界共通のprotocol名ではない。権限と監査の契約は製品・実装ごとに確認する。 | [第3章 §3.4](../../chapters/chapter-03/#section-3-4) | [SOP：approval / audit / rollback](../../introduction/ai-collaboration-sop/#approval--audit--rollback-の確認観点) / [付録D](../update-notes/) |
| <a id="term-function-calling"></a>function calling | modelが定義済みのtool / function schemaに沿って呼び出し名と引数を返す仕組み。model自身が処理を実行するのではなく、applicationが引数を検証し、許可された処理を実行する。 | [第3章 §3.4](../../chapters/chapter-03/#section-3-4) | [SOP：レビュー・承認](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/) |
| <a id="term-external-api"></a>外部 API | 本書では、applicationまたはtoolが既存のAPI contractを直接呼ぶ方式。認証、rate limit、retry、error処理、rollbackは呼び出すapplication側の責務とする。標準規格の名称ではない。 | [第3章 §3.4](../../chapters/chapter-03/#section-3-4) | [SOP：リリース・運用](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録D](../update-notes/) |
| <a id="term-tool-approval-matrix"></a>tool approval matrix | tool、操作、データ、権限ごとに、実行前承認、事後監査、禁止を分類する表。 | [第3章 §3.4](../../chapters/chapter-03/#section-3-4) | [SOP：approval / audit / rollback](../../introduction/ai-collaboration-sop/#approval--audit--rollback-の確認観点) / [付録A](../templates/) |
| <a id="term-threat-model"></a>threat model | 資産、攻撃者、信頼境界、攻撃経路、影響、control point を整理して、設計の脅威と対策を対応付ける成果物。 | [第3章 §3.5](../../chapters/chapter-03/#section-3-5) | [SOP：情報分類](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/) |
| <a id="term-eval-harness"></a>eval harness | 入力、期待値、評価指標、実行環境、結果、失敗例を繰り返し検証するための評価基盤。 | [第3章 §3.6](../../chapters/chapter-03/#section-3-6) | [SOP：評価設計](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/) |
| <a id="term-audit-trail"></a>audit trail | 誰が、いつ、何を入力し、どの出力を採用し、どの検証・承認を行ったかを後から追跡できる記録。 | [第3章 §3.5](../../chapters/chapter-03/#section-3-5) | [SOP：audit](../../introduction/ai-collaboration-sop/#approval--audit--rollback-の確認観点) / [付録A](../templates/) |
| <a id="term-ai-system-adr"></a>AI system ADR | AI を含むシステムの選択肢、採用理由、却下理由、制約、評価、control point、退出条件を記録する設計判断文書。 | [第3章 §3.9](../../chapters/chapter-03/#section-3-9) | [SOP：反映](../../introduction/ai-collaboration-sop/#成果物への落とし込み先) / [付録A](../templates/#a3-ai-system-adr) |
| <a id="term-ai-native-sdlc"></a>AI-native SDLC / agent-assisted delivery | Issue、Plan、PR、レビュー、評価、リリースを、AI の支援範囲と人間の検証責任を明記して運用する delivery 方法。 | [第4章 §4.1](../../chapters/chapter-04/#section-4-1) | [SOP：反映、レビュー・承認](../../introduction/ai-collaboration-sop/#成果物への落とし込み先) / [付録E](../concept-map/#設計から-delivery-へ) |
| <a id="term-verification-cost"></a>verification cost | 生成や自動化で得た速度から、確認、再現、レビュー、修正、監査に必要な時間・費用・認知負荷を差し引くためのコスト。 | [第4章 §4.4](../../chapters/chapter-04/#section-4-4) | [SOP：Review](../../introduction/ai-collaboration-sop/#delegate--review--own) / [付録A](../templates/#a113-roi--tco--control-cost-表) |
| <a id="term-regression"></a>regression | 変更後に、既存の品質、セキュリティ、コスト、運用条件が悪化していないかを再検証すること。 | [第3章 §3.6](../../chapters/chapter-03/#section-3-6) / [第4章 §4.4](../../chapters/chapter-04/#section-4-4) | [SOP：評価設計](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/) |

## 合意・運用

| 用語 | 本書での定義 | 関連章 | SOP / 付録 |
| --- | --- | --- | --- |
| <a id="term-risk-register"></a>risk register | リスク、根拠、影響、対応、owner、期限、受容・解除条件を追跡する台帳。 | [第5章 §5.5](../../chapters/chapter-05/#section-5-5) | [SOP：レビュー・承認](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/) |
| <a id="term-roi-tco-control-cost"></a>ROI / TCO / control cost | ROI は効果と投資の関係、TCO は導入から廃止までの総保有コスト、control cost は検証・承認・監査・安全運用のコスト。 | [第5章 §5.2](../../chapters/chapter-05/#section-5-2) | [SOP：Plan / 評価設計](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/#a113-roi--tco--control-cost-表) |
| <a id="term-exit-strategy"></a>exit strategy | provider、モデル、契約、データ形式、運用依存を切り替えられる条件と、切り替え手順・費用・責任者を事前に定めること。 | [第3章 §3.8](../../chapters/chapter-03/#section-3-8) / [第5章 §5.6](../../chapters/chapter-05/#section-5-6) | [SOP：リリース・運用](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録D](../update-notes/) |
| <a id="term-ai-incident"></a>AI incident | AI の誤出力、権限逸脱、prompt injection、provider 障害、コスト暴走、approval bypass など、業務・安全・説明責任へ影響する事象。 | [第6章 §6.1](../../chapters/chapter-06/#section-6-1) | [SOP：事後記録](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/#a161-ai-incident-runbook) |
| <a id="term-kill-switch"></a>kill switch / quarantine | kill switch は自動化や tool 実行を止める操作、quarantine は影響する入力・出力・実行主体を隔離して調査する操作。 | [第6章 §6.3](../../chapters/chapter-06/#section-6-3) | [SOP：rollback](../../introduction/ai-collaboration-sop/#approval--audit--rollback-の確認観点) / [付録A](../templates/#a161-ai-incident-runbook) |
| <a id="term-postmortem"></a>postmortem | 事実と仮説、影響、検知・対応、根本原因、寄与要因、是正措置を、個人攻撃ではなく accountable な学習として記録する文書。 | [第6章 §6.6](../../chapters/chapter-06/#section-6-6) | [SOP：事後記録](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/) |
| <a id="term-manual-takeover"></a>manual takeover | AI や自動化を停止または迂回し、人間が定められた手順で業務を継続する運用状態。担当者、権限、開始条件、解除条件を定義する。 | [第2章 §2.7](../../chapters/chapter-02/#section-2-7) / [第6章 §6.3](../../chapters/chapter-06/#section-6-3) | [SOP：リリース・運用](../../introduction/ai-collaboration-sop/#全体像10ステップ) / [付録A](../templates/) |
| <a id="term-skill-degradation"></a>skill degradation | AI への過度な委任で、人が設計、実装、検証、障害対応を行う能力や判断基準を失うリスク。学習設計とレビュー責任で抑制する。 | [第4章 §4.8](../../chapters/chapter-04/#section-4-8) / [第5章 §5.7](../../chapters/chapter-05/#section-5-7) | [SOP：Small Start](../../introduction/ai-collaboration-sop/#最小運用small-start) / [付録C](../reading-list/) |

## 用語を更新するときの注意

- 用語の定義を製品名、モデル名、価格、UI の固有仕様に依存させない。
- 定義を変える場合は、関連章、[SOP](../../introduction/ai-collaboration-sop/)、[付録Aのテンプレート](../templates/)、[付録Eの依存関係](../concept-map/)、[付録Gの図版メタデータ](../figure-index/)を同時に確認する。
- 実測値や保証を示す必要がある場合は、測定条件、データの版、確認日、owner を記録する。概念図の数値や年代は実測効果を意味しない。
