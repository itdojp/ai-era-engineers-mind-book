---
title: "AI協働の標準手順（SOP）"
layout: book
---

# AI協働の標準手順（SOP）

本書では、生成AI、workflow、agent、外部 connector を「提案・草案・観点出し・差分整理・検証補助」を担う仕組みとして扱う。AIの出力は誤り得るため、最終判断、承認、説明責任は人間と組織が負う。

この SOP は、AI協働をプロンプト単体で終わらせず、Issue、Plan、ADR、PR、Eval、Runbook、Postmortem まで接続するための章横断の標準手順である。

## 全体像（10ステップ）

1. **Issue化**: 目的、利用者、意思決定点、成功条件、制約を明文化する。
2. **情報分類**: 機密、個人情報、ソースコード、契約情報、利用禁止情報を分類する。
3. **Plan作成**: 作業分割、責任者、decision rights、escalation、停止条件を決める。
4. **入力設計**: 前提、根拠資料、source hierarchy、出力 schema、禁止事項を定義する。
5. **生成・探索**: AIに草案、候補、観点、比較、質問を出させる。
6. **評価設計**: acceptance criteria、eval plan、guardrail metric、手動確認範囲を決める。
7. **反映**: ADR、PR、requirements brief、Runbook などの成果物へ落とす。
8. **レビュー・承認**: 人間レビュー、approval gate、権限分離、監査ログを確認する。
9. **リリース・運用**: fallback、rollback、manual takeover、監視、コスト上限を確認する。
10. **事後記録**: 判断ログ、検証結果、変更差分、incident / postmortem を残す。

## ステップ別の成果物とゲート

| ステップ | 主な成果物 | 最低限のゲート |
| --- | --- | --- |
| 1. Issue化 | Issue、problem statement | 何を決めるか、誰が利用者か、成功条件は何かが明確 |
| 2. 情報分類 | data classification sheet | 外部AIに投入してよい情報と禁止情報が分かれている |
| 3. Plan作成 | implementation plan、責任分界表 | decision owner、reviewer、escalation 先、停止条件が明確 |
| 4. 入力設計 | structured prompt、schema、根拠リスト | 一次情報、実測、公式文書、AI要約の優先順位が明確 |
| 5. 生成・探索 | 複数案、確認質問、比較表 | AIが断定した箇所と根拠不明箇所を分けている |
| 6. 評価設計 | eval plan、acceptance criteria | 品質、再現性、安全性、フェイルセーフを確認できる |
| 7. 反映 | ADR、PR、Runbook、requirements brief | 成果物に採用理由、却下理由、検証結果が残る |
| 8. レビュー・承認 | review checklist、approval log | 権限分離、承認条件、監査ログ、説明先が明確 |
| 9. リリース・運用 | release readiness、rollback plan | fallback、manual takeover、復旧手順、コスト上限がある |
| 10. 事後記録 | postmortem、変更履歴、判断ログ | 後日追跡できる粒度で差分と教訓が保存されている |

## Delegate / Review / Own

AI協働の成果を実務へ反映する前に、次の3層で責任境界を確認する。

| 観点 | 確認すること | 成果物に残す例 |
| --- | --- | --- |
| Delegate（任せる） | AIに任せる作業が、草案、候補生成、要約、観点出し、差分整理などの支援領域に収まっているか | AI利用範囲、入力情報の種類、禁止した作業 |
| Review（検証する） | 一次情報、実測、テスト、レビュー、再現手順で裏取りしたか | 検証結果、レビュー指摘、採用・却下理由 |
| Own（責任を持つ） | 最終判断者、承認条件、ロールバック、監査ログ、説明先が明確か | ADR、PR、Runbook、判断ログ、approval log |

このゲートは、AI活用を遅くするためではない。AI出力を、組織が責任を持てる成果物へ変換するための最低条件である。

## approval / audit / rollback の確認観点

AIが外部ツールを呼び出す、コードを生成する、本番運用へ影響する提案を出す場合は、次を必ず確認する。

- **approval**: 実行前承認が必要な操作、事後監査でよい操作、禁止する操作を分ける。
- **audit**: 誰が、いつ、何を入力し、どの出力を採用し、どの検証をしたかを追跡できるようにする。
- **rollback**: 変更の戻し方、停止条件、manual takeover の担当、影響範囲の連絡先を定義する。
- **least privilege**: AIや agent に渡す権限を、タスク遂行に必要な最小範囲へ制限する。
- **data boundary**: 機密、個人情報、契約情報、顧客情報、利用禁止情報を入力前に分類する。

## 成果物への落とし込み先

- **要件定義**: requirements brief、acceptance criteria、data / permission boundary table
- **設計判断**: ADR、architecture decision matrix、threat model、tool approval matrix
- **実装変更**: PR、AI利用記録、review checklist、verification record
- **評価**: eval plan、regression result、offline eval、trace-based evaluation
- **運用手順**: Runbook、release readiness、rollback plan、approval log
- **障害対応**: incident timeline、AI incident runbook、postmortem

## 最小運用（Small Start）

最初から全工程を整備できない場合でも、次の5点は必須とする。

1. 判断点と責任者を明確にする。
2. 外部AIへ投入してよい情報と禁止情報を分ける。
3. 出力形式と受入条件を先に決める。
4. 一次情報、実測、テスト、レビューのいずれかで検証する。
5. 採用理由、却下理由、承認条件、ロールバック方針を成果物に残す。
