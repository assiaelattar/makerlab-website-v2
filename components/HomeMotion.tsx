import { useEffect, useRef } from 'react';

export const HomeMotion: React.FC = () => {
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let context: { revert: () => void } | undefined;
    let media: { revert: () => void } | undefined;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollModule]) => {
      if (!mounted.current) return;

      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        media = gsap.matchMedia();

        media.add('(prefers-reduced-motion: no-preference)', () => {
          gsap.utils.toArray<HTMLElement>('[data-home-group]').forEach(group => {
            const items = group.querySelectorAll('[data-home-item]');
            if (!items.length) return;

            gsap.from(items, {
              y: 18,
              duration: 0.48,
              stagger: 0.065,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: group,
                start: 'top 86%',
                once: true,
              },
            });
          });
        });
      });
    });

    return () => {
      mounted.current = false;
      media?.revert();
      context?.revert();
    };
  }, []);

  return null;
};
