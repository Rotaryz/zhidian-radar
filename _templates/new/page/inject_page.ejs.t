---
inject: true
to: src/router/index.js
prepend: true
---
const <%= h.inflection.dasherize(name) %> = () => import('pages/<%= h.inflection.dasherize(name) %>/<%= h.inflection.dasherize(name) %>')
