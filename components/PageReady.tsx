import React from 'react';
import { ChevronDown } from 'lucide-react';
import { AppContainer } from './AppStyle';
import { Reveal } from './Motion';

export type FAQItem = {
  question: string;
  answer: string;
};

export const FAQSection: React.FC<{
  eyebrow?: string;
  title?: string;
  items: FAQItem[];
  contained?: boolean;
}> = ({
  eyebrow = 'Questions fréquentes',
  title = 'Les réponses avant de vous décider.',
  items,
  contained = false,
}) => {
  const content = (
    <Reveal>
      <section className="py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="max-w-md">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-orange">{eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-black leading-[1.05] md:text-5xl">{title}</h2>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            {items.map(item => (
              <details key={item.question} className="group border-b border-slate-100 last:border-b-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 font-black md:px-6">
                  <span>{item.question}</span>
                  <ChevronDown className="shrink-0 text-brand-blue transition-transform duration-200 group-open:rotate-180" size={20} />
                </summary>
                <p className="max-w-2xl px-5 pb-5 text-sm font-semibold leading-7 text-slate-500 md:px-6">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );

  return contained ? <AppContainer>{content}</AppContainer> : content;
};
