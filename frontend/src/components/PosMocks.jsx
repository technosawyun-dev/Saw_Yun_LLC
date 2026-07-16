import { NAVY, MUTED, FONT_HEAD } from '../styles/theme';

const tileGrad = ['linear-gradient(135deg,#22D3EE,#3D6BFF)', 'linear-gradient(135deg,#3D6BFF,#7B2FF7)', 'linear-gradient(135deg,#7B2FF7,#22D3EE)', 'linear-gradient(135deg,#22D3EE,#7B2FF7)'];

export function POSMobileMockSimple() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#E7E9F2', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ padding: '16px 18px 8px' }}>
        <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: NAVY }}>Saw Yun POS</div>
        <div style={{ fontSize: 11, color: MUTED }}>Front counter</div>
      </div>
      <div style={{ margin: '8px 18px 12px', padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid rgba(11,18,32,0.08)', fontSize: 12, color: MUTED }}>Search products…</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 18px' }}>
        {['Espresso', 'Croissant'].map((name, i) => (
          <div key={name} style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(11,18,32,0.06)', padding: 10 }}>
            <div style={{ width: '100%', height: 36, borderRadius: 8, background: tileGrad[i] }} />
            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8, color: NAVY }}>{name}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', padding: '12px 18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderTop: '1px solid rgba(11,18,32,0.06)' }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: NAVY }}>3 items · $10.75</div>
        <div style={{ padding: '9px 18px', borderRadius: 100, background: 'linear-gradient(135deg,#22D3EE,#3D6BFF 55%,#7B2FF7)', color: '#fff', fontSize: 12, fontWeight: 700 }}>Charge</div>
      </div>
    </div>
  );
}

export function POSMobileMockRich() {
  const items = [
    { name: 'Espresso', price: '$3.50' }, { name: 'Croissant', price: '$4.25' },
    { name: 'Iced Tea', price: '$3.00' }, { name: 'Bagel', price: '$3.75' },
  ];
  return (
    <div style={{ width: '100%', height: '100%', background: '#E7E9F2', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ padding: '16px 18px 8px' }}>
        <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: NAVY }}>Saw Yun POS</div>
        <div style={{ fontSize: 11, color: MUTED }}>Front counter</div>
      </div>
      <div style={{ margin: '8px 18px 12px', padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid rgba(11,18,32,0.08)', fontSize: 12, color: MUTED }}>Search products…</div>
      <div style={{ display: 'flex', gap: 8, padding: '0 18px 12px', overflow: 'hidden' }}>
        <div style={{ padding: '6px 14px', borderRadius: 100, background: 'linear-gradient(135deg,#22D3EE,#3D6BFF)', color: '#fff', fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}>All</div>
        <div style={{ padding: '6px 14px', borderRadius: 100, background: '#fff', border: '1px solid rgba(11,18,32,0.08)', color: MUTED, fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}>Drinks</div>
        <div style={{ padding: '6px 14px', borderRadius: 100, background: '#fff', border: '1px solid rgba(11,18,32,0.08)', color: MUTED, fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}>Food</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 18px' }}>
        {items.map((it, i) => (
          <div key={it.name} style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(11,18,32,0.06)', padding: 10 }}>
            <div style={{ width: '100%', height: 36, borderRadius: 8, background: tileGrad[i] }} />
            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8, color: NAVY }}>{it.name}</div>
            <div style={{ fontSize: 11.5, color: MUTED }}>{it.price}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', padding: '12px 18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderTop: '1px solid rgba(11,18,32,0.06)' }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: NAVY }}>3 items · $10.75</div>
        <div style={{ padding: '9px 18px', borderRadius: 100, background: 'linear-gradient(135deg,#22D3EE,#3D6BFF 55%,#7B2FF7)', color: '#fff', fontSize: 12, fontWeight: 700 }}>Charge</div>
      </div>
    </div>
  );
}

function DesktopIconRail() {
  return (
    <div style={{ width: 56, background: '#fff', borderRight: '1px solid rgba(11,18,32,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '18px 0' }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#22D3EE,#3D6BFF 55%,#7B2FF7)' }} />
      <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(11,18,32,0.08)' }} />
      <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(11,18,32,0.08)' }} />
    </div>
  );
}

export function POSDesktopMockSimple() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: '#E7E9F2', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <DesktopIconRail />
      <div style={{ flex: 1, padding: '20px 22px' }}>
        <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: NAVY, marginBottom: 14 }}>Checkout</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {tileGrad.map((g, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(11,18,32,0.06)', padding: 10 }}>
              <div style={{ width: '100%', height: 26, borderRadius: 6, background: g }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: 200, background: '#fff', borderLeft: '1px solid rgba(11,18,32,0.06)', padding: 18 }} />
    </div>
  );
}

export function POSDesktopMockRich() {
  const items = [
    { name: 'Espresso ×2', price: '$7.00' }, { name: 'Croissant', price: '$4.25' }, { name: 'Iced Tea', price: '$3.00' },
  ];
  const labels = ['Espresso', 'Croissant', 'Iced Tea', 'Bagel'];
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: '#E7E9F2', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <DesktopIconRail />
      <div style={{ flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15, color: NAVY }}>Checkout</div>
          <div style={{ padding: '7px 14px', borderRadius: 8, background: 'linear-gradient(135deg,#22D3EE,#3D6BFF)', color: '#fff', fontSize: 11.5, fontWeight: 700 }}>+ New sale</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {tileGrad.map((g, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(11,18,32,0.06)', padding: 10 }}>
              <div style={{ width: '100%', height: 26, borderRadius: 6, background: g }} />
              <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 6, color: NAVY }}>{labels[i]}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: 200, background: '#fff', borderLeft: '1px solid rgba(11,18,32,0.06)', padding: 18, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 10 }}>CURRENT ORDER</div>
        {items.map((it) => (
          <div key={it.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: NAVY, marginBottom: 8 }}>
            <span>{it.name}</span><span>{it.price}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px dashed rgba(11,18,32,0.12)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 14 }}>
          <span>Total</span><span>$14.25</span>
        </div>
        <div style={{ marginTop: 'auto', padding: 11, textAlign: 'center', borderRadius: 9, background: 'linear-gradient(135deg,#22D3EE,#3D6BFF 55%,#7B2FF7)', color: '#fff', fontSize: 12.5, fontWeight: 700 }}>Charge $14.25</div>
      </div>
    </div>
  );
}
