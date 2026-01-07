# @instago/twilio

Twilio SMS sender via REST API.

- Version: 1.0.0
- Entry: index.js
- Exports: `{ configure, send }`
- Dependencies: `http@1.0.0`, `log@1.0.0`, `env@1.0.0`
- Env: `twilio.sid`, `twilio.token`, `twilio.from`

## API
- `configure({ accountSid, authToken, from })`
- `send({ to, text, from? })` → `{ ok, data, error }`

## Example
```js
const twilio = require('twilio@1.0.0');
twilio.configure({
  accountSid: env.twilio.sid,
  authToken: env.twilio.token,
  from: env.twilio.from
});
await twilio.send({ to: '+15551234567', text: 'Hello' });
```

## Notes
- Builds basic auth header inline; uses `http.form` via `http@1.0.0`.
