---
title: "付録A：実務成果物テンプレート集"
description: "AI ネイティブな要求定義、ADR、eval、脅威分析、承認、ベンダー選定、インシデント、経営説明、検証記録の実務テンプレート集"
layout: book
---

# 付録A：実務成果物テンプレート集

本付録は、本書で扱った思考法、意思決定、説明責任、運用統制を、現場でそのまま使える成果物へ落とすためのテンプレート集である。AI を使うかどうかに関係なく、実務では「何を決めたか」「どの根拠で判断したか」「誰が承認したか」「どの条件なら止めるか」を記録できなければならない。

テンプレートは完成文書ではない。各組織の規程、契約、データ分類、監査要件、業務リスクに合わせて調整する。特にモデル名、価格、UI 手順、API 細部など変化しやすい情報は本文へ固定せず、参照先、版、確認日、owner を記録する。

## A.1 使い方と成果物の対応

| 章 | 主な判断 | 使うテンプレート |
| --- | --- | --- |
| 第1章 | 問い、根拠、不確実性、delegate / review / own | verification record、model / tool change impact checklist |
| 第2章 | 要求境界、受入条件、データ分類、自動化境界 | AI system PRD / requirements brief、data classification sheet |
| 第3章 | workflow / agent / RAG / tool の設計判断 | AI system ADR、threat model、tool approval matrix |
| 第4章 | delivery、PR、検証、release readiness | verification record、eval spec、model / tool change impact checklist |
| 第5章 | 投資判断、統制、契約、退出戦略 | 1ページ提案メモ、risk register、ROI / TCO / control cost 表、executive memo、vendor selection matrix |
| 第6章 | AI incident、rollback、postmortem、communication | AI incident runbook、severity matrix、communication template、operational guardrail checklist、incident timeline template、AI incident postmortem |

テンプレートは、単独で使うよりも、Issue、ADR、PR、Eval、Runbook、Postmortem の流れでつなげて使う。例えば AI system ADR の `Decision` は、eval spec の `Acceptance metrics` と、tool approval matrix の `Approval gate` へ接続する。

## A.2 AI system PRD / requirements brief

AI system PRD / requirements brief は、AI を含む業務機能や社内ツールの要求境界を定義する文書である。解決策を先に固定せず、問題、利用者、データ、権限、受入条件、失敗時挙動を明示する。

```markdown
# AI system PRD / requirements brief

## 1. Problem statement
- 対象業務:
- 利用者:
- 現行課題:
- AI を使わない場合の代替案:
- 非目標:

## 2. Users and stakeholders
| Role | 利用目的 | Decision right | Concern | Evidence needed |
| --- | --- | --- | --- | --- |
| | | | | |

## 3. Scope
- 対象に含めること:
- 対象外:
- 対象データ:
- 対象外データ / 利用禁止情報:

## 4. Automation boundary
| 業務イベント | Human-in-the-loop | Human-on-the-loop | Full automation | 理由 |
| --- | --- | --- | --- | --- |
| | | | | |

## 5. Acceptance criteria
| 観点 | 条件 | 測定方法 | Owner |
| --- | --- | --- | --- |
| Quality | | | |
| Reproducibility | | | |
| Explainability | | | |
| Fail-safe | | | |
| Security / privacy | | | |
| Approval / audit | | | |
| Rollback | | | |

## 6. Metrics
- KPI:
- Guardrail metric:
- manual takeover rate:
- verification cost:
- audit completeness:

## 7. Risks and assumptions
| ID | Assumption / Risk | Evidence | Owner | Decision needed |
| --- | --- | --- | --- | --- |
| | | | | |

## 8. Approval and next decision
- Decision owner:
- Reviewers:
- 次の判断日:
- 止める条件:
```

### A.2 レビュー観点

- 問題設定が「AI を使うこと」ではなく、業務上の判断や制約から始まっている。
- data classification、permission boundary、fallback、manual override がある。
- `精度が高い` のような評価不能な要件を、測定可能な acceptance criteria へ変換している。

## A.3 AI system ADR

AI system ADR は、AI システムに関する設計判断を記録する。RAG、fine-tuning、workflow / agent、MCP / connector / function calling、managed service、self-hosted / hybrid の判断を、採用理由と撤退条件まで含めて残す。

```markdown
# AI system ADR: <decision title>

- Status: proposed / accepted / superseded / deprecated
- Date:
- Decision owner:
- Reviewers: Architect / Security / SRE / Legal / Compliance
- Related Issue / PR:

## Context
- 解決したい問題:
- 既存システム制約:
- データ分類:
- 利用者と権限:
- latency / cost / quality / reliability budget:

## Options considered
| Option | Description | Benefits | Risks | Cost | Operability |
| --- | --- | --- | --- | --- | --- |
| Normal feature | | | | | |
| Search / RAG | | | | | |
| Workflow | | | | | |
| Agent | | | | | |

## Decision
- 採用する方式:
- 採用理由:
- 採用しない方式と理由:

## Control points
| Control | Design | Evidence |
| --- | --- | --- |
| schema validation | | |
| approval gate | | |
| least privilege | | |
| audit trail | | |
| isolation | | |
| output validation | | |
| fallback / rollback | | |

## Evaluation plan
- offline eval:
- trace-based evaluation:
- regression test:
- acceptance threshold:

## Exit strategy
- vendor portability:
- export するデータ / 設定 / eval:
- provider outage 時の degrade gracefully:
- 乗り換え判断条件:

## Consequences
- Positive:
- Negative:
- Operational burden:
- Follow-up actions:
```

### A.3 レビュー観点

- `AI を使うから` ではなく、通常機能、検索、RAG、workflow / agent の比較で判断している。
- approval、audit、rollback、exit strategy が設計判断の一部になっている。

## A.4 eval spec

Eval spec は、AI 機能の品質と安全性を、受入条件と regression の形で確認する文書である。平均スコアだけでなく、失敗時影響、guardrail metric、manual takeover を含める。

```markdown
# Eval spec

## Purpose
- 評価対象:
- 評価目的:
- 本番判断との関係:

## Evaluation scope
| Scenario | User goal | Expected behavior | Prohibited behavior |
| --- | --- | --- | --- |
| | | | |

## Dataset
- データソース:
- データ分類:
- 個人情報 / 機密情報の扱い:
- version:
- owner:

## Metrics
| Metric | Definition | Threshold | Guardrail / KPI | Owner |
| --- | --- | --- | --- | --- |
| answer quality | | | | |
| citation coverage | | | | |
| hallucination rate proxy | | | | |
| tool error rate | | | | |
| latency distribution | | | | |
| token / cost anomaly | | | | |
| manual takeover rate | | | | |
| audit completeness | | | | |

## Failure review
| Failure class | Severity | Required response | Regression item |
| --- | --- | --- | --- |
| prompt injection | | | |
| citation failure | | | |
| retrieval failure | | | |
| approval bypass | | | |
| data leakage | | | |

## Acceptance decision
- Pass / Conditional pass / Fail:
- 条件:
- 承認者:
- 次回 eval:
```

### A.4 レビュー観点

- metric の定義、閾値、owner が明確である。
- `quality` だけでなく security、privacy、approval、audit、rollback を評価している。

## A.5 eval dataset design sheet

Eval dataset design sheet は、評価データセットの設計と更新ルールを記録する。データセットは、モデルやプロンプトの変更と同じくらい重要な構成要素である。

```markdown
# Eval dataset design sheet

## Dataset identity
- Name:
- Version:
- Owner:
- Last reviewed:
- Related eval spec:

## Coverage plan
| Category | Example | Required count | Source | Risk covered |
| --- | --- | --- | --- | --- |
| normal case | | | | |
| edge case | | | | |
| adversarial / prompt injection | | | | |
| stale knowledge | | | | |
| citation required | | | | |
| tool approval required | | | | |
| fallback / manual takeover | | | | |

## Data governance
- Data classification:
- Masking / anonymization:
- Data retention:
- Data residency:
- Access control:

## Expected outputs
| Input ID | Expected output | Required citation | Prohibited output | Review owner |
| --- | --- | --- | --- | --- |
| | | | | |

## Change rule
- 追加条件:
- 削除条件:
- drift review:
- approval:
```

### A.5 レビュー観点

- 成功例だけでなく、失敗例、攻撃例、古い知識、引用必須例が入っている。
- データ分類と access control が dataset の設計に含まれている。

## A.6 threat model

Threat model は、AI システムの攻撃面と統制点を整理する。prompt injection、tool misuse、data exfiltration、MCP authorization failure、approval bypass を明示的に扱う。

```markdown
# Threat model

## System overview
- 対象システム:
- Trust boundaries:
- Data flows:
- External dependencies:

## Assets
| Asset | Classification | Owner | Protection requirement |
| --- | --- | --- | --- |
| prompts / instructions | | | |
| retrieved documents | | | |
| user data | | | |
| tool credentials | | | |
| audit logs | | | |

## Threats
| Threat | Attack path | Impact | Existing control | Gap |
| --- | --- | --- | --- | --- |
| prompt injection | | | | |
| tool misuse | | | | |
| data exfiltration | | | | |
| privilege escalation | | | | |
| MCP authorization failure | | | | |
| approval bypass | | | | |
| stale knowledge | | | | |
| cost anomaly | | | | |

## Mitigations
| Control | Implementation | Evidence | Owner |
| --- | --- | --- | --- |
| least privilege | | | |
| schema validation | | | |
| output validation | | | |
| approval gate | | | |
| audit trail | | | |
| rate limit / cost alert | | | |
| kill switch / rollback | | | |

## Residual risk
- Accepted risks:
- Escalation:
- Review date:
```

### A.6 レビュー観点

- 攻撃者だけでなく、誤設定、運用逸脱、承認漏れも threat として扱っている。
- residual risk に owner と review date がある。

## A.7 tool approval matrix

Tool approval matrix は、agent や workflow が利用する tool、connector、MCP server の権限と承認条件を定義する。

```markdown
# Tool approval matrix

| Tool / connector | Capability | Data access | Risk level | Default permission | Approval gate | Audit log | Rollback / disable |
| --- | --- | --- | --- | --- | --- | --- | --- |
| search docs | read | public / internal | low | allowed | none | query log | disable connector |
| read ticket | read | internal | medium | allowed with scope | owner approval | access log | revoke token |
| create PR | write | repository | medium | approval required | maintainer approval | PR / commit log | revert PR |
| send customer message | external write | customer data | high | disabled by default | Communication + Legal | message log | recall / correction |
| change production config | write | production | critical | disabled by default | Incident Commander + SRE | change log | rollback plan |

## Review
- Owner:
- Last access review:
- Exceptions:
- Expiration:
```

### A.7 レビュー観点

- read と write、internal と external、reversible と irreversible を分けている。
- high / critical 操作は default deny で、approval と audit が必須になっている。

## A.8 data classification sheet

Data classification sheet は、AI へ投入する情報、retrieval 対象、ログ、出力の扱いを整理する。要求定義、ADR、incident response の共通入力になる。

```markdown
# Data classification sheet

| Data item | Classification | Allowed use | Prohibited use | Masking | Retention | Residency | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| public docs | public | retrieval / citation | none | none | standard | any allowed | |
| internal docs | internal | retrieval with access control | external AI training | metadata mask | | | |
| customer data | confidential | limited processing | prompt sharing / vendor training | required | | | |
| personal data | restricted | approved workflow only | ad hoc prompt input | required | | | |
| secrets / tokens | prohibited | none | any AI input | not applicable | none | not applicable | Security |
| audit logs | controlled | incident review | external sharing without approval | partial | policy based | | Compliance |

## Approval
- Data owner:
- Security reviewer:
- Legal / privacy reviewer:
- Exception path:
```

### A.8 レビュー観点

- `利用可能` と `投入禁止` が曖昧でない。
- data residency、retention、masking、owner が含まれている。

## A.9 vendor selection matrix

Vendor selection matrix は、AI サービスや partner を選ぶときに、機能比較だけでなく、契約、データ越境、監査、退出戦略を比較するための表である。

```markdown
# Vendor selection matrix

| Criteria | Weight | Vendor A | Vendor B | Vendor C | Evidence |
| --- | --- | --- | --- | --- | --- |
| functional fit | | | | | demo / pilot |
| security controls | | | | | security report |
| data residency | | | | | contract / DPA |
| audit log | | | | | docs / sample export |
| SLA / support | | | | | contract |
| cost / pricing risk | | | | | estimate |
| vendor concentration risk | | | | | exit strategy |
| portability / export | | | | | export test |
| contract / liability | | | | | legal review |
| responsible use support | | | | | policy / admin controls |

## Decision
- Recommended option:
- Conditions:
- Exit strategy:
- Renewal review date:
```

### A.9 レビュー観点

- 価格や機能だけでなく、データ、契約、監査、退出が比較されている。
- vendor concentration risk と portability が採点対象になっている。

## A.10 AI incident postmortem

AI incident postmortem は、第6章の incident response を組織学習へ接続するためのテンプレートである。

```markdown
# AI incident postmortem

## Summary
- Incident ID:
- Severity:
- 発生日 / 検知時刻 / 復旧時刻:
- 影響範囲:
- 現在状態:

## Customer / business impact
- 顧客影響:
- 業務影響:
- 法務 / 監査 / 契約影響:
- コスト影響:

## Timeline
| Time | Event | Type: fact / hypothesis / decision / action / result | Evidence ID |
| --- | --- | --- | --- |
| | | | |

## AI involvement
- prompt / input:
- retrieval / citation:
- model / provider:
- tool / MCP / connector:
- approval / audit:
- human review:

## Root causes and contributing factors
- 直接原因:
- 技術的寄与要因:
- 運用上の寄与要因:
- 組織・教育・契約上の寄与要因:

## Containment and recovery
- kill switch:
- quarantine:
- rollback:
- manual takeover:
- escalation:

## Corrective actions
| Action | Type | Owner | Due date | Evidence of completion |
| --- | --- | --- | --- | --- |
| | guardrail / eval / approval / audit / training / contract | | | |
```

### A.10 レビュー観点

- blame ではなく、system、process、approval、training、contract の改善へ落ちている。
- action item に owner、期限、完了証跡がある。

## A.11 executive memo template

Executive memo は、経営層へ AI 投資、統制、リスク受容、撤退条件を説明するための1〜2ページ文書である。

```markdown
# Executive memo

## Decision requested
- 採用 / pilot / 本番移行 / 予算 / 契約 / 撤退:
- Decision date:

## Recommendation
- 推奨案:
- 代替案:
- 採用しない案と理由:

## Business case
| Item | Estimate | Evidence | Owner |
| --- | --- | --- | --- |
| productivity benefit | | | |
| risk reduction | | | |
| implementation cost | | | |
| verification cost | | | |
| control cost | | | |
| training cost | | | |
| fallback / rollback cost | | | |

## Governance
- security:
- privacy:
- compliance:
- approval:
- audit:
- rollback:

## Risks and conditions
| Risk | Mitigation | Decision condition | Owner |
| --- | --- | --- | --- |
| | | | |

## Exit strategy
- 退出条件:
- export 対象:
- 移行費用:
- 代替案:

## Final decision log
- Decision:
- Approver:
- Conditions:
- Review date:
```

### A.11.1 1ページ提案メモ

```markdown
# 1ページ提案メモ

## 提案
- 対象業務:
- 提案内容:
- 今回決めたいこと:

## 背景と問題
- 現行課題:
- 影響を受ける利用者:
- 放置した場合のリスク:

## 期待効果
- productivity benefit:
- risk reduction:
- 測定方法:

## 費用と統制
- 初期費用:
- 継続費用:
- verification cost:
- control cost:
- training / rollback cost:

## 主要リスク
- 契約 / データ越境:
- security / privacy:
- audit / approval:
- vendor concentration:
- 現場負荷:

## 判断案
- 推奨:
- 代替案:
- 進める条件:
- 止める条件:
- 次の decision date:
```

### A.11.2 risk register

| ID | Risk | Cause | Impact | Owner | Mitigation | Evidence | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-01 | | | | | | | |

### A.11.3 ROI / TCO / control cost 表

| 区分 | 項目 | 見積もる内容 | Evidence | Owner |
| --- | --- | --- | --- | --- |
| Benefit | productivity benefit | | | |
| Benefit | risk reduction | | | |
| Cost | service / license | | | |
| Cost | implementation | | | |
| Cost | verification cost | | | |
| Cost | control cost | | | |
| Cost | training cost | | | |
| Cost | fallback / rollback | | | |
| Risk | incident exposure | | | |
| Risk | vendor concentration | | | |

### A.11.4 レビュー観点

- benefit と verification / control cost が同じ密度で書かれている。
- 承認条件、撤退条件、次回レビューが明確である。
- risk register と ROI / TCO / control cost 表が executive memo の判断条件へ接続している。

## A.12 cost / reliability dashboard sample

Cost / reliability dashboard は、AI システムを運用する owner が、品質、コスト、信頼性、統制を継続監視するためのサンプルである。

| Area | Metric | Target / Threshold | Signal | Action | Owner |
| --- | --- | --- | --- | --- | --- |
| Cost | token / cost anomaly | 予算80%で alert | 急増 / retry storm | rate limit、kill switch 検討 | Owner / CFO |
| Reliability | latency distribution | P95 が SLO 内 | provider degradation | fallback / degrade gracefully | SRE |
| Quality | citation coverage | 重要回答は100% | citation failure | 回答停止、eval 更新 | Tech Lead |
| Safety | approval rejection rate | 急増時 alert | risky automation | workflow quarantine | Security |
| Tool | tool error rate | 通常比2倍で alert | MCP / connector failure | Human-in-the-loop へ切替 | SRE |
| Operations | manual takeover rate | pilot 想定内 | 自動化範囲の不適合 | 対象業務縮小、training | Field Owner |
| Audit | audit completeness | 必須項目100% | 証跡不足 | release 停止、監査対応 | Compliance |
| Value | productivity benefit | baseline 比改善 | 効果不足 | scope 見直し、撤退判断 | EM / Product |

### A.12 レビュー観点

- dashboard が生産性だけに偏っていない。
- alert から action、owner までつながっている。

## A.13 verification record template

Verification record は、AI 出力、生成コード、設計判断、運用変更を、どの根拠で検証したかを残す記録である。

```markdown
# Verification record

## Target
- 対象成果物:
- Related Issue / PR / ADR:
- AI 利用の有無:

## Inputs reviewed
| Input | Source hierarchy | Version / date | Reviewer |
| --- | --- | --- | --- |
| primary docs | | | |
| measured logs | | | |
| AI summary | | | |

## Checks performed
| Check | Command / Method | Result | Evidence |
| --- | --- | --- | --- |
| unit / integration test | | | |
| eval / regression | | | |
| static analysis | | | |
| security review | | | |
| privacy / data boundary | | | |
| approval / audit | | | |
| rollback / fallback | | | |

## Findings
- Accepted:
- Rejected:
- Open issues:

## Decision
- Ship / hold / rollback / rework:
- Decision owner:
- Date:
```

### A.13 レビュー観点

- AI 要約を一次情報として扱っていない。
- 検証コマンド、結果、証跡、判断者が分かる。

## A.14 model / tool change impact checklist

Model / tool change impact checklist は、モデル、provider、prompt、retrieval index、tool、connector、MCP server、権限を変更する前に使う。

```markdown
# Model / tool change impact checklist

## Change summary
- 変更対象:
- 変更理由:
- 影響する workflow / agent / tool:
- Rollback target:

## Impact areas
- [ ] requirements brief への影響を確認した。
- [ ] AI system ADR の decision / trade-off を更新した。
- [ ] eval spec と eval dataset を更新または再実行した。
- [ ] threat model の差分を確認した。
- [ ] tool approval matrix の権限と approval gate を確認した。
- [ ] data classification sheet のデータ利用条件を確認した。
- [ ] cost / reliability dashboard の閾値を確認した。
- [ ] AI incident runbook の kill switch / rollback を確認した。
- [ ] communication template と support FAQ の更新要否を確認した。
- [ ] Legal / Security / Compliance review の要否を判断した。

## Required evidence
| Evidence | Required | Result | Link |
| --- | --- | --- | --- |
| eval result | yes / no | | |
| security review | yes / no | | |
| cost estimate | yes / no | | |
| rollback test | yes / no | | |
| approval log | yes / no | | |

## Decision
- Approve / reject / defer:
- Conditions:
- Approver:
- Review date:
```

### A.14 レビュー観点

- 変更を「差し替え」で終わらせず、eval、security、cost、rollback、approval まで確認している。
- 影響を受ける成果物が明示されている。


## A.15 delivery / review / runbook templates

第4章から参照する PR テンプレート、コードレビューチェックリスト、Runbook テンプレートは、AI 支援開発を delivery pipeline へ接続するために使う。

### A.15.1 AI 利用ポリシー付き PR テンプレート

```markdown
# Pull request

## Summary
- 変更内容:
- Related Issue / ADR:

## Scope
- 変更した範囲:
- 変更していない範囲:

## AI use policy
- AI 利用の有無:
- AI に委任した作業:
- 入力した情報の分類:
- AI 出力の採用 / 修正 / 却下:
- 人間が最終判断した内容:

## Verification
| Check | Result | Evidence |
| --- | --- | --- |
| tests | | |
| lint / static analysis | | |
| security / privacy | | |
| eval / regression | | |
| docs / runbook | | |

## Risk / approval / rollback
- 主要リスク:
- 必要な承認:
- audit log:
- rollback:
```

### A.15.2 コードレビューチェックリスト / AI レビュー checklist

- [ ] Issue、requirements brief、ADR、acceptance criteria と差分が対応している。
- [ ] AI 生成部分と人間が判断した部分が PR に記録されている。
- [ ] security / privacy / compliance / approval / audit / rollback の観点が確認されている。
- [ ] テスト、静的解析、eval、手動確認の証跡がある。
- [ ] 生成コード、生成テスト、生成ドキュメントを、AI 出力のまま採用していない。
- [ ] runbook、release note、運用手順、問い合わせ先の更新要否を確認している。
- [ ] rollback または manual takeover が説明できる。

### A.15.3 Runbook テンプレート

```markdown
# Runbook

## Purpose
- 対象システム:
- 対象業務:
- 利用者:

## Preconditions
- 必要な権限:
- 実行前承認:
- 入力禁止情報:
- 想定するリスク:

## Procedure
| Step | Action | Expected result | Evidence |
| --- | --- | --- | --- |
| 1 | | | |

## Verification
- 成功条件:
- 失敗条件:
- 監視指標:

## Rollback / manual takeover
- rollback 手順:
- manual takeover 手順:
- escalation:

## Audit
- 残すログ:
- 承認者:
- 保存先:
```

## A.16 AI incident operational templates

第6章から参照する AI incident runbook、severity matrix、communication template は、AI 固有インシデントの初動、説明、復旧、再発防止を標準化するために使う。

### A.16.1 AI incident runbook

```markdown
# AI incident runbook

## Scope
- 対象システム:
- 対象 AI 機能:
- 対象 tool / connector / MCP:

## Severity
- severity matrix:
- incident declaration 条件:
- escalation 条件:

## Roles
- Incident Commander:
- Technical Lead:
- Security Lead:
- Communication Lead:
- Legal / Compliance:
- Field Owner:

## Detection
- alerts:
- metrics:
- manual reports:
- audit signals:

## Containment
- kill switch:
- quarantine:
- rollback:
- manual takeover:
- degrade gracefully:

## Approval and audit
- 実行前承認:
- 事後監査:
- 必須証跡:

## Recovery and validation
- 復旧条件:
- eval / regression:
- audit completeness:

## Postmortem
- 開催条件:
- template:
- action item tracking:
```

### A.16.2 severity matrix

| Severity | AI 固有の例 | 初動 | 通知先 |
| --- | --- | --- | --- |
| SEV-1 | 情報漏えい、重大な誤操作、広範な approval bypass | kill switch、quarantine、経営 escalation | 経営、Security、Legal、監査、顧客窓口 |
| SEV-2 | 限定範囲の重大誤回答、provider outage、コスト急増 | 対象機能停止、manual takeover | 事業責任者、SRE、Security、現場責任者 |
| SEV-3 | citation failure、retrieval failure、stale knowledge | 回答停止、再評価、FAQ 更新 | EM、Tech Lead、Support |
| SEV-4 | eval drift、軽微な latency / cost anomaly | backlog 化、定期レビュー | Owner、SRE |

### A.16.3 communication template（社内 / 顧客 / 経営向け）

```markdown
# Internal update
- Incident ID:
- Severity:
- Current state:
- AI involvement:
- Containment:
- Next update:

# Customer update
- 発生している事象:
- 影響範囲:
- 実施済み対応:
- お客様にお願いしたいこと:
- 次回更新:
- 問い合わせ先:

# Executive brief
- Decision needed:
- Customer / business impact:
- Legal / audit / contract impact:
- Actions taken:
- Options and recommendation:
- Next update:
```

### A.16.4 operational guardrail checklist

- [ ] prompt injection を想定した eval / regression がある。
- [ ] retrieval failure、stale knowledge、citation failure を検知する check がある。
- [ ] tool 実行は least privilege で、destructive / external 操作には approval gate がある。
- [ ] MCP / connector の scope と token が定期レビューされている。
- [ ] kill switch、quarantine、rollback、manual takeover の手順が最新である。
- [ ] provider outage 時の fallback と degrade gracefully が定義されている。
- [ ] token / cost anomaly の alert、上限、停止条件がある。
- [ ] audit completeness を確認する項目が release readiness に入っている。

### A.16.5 incident timeline template

| Time | Event | Type: fact / hypothesis / decision / action / result | Evidence ID | Owner |
| --- | --- | --- | --- | --- |
| | | | | |

## A.17 付録Aの運用ルール

テンプレートは、作った時点ではなく、使われて更新された時点で価値を持つ。次のルールで運用する。

- 新しい AI 機能を提案する場合は、AI system PRD / requirements brief から開始する。
- 設計選択を含む場合は、AI system ADR、threat model、tool approval matrix を更新する。
- 品質や安全性を主張する場合は、eval spec と verification record を残す。
- 外部サービスや partner を使う場合は、vendor selection matrix と executive memo に契約・退出条件を入れる。
- 本番運用に入る場合は、cost / reliability dashboard と model / tool change impact checklist を使う。
- incident が起きた場合は、AI incident postmortem を作り、再発防止を各テンプレートへ反映する。

テンプレートを埋めること自体を目的にしない。意思決定、承認、監査、rollback、説明責任に必要な証跡を残すことが目的である。
