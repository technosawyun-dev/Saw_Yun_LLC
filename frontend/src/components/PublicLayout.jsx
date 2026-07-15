import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import CtaBand from './CtaBand';
import { BG, NAVY, PAGE_GRADIENT_WASH_STYLE, PAGE_DOT_GRID_STYLE } from '../styles/theme';

export default function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', background: BG, color: NAVY, position: 'relative', overflowX: 'hidden' }}>
      <div style={PAGE_GRADIENT_WASH_STYLE} />
      <div style={PAGE_DOT_GRID_STYLE} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <Outlet />
        <CtaBand />
        <Footer />
      </div>
    </div>
  );
}
