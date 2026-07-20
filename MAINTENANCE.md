# 保守者向けrunbook

## 対象読者と責務

この文書は、本書の本文、品質ゲート、GitHub Pages公開を変更する**保守者向け**です。一般読者向けの鮮度確認方法と内容上の更新履歴は、公開正本 `docs/appendices/update-notes.md` で管理します。一般読者はこのrunbookを実行する必要はありません。

保守者は、変更範囲を分離し、レビュー指摘を処理し、検証結果と公開状態を追跡できる証跡として残す責務を持ちます。

## 正本と公開境界

| 情報 | 正本 | GitHub Pages |
| --- | --- | --- |
| 読者向け本文・更新方針・更新履歴 | `docs/` | 公開対象 |
| 保守手順・review / CI / merge / deployment証跡 | `MAINTENANCE.md`、GitHub Issue / PR | 公開サイトの対象外 |
| プロジェクト管理記録 | `project-management/`、GitHub Issue | 公開サイトの対象外 |

`docs/`へ内部のIssue番号、PR番号、portfolio sprint名、review thread、Book QA、main merge commitなどの個別運用証跡を記載しません。読者が必要とする内容上の変更、確認日、対象バージョン、正本、適用範囲、再確認条件だけを公開更新履歴へ反映します。

## 更新手順

1. 影響範囲を特定する。対象章、付録、目次、関連リンク、成果物テンプレート、`book-config.json`を確認する。
2. 本文に残す判断原則と、付録または正本参照へ寄せる変動情報を分ける。
3. 変更を1つの目的でレビューできる単位へ分ける。本文、依存更新、build契約を不用意に混在させない。
4. 用語と導線を確認する。agent、workflow、tool、approval、guardrail、eval、audit、rollbackの表記とリンク先を確認する。
5. ローカル検証、PR headのCI、review thread、merge後のmain CI、Pages、公開HTTPを確認する。
6. GitHub Issue / PRへ変更対象、対象外、検証結果、指摘対応、merge SHA、公開確認を記録する。
7. `docs/appendices/update-notes.md`には、読者へ影響する変更と鮮度情報だけを追記する。

## レビュー観点

- 章または付録が、思考法、意思決定、説明責任、運用統制のいずれかに接続している。
- 「AIに任せる」「人がレビューする」「人が最終責任を持つ」を区別している。
- security / privacy / compliance / approval / audit / rollbackの観点を確認している。
- agent、workflow、tool、approval、guardrail、eval、auditの用語を章間で揃えている。
- 例が、権限分離、監査ログ、納期、予算、既存システム、組織内調整などの現実的制約を含む。
- 断定が強い箇所に、前提条件、適用範囲、例外、検証方法がある。
- 変化しやすい固有情報に確認日、対象バージョン、正本、適用範囲、再確認条件がある。
- 章末から関連する成果物、章、付録へ移動できる。

## 必須検証

```bash
npm ci
npm test
npm run build
npm run check:reader-maintainer-boundary:built
npm run check:case-study-quantitative-coverage:built
npm run check-ux-contract:built
```

加えて、Book QAでUnicode、textlint、内部リンク、layout risk、Markdown構造、Jekyll build、rendered quantitative coverage、rendered reader UXを確認します。warningを無視または抑制せず、既知の別Issueとして扱う場合はowner、期限、再確認条件を記録します。

## 完了証跡

PRを完了する前に、次を記録します。

- 変更した範囲と変更しなかった範囲
- 本文に残した一般原則と、外部の正本へ寄せた変動情報
- 実行した検証コマンドと結果
- review本文、inline comment、suggestion、threadの確認結果
- 必要な修正、または修正不要と判断した根拠
- unresolved review threadが0であること
- PR headとmain merge commitのCI結果、および追跡に必要なGitHub Actions run ID
- Pages deploymentと公開URLの確認結果

## 移管した運用履歴

- 2026年版への全面リライトは [Issue #127](https://github.com/itdojp/ai-era-engineers-mind-book/issues/127) で管理しました。
- 初版のAI協働SOPと前作接続は [PR #83](https://github.com/itdojp/ai-era-engineers-mind-book/pull/83)、設計論点は [PR #84](https://github.com/itdojp/ai-era-engineers-mind-book/pull/84)、章の成果物接続は [PR #85](https://github.com/itdojp/ai-era-engineers-mind-book/pull/85) で追加しました。
- テンプレート、ケーススタディ、ルーブリックは [PR #86](https://github.com/itdojp/ai-era-engineers-mind-book/pull/86)、ライセンスFAQと更新履歴は [PR #87](https://github.com/itdojp/ai-era-engineers-mind-book/pull/87) で整備しました。
- 読者向け情報と保守者向け情報の境界は [Issue #156](https://github.com/itdojp/ai-era-engineers-mind-book/issues/156) で再整理しました。
