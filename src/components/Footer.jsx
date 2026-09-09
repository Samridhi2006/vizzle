/* eslint-disable react/no-unescaped-entities */
import { Mail, Phone, Facebook, Instagram, Youtube, Linkedin, ShoppingBag } from 'lucide-react';

const NAV_COMPANY = [
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Careers', href: '/careers' },
];

const NAV_RESOURCES = [
  { label: 'Documentation', href: '/docs' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Support', href: '/support' },
  { label: 'API Reference', href: '/api-docs' },
];

const SOCIALS = [
  { icon: <Facebook size={16} strokeWidth={1.75} />, href: 'https://www.facebook.com/vizzle.in/', label: 'Facebook' },
  { icon: <Instagram size={16} strokeWidth={1.75} />, href: 'https://www.instagram.com/vizzle.in/', label: 'Instagram' },
  { icon: <Youtube size={16} strokeWidth={1.75} />, href: 'https://www.youtube.com/@vizzle', label: 'YouTube' },
  { icon: <Linkedin size={16} strokeWidth={1.75} />, href: 'https://www.linkedin.com/company/vizzle-official/', label: 'LinkedIn' },
  { icon: <ShoppingBag size={16} strokeWidth={1.75} />, href: '#', label: 'Shopify' },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: '#0B0F17',
        borderTop: '1px solid rgba(51,65,85,0.6)',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      <div
        className="vz-footer-grid"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '64px 32px 48px',
          display: 'grid',
          gridTemplateColumns: '4fr 2fr 2fr 4fr',
          gap: '48px',
        }}
      >

        {/* ── Col 1: Brand + Addresses ───────────────────────────────────── */}
        <div>
          {/* Logo + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <img
              src="/viz.png"
              alt="Vizzle logo"
              style={{ height: '36px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
            />
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>
              Vizzle
            </span>
          </div>

          {/* Tagline */}
          <p style={{ fontSize: '11.5px', color: '#94A3B8', marginBottom: '14px', lineHeight: 1.6 }}>
            Visualize Your Style | AI Virtual Try-On & Fashion Catalogues
          </p>

          {/* CIN */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid rgba(51,65,85,0.8)',
            borderRadius: '8px',
            padding: '6px 12px',
            marginBottom: '22px',
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#94A3B8',
          }}>
            <span style={{ color: '#CBD5E1', fontWeight: 600 }}>CIN:</span> U62013BR2025PTC080881
          </div>


        </div>

        {/* ── Col 2: Company ─────────────────────────────────────────────── */}
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', marginBottom: '18px', textTransform: 'uppercase' }}>
            Company
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {NAV_COMPANY.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#22D3EE')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                >
                  • {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 3: Resources ───────────────────────────────────────────── */}
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', marginBottom: '18px', textTransform: 'uppercase' }}>
            Resources
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {NAV_RESOURCES.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#22D3EE')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                >
                  • {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 4: Contact + Socials ───────────────────────────────────── */}
        <div>
          {/* Email */}
          <a
            href="mailto:support@vizzle.in"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              fontSize: '13px', color: '#CBD5E1', textDecoration: 'none',
              marginBottom: '14px', transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#22D3EE')}
            onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}
          >
            <Mail size={15} color="#22D3EE" strokeWidth={2} />
            info@vizzle.in
          </a>

          {/* Phone */}
          <a
            href="tel:+918310247975"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              fontSize: '13px', color: '#CBD5E1', textDecoration: 'none',
              marginBottom: '28px', transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#22D3EE')}
            onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}
          >
            <Phone size={15} color="#22D3EE" strokeWidth={2} />
            +91 8310247975
          </a>

          {/* Follow Us */}
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Follow Us On
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  width: '36px', height: '36px',
                  borderRadius: '8px',
                  background: '#0F172A',
                  border: '1px solid rgba(51,65,85,0.8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94A3B8',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#06B6D4';
                  e.currentTarget.style.color = '#22D3EE';
                  e.currentTarget.style.background = '#0F2A33';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(51,65,85,0.8)';
                  e.currentTarget.style.color = '#94A3B8';
                  e.currentTarget.style.background = '#0F172A';
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Admin hidden button */}
          <div style={{ marginTop: '32px' }}>
            <button
              onClick={() => {
                const key = prompt('Enter admin key:');
                if (key === '190904') window.location.href = '/admin';
                else if (key) alert('Invalid key');
              }}
              style={{ fontSize: '10px', color: 'rgba(71,85,105,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Admin
            </button>
          </div>
        </div>

      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <div
        className="vz-footer-bottom"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '24px 32px',
          borderTop: '1px solid rgba(51,65,85,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <p style={{ fontSize: '11.5px', color: '#475569', margin: 0 }}>
          © 2026 Vizzle Private Limited • All Rights Reserved.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[['Terms of Service', '/terms'], ['Privacy Policy', '/privacy']].map(([label, href]) => (
            <a
              key={label}
              href={href}
              style={{ fontSize: '11.5px', color: '#475569', textDecoration: 'none', transition: 'color 0.2s ease' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#94A3B8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
