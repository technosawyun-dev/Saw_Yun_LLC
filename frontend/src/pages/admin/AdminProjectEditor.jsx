import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getProjectByIdAdmin, createProject, updateProject, uploadScreenshot, deleteScreenshot, updateScreenshotPosition,
} from '../../api/projects';
import { imageUrl } from '../../api/client';
import { FRAME_BY_PLATFORM, FRAME_PREVIEW_SIZE } from '../../components/devices/frameRegistry';
import ScreenshotAdjuster from '../../components/admin/ScreenshotAdjuster';
import { NAVY, MUTED, BLUE, LINE, FONT_HEAD, FONT_BODY, PLATFORMS } from '../../styles/theme';

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 10, border: `1px solid ${LINE}`, fontSize: 14,
  fontFamily: FONT_BODY, outline: 'none', color: NAVY,
};
const labelStyle = { display: 'block', fontSize: 12.5, fontWeight: 700, color: MUTED, marginBottom: 6 };
const primaryBtnStyle = {
  padding: '12px 24px', border: 'none', borderRadius: 10,
  background: 'linear-gradient(135deg,#22D3EE 0%,#3D6BFF 55%,#7B2FF7 100%)', color: '#fff',
  fontWeight: 700, fontSize: 14, fontFamily: FONT_BODY, cursor: 'pointer',
};
const secondaryBtnStyle = {
  padding: '12px 24px', borderRadius: 10, border: `1px solid ${LINE}`, background: '#fff',
  color: NAVY, fontWeight: 700, fontSize: 14, fontFamily: FONT_BODY, cursor: 'pointer',
};

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const emptyForm = { title: '', slug: '', tagline: '', description: '', status: 'in_development', live_demo_url: '', sort_order: 0 };

function ViewField({ label, children }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <div style={{ fontSize: 14.5, color: NAVY, fontWeight: 600 }}>{children}</div>
    </div>
  );
}

export default function AdminProjectEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const fileInputs = useRef({});

  const [form, setForm] = useState(emptyForm);
  const [originalForm, setOriginalForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState(isNew);
  const [slugTouched, setSlugTouched] = useState(false);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingPlatform, setUploadingPlatform] = useState(null);
  const [adjusting, setAdjusting] = useState(null);
  const [adjustSaving, setAdjustSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    // React Router doesn't remount this component when navigating from
    // /admin/projects/new to /admin/projects/:id after creating a project
    // (different Route patterns, same element) — so editMode/loading from
    // the "new project" render would otherwise leak into the freshly
    // created project's view instead of resetting.
    setLoading(true);
    setEditMode(false);
    getProjectByIdAdmin(id)
      .then((p) => {
        const next = {
          title: p.title, slug: p.slug, tagline: p.tagline || '', description: p.description || '',
          status: p.status, live_demo_url: p.live_demo_url || '', sort_order: p.sort_order,
        };
        setForm(next);
        setOriginalForm(next);
        setScreenshots(p.screenshots);
        setSlugTouched(true);
      })
      .catch(() => setError('Could not load this project.'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const onTitleChange = (e) => {
    const title = e.target.value;
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
  };

  const onField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const onEdit = () => setEditMode(true);

  const onCancel = () => {
    setForm(originalForm);
    setError(null);
    setEditMode(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const body = {
      ...form,
      tagline: form.tagline || null,
      description: form.description || null,
      live_demo_url: form.live_demo_url || null,
      sort_order: Number(form.sort_order) || 0,
    };
    try {
      if (isNew) {
        const created = await createProject(body);
        navigate(`/admin/projects/${created.id}`, { replace: true });
      } else {
        await updateProject(id, body);
        setOriginalForm(form);
        setEditMode(false);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save this project.');
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (platform, file) => {
    if (!file) return;
    setUploadingPlatform(platform);
    setError(null);
    try {
      const shot = await uploadScreenshot(id, platform, file);
      setScreenshots((s) => [...s, shot]);
    } catch {
      setError('Screenshot upload failed. Use an image under 10MB (JPEG/PNG/WebP/GIF).');
    } finally {
      setUploadingPlatform(null);
    }
  };

  const onDeleteScreenshot = async (shotId) => {
    await deleteScreenshot(id, shotId);
    setScreenshots((s) => s.filter((x) => x.id !== shotId));
  };

  const onSavePosition = async (patch) => {
    setAdjustSaving(true);
    try {
      const updated = await updateScreenshotPosition(id, adjusting.id, patch);
      setScreenshots((s) => s.map((x) => (x.id === updated.id ? updated : x)));
      setAdjusting(null);
    } catch {
      setError('Could not save the screenshot position.');
    } finally {
      setAdjustSaving(false);
    }
  };

  if (loading) return <div style={{ color: MUTED }}>Loading…</div>;

  const showFields = isNew || editMode;

  return (
    <div>
      <Link to="/admin/projects" className="inline-link" style={{ fontSize: 13.5, color: BLUE }}>← All projects</Link>
      <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 24, color: NAVY, margin: '16px 0 24px' }}>
        {isNew ? 'New project' : editMode ? `Editing: ${form.title}` : form.title}
      </h1>

      <form onSubmit={onSave} style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        {showFields ? (
          <div key="edit" className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input required style={inputStyle} value={form.title} onChange={onTitleChange} placeholder="e.g. Saw Yun POS" />
            </div>
            <div>
              <label style={labelStyle}>Slug (used in the URL)</label>
              <input required style={inputStyle} value={form.slug} onChange={(e) => { setSlugTouched(true); onField('slug')(e); }} placeholder="saw-yun-pos" />
            </div>
            <div>
              <label style={labelStyle}>Tagline (shown on the project card)</label>
              <input style={inputStyle} value={form.tagline} onChange={onField('tagline')} placeholder="Short one-line summary" />
            </div>
            <div>
              <label style={labelStyle}>Description (shown on the project detail page)</label>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4} value={form.description} onChange={onField('description')} placeholder="Longer description of the project" />
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 180px' }}>
                <label style={labelStyle}>Status</label>
                <select style={inputStyle} value={form.status} onChange={onField('status')}>
                  <option value="live">Live</option>
                  <option value="in_development">In development</option>
                </select>
              </div>
              <div style={{ flex: '2 1 260px' }}>
                <label style={labelStyle}>Live demo URL (optional)</label>
                <input style={inputStyle} value={form.live_demo_url} onChange={onField('live_demo_url')} placeholder="https://app.example.com" />
              </div>
              <div style={{ flex: '1 1 100px' }}>
                <label style={labelStyle}>Sort order</label>
                <input type="number" style={inputStyle} value={form.sort_order} onChange={onField('sort_order')} />
              </div>
            </div>
            {error && <div className="fade-up" style={{ fontSize: 13.5, color: '#c0392b' }}>{error}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ ...primaryBtnStyle, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : isNew ? 'Create project' : 'Save changes'}
              </button>
              {!isNew && (
                <button type="button" disabled={saving} onClick={onCancel} className="admin-btn" style={{ ...secondaryBtnStyle, opacity: saving ? 0.7 : 1 }}>Cancel</button>
              )}
            </div>
          </div>
        ) : (
          <div key="view" className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ViewField label="Title">{form.title}</ViewField>
            <ViewField label="Slug (used in the URL)">{form.slug}</ViewField>
            <ViewField label="Tagline (shown on the project card)">{form.tagline || '—'}</ViewField>
            <ViewField label="Description (shown on the project detail page)">
              <span style={{ whiteSpace: 'pre-wrap', fontWeight: 400, color: MUTED, fontSize: 14 }}>{form.description || '—'}</span>
            </ViewField>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 180px' }}>
                <ViewField label="Status">
                  <span style={{
                    fontSize: 12.5, fontWeight: 700, padding: '4px 10px', borderRadius: 100,
                    color: form.status === 'live' ? BLUE : '#7B2FF7',
                    background: form.status === 'live' ? 'rgba(61,107,255,0.08)' : 'rgba(123,47,247,0.1)',
                  }}>{form.status === 'live' ? 'Live' : 'In development'}</span>
                </ViewField>
              </div>
              <div style={{ flex: '2 1 260px' }}>
                <ViewField label="Live demo URL">
                  {form.live_demo_url
                    ? <a href={form.live_demo_url} target="_blank" rel="noopener noreferrer" style={{ color: BLUE }}>{form.live_demo_url}</a>
                    : '—'}
                </ViewField>
              </div>
              <div style={{ flex: '1 1 100px' }}>
                <ViewField label="Sort order">{form.sort_order}</ViewField>
              </div>
            </div>
            <div>
              <button type="button" onClick={onEdit} className="admin-btn admin-btn-primary" style={primaryBtnStyle}>Edit</button>
            </div>
          </div>
        )}
      </form>

      {!isNew && (
        <div>
          <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 17, color: NAVY, marginBottom: 6 }}>Screenshots</h2>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
            One per platform is shown on the public site (the first one uploaded). Each preview below shows exactly how it will look in its device frame — click Adjust to reposition or zoom.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {PLATFORMS.map((p) => {
              const shots = screenshots.filter((s) => s.platform === p.key);
              const Frame = FRAME_BY_PLATFORM[p.key];
              const size = FRAME_PREVIEW_SIZE[p.key];
              return (
                <div key={p.key} className="hoverable-card" style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, padding: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: NAVY, marginBottom: 10 }}>{p.label}</div>
                  {shots.length === 0 && <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 10 }}>No screenshot yet</div>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
                    {shots.map((s) => (
                      <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div className="hoverable-lift" style={{ borderRadius: 8 }}>
                          <Frame
                            screenshot={imageUrl(s.image_url)} alt=""
                            focalX={s.focal_x} focalY={s.focal_y} zoom={s.zoom}
                            width={size.width} height={size.height}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => setAdjusting(s)}
                            className="admin-btn"
                            style={{
                              background: '#fbfbfd', color: NAVY, border: `1px solid ${LINE}`, borderRadius: 6,
                              fontSize: 11, fontWeight: 700, padding: '4px 10px', cursor: 'pointer',
                            }}
                          >Adjust</button>
                          <button
                            type="button"
                            onClick={() => onDeleteScreenshot(s.id)}
                            className="admin-btn"
                            style={{
                              background: 'rgba(192,57,43,0.08)', color: '#c0392b', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 6,
                              fontSize: 11, fontWeight: 700, padding: '4px 10px', cursor: 'pointer',
                            }}
                          >Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <input
                    ref={(el) => (fileInputs.current[p.key] = el)}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    style={{ display: 'none' }}
                    onChange={(e) => { onUpload(p.key, e.target.files[0]); e.target.value = ''; }}
                  />
                  <button
                    type="button"
                    disabled={uploadingPlatform === p.key}
                    onClick={() => fileInputs.current[p.key]?.click()}
                    className="admin-btn"
                    style={{
                      width: '100%', padding: '9px 0', borderRadius: 8, border: `1px dashed ${LINE}`, background: '#fbfbfd',
                      color: NAVY, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                    }}
                  >{uploadingPlatform === p.key ? 'Uploading…' : '+ Upload screenshot'}</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {adjusting && (
        <ScreenshotAdjuster
          platform={adjusting.platform}
          imageSrc={imageUrl(adjusting.image_url)}
          initial={adjusting}
          saving={adjustSaving}
          onSave={onSavePosition}
          onCancel={() => setAdjusting(null)}
        />
      )}
    </div>
  );
}
