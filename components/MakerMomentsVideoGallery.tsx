import React from 'react';

interface MakerMomentsVideoGalleryProps {
  videoIds: string[];
}

const moments = [
  { start: 5, step: '01', label: 'Imaginer', detail: 'L’idée prend forme' },
  { start: 13, step: '02', label: 'Construire', detail: 'Les mains entrent en jeu' },
  { start: 21, step: '03', label: 'Tester', detail: 'On comprend en essayant' },
  { start: 29, step: '04', label: 'Présenter', detail: 'Le projet devient une fierté' },
];

const sendPlayerCommand = (frame: HTMLIFrameElement, command: 'playVideo' | 'pauseVideo') => {
  frame.contentWindow?.postMessage(JSON.stringify({
    event: 'command',
    func: command,
    args: [],
  }), '*');
};

export const MakerMomentsVideoGallery: React.FC<MakerMomentsVideoGalleryProps> = ({ videoIds }) => {
  const galleryRef = React.useRef<HTMLDivElement>(null);
  const frameRefs = React.useRef<Array<HTMLIFrameElement | null>>([]);
  const [motionAllowed, setMotionAllowed] = React.useState(() => (
    typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));
  const playableVideoIds = videoIds.filter(id => /^[\w-]{11}$/.test(id));

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setMotionAllowed(!mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);
    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  React.useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const updatePlayback = (shouldPlay: boolean) => {
      frameRefs.current.forEach(frame => {
        if (frame) sendPlayerCommand(frame, shouldPlay && motionAllowed ? 'playVideo' : 'pauseVideo');
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      updatePlayback(entry.isIntersecting && !document.hidden);
    }, { threshold: 0.18 });

    const handleVisibility = () => updatePlayback(!document.hidden && gallery.getBoundingClientRect().top < window.innerHeight);

    observer.observe(gallery);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      updatePlayback(false);
    };
  }, [motionAllowed]);

  if (playableVideoIds.length === 0) return null;

  return (
    <div ref={galleryRef} className="home-moments-gallery" aria-label="Moments vécus dans le makerspace MakerLab">
      <div className="home-moments-grid">
        {moments.map((moment, index) => {
          const videoId = playableVideoIds[index % playableVideoIds.length];
          const src = `https://www.youtube-nocookie.com/embed/${videoId}?start=${moment.start}&autoplay=${motionAllowed ? 1 : 0}&mute=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;

          return (
            <figure key={moment.label} className={`home-moment home-moment-${index + 1}`}>
              <iframe
                ref={frame => { frameRefs.current[index] = frame; }}
                src={src}
                title={`Moment MakerLab : ${moment.label}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="home-moment-player"
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                tabIndex={-1}
                aria-hidden="true"
              />
              <div className="home-moment-shade" aria-hidden="true" />
              <figcaption className="home-moment-caption">
                <span className="home-moment-step">{moment.step}</span>
                <span>
                  <strong>{moment.label}</strong>
                  <small>{moment.detail}</small>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="home-moments-proof">
        <span className="home-moments-live"><i aria-hidden="true" /> En ce moment au Lab</span>
        <p>Des ateliers vécus. Des essais, des déclics et des projets que les enfants peuvent vraiment raconter.</p>
      </div>
    </div>
  );
};
