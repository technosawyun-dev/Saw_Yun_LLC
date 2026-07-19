import { useState } from 'react';
import { SiTiktok, SiViber, SiTelegram, SiYoutube } from 'react-icons/si';
import { sendContact } from '../api/contact';
import { NAVY, MUTED, BLUE, LINE, FONT_HEAD, FONT_BODY } from '../styles/theme';

const inputBase = {
  width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${LINE}`, fontSize: 14.5,
  fontFamily: FONT_BODY, color: NAVY, outline: 'none', background: '#fbfbfd',
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await sendContact(form);
      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 429) {
        setError("You've sent a few messages already — please try again in a minute.");
      } else {
        setError('Something went wrong sending your message. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-screen-label="Contact" className="fade-up">
      <div className="page-header">
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, color: BLUE, marginBottom: 12 }}>CONTACT</div>
        <h1 className="page-title" style={{ fontFamily: FONT_HEAD, fontWeight: 700, letterSpacing: -1, margin: '0 0 16px', color: NAVY }}>
          Let's build something.
        </h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.65, color: MUTED, maxWidth: 600, margin: 0 }}>
          Tell us what you're working on — we usually reply within 1–2 business days.
        </p>
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 32px 100px' }}>
        <div className="contact-grid">
          {submitted ? (
            <div className="fade-up" style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 18, padding: '48px 36px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#22D3EE 0%,#3D6BFF 55%,#7B2FF7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 12.5L9.5 18L20 6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 20, color: NAVY, marginBottom: 8 }}>Thanks — message sent</div>
              <div style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.6 }}>We'll get back to you within 1–2 business days.</div>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 18, padding: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: MUTED, marginBottom: 8 }}>Name</label>
                <input type="text" required value={form.name} onChange={onChange('name')} placeholder="Your name" style={inputBase} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: MUTED, marginBottom: 8 }}>Email</label>
                <input type="email" required value={form.email} onChange={onChange('email')} placeholder="you@company.com" style={inputBase} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: MUTED, marginBottom: 8 }}>What are you building?</label>
                <textarea required value={form.message} onChange={onChange('message')} placeholder="Tell us about your project…" rows={9} style={{ ...inputBase, resize: 'vertical' }} />
              </div>
              {error && <div style={{ fontSize: 13.5, color: '#c0392b' }}>{error}</div>}
              <button type="submit" disabled={submitting} style={{
                marginTop: 6, padding: '14px 0', border: 'none', borderRadius: 10,
                background: 'linear-gradient(135deg,#22D3EE 0%,#3D6BFF 55%,#7B2FF7 100%)', color: '#fff',
                fontWeight: 700, fontSize: 15, fontFamily: FONT_BODY, cursor: submitting ? 'default' : 'pointer',
                opacity: submitting ? 0.7 : 1,
              }}>{submitting ? 'Sending…' : 'Send message'}</button>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'EMAIL', value: 'support@sawyuntech.com', href: 'mailto:support@sawyuntech.com',
                svg: <path key="e" d="M3 6L12 13L21 6M3 5H21V19H3V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> },
              { label: 'PHONE', value: '+66 817639774 / +1 3022301026',
                hrefs: ['tel:+66817639774', 'tel:+13022301026'],
                svg: <path key="ph" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> },
              ['LOCATION', 'Remote-first · Worldwide', <><path key="l1" d="M12 21C12 21 19 14.5 19 9.5C19 5.9 15.9 3 12 3C8.1 3 5 5.9 5 9.5C5 14.5 12 21 12 21Z" stroke="currentColor" strokeWidth="2" /><circle key="l2" cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="2" /></>],
              ['RESPONSE TIME', '1–2 business days', <><path key="r1" d="M12 7V12L15.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle key="r2" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /></>],
            ].map((entry) => {
              const isObj = !Array.isArray(entry);
              const label = isObj ? entry.label : entry[0];
              const value = isObj ? entry.value : entry[1];
              const svg = isObj ? entry.svg : entry[2];
              const href = isObj ? entry.href : null;
              const hrefs = isObj ? entry.hrefs : null;
              return (
                <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'center', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, padding: 20 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(61,107,255,0.08)', color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">{svg}</svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 4 }}>{label}</div>
                    {hrefs ? (
                      <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 16, color: NAVY }}>
                        {value.split(' / ').map((v, i) => (
                          <span key={v}>
                            {i > 0 && ' / '}
                            <a href={hrefs[i]} style={{ color: NAVY, textDecoration: 'none' }} className="inline-link">{v}</a>
                          </span>
                        ))}
                      </div>
                    ) : href ? (
                      <a
                        href={href} target={href.startsWith('mailto:') ? undefined : '_blank'}
                        rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                        className="inline-link"
                        style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 16, color: NAVY }}
                      >{value}</a>
                    ) : (
                      <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 16, color: NAVY }}>{value}</div>
                    )}
                  </div>
                </div>
              );
            })}

            <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, padding: 20, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              {[
                { label: 'TikTok', href: 'https://www.tiktok.com/@saw.yunllc?is_from_webapp=1&sender_device=pc', Icon: SiTiktok },
                { label: 'Viber', href: 'https://invite.viber.com/?g2=AQBQYMvZ0oUO%2FVbQdt14UApedKyJPfJ3ZaL1%2FyQM6E%2FtlB4OArSpfnuEAt5DjPjo', Icon: SiViber },
                { label: 'Telegram', href: 'https://t.me/+Qer7Jk9nmedlMmZl', Icon: SiTelegram },
                { label: 'YouTube', href: 'https://www.youtube.com/@SawYun-LLC', Icon: SiYoutube },
              ].map(({ label, href, Icon }) => (
                <a
                  key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="social-icon-pop-wrap"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none',
                    color: NAVY, flex: '1 1 0',
                  }}
                >
                  <div className="social-icon-pop" style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(61,107,255,0.08)', color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{label}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
