import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            AI-Powered Vocational Training
          </h1>
          <p className="hero-subtitle">
            Master skilled trades with cutting-edge AI guidance, AR visualization, and personalized learning paths
          </p>
          <div className="mt-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary">
                  Start Learning Today
                </Link>
                <Link to="/login" className="btn btn-outline" style={{ marginLeft: '1rem' }}>
                  Already a Member?
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="text-center">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Revolutionary Learning Experience
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '800px', margin: '0 auto' }}>
              Combine traditional craftsmanship with modern technology to accelerate your learning and ensure industry-ready skills
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI-Powered Guidance</h3>
              <p className="feature-description">
                Get real-time feedback from our advanced AI that analyzes your technique and provides personalized recommendations for improvement.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🥽</div>
              <h3 className="feature-title">Augmented Reality Training</h3>
              <p className="feature-description">
                Visualize complex procedures with AR overlays that show proper techniques, safety zones, and step-by-step instructions in real-time.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3 className="feature-title">Comprehensive Courses</h3>
              <p className="feature-description">
                Access structured learning paths covering welding, plumbing, electrical work, and more - all designed by industry experts.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">Progress Tracking</h3>
              <p className="feature-description">
                Monitor your skill development with detailed analytics, competency assessments, and industry-standard certifications.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Hands-On Practice</h3>
              <p className="feature-description">
                Learn by doing with guided practice sessions that simulate real-world scenarios and workplace conditions.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3 className="feature-title">Industry Recognition</h3>
              <p className="feature-description">
                Earn certificates and credentials recognized by top employers and industry associations nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'white' }}>
        <div className="container">
          <div className="text-center mb-3">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
              Three simple steps to start your vocational training journey
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }}>1</div>
              <h3 className="feature-title">Choose Your Path</h3>
              <p className="feature-description">
                Select from our comprehensive catalog of vocational training programs tailored to in-demand skills.
              </p>
            </div>

            <div className="feature-card">
              <div style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }}>2</div>
              <h3 className="feature-title">Learn with AI & AR</h3>
              <p className="feature-description">
                Engage with interactive lessons featuring AI feedback and AR visualization for immersive learning.
              </p>
            </div>

            <div className="feature-card">
              <div style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }}>3</div>
              <h3 className="feature-title">Get Certified</h3>
              <p className="feature-description">
                Complete assessments and earn industry-recognized certifications to advance your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero">
        <div className="container text-center">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Ready to Transform Your Career?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
            Join thousands of learners who are mastering skilled trades with AI-powered training
          </p>
          {!isAuthenticated && (
            <Link to="/signup" className="btn btn-success" style={{ fontSize: '1.25rem', padding: '1rem 2rem' }}>
              Start Your Free Trial
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;