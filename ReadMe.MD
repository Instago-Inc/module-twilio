# module/twilio - V8 module

Send text messages through Twilio from workflows and test scripts without wiring up extra infrastructure. This module keeps the API small so you can focus on the message content rather than transport details.

It is designed for the hgi-v8 runtime and fits into the broader Instago automation stack. Learn more at https://instago.ai.

## Technical reference

Exports:
- `configure({ accountSid, authToken, from })`
- `send({ to, text, from? }) -> { ok, data, error }`

Usage:
- Load with `require('twilio@latest')`.
- Call `configure` once to set defaults, or pass `from` in each `send` call.
- `send` returns `{ ok, data, error }` and does not throw on validation errors.

Configuration:
- Optional env keys:
  - `twilio.sid`
  - `twilio.token`
  - `twilio.from`

Examples:
```js
const twilio = require('twilio@latest');

twilio.configure({
  accountSid: env.twilio.sid,
  authToken: env.twilio.token,
  from: env.twilio.from
});

const res = await twilio.send({ to: '+15551234567', text: 'Hello from V8' });
if (!res.ok) console.error('twilio error:', res.error);
```

```js
const twilio = require('twilio@latest');

const res = await twilio.send({
  to: '+15551234567',
  from: '+15557654321',
  text: 'Override sender per message'
});
```
