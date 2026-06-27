---
title: "第4章：開発/構築フェーズの最適化思考 - AI-native SDLC / Agent-assisted delivery"
subtitle: "AI-native SDLC / Agent-assisted delivery"
description: "Issue 起点の実装計画、agent-assisted delivery、AI レビュー、検証責任、release readiness、team working agreement を、PR と delivery pipeline へ落とす章"
layout: book
chapter: 4
---

# 第4章：開発/構築フェーズの最適化思考 - AI-native SDLC / Agent-assisted delivery

AI 支援開発の価値は、生成されたコード量ではなく、要求からリリースまでの意思決定、検証、レビュー、説明責任が速く正確になることで測る。
AI が実装案、テスト案、レビュー観点、ドキュメント草案を出せても、最終的な品質、セキュリティ、運用責任はチームが負う。
そのため、開発・構築フェーズでは、AI を「個人の生産性ツール」としてではなく、Issue、Plan、PR、CI、Review、Release、Runbook を接続する delivery system の一部として設計する。

本章では、第2章の requirements brief と acceptance criteria、第3章の AI system ADR、tool approval matrix、eval plan を受け取り、AI-native SDLC / Agent-assisted delivery として実装へ落とす方法を扱う。
重要なのは、prompt engineering の巧拙ではない。
作業分割、入力境界、検証責任、レビューゲート、release readiness、rollback、監査証跡を、チームの標準作業として固定することである。

## この章で扱う判断

本章で扱う判断は、次の7つである。

1. Issue 起点で、実装計画、非目標、受入条件、検証方法をどこまで明文化するか。
2. coding agent、IDE agent、CI 上の agent、人間レビューへ、どのタスクを渡し、どのタスクを渡さないか。
3. trunk-based / PR-based 運用の中で、AI 利用記録、review checklist、approval gate をどう置くか。
4. 生成コード、生成テスト、生成ドキュメントの検証責任を誰が持つか。
5. AI レビュー、自動テスト、静的解析、セキュリティ検査、人間レビューをどう重ねるか。
6. lead time、failed change / recovery、review rework、escaped defects、verification cost、documentation freshness をどう測るか。
7. skill degradation を防ぎ、team working agreement、handoff / escalation rule、release readiness checklist として運用に残すか。

## 誰向けか

- **IC / Senior Engineer**: AI 支援を使いながら、PR に検証証跡と説明責任を残したい人。
- **Tech Lead**: 作業分割、レビュー境界、agent に渡せるタスク、渡せないタスクをチーム標準にしたい人。
- **DevOps / SRE**: CI 上の agent、静的解析、セキュリティ検査、release readiness、rollback を delivery pipeline に組み込みたい人。
- **EM**: 生産性向上と verification cost、review rework、skill degradation のバランスを管理したい人。
- **Security / Compliance**: AI に投入する情報、生成コードの検査、承認者、監査ログ、policy exception を確認したい人。

## 章末に残るもの

この章を読み終えた時点で、次の成果物を作れる状態を目指す。

- AI 利用ポリシー付き PR テンプレ
- review checklist
- release readiness checklist
- team working agreement
- verification checklist
- handoff / escalation rule
- agent task brief
- delivery metrics dashboard

## よくある失敗

| 失敗 | 何が起きるか | 防止策 |
| --- | --- | --- |
| AI 生成コード行数比率を追う | 大量の差分を人が読めず、review rework と escaped defects が増える | lead time、verification cost、escaped defects で測る（§4.7） |
| Issue が曖昧なまま agent に渡す | agent が不要な実装や広すぎる変更を作る | Issue、acceptance criteria、非目標、停止条件を agent task brief に書く（§4.1、§4.2） |
| prompt engineering だけを改善する | 成果物、検証、承認、rollback に接続しない | prompt を入力設計の一部として扱い、PR と verification record に接続する（§4.3、§4.4） |
| 人間レビューが形骸化する | AI レビューを通過したことを正しさと誤認する | AI レビュー、人間レビュー、CI、security scan の責任分界を分ける（§4.5） |
| 速くなったが確認コストで相殺される | 実装時間は減るが、検証、手戻り、承認待ちが増える | verification cost と approval throughput を同時に測る（§4.4、§4.7） |
| ドキュメント生成を放置する | 実装と runbook、release note、運用手順がずれる | documentation freshness を delivery pipeline のゲートにする（§4.6） |
| skill degradation が進む | チームが設計・デバッグ・レビュー能力を失う | 学習設計、レビュー当番、採用・却下理由の共有を team working agreement に入れる（§4.8） |

## 本章と AI 協働の標準手順（SOP）

本章は、[AI 協働の標準手順（SOP）](../../introduction/ai-collaboration-sop/) のうち、特に次の工程に対応する。

- Issue 化: 目的、受入条件、非目標、作業境界、影響範囲を明文化する。
- Plan 作成: agent に渡すタスク、渡さないタスク、人間レビュー、escalation、停止条件を決める。
- 入力設計: agent task brief、根拠資料、禁止情報、出力 schema、検証コマンドを定義する。
- 生成・探索: 実装案、テスト案、レビュー観点、ドキュメント草案を候補として出す。
- 評価設計: verification checklist、security scan、static analysis、manual review を決める。
- 反映: PR、AI 利用記録、review checklist、release readiness、handoff note へ落とす。
- レビュー・承認: approval、audit、rollback、policy exception、説明先を確認する。

本章の目的は、AI に実装させることではない。
AI を使う場合でも使わない場合でも、delivery pipeline が品質、セキュリティ、監査、復旧性を失わないようにすることである。

## 4.1 Issue 起点で実装計画を作る {#section-4-1}

AI-native SDLC では、実装前の Issue が重要になる。
Issue が曖昧なまま coding agent に渡されると、agent は「もっともらしい広い変更」を作りやすい。
広い変更はレビューを遅くし、検証対象を増やし、rollback を難しくする。

Issue は、依頼文ではなく、delivery unit である。
少なくとも、問題、受入条件、非目標、検証、影響範囲、承認条件を含める。

### 4.1.1 Issue に書く最小項目

| 項目 | 書くこと | AI 利用時の注意 |
| --- | --- | --- |
| Problem | どの利用者・業務イベントの問題か | 解決策を先に固定しない |
| Scope | 変更するファイル、画面、API、ドキュメント | agent に触らせない範囲も明記する |
| Acceptance criteria | 何が満たされれば完了か | 品質、再現性、説明可能性、rollback を含める |
| Non-goals | 今回やらないこと | 過剰実装を防ぐ |
| Evidence | 参照する一次情報、既存仕様、実測 | AI 要約だけを根拠にしない |
| Verification | 実行するテスト、静的解析、手動確認 | agent へ検証コマンドを渡す |
| Approval | 誰がレビューし、誰が承認するか | security / compliance / ops を必要時に含める |
| Rollback | 戻し方、停止条件、影響範囲 | release readiness へ接続する |

Issue には、AI へ渡してよい情報と渡してはいけない情報も書く。
機密、個人情報、顧客データ、契約情報、アクセス token、production log は、入力前に分類する。

### 4.1.2 作業分割の粒度

AI 支援開発では、作業を小さくするほどレビューしやすい。
ただし、小さすぎる PR は依存関係と承認待ちを増やす。
作業分割は、次の単位で判断する。

| 分割軸 | 良い単位 | 避ける単位 |
| --- | --- | --- |
| ユーザー価値 | 1つの受入条件を満たす | 複数の目的をまとめる |
| 影響範囲 | 変更箇所が説明できる | unrelated refactor を混ぜる |
| 検証 | 1つの検証計画で確認できる | テスト不能な変更を含める |
| rollback | 単独で戻せる | schema / API / UI / docs を無秩序に混ぜる |
| レビュー | reviewer が責任を持てる | 複数専門領域を1人に押し込む |

### 4.1.3 agent task brief

agent に渡す前に、Issue から agent task brief を作る。
これは prompt ではなく、作業契約である。

```markdown
## Agent task brief

### Objective
- 何を達成するか:

### Scope
- 変更してよい範囲:
- 変更してはいけない範囲:

### Inputs
- 参照する一次情報:
- 入力禁止情報:

### Acceptance criteria
- 機能:
- 品質:
- セキュリティ:
- ドキュメント:

### Verification
- 実行するテスト:
- 静的解析:
- 手動確認:

### Stop conditions
- 判断不能な場合:
- 仕様矛盾がある場合:
- 権限・データ境界が不明な場合:

### Handoff
- 人間に確認してほしい点:
- 想定リスク:
```

Stop conditions がない task brief は、agent に任せるには広すぎる。
不明点が出たら、agent は推測で進めるのではなく、open question として返すべきである。

## 4.2 agent に渡せるタスク / 渡せないタスクを分ける {#section-4-2}

agent-assisted delivery では、AI に任せる範囲を決めることが、品質保証の第一歩である。
「AI にできるか」ではなく、「AI に渡しても、検証と責任を人間が持てるか」で判断する。

### 4.2.1 タスク委任の判断表

| タスク | 渡せる条件 | 渡さない条件 | 必須ゲート |
| --- | --- | --- | --- |
| 小規模リファクタ | テストがあり、意図が明確 | 振る舞い変更が混ざる | 差分レビュー、unit test |
| テスト生成 | 仕様、境界値、期待結果が明確 | 期待値を AI が推測する | 人間による期待値確認 |
| ドキュメント草案 | 事実ソースがある | 未確認仕様を断定する | source check、review |
| バグ修正案 | 再現手順と失敗テストがある | 根本原因が不明 | failing test → fix → passing test |
| 依存更新 | changelog、互換性、rollback が明確 | 破壊的変更の影響が不明 | lockfile diff、integration test |
| 本番設定変更 | 変更手順と rollback がある | 承認者、監査ログ、停止条件がない | approval、runbook、audit |
| セキュリティ修正 | 脆弱性情報と検証手順がある | exploit 詳細や秘密情報を外部 AI へ渡す | security reviewer、秘匿情報確認 |

### 4.2.2 agent の種類と役割分担

| 種類 | 得意なこと | 注意点 | 人間が持つ責任 |
| --- | --- | --- | --- |
| coding agent | 複数ファイルの実装、機械的修正、テスト追加 | 範囲が広いと余計な変更を混ぜる | scope、acceptance、final review |
| IDE agent | 局所的な補完、説明、リファクタ候補 | 文脈が局所に偏る | 周辺影響、設計整合性 |
| CI 上の agent | 失敗ログの要約、修正候補、flake 分析 | 失敗原因を断定しやすい | root cause、再実行判断 |
| review agent | 差分の観点出し、規約違反検出 | 重要設計判断を見落とす | approve / request changes |
| documentation agent | release note、runbook、FAQ 草案 | 実装とずれた説明を作る | source verification |

AI が「提案」したことと、AI が「実行」したことは分けて記録する。
外部 connector、CI secret、deployment 権限、production data に触れる作業は、least privilege と approval gate がない限り agent に渡さない。

### 4.2.3 渡してはいけないタスク

次のタスクは、原則として agent に単独で任せない。

- 要件の確定、優先順位の決定、利用者への約束。
- 重大なアーキテクチャ変更の採否。
- 本番データ、個人情報、契約情報、秘密情報を含む分析。
- 権限変更、課金設定、削除、外部送信、公開設定の変更。
- 法務、セキュリティ、監査への例外申請の判断。
- rollback 不可能または影響範囲が不明な変更。

これらは、AI に観点出しや候補生成をさせることはできる。
しかし、意思決定、承認、実行、説明責任は人間と組織が持つ。

## 4.3 trunk-based / PR-based 運用で AI 利用を制御する {#section-4-3}

AI 支援は、ブランチ戦略とレビュー運用に合わせて設計する。
trunk-based でも PR-based でも、AI 利用記録、検証結果、承認条件、rollback を残す点は同じである。
違いは、どのタイミングでゲートを置くかである。

### 4.3.1 運用パターンの比較

| 運用 | AI 利用パターン | 向く場面 | 主なゲート | 注意点 |
| --- | --- | --- | --- | --- |
| PR-based | agent が branch を作り、PR でレビューする | 変更差分を明確にしたい | PR template、review checklist、CI | PR が大きくなりやすい |
| trunk-based | 小さな変更を短時間で統合する | feature flag と自動テストが強い | pre-merge CI、feature flag、rollback | 承認が遅いと流れが止まる |
| pair with IDE agent | 人間が編集し、AI が局所支援する | 高文脈・高判断タスク | human review、local test | AI 利用記録が残りにくい |
| CI repair agent | CI 失敗を解析し修正候補を出す | flake、lint、依存問題 | root cause note、再実行基準 | 「通すだけ」の修正に注意 |
| docs pipeline | 変更差分から docs / release note を生成する | ドキュメント鮮度を保ちたい | source check、docs review | 実装と説明のずれに注意 |

### 4.3.2 PR に残す AI 利用記録

AI 利用記録は、監査のためだけではない。
reviewer が「どこを重点的に検証すべきか」を判断するための入力である。

```markdown
## AI 利用

- 利用範囲:
  - 実装案 / テスト案 / レビュー観点 / ドキュメント草案 / ログ要約
- 入力した情報:
  - public docs / repository code / masked logs / synthetic data
- 入力しなかった情報:
  - secrets / production personal data / contract data / customer confidential data
- 採用判断:
  - 採用した出力:
  - 却下した出力:
  - 人間が修正した点:
- 検証責任者:
- 追加 review が必要な領域:
```

### 4.3.3 approval / audit / rollback の配置

PR 本文には、少なくとも次を含める。

| 観点 | PR に残す内容 | gate |
| --- | --- | --- |
| approval | 変更種別、承認者、例外承認の有無 | CODEOWNERS、reviewer、security approval |
| audit | AI 利用範囲、検証結果、採用・却下理由 | PR comment、review thread、CI log |
| rollback | revert 方法、feature flag、schema rollback、運用連絡先 | release readiness checklist |
| privacy | 入力データ分類、匿名化・マスキング、禁止情報確認 | data classification check |
| compliance | 規約、契約、監査要求への影響 | policy check、evidence link |

AI 利用の有無にかかわらず、PR は「変更を説明できる単位」であるべきである。
AI が生成したから詳しく書くのではなく、AI を使った場合は不確実性が増えるため、より明確に書く。

## 4.4 生成コードの検証責任を設計する {#section-4-4}

生成コードは、見た目が整っていても正しいとは限らない。
AI はエラーハンドリング、境界条件、権限チェック、既存仕様、運用上の制約を省略することがある。
したがって、生成コードの検証責任は、生成した人ではなく、マージを承認するチームが持つ。

### 4.4.1 verification ladder

検証は、速いものから深いものへ段階化する。
全 PR で全項目を重くするのではなく、変更リスクに応じて階段を上げる。

| レベル | 検証 | 使う場面 | 証跡 |
| --- | --- | --- | --- |
| L1 | format、lint、type check | すべての変更 | CI log |
| L2 | unit test、snapshot、contract test | ロジック変更 | test result |
| L3 | integration test、migration dry-run | 外部 I/O、DB、API | test report |
| L4 | security scan、dependency scan、secret scan | 入力、権限、依存、外部通信 | scan result |
| L5 | manual scenario、access review、rollback drill | 高リスク、本番影響 | verification record |
| L6 | staged rollout、monitoring、post-release check | 利用者影響が大きい | release readiness、runbook |

### 4.4.2 テスト生成と期待値の責任

AI はテストケースを増やすのに役立つ。
しかし、期待値を AI に決めさせると、誤った仕様をテストで固定するリスクがある。
テスト生成では、次を分ける。

| 項目 | AI に任せやすい | 人間が確認する |
| --- | --- | --- |
| ケース列挙 | 境界値、異常系、組み合わせ | 重要度、抜け漏れ、業務意味 |
| テストコード草案 | setup、assertion 構造、mock | 期待値、fixture、外部副作用 |
| regression test | 既存バグの再現コード | 根本原因との対応 |
| property-based test | 不変条件候補 | 仕様として妥当か |
| performance test | 負荷シナリオ案 | 実測環境、SLO、閾値 |

### 4.4.3 静的解析とセキュリティ検査

静的解析とセキュリティ検査は、AI 支援開発でより重要になる。
AI は、既存チームの暗黙規約や脅威モデルを知らないためである。

最低限、次を確認する。

- secret scan: token、鍵、認証情報、接続文字列が混入していないか。
- dependency scan: 依存追加の脆弱性、ライセンス、供給網リスク。
- SAST: injection、unsafe deserialization、path traversal、SSRF など。
- permission check: 新しい権限、scope、role、policy exception。
- logging check: 個人情報、機密情報、token をログへ出していないか。
- data boundary check: AI に渡した入力と、実装が扱うデータ分類が一致しているか。

### 4.4.4 「速くなったが確認コストで相殺」の構造

AI 導入後に、実装時間だけを見ると成功に見えることがある。
しかし、review rework、追加テスト、仕様確認、セキュリティレビュー、ドキュメント修正が増えると、全体の lead time は短くならない。

| 速度向上に見えるもの | 隠れた確認コスト | 観測する指標 |
| --- | --- | --- |
| 実装草案が速い | 仕様不一致の修正 | review rework |
| テストが増える | 期待値確認と保守 | verification cost |
| PR が大きくなる | reviewer の認知負荷 | review latency |
| docs が自動生成される | 事実確認と同期 | documentation freshness |
| CI 修正が速い | root cause 不明のまま通す | failed change / recovery |

最適化対象は、typing speed ではなく、validated delivery speed である。

## 4.5 AI レビューと人間レビューを重ねる {#section-4-5}

AI レビューは、差分の抜け漏れ、規約違反、テスト不足、潜在バグの観点出しに有効である。
しかし、AI レビューは承認者ではない。
人間レビューは、要求、設計、運用、責任境界の判断を担う。

### 4.5.1 review checklist

| 観点 | AI レビューに期待すること | 人間レビューで判断すること |
| --- | --- | --- |
| 仕様整合 | acceptance criteria の未充足候補を挙げる | 仕様解釈が正しいか |
| 差分品質 | 複雑な分岐、重複、未使用コードを検出する | 変更粒度が適切か |
| テスト | テスト不足、境界値不足を指摘する | 期待値が業務上正しいか |
| セキュリティ | 典型的な脆弱性や秘密情報混入を検出する | 脅威モデルと権限境界が妥当か |
| 運用 | log、metric、rollback 漏れを指摘する | SLO、runbook、当番体制に合うか |
| ドキュメント | 変更に対する docs 不足を指摘する | 説明が読者・利用者に十分か |

### 4.5.2 人間レビューが形骸化する兆候

次の兆候があれば、review working agreement を見直す。

- 「AI レビュー済みなのでよい」として、人間が差分を読まない。
- reviewer が大きすぎる PR を短時間で approve する。
- テストが増えているが、期待値の根拠を誰も説明できない。
- セキュリティや運用観点が「CI が通った」で終わっている。
- review comment が表記や style に偏り、設計判断に触れていない。
- AI が出した修正を、根拠確認なしに再度 AI に直させている。

### 4.5.3 review rework を減らす

review rework は、レビューで見つかった問題の修正量である。
AI 支援開発では、初回差分が大きくなりやすいため、review rework が増えることがある。
減らすには、PR 前に次を実施する。

1. Issue と acceptance criteria を再確認する。
2. agent の出力から、不要な変更と関連しない refactor を削る。
3. 自動テスト、静的解析、security scan を通す。
4. PR 本文に、AI 利用範囲、採用・却下理由、検証結果を書く。
5. reviewer が重点的に見る点を明示する。

レビューは、品質保証であると同時に、チームの学習機会である。
AI にレビュー観点を出させても、人間が判断理由を残さなければ、学習は蓄積されない。

## 4.6 ドキュメント生成を delivery pipeline に組み込む {#section-4-6}

AI は、README、API 説明、release note、runbook、FAQ、migration note の草案作成に有効である。
ただし、ドキュメントは生成しただけでは価値にならない。
実装、設定、運用手順、制約、rollback と同期している必要がある。

### 4.6.1 documentation freshness

ドキュメント鮮度は、変更後に必要な説明が更新されているかを表す。
AI 支援開発では、ドキュメント草案を delivery pipeline に含め、PR で確認する。

| 変更 | 更新対象 | 確認すること |
| --- | --- | --- |
| UI / API 変更 | README、API docs、操作手順 | 実際の挙動と一致するか |
| 設定変更 | runbook、環境変数一覧、rollback 手順 | production と staging で差がないか |
| 権限変更 | data classification、approval、audit log | 承認者と監査項目が更新されたか |
| リリース変更 | release note、migration note | 利用者影響と戻し方が書かれたか |
| 障害対応変更 | incident runbook、postmortem template | escalation と manual takeover が明確か |

### 4.6.2 docs-as-code のゲート

ドキュメント生成を pipeline に入れる場合、次をゲートにする。

- 事実ソース: 実装、設定、ADR、Issue、Runbook から生成しているか。
- 差分追跡: どの変更に対応する docs 更新かが PR で分かるか。
- 読者: 利用者、運用者、reviewer、承認者のどれ向けかが明確か。
- 陳腐化対策: モデル名、価格、UI、API 細部など変化しやすい情報を本文に固定しすぎていないか。
- 公開範囲: 機密情報、内部 URL、顧客名、token、未公開仕様を含まないか。

### 4.6.3 handoff note

AI 支援で作られた変更は、handoff note を残すと保守しやすい。

```markdown
## Handoff note

- 変更の目的:
- 主要な設計判断:
- AI が支援した範囲:
- 人間が確認した範囲:
- 未解決の open question:
- 運用時に見る metric / log:
- rollback 手順:
- escalation 先:
```

handoff note は、将来の自分、当番、reviewer、監査担当への説明である。

## 4.7 delivery metrics で改善を測る {#section-4-7}

AI 支援開発の指標は、AI 利用率や生成コード行数比率だけでは不十分である。
生成量は増えても、検証コスト、手戻り、事故、承認待ち、学習劣化が増えれば、delivery system は改善していない。

### 4.7.1 採用する指標

| 指標 | 見ること | 悪化した時の問い |
| --- | --- | --- |
| lead time | Issue から release までの時間 | 待ち時間、レビュー、CI、承認のどこが詰まっているか |
| failed change / recovery | 失敗変更率と復旧時間 | 検証不足か、rollback 不足か |
| review rework | レビュー後の修正量 | Issue、task brief、事前検証が不足していないか |
| escaped defects | リリース後に漏れた欠陥 | acceptance criteria、test、manual scenario が弱くないか |
| verification cost | 検証にかかった時間と人手 | 自動化すべきか、PR を小さくすべきか |
| documentation freshness | docs と実装の同期度 | docs 更新を PR gate に入れているか |
| onboarding speed | 新メンバーが変更に参加できるまでの時間 | handoff note と working agreement が機能しているか |
| rollback readiness | 戻せる状態で release できたか | feature flag、backup、runbook があるか |
| approval throughput | 承認待ちの流れ | decision rights と承認者が明確か |

### 4.7.2 metric dashboard の例

```text
Delivery metrics dashboard

Period: YYYY-MM
Team / Service:

Flow
- Lead time median / p85:
- PR review latency:
- Approval throughput:

Quality
- Failed change rate:
- Escaped defects:
- Review rework:

Verification
- Verification cost per PR:
- CI failure root causes:
- Security scan findings:

Operations
- Rollback readiness:
- Recovery time:
- Documentation freshness:

Learning
- Onboarding speed:
- Pair review sessions:
- AI output rejection reasons:
```

この dashboard は、AI 導入の成果を誇示するためではなく、次に改善するボトルネックを見つけるために使う。
数値はチームの成熟度、プロダクトリスク、規制要件によって変わるため、標準値として扱わない。

### 4.7.3 AI 生成コード行数比率を主指標にしない

AI 生成コード行数比率は、補助指標としても扱いに注意が必要である。
次の理由で主指標にしない。

- 生成行数が増えても、価値が増えるとは限らない。
- 大きな差分は review cost を増やす。
- 削るべきコードや重複コードも増えうる。
- テスト、ドキュメント、監査、rollback のコストを見落とす。
- 人間が理解していないコードを増やすと skill degradation が進む。

測るべきものは、生成量ではなく、検証済みの価値である。

## 4.8 skill degradation を防ぐ学習設計を入れる {#section-4-8}

AI 支援が進むと、実装の手数は減る一方で、設計、デバッグ、レビュー、運用判断の経験が減ることがある。
これを skill degradation と呼ぶ。
スキル劣化は個人の問題ではなく、チーム設計の問題である。

### 4.8.1 team working agreement

AI 利用をチームで運用する場合、team working agreement を作る。

| 項目 | 合意すること |
| --- | --- |
| AI 利用範囲 | どの作業で AI 利用を推奨、任意、禁止にするか |
| 入力禁止情報 | secrets、個人情報、顧客情報、契約情報、未公開仕様の扱い |
| review rule | AI 生成差分の読み方、重点確認、承認条件 |
| verification rule | 最低限のテスト、静的解析、security scan、手動確認 |
| learning rule | 採用・却下理由、失敗例、良い task brief を共有する方法 |
| escalation | 判断不能、権限不明、仕様矛盾、事故兆候の連絡先 |
| rollback | release 前の戻し方確認、feature flag、manual takeover |

### 4.8.2 学習を残す仕組み

skill degradation を防ぐには、AI を使わない時間を作るだけでは足りない。
AI を使った判断の理由をチームの知識へ変える必要がある。

有効な仕組みは次である。

- AI 出力を採用した理由と却下した理由を PR に残す。
- 週次で「良い task brief」「悪い task brief」「review で見落とした点」を共有する。
- junior と senior の pair review で、AI 出力の妥当性を説明する。
- 障害や手戻りが起きたら、AI 利用範囲と検証不足を postmortem に含める。
- 重要領域では、AI なしで設計・デバッグする訓練を残す。
- reviewer を固定せず、セキュリティ、運用、ドメイン知識の観点をローテーションする。

### 4.8.3 handoff / escalation rule

agent-assisted delivery では、作業を引き継ぐ時点が多い。
agent から人へ、開発者から reviewer へ、開発チームから運用へ、運用から incident commander へ、情報が渡る。
そのため、handoff / escalation rule を明文化する。

| 状況 | handoff する内容 | escalation 先 |
| --- | --- | --- |
| 仕様が矛盾する | 該当 Issue、根拠、未解決質問 | Product Owner、Tech Lead |
| セキュリティ判断が必要 | データ分類、権限、脅威、scan result | Security、Compliance |
| CI が不安定 | 失敗ログ、再現性、変更範囲 | DevOps、SRE |
| rollback 不明 | 影響範囲、戻し方候補、停止条件 | SRE、Release Manager |
| AI 出力が信用できない | 根拠不明点、検証不能点、却下理由 | Tech Lead、Reviewer |

エスカレーションは失敗ではない。
AI が不確実な領域を広げるほど、早い escalation は品質と速度を守る。

## 4.9 章末成果物を作る {#section-4-9}

この章の最後に、実務へ持ち帰る成果物を最小セットとしてまとめる。
各チームは、自組織の規制、開発プロセス、ツールに合わせて調整してよい。
ただし、AI 利用範囲、検証責任、承認、監査、rollback は省略しない。

### 4.9.1 AI 利用ポリシー付き PR テンプレ

```markdown
## Summary

## Issue / Plan
- Issue:
- Acceptance criteria:
- Non-goals:

## AI use policy
- AI を使った範囲:
- AI に入力した情報:
- 入力しなかった情報:
- 採用した出力:
- 却下した出力:
- 人間が修正した判断:

## Verification
- Tests:
- Static analysis:
- Security scan:
- Manual check:
- Documentation check:

## Risk / Approval / Rollback
- Risk:
- Approval:
- Audit log:
- Rollback:
- Escalation:
```

### 4.9.2 review checklist

| 観点 | チェック |
| --- | --- |
| Scope | Issue と関係ない変更が混ざっていないか |
| Acceptance | 受入条件を満たす証跡があるか |
| AI use | 入力情報、採用・却下理由、検証責任が書かれているか |
| Tests | 期待値を人間が確認しているか |
| Security | secrets、権限、入力検証、外部通信、ログが確認されているか |
| Privacy | 個人情報、顧客情報、契約情報が混入していないか |
| Compliance | 承認、監査、policy exception が必要か |
| Operations | metric、alert、runbook、rollback があるか |
| Docs | README、API docs、release note、runbook が必要に応じて更新されているか |
| Learning | 判断理由、却下理由、handoff note が残っているか |

### 4.9.3 release readiness checklist

- [ ] 変更範囲と利用者影響が説明できる。
- [ ] 必要な自動テスト、静的解析、security scan が通っている。
- [ ] 手動確認が必要なシナリオを確認した。
- [ ] feature flag、段階リリース、rollback のいずれかを用意した。
- [ ] monitoring、alert、log、audit trail が確認できる。
- [ ] documentation freshness を確認した。
- [ ] approval が必要な関係者から承認を得た。
- [ ] support / operations への handoff note がある。
- [ ] リリース後に見る metric と責任者が決まっている。

### 4.9.4 verification checklist

- [ ] Issue、acceptance criteria、non-goals を確認した。
- [ ] AI に入力した情報が data classification に合っている。
- [ ] 生成コードの期待値を人間が確認した。
- [ ] AI 生成テストが誤った仕様を固定していない。
- [ ] 静的解析、secret scan、dependency scan を確認した。
- [ ] セキュリティ、privacy、compliance、approval、audit、rollback の観点を確認した。
- [ ] 変更が失敗した時の fallback、manual takeover、rollback を説明できる。
- [ ] reviewer が重点確認点を理解している。

## まとめ

AI-native SDLC / Agent-assisted delivery は、AI に実装を丸投げする運用ではない。
Issue 起点で作業を分け、agent に渡せるタスクと渡せないタスクを明確にし、PR、CI、review、release readiness、runbook へ検証責任を接続する運用である。

本章で扱った要点は、次の通りである。

- AI 利用は、prompt engineering ではなく delivery system の設計として扱う。
- coding agent、IDE agent、CI 上の agent、review agent には、それぞれ得意領域と禁止領域がある。
- 生成コード、生成テスト、生成ドキュメントは、検証責任と監査証跡があって初めて成果物になる。
- AI レビューは有効だが、承認者ではない。人間レビューは要求、設計、運用、説明責任を判断する。
- AI 生成コード行数比率ではなく、lead time、failed change / recovery、review rework、escaped defects、verification cost、documentation freshness、rollback readiness を見る。
- skill degradation を防ぐには、AI 出力の採用・却下理由をチームの学習へ変換する必要がある。

次章では、AI を含む投資判断、統制、法務・セキュリティ・監査調整を、ステークホルダーと合意する方法を扱う。

次に読む： [第5章：ステークホルダーマネジメント](../chapter-05/) / [目次（トップ）](../../)

---

## この章のまとめとチェックリスト

### この章のまとめ

- Issue 起点の実装計画、agent task brief、作業分割により、agent-assisted delivery の範囲を制御する方法を整理した。
- PR-based / trunk-based 運用に AI 利用記録、review checklist、verification checklist、release readiness を組み込む方法を示した。
- delivery metrics と team working agreement により、生産性、品質、検証コスト、学習劣化を同時に扱う考え方を示した。

### この章を読み終えたら確認したいこと

- [ ] 自チームの Issue / PR テンプレートに、AI 利用範囲、検証責任、rollback、approval、audit を書ける欄があるか。
- [ ] agent に渡せるタスクと渡せないタスクを、チームで説明できるか。
- [ ] 生成コード、生成テスト、生成ドキュメントの検証責任者が明確か。
- [ ] lead time だけでなく、review rework、escaped defects、verification cost、documentation freshness を見ているか。
- [ ] skill degradation を防ぐために、採用・却下理由、review 観点、失敗例を共有しているか。

### 関連する付録・テンプレート

- PR やレビュー項目を整備する場合は、[付録A：実務成果物テンプレート集](../../appendices/templates/) の PR テンプレート、コードレビューチェックリスト、Runbook テンプレートを参照してほしい。
- 開発フェーズ最適化の実例は、[付録B：ケーススタディ](../../appendices/case-studies/) の GitHub 上の agent-assisted delivery が参考になる。
- モデル名、価格、UI、API 細部などを delivery document に固定しすぎない基準は、[付録D：更新履歴とメンテナンス方針](../../appendices/update-notes/) を参照してほしい。
- 汎用スキル（問題設定/構造化/検証）の補完関係は、[前作（論理思考ガイド）との接続](../../introduction/bridge-logical-thinking-guide/) を参照してほしい。
