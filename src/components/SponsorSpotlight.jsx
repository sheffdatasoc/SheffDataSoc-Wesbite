import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import './SponsorSpotlight.css';

const SponsorSpotlight = ({ sponsor }) => {
    if (!sponsor) return null;

    return (
        <section className="sponsor-spotlight">
            <div className="spotlight-container">
                <div className="spotlight-badge">
                    <Sparkles size={16} />
                    <span>Platinum Sponsor Spotlight</span>
                </div>

                <div className="spotlight-content">
                    <div className="spotlight-left">
                        <div className="spotlight-logo-wrapper">
                            <img src={sponsor.logo} alt={sponsor.name} className="spotlight-logo" />
                        </div>
                        <h2 className="spotlight-name">{sponsor.name}</h2>
                        {sponsor.cta_link && (
                            <a
                                href={sponsor.cta_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="spotlight-cta"
                            >
                                Visit {sponsor.name} <ExternalLink size={16} />
                            </a>
                        )}
                    </div>

                    <div className="spotlight-right">
                        <div className="spotlight-block">
                            <h3>About {sponsor.name}</h3>
                            <p>{sponsor.about_blurb}</p>
                        </div>

                        <div className="spotlight-block">
                            <h3>Why They Sponsor Data Science</h3>
                            <p>{sponsor.why_sponsor}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SponsorSpotlight;
