// The barrel. Both halves are also reachable as subpaths, because they answer different questions
// and a backend may want only one: `@weave/emit-web/contract` reads a contract, `@weave/emit-web/css`
// writes light-DOM stylesheets.
export * from './contract.mjs';
export * from './css.mjs';
