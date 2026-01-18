// twilio@latest — SMS sender via Twilio REST API
// configure({ accountSid, authToken, from })
// send({ to, text, from? }) -> { ok, data, error }

(function(){
  const httpx = require('http@latest');
  const log = require('log@latest').create('twilio');

  const state = { sid: null, token: null, from: null };
  function configure({ accountSid, authToken, from } = {}){
    if (accountSid) state.sid = String(accountSid);
    if (authToken) state.token = String(authToken);
    if (from) state.from = String(from);
  }
  function pickSid(){ return state.sid || sys.env.get('twilio.sid') || null; }
  function pickToken(){ return state.token || sys.env.get('twilio.token') || null; }
  function pickFrom(f){ return f || state.from || sys.env.get('twilio.from') || null; }

  async function send({ to, text, from } = {}){
    try {
      const sid = pickSid(); const tok = pickToken(); const fromN = pickFrom(from);
      if (!sid || !tok) return { ok:false, error:'twilio: missing sid/token' };
      if (!to || !fromN || !text) return { ok:false, error:'twilio: to/from/text required' };
      const url = 'https://api.twilio.com/2010-04-01/Accounts/' + encodeURIComponent(sid) + '/Messages.json';
      const fields = { To: String(to), From: String(fromN), Body: String(text) };
      const authHeader = 'Basic ' + (function basic(){
        // inline base64 to avoid pulling another helper
        const s = sid + ':' + tok; const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let out=''; let i=0; while(i<s.length){ const a=s.charCodeAt(i++)&255; const b=i<s.length?s.charCodeAt(i++)&255:NaN; const c=i<s.length?s.charCodeAt(i++)&255:NaN; const b1=a>>2; const b2=((a&3)<<4)|(isNaN(b)?0:(b>>4)); const b3=isNaN(b)?64:(((b&15)<<2)|(isNaN(c)?0:(c>>6))); const b4=isNaN(c)?64:(c&63); out+=chars.charAt(b1)+chars.charAt(b2)+(b3===64?'=':chars.charAt(b3))+(b4===64?'=':chars.charAt(b4)); }
        return out;
      })();
      const r = await httpx.form({ url, method:'POST', headers: { 'Authorization': authHeader }, fields, debug: false });
      return { ok:true, data: r && (r.json||r.raw) };
    } catch (e){ log.error('send:error', e && (e.message||e)); return { ok:false, error: (e && (e.message||String(e))) || 'unknown' }; }
  }

  module.exports = { configure, send };
})();
