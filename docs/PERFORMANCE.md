# Frontend Performance & Asset Optimization Checklist

## Key Metrics Targets
- **Lighthouse Performance**: >= 90
- **First Contentful Paint (FCP)**: < 1.2s
- **Largest Contentful Paint (LCP)**: < 2.0s
- **Cumulative Layout Shift (CLS)**: < 0.05

## Optimization Strategies Implemented
1. **Lazy Loading**: Route-based code splitting for heavy admin views.
2. **Debounced Inputs**: Real-time filters and search queries debounced by 300ms.
3. **Responsive Images**: Width descriptors and modern WebP / AVIF formats.
4. **Optimized Bundle**: Tree-shaking unused icons and utility packages.
