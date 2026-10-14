import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getProjectByIdAdmin, createProject, updateProject, uploadScreenshot, deleteScreenshot,
} from '../../api/projects';
import { imageUrl } from '../../api/client';
import AppIcon from '../../components/AppIcon';
import { NAVY, MUTED, BLUE, LINE, FONT_HEAD, FONT_BODY } from '../../styles/theme';

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 10, border: `1px solid ${LINE}`, fontSize: 14,
  fontFamily: FONT_BODY, outline: 'none', color: NAVY,
};
const labelStyle = { display: 'block', fontSize: 12.5, fontWeight: 700, color: MUTED, marginBottom: 6 };
const hintStyle = { fontSize: 12, color: MUTED, marginTop: 5 };
const primaryBtnStyle = {
  padding: '12px 24px', border: 'none', borderRadius: 10,
  background: 'linear-gradient(135deg,#22D3EE 0%,#3D6BFF 55%,#7B2FF7 100%)', color: '#fff',
  fontWeight: 700, fontSize: 14, fontFamily: FONT_BODY, cursor: 'pointer',
};

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const emptyForm = {
  title: '', slug: '', tagline: '', description: '', status: 'live', download_android_url: '', privacy_url: '',
};

// A store app only needs a few fields. Everything project-specific (iOS/Windows links, live demo,
// per-platform notes, featured band) is left out on purpose.
export default function AdminAppEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const fileInput = useRef(null);

  const [form, setForm] = useState(emptyForm);
  const [shot, setShot] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isNew) { setForm(emptyForm); setShot(null); setLoading(false); return; }
    setLoading(true);
    getProjectByIdAdmin(id)
      .then((p) => {
        setForm({
          title: p.title, slug: p.slug, tagline: p.tagline || '', description: p.description || '',
          status: p.status === 'live' ? 'live' : 'in_development',
          download_android_url: p.download_android_url || '', privacy_url: p.privacy_url || '',
        });
        setShot(p.screenshots.find((s) => s.platform === 'android') || null);
      })
      .catch(() => setError('Could not load this app.'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const onField = (field) => (e) => { setSaved(false); setForm((f) => ({ ...f, [field]: e.target.value })); };
  const onTitle = (e) => {
    const title = e.target.value;
    setSaved(false);
    setForm((f) => ({ ...f, title, slug: isNew ? slugify(title) : f.slug }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const body = {
      kind: 'app',
      slug: form.slug || slugify(form.title),
      title: form.title,
      tagline: form.tagline || null,
      description: form.description || null,
      status: form.status,
      download_android_url: form.download_android_url || null,
      privacy_url: form.privacy_url || null,
    };
    try {
      if (isNew) {
        // new apps go to the end of the list; reorder by dragging in the apps list
        const created = await createProject({ ...body, sort_order: 1000 });
        navigate(`/admin/apps/${created.id}`, { replace: true });
      } else {
        await updateProject(id, body);
        setSaved(true);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save this app.');
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      setShot(await uploadScreenshot(id, 'android', file));
    } catch {
      setError('Logo upload failed. Use an image under 10MB (JPEG/PNG/WebP/GIF).');
    } finally {
      setUploading(false);
    }
  };

  const onDeleteShot = async () => {
    await deleteScreenshot(id, shot.id);
    setShot(null);
  };

  if (loading) return <div style={{ color: MUTED }}>Loading…</div>;

  return (
    <div>
      <Link to="/admin/apps" className="inline-link" style={{ fontSize: 13.5, color: BLUE }}>← All apps</Link>
      <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 24, color: NAVY, margin: '16px 0 24px' }}>
        {isNew ? 'New app' : form.title}
      </h1>

      <form onSubmit={onSave} style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28, maxWidth: 720 }}>
        <div>
          <label style={labelStyle}>App name</label>
          <input required style={inputStyle} value={form.title} onChange={onTitle} placeholder="e.g. SawYun Wallet" />
        </div>
        <div>
          <label style={labelStyle}>Short description (shown on the app card)</label>
          <input style={inputStyle} value={form.tagline} onChange={onField('tagline')} placeholder="One line about what the app does" />
        </div>
        <div>
          <label style={labelStyle}>About the app (optional, one point per line)</label>
          <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4} value={form.description} onChange={onField('description')} placeholder={'Track income and expenses\nWorks offline\nBackup to Google Drive'} />
          <div style={hintStyle}>Each line becomes one bullet point on the app page.</div>
        </div>
        <div>
          <label style={labelStyle}>Google Play link</label>
          <input style={inputStyle} value={form.download_android_url} onChange={onField('download_android_url')} placeholder="https://play.google.com/store/apps/details?id=…" />
          <div style={hintStyle}>Adds the Google Play button on the app page.</div>
        </div>
        <div>
          <label style={labelStyle}>Privacy policy link</label>
          <input style={inputStyle} value={form.privacy_url} onChange={onField('privacy_url')} placeholder="https://…/privacy" />
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.status} onChange={onField('status')}>
              <option value="live">Live on Google Play</option>
              <option value="in_development">Coming soon</option>
            </select>
          </div>
        </div>
        {error && <div style={{ color: '#c0392b', fontSize: 13.5 }}>{error}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={primaryBtnStyle}>{saving ? 'Saving…' : isNew ? 'Add app' : 'Save'}</button>
          {saved && <span style={{ fontSize: 13.5, color: '#0f7a43', fontWeight: 700 }}>Saved</span>}
        </div>
      </form>

      {isNew ? (
        <div style={{ fontSize: 13, color: MUTED }}>After you add the app, you can upload its logo here.</div>
      ) : (
        <div>
          <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 17, color: NAVY, marginBottom: 6 }}>App logo</h2>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>A square image (512 x 512 works best), the same icon as on Google Play. Shown on the app card and app page.</div>
          <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, padding: 16, maxWidth: 260 }}>
            {shot ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <AppIcon src={shot.image_url} name={form.title} size={120} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={onDeleteShot} className="admin-btn" style={{ background: 'rgba(192,57,43,0.08)', color: '#c0392b', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 6, fontSize: 11, fontWeight: 700, padding: '4px 10px', cursor: 'pointer' }}>Replace</button>
                </div>
              </div>
            ) : (
              <>
                <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp,image/gif" style={{ display: 'none' }} onChange={(e) => { onUpload(e.target.files[0]); e.target.value = ''; }} />
                <button type="button" disabled={uploading} onClick={() => fileInput.current?.click()} className="admin-btn" style={{ width: '100%', padding: '9px 0', borderRadius: 8, border: `1px dashed ${LINE}`, background: '#fbfbfd', color: NAVY, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
                  {uploading ? 'Uploading…' : '+ Upload logo'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
