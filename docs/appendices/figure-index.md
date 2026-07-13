---
title: "付録G：図表索引"
description: "docs/assets/images/diagrams にある3件のSVG図版を、安定した識別子、代替テキスト、用途、関連章とともに参照する図表索引"
layout: book
---

# 付録G：図表索引

この付録は、`docs/assets/images/diagrams/` にある公開 SVG **3件をすべて**、読者が直接参照できるようにした図表索引である。各図は画像を埋め込み、安定したアンカー、代替テキスト、キャプション、用途、関連章を持つ。

## 図版の前提

ここに掲載する図は、本文の考え方を説明するための**概念図・説明用のイラスト**である。図中の数値、年代、段階、矢印、配置は実測効果、性能保証、導入順序、将来予測を意味しない。実際の設計や投資判断では、対象システムのデータ、評価条件、リスク受容、承認記録を別途確認する。

## 図版インベントリ

| 安定アンカー | ファイル | 主な用途 | 関連章 |
| --- | --- | --- | --- |
| [図G-1](#figure-ai-collaboration-patterns) | `ai-collaboration-patterns.svg` | AI と人の協働境界、delegate / review / own の説明 | [第1章](../../chapters/chapter-01/)、[第4章](../../chapters/chapter-04/)、[SOP](../../introduction/ai-collaboration-sop/) |
| [図G-2](#figure-continuous-learning-cycle) | `continuous-learning-cycle.svg` | 観測、内省、計画、実行を回す継続学習の説明 | [第4章](../../chapters/chapter-04/)、[第6章](../../chapters/chapter-06/)、[付録E](../concept-map/) |
| [図G-3](#figure-engineer-mindset-evolution) | `engineer-mindset-evolution.svg` | エンジニアの思考変化を説明する補助線 | [第1章](../../chapters/chapter-01/)、[第5章](../../chapters/chapter-05/)、[付録F](../glossary/) |

## 図G-1：AI 協働パターン

<figure id="figure-ai-collaboration-patterns" aria-labelledby="figure-ai-collaboration-patterns-caption">
  <img src="{{ '/assets/images/diagrams/ai-collaboration-patterns.svg' | relative_url }}" alt="個人、AI アシスタント、協働パターン、創造的な成果の関係を示す概念図">
  <figcaption id="figure-ai-collaboration-patterns-caption"><strong>図G-1：AI 協働パターン</strong> — AI を単独の意思決定者ではなく、人の判断とレビューに接続する支援者として位置付ける概念図。用途は、第1章の delegate / review / own、第4章の AI-assisted delivery、SOP の責任境界を説明すること。関連章：<a href="{{ '/chapters/chapter-01/' | relative_url }}">第1章</a>、<a href="{{ '/chapters/chapter-04/' | relative_url }}">第4章</a>、<a href="{{ '/introduction/ai-collaboration-sop/' | relative_url }}">SOP</a>。概念図・説明用であり、協働による効果や品質を保証しない。</figcaption>
</figure>

## 図G-2：継続学習サイクル

<figure id="figure-continuous-learning-cycle" aria-labelledby="figure-continuous-learning-cycle-caption">
  <img src="{{ '/assets/images/diagrams/continuous-learning-cycle.svg' | relative_url }}" alt="observe、reflect、plan、act の4段階を循環させる継続学習サイクルの概念図">
  <figcaption id="figure-continuous-learning-cycle-caption"><strong>図G-2：継続学習サイクル</strong> — observe（観測）、reflect（内省）、plan（計画）、act（実行）を循環させ、delivery と運用の学びを次の判断へ戻す概念図。用途は、第4章の skill degradation 対策、第6章の postmortem と operational guardrail、付録Eの成果物連鎖を説明すること。関連章：<a href="{{ '/chapters/chapter-04/' | relative_url }}">第4章</a>、<a href="{{ '/chapters/chapter-06/' | relative_url }}">第6章</a>、<a href="{{ '/appendices/concept-map/' | relative_url }}">付録E</a>。概念図・説明用であり、学習速度や改善効果を保証しない。</figcaption>
</figure>

## 図G-3：エンジニアの思考の変化

<figure id="figure-engineer-mindset-evolution" aria-labelledby="figure-engineer-mindset-evolution-caption">
  <img src="{{ '/assets/images/diagrams/engineer-mindset-evolution.svg' | relative_url }}" alt="traditional、digital、AI era、future の4段階でエンジニアの思考要素を捉える概念図">
  <figcaption id="figure-engineer-mindset-evolution-caption"><strong>図G-3：エンジニアの思考の変化</strong> — traditional、digital、AI era、future というラベルで、実装だけでなく問い、判断、説明責任、運用統制へ視点を広げる補助線。用途は、第1章の思考 OS と第5章の組織・合意形成を説明すること。関連章：<a href="{{ '/chapters/chapter-01/' | relative_url }}">第1章</a>、<a href="{{ '/chapters/chapter-05/' | relative_url }}">第5章</a>、<a href="{{ '/appendices/glossary/' | relative_url }}">付録F</a>。概念図・説明用であり、年代ごとの実態、優劣、将来予測を表さない。</figcaption>
</figure>

## 図版を成果物へ接続する

- 図G-1を使って AI に任せる作業と、人が検証・承認する作業を分ける場合は、[付録Fの delegate / review / own](../glossary/#term-delegate-review-own) と [SOP](../../introduction/ai-collaboration-sop/#delegate--review--own) を併記する。
- 図G-2を運用改善の説明に使う場合は、観測結果を [第6章の incident timeline](../../chapters/chapter-06/#section-6-5) と postmortem に結び付け、図だけから改善効果を推定しない。
- 図G-3を組織や投資の説明に使う場合は、[第5章の productivity benefit と verification cost](../../chapters/chapter-05/#section-5-2) を同じ表で示し、ラベルの年代を予測や保証として扱わない。

画像の追加・削除・改名時は、ファイル名、安定アンカー、alt、caption、purpose、related chapters、概念図である旨をこの付録とUX契約チェッカーへ反映する。
