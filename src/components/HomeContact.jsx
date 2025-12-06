import React from 'react';
import './HomeContact.css';

function HomeContact() {
return ( <section className="home-contact"> <div className="contact-content"> <h2>Contact Us</h2> <p>Reach out if you want to join or collaborate!</p> <div className="contact-buttons"> <a
         href="https://su.sheffield.ac.uk/activities/view/data-science-society?activity=541"
         target="_blank"
         rel="noopener noreferrer"
         className="join-button"
       >
Join Now </a> <a
         href="https://mail.google.com/mail/?view=cm&fs=1&to=datascience@sheffield.ac.uk"
         target="_blank"
         rel="noopener noreferrer"
         className="contact-button"
       >
Contact Us </a> </div> </div> </section>
);
}

export default HomeContact;





