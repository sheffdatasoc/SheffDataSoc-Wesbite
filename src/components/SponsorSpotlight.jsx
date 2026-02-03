import React from 'react';
import { ExternalLink } from 'lucide-react';
import './SponsorSpotlight.css';

const SponsorSpotlight = ({ sponsor, onClose, arrowOffset }) => {
    if (!sponsor) return null;

    return (
        <section className="sponsor-spotlight visible">
            <div
                className="spotlight-arrow"
                style={{ left: arrowOffset || '50%' }}
            ></div>
            <div className="spotlight-container">
                <button className="spotlight-close" onClick={onClose}>×</button>
                <div className="spotlight-badge" style={{ color: '#EBB479', fontWeight: 'bold' }}>
                    <span>Platinum Sponsor Spotlight</span>
                </div>

                <div className="spotlight-content">
                    <div className="spotlight-left">
                        <div className="spotlight-logo-wrapper">
                            <img src={sponsor.logo} alt={sponsor.name} className="spotlight-logo" />
                        </div>
                        <h2 className="spotlight-name" style={{ color: '#182F4D' }}>{sponsor.name}</h2>
                        {sponsor.cta_link && (
                            <a
                                href={sponsor.cta_link.trim()}
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
                            <h3 style={{ color: '#182F4D' }}>About {sponsor.name}</h3>
                            <p style={{ color: '#4a5568' }}>{sponsor.about_blurb || 'More information about our platinum sponsor is coming soon.'}</p>
                        </div>

                        <div className="spotlight-block">
                            <h3 style={{ color: '#182F4D' }}>Why They Sponsor Datasoc</h3>
                            <p style={{ color: '#4a5568' }}>{sponsor.why_sponsor || 'Statement on data science sponsorship is coming soon.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SponsorSpotlight;
