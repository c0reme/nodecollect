# nodecollect

![NPM Version](https://img.shields.io/npm/v/nodecollect?logo=npm&color=red)

## About

A [NodeJS](https://nodejs.org/) wrapper that easily interacts with the [FFXIV Collect API](https://ffxivcollect.com/).

- Supports TypeScript
- Supports both CommonJS and ESM

## Installation

**Prerequisites Node.js (`18.0.0` or newer).**

```
npm install nodecollect
yarn add nodecollect
pnpm add nodecollect
bun add nodecollect
```

## Example usage

Import Nodecollect and fetch collections:

```js
import { Nodecollect } from 'nodecollect';

const nodecollect = new Nodecollect();

// or instead with options
const nodecollect = new Nodecollect({ language: 'ja' }); // en (default), fr, de, ja

await nodecollect.achievements.show(1); // {}
```

## Contributing

Before creating an issue, please ensure that it hasn't been reported or suggested previously.

## Attribution

This package is not affiliated with [FFXIV Collect](https://ffxivcollect.com/) in any way.

Data provided by [FFXIV Collect API](https://ffxivcollect.com/) was made possible by open source software, generous crowd funding in support of an ad-free internet, and countless volunteer contributions.
