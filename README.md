# Cezerin - Ecommerce Progressive Web Apps

This repository is a fork of [cezerin2/cezerin2](https://github.com/cezerin2/cezerin2), which is a fork of [cezerin/cezerin](https://github.com/cezerin/cezerin).

Main motivation of this fork is to build towards an extensible monorepo architecture.

## Installation

Use node v8.10.0 (or use `nvs` to automatically load the correct node version).

First time setup: From `[MONO_ROOT]/packages/cezerin-mono`:
```
yarn
yarn setup
```

Building and running: From `[MONO_ROOT]`
```
yarn build
yarn start
```

By default, the store will be running on `http://localhost:3000`, the admin - application will be mounted on `http://localhost:3000/admin` and the API will be listening to `http://localhost:30001`.

## Licence

This software is provided free of charge and without restriction under the MIT License
