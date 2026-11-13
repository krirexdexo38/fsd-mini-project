# Multimodal test assets

Create the input side of a test: an image, audio clip, video, or text corpus that drives the
production path. Generate stimuli, never verdicts. A subjective quality judgment, real-user
acceptance, or load-bearing realism stays with a person.

Use an approved generator already available to the project and its existing fixture tooling or language.
Do not assume a provider, model, SDK, or credential name. Record the provider, model, prompt, seed
when available, and output hash in a
committed manifest so another run can reproduce the fixture. If no suitable generator is available,
make a deterministic local fixture or ask the user for the input.

## Follow the verification-fidelity decision

Read the SPEC's **Verification fidelity** section. Generated fixtures fit the `fixtures` data rung.
They do not substitute for anonymized or production data. Without a SPEC, use fixtures and flag any
test whose realism is load-bearing.

| Generate | Hand off to a person |
|---|---|
| A stimulus with a code-checkable oracle: OCR, transcription, parsing, detection, or schema validation | A judgment such as "does this look right?" or "is this natural?" |
| A plausible but imperfect fixture still exercises the right failure | A real journey, device check, or user acceptance test |
| The fixture generator is independent of the product behavior under test | The product is a wrapper around the same model family, making the test circular |

## Manifest and files

Use `test-assets/manifest.json` as the source of truth. Each row records an id, modality, generator
and model, prompt, seed when available, hash, and whether a person must verify it. Commit small,
deterministic assets beside the manifest. Keep large assets out of Git, add their generated paths to
the target project's ignore file, and regenerate them from the manifest.

## Generate and verify

1. List the fixtures the slice needs and reuse any manifest entry whose hash matches.
2. Verify the chosen provider's current API, model name, and license before calling it. Do not invent
   an endpoint or response shape.
3. Generate the asset, save it, record the manifest row, and use a deterministic seed where supported.
4. Turn environmental failures into one actionable message without exposing credentials or provider
   traces. Tests skip for unavailable credentials or quota, and fail for a code regression.
5. For a hand-off, state exactly what the person must check and how.
