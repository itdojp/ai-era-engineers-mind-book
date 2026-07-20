# AI時代のプロフェッショナルITエンジニアの思考法

AI ネイティブな実務を前提に、シニアエンジニア、テックリード、アーキテクト、EM、SRE、DevOps リーダー、Security 担当者が、意思決定・説明責任・運用統制を成果物として残すための実践書です。

- 公開ページ（GitHub Pages）: [AI時代のプロフェッショナルITエンジニアの思考法](https://itdojp.github.io/ai-era-engineers-mind-book/)
- 目次（リポジトリ内）: `docs/index.md`
- シリーズ: [IT エンジニア知識体系](https://github.com/itdojp/it-engineer-knowledge-architecture)
- 関連 Issue: [#127 2026年版への全面リライト](https://github.com/itdojp/ai-era-engineers-mind-book/issues/127)
- 保守者向け手順: [`MAINTENANCE.md`](MAINTENANCE.md)

## 本書の位置づけ

本書は、生成 AI や agent を単体の「便利なツール」として扱うのではなく、Issue、Plan、ADR、PR、Eval、Runbook、Postmortem まで接続された運用体系として扱います。本文の主軸は、特定ベンダーやモデルの比較ではなく、次の4点です。

- **思考法**: 問い、前提、根拠、制約、失敗条件を分離して扱う。
- **意思決定**: AI に任せる作業、人がレビューする作業、人が最終責任を持つ判断を分ける。
- **説明責任**: 採用理由、却下理由、検証結果、承認者、監査ログを後から追跡できる形で残す。
- **運用統制**: approval / audit / rollback / fallback / manual takeover を設計時点から扱う。

## この本でできるようになること

- AI 支援開発や LLM アプリケーションの判断を、品質・安全・再現性・レビュー負荷・復旧性・監査性で評価できるようになる。
- 要件定義、設計、実装、運用、危機対応を、成果物とレビューゲートを持つ一連の意思決定プロセスとして扱えるようになる。
- CFO、法務、セキュリティ、監査、現場責任者に対して、効果だけでなく検証コスト、統制コスト、事故時の説明責任を説明できるようになる。
- 変化しやすいモデル名、価格、UI、API 細部を本文に固定しすぎず、更新しやすい形で管理できるようになる。

## 2026年版リライトの作業方針

Issue #127 では、本書全体を段階的に 2026年版へ刷新します。各 PR は次の条件を満たす粒度で作成します。

- 章番号と公開 URL の大分類は維持し、読者と既存リンクへの影響を最小化する。
- 抽象論の追記だけで終えず、判断メモ、requirements brief、AI system ADR、eval plan、risk register、Runbook、Postmortem などの成果物に接続する。
- security / privacy / compliance / approval / audit / rollback を各章・付録の文脈に組み込む。
- 隣接書籍と重複する詳細実装は、本文では判断原則に留め、必要に応じてシリーズ内の関連書籍へ誘導する。

## フィードバック（誤り指摘・改善提案）

誤字脱字、技術的な誤り、改善提案は Issues / PR で受け付けます。手順は `CONTRIBUTING.md` を参照してください。

## ライセンス

本書は Creative Commons BY-NC-SA 4.0 で提供されています。詳細は `LICENSE.md` を参照してください。
