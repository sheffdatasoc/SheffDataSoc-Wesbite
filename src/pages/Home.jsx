import Hero from '../components/Hero';
import './Home.css';
import Footer from '../components/Footer'; 


function Home() {
  const stats = [
    { value: '300+', title: 'Members' },
    { value: '40+', title: 'Events/Year' },
    { value: '15+', title: 'Partners' }
  ];


  return (
    <div className="home-page">
      <Hero 
        title="Sheffield's Data Science Community"
        subtitle="Join SheffDataSoc - where students passionate about data, AI, and analytics come together to learn, build, and grow."
        showButtons={true}
        showStats={true}
        stats={stats}
        showBadge={true}
        badgeText="University of Sheffield"
        highlightWord="Data Science"
      />

      <section className="about-preview">
        <h2>Welcome to Sheffield Data Science Society</h2>
        <p>
          We're a community of students passionate about data science, machine learning, 
          and artificial intelligence. Join us for workshops, projects, and networking events!
        </p>
      </section>

      <section className="projects-preview">
        <h2>Our Projects</h2>
        <p>Check out some of the data science projects our members are working on.</p>
      </section>

      <section className="events-preview">
        <h2>Upcoming Events</h2>
        <p>Workshops, talks, and networking events happening soon.</p>
      </section>

      <section className="social-preview">
        <h2>Follow Us on Social Media</h2>
        <p>Stay connected and see what we’re up to!</p>
      </section>

      <section className="contact-preview">
        <div className="contact-content">
          <h2>Contact Us</h2>
          <p>Reach out if you want to join or collaborate!</p>
        </div>
        <div className="footer-content">
          <Footer />
        </div>
      </section>


    </div>
  );
}

export default Home;
