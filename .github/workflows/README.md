# `.github/workflows/`

Continuous integration. The place a gate becomes enforcement rather than a suggestion.

The scripts themselves live in [`scripts/`](../../scripts/README.md) and
[`packages/react/scripts/`](../../packages/react/scripts/README.md); this directory only decides
**when they run and on what**.

## What is here

| Workflow                     | Jobs                         | What it protects                                                                         |
| ---------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------- |
| [`verify.yml`](./verify.yml) | `verify`, `brand`, `browser` | Repository checks, no old-prefix stragglers, and generated-component browser regressions |

### `browser`

Installs Chromium, Firefox and WebKit and runs `pnpm test:browser`. This separate job catches DOM,
accessibility and event/lifecycle defects that pass the pure behavior tests and type
checks. The [browser test guide](../../tests/browser/README.md) describes the fixtures
and local setup. Browser installation is not required for `pnpm verify`.

### `verify`

Runs the same **set** of gates as `pnpm verify`, one step per gate, each with a comment stating what
that gate catches that nothing else would. Then two **reports** — contract coverage and the
token-policy paint report — which print and never fail.

Steps are separate rather than one `pnpm verify` call on purpose: a failure names itself in the
GitHub UI without anyone reading a log.

**The same set, not the same order** — and the difference matters. This job builds tokens early;
`pnpm verify` builds late. So a gate that accidentally depends on build output passes here and fails
there. That is not hypothetical: `verify:docs` shipped requiring generated token files to exist,
this job went green, and the template's `init-ds` job (since replaced by `brand`, below) caught it
by running the real `pnpm verify` on a clean checkout. **A gate must not depend on anything produced later in its own chain.**

### `brand`

Runs `pnpm init-ds --check`: asserts no straggler of the template's `ds` prefix survives anywhere the
rename rules know about.

The template shipped an `init-ds` job instead, which branded a clean checkout and re-ran `pnpm verify`.
This repo was branded `weave` on 2026-10-12, and `init-ds` refuses to run on a branded repo, so that
job could only fail. The check is narrower than it looks: init-ds's rules missed custom event names
(`ds-value-change`), which were fixed by hand and which this job would not have caught.

## Why gates live here and not only in `pnpm verify`

**A contract whose breach produces no build error has to be gated in CI, or it is enforced on
whichever machine happens to run `verify`.**

That is the rule this directory exists to satisfy, and it is why the two lists must stay in step: a
gate added to `package.json` and not to `verify.yml` is a gate that protects the author and nobody
else. When you add one, add it in both places, with a comment here saying what it catches.

## What is deliberately absent

No deploy, no release, no publish workflow. The template ships no components, so there is nothing to
release yet — and an unused publish pipeline is a thing that breaks quietly and is discovered on the
day it is first needed.
