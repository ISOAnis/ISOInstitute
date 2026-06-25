import * as React from 'react';
import { SplashNavigation } from './SplashNavigation';
import { SplashFooter } from './SplashFooter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { FAQ_PATHWAYS, FAQ_SECTIONS } from '../data/faqContent';
import '../styles/about.css';
import '../styles/faq.css';

interface FAQPageProps {
  onBack?: () => void;
  onWaitlistClick?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToFAQ?: () => void;
}

function PathwaysAnswer() {
  return (
    <div>
      <p className="faq-pathway-intro">The six pathways are:</p>
      <div className="faq-pathway-list">
        {FAQ_PATHWAYS.map((pathway) => (
          <div
            key={pathway.name}
            className="faq-pathway-row"
            style={{ '--pathway-accent': pathway.accent } as React.CSSProperties}
          >
            <span className="faq-pathway-name">{pathway.name}</span>
            <span className="faq-pathway-domain">{pathway.domain}</span>
          </div>
        ))}
      </div>
      <p className="faq-pathway-outro">
        Each pathway has its own coaches, skill trees, and community of players who are building in
        that space.
      </p>
    </div>
  );
}

export function FAQPage({ onBack, onWaitlistClick, onNavigateToAbout, onNavigateToFAQ }: FAQPageProps) {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="about-splash">
      <div className="about-splash-bg" aria-hidden="true">
        <div className="about-splash-bg-vignette" />
        <div className="about-splash-bg-glow" />
      </div>

      <SplashNavigation mode={onBack ? 'about' : 'splash'} onBack={onBack} />

      <div className="faq-splash-content">
        <header className="faq-hero">
          <h1 className="faq-hero-title">Frequently Asked Questions</h1>
          <p className="faq-hero-sub">
            Everything you need to know about ISO, the Institute, and The Assist.
          </p>
        </header>

        <nav className="faq-nav" aria-label="FAQ sections">
          {FAQ_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className="faq-nav-link"
              onClick={() => scrollToSection(section.id)}
            >
              {section.title}
            </button>
          ))}
        </nav>

        {FAQ_SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="faq-section">
            <h2 className="faq-section-title">{section.title}</h2>
            <Accordion type="single" collapsible className="faq-accordion">
              {section.items.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="faq-accordion-item border-b-0"
                >
                  <AccordionTrigger className="faq-accordion-trigger">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="faq-accordion-content">
                    {item.variant === 'pathways' ? <PathwaysAnswer /> : item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}

        <section className="faq-close">
          <p className="faq-close-text">Still have questions? Reach out on Instagram @isoinstitute.</p>
          {onWaitlistClick && (
            <>
              <button type="button" className="about-close-btn" onClick={onWaitlistClick}>
                Join the Waitlist
              </button>
              <div className="about-close-sub">Early Access</div>
            </>
          )}
        </section>
      </div>

      <SplashFooter
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToFAQ={onNavigateToFAQ}
        onWaitlistClick={onWaitlistClick}
      />
    </div>
  );
}
