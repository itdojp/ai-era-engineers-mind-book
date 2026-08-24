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

## 共有コンポーネント同期メタデータ

`book-config.json#shared` は本文や公開サイトの鮮度ではなく、`book-formatter` から取り込む共有コンポーネントの同期baselineを記録します。

- `shared.version` の正本は `book-formatter/shared/version.json#version` です。
- `shared.lastSync` の生成元は `book-formatter/scripts/sync-components.js` です。共有fileまたは共有versionが実際に変わった同期時だけ同scriptが更新します。
- `shared.lastSync` は、本文の更新日、公開日、最終校正日など**内容の鮮度**を表しません。同一内容の再同期、本文変更、依存更新を理由に手動更新しません。
- 共有fileを取り込んだ後のbook-local customizationは許容します。再同期前にlayout、include、assetの差分を確認し、書籍固有の変更を機械的に上書きしません。
- 読者向けの内容更新と鮮度の正本は `docs/appendices/update-notes.md` です。`shared.*` を公開上の鮮度表示には使用しません。
- owner: `ootakazuhiko`。共有同期の再確認は、Book QAのformatter pin更新時、`shared/version.json` 更新時、または共有component修正が必要になった時に行います。

2026-07-23 JSTの監査では、Book QA pin `69eb5c12f5a750b65614bc9bbbc3d7abd5aa6f6c` と本書の `shared.version` はともに `3.2.2` でした。既定の同期対象10件のうち5件は2026年版でbook-localに変更されているため、破壊的な再同期とtimestampだけの更新は行っていません。

2026-08-24 JSTの互換性監査では、formatter `cff9fcf8bae31140f07b358d314fc64173cb7013` の共有component `3.2.3` が、`mobile-responsive.css` のsidebar selectorを1箇所強化する更新であることを確認しました。本書のbook-local CSSは、closed drawerを `!important` と `visibility` で維持する同等以上の境界を既に実装しているため、local layout/include/CSSを機械的に上書きせず、互換baselineだけを `3.2.3` へ進めます。共有fileの再同期は行っていないため、`shared.lastSync` は更新しません。

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

依存関係とlint toolchainの実行には、Node.js 22.22.2以降の22系、24.15.0以降の24系、または26.0.0以降を使用します。

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
