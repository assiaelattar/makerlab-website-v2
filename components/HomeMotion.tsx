import { useEffect, useRef } from 'react';

export const HomeMotion: React.FC = () => {
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let context: { revert: () => void } | undefined;
    let media: { revert: () => void } | undefined;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollModule]) => {
      if (!mounted.current) return;

      const root = document.querySelector<HTMLElement>('[data-home-root]');
      if (!root) return;

      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        media = gsap.matchMedia();

        media.add('(prefers-reduced-motion: no-preference)', () => {
          const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
          heroTimeline
            .from('[data-home-hero-copy] h1', { y: 24, duration: 0.9 })
            .from('[data-home-hero-copy] p:not(.home-hero-kicker), [data-home-hero-copy] a', { y: 20, duration: 0.55, stagger: 0.07 }, '-=0.42')
            .from('[data-home-hero-stage]', { y: 24, duration: 0.75 }, '-=0.62')
            .from('[data-home-hero-image]', { scale: 1.08, duration: 1.1 }, '<')
            .from('[data-home-hero-annotation]', { x: -18, duration: 0.65 }, '-=0.68');

          gsap.utils.toArray<HTMLElement>('[data-home-parallax]').forEach(element => {
            const speed = Number(element.dataset.parallaxSpeed || 10);
            gsap.to(element, {
              yPercent: speed,
              ease: 'none',
              scrollTrigger: {
                trigger: '.home-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.8,
              },
            });
          });

          gsap.utils.toArray<HTMLElement>('[data-home-reveal]').forEach(block => {
            gsap.from(block, {
              y: 32,
              duration: 0.8,
              ease: 'power3.out',
              immediateRender: false,
              scrollTrigger: {
                trigger: block,
                start: 'top 84%',
                once: true,
              },
            });
          });

          gsap.utils.toArray<HTMLElement>('[data-home-media]').forEach(image => {
            gsap.fromTo(image,
              { scale: 1.08 },
              {
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: image,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.8,
                },
              }
            );
          });

          gsap.utils.toArray<HTMLElement>('[data-home-words]').forEach(block => {
            const words = block.querySelectorAll('[data-home-word]');
            gsap.fromTo(words,
              { opacity: 0.16, y: 10 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.08,
                ease: 'none',
                scrollTrigger: {
                  trigger: block,
                  start: 'top 82%',
                  end: 'bottom 46%',
                  scrub: 0.7,
                },
              }
            );
          });

          gsap.utils.toArray<HTMLElement>('[data-home-story-card]').forEach(card => {
            const image = card.querySelector<HTMLElement>('[data-home-story-image]');
            if (!image) return;

            gsap.fromTo(image,
              { scale: 1.08, yPercent: -3 },
              {
                scale: 1,
                yPercent: 3,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.8,
                },
              }
            );
          });

          gsap.fromTo('[data-home-progress]',
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: '[data-home-story]',
                start: 'top 42%',
                end: 'bottom 70%',
                scrub: true,
              },
            }
          );
        });

        media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
          const stackCards = gsap.utils.toArray<HTMLElement>('[data-home-stack-card]');
          stackCards.slice(0, -1).forEach(card => {
            gsap.to(card, {
              scale: 0.94,
              opacity: 0.56,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top top+=130',
                end: 'bottom top+=130',
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            });
          });
        });

        const refresh = () => ScrollTrigger.refresh();
        if (document.fonts?.ready) {
          document.fonts.ready.then(() => mounted.current && refresh());
        } else {
          refresh();
        }
      }, root);
    });

    return () => {
      mounted.current = false;
      media?.revert();
      context?.revert();
    };
  }, []);

  return null;
};
