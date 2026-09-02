# Third-Party Notices

## Kokoro voice system

Bunny English can optionally use Kokoro for local-in-browser text-to-speech.

- Project/model: https://github.com/hexgrad/kokoro
- Browser library: https://www.npmjs.com/package/kokoro-js
- ONNX model: https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX
- Upstream license: Apache-2.0

The runtime/model are fetched on demand and are not bundled in this repository.

## PronounceAI pronunciation backend

Bunny English v2.0 can connect to the open-source PronounceAI project:

- Project: https://github.com/vikranthreddimasu/PronounceAI
- Upstream license: MIT

The upstream source and ML models are not copied into the Bunny English repository. `npm run pronunciation:setup` clones the upstream project on the developer's machine. Bunny English uses only the documented pronunciation scoring/prewarm/health API surface; voice cloning is not enabled.
