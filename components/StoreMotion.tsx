import { useEffect, useRef } from 'react';

export const StoreMotion = () => {
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
          gsap.utils.toArray<HTMLElement>('[data-store-media]').forEach(element => {
            gsap.fromTo(element,
              { scale: 0.88, opacity: 0.68 },
              {
                scale: 1,
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: element,
                  start: 'top 94%',
                  end: 'bottom 48%',
                  scrub: 0.75,
                },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>('[data-store-words]').forEach(block => {
            const words = block.querySelectorAll('[data-store-word]');
            if (!words.length) return;
            gsap.fromTo(words,
              { opacity: 0.18, y: 5 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.025,
                ease: 'none',
                scrollTrigger: {
                  trigger: block,
                  start: 'top 88%',
                  end: 'bottom 54%',
                  scrub: 0.65,
                },
              },
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
