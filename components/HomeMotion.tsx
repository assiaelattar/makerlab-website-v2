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
          gsap.from('[data-home-hero] > *', {
            y: 18,
            duration: 0.42,
            stagger: 0.06,
            ease: 'power3.out',
          });

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

          gsap.utils.toArray<HTMLElement>('[data-home-media]').forEach(mediaEl => {
            gsap.fromTo(mediaEl,
              { scale: 0.94, opacity: 0.72 },
              {
                scale: 1,
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: mediaEl,
                  start: 'top 92%',
                  end: 'bottom 58%',
                  scrub: 0.8,
                },
              }
            );
          });

          gsap.utils.toArray<HTMLElement>('[data-home-words]').forEach(block => {
            const words = block.querySelectorAll('[data-home-word]');
            if (!words.length) return;

            gsap.fromTo(words,
              { opacity: 0.24, y: 8 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.035,
                ease: 'none',
                scrollTrigger: {
                  trigger: block,
                  start: 'top 82%',
                  end: 'bottom 52%',
                  scrub: 0.7,
                },
              }
            );
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
