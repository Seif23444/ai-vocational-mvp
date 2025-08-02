import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

interface ProgressData {
  completedModules: string[];
  currentModule: string | null;
  totalProgress: number;
  courses: {
    [key: string]: {
      title: string;
      progress: number;
      completed: boolean;
      steps: Array<{
        id: number;
        title: string;
        completed: boolean;
      }>;
    };
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressData = await authService.getProgress();
        setProgress(progressData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <div style={{ 
          background: '#fee2e2', 
          color: '#dc2626', 
          padding: '1rem', 
          borderRadius: '0.5rem' 
        }}>
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  const totalCourses = progress ? Object.keys(progress.courses).length : 0;
  const completedCourses = progress ? progress.completedModules.length : 0;
  const overallProgress = progress ? progress.totalProgress : 0;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Welcome Header */}
      <div className="dashboard-header">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          Welcome back, {user?.name}!
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
          Continue your vocational training journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{overallProgress}%</div>
          <div className="stat-label">Overall Progress</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{completedCourses}</div>
          <div className="stat-label">Courses Completed</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{totalCourses}</div>
          <div className="stat-label">Total Courses</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">
            {progress && progress.courses['welding-101'] 
              ? progress.courses['welding-101'].steps.filter(s => s.completed).length 
              : 0}
          </div>
          <div className="stat-label">Steps Completed</div>
        </div>
      </div>

      {/* Current Progress */}
      {progress && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Your Progress</h2>
            <p className="card-subtitle">Track your learning journey</p>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>Overall Progress</span>
              <span style={{ color: '#6b7280' }}>{overallProgress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Available Courses */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>
          Your Courses
        </h2>
        
        <div className="courses-grid">
          {progress && Object.entries(progress.courses).map(([courseId, course]) => (
            <div key={courseId} className="course-card">
              <div className="course-header">
                <div>
                  <h3 className="course-title">{course.title}</h3>
                  <div className="course-meta">
                    {course.completed ? (
                      <span>✅ Completed</span>
                    ) : (
                      <span>{course.progress}% Complete</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="course-body">
                <p className="course-description">
                  Learn the fundamentals of welding with AI-powered guidance and AR visualization. 
                  Perfect for beginners looking to master this essential trade skill.
                </p>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Progress</span>
                    <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>{course.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>
                    Steps ({course.steps.filter(s => s.completed).length}/{course.steps.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {course.steps.map((step) => (
                      <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: step.completed ? '#10b981' : '#d1d5db' }}>
                          {step.completed ? '✅' : '⭕'}
                        </span>
                        <span style={{ 
                          color: step.completed ? '#374151' : '#9ca3af',
                          fontSize: '0.9rem' 
                        }}>
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link 
                  to={`/training/${courseId}`} 
                  className="btn btn-primary btn-full"
                >
                  {course.completed ? 'Review Course' : 'Continue Learning'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Coming Soon</h2>
          <p className="card-subtitle">More courses are being developed</p>
        </div>
        
        <div className="courses-grid">
          <div style={{ 
            background: '#f9fafb', 
            border: '2px dashed #d1d5db', 
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔧</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              Plumbing Fundamentals
            </h3>
            <p>Learn pipe installation, repair techniques, and plumbing systems</p>
          </div>

          <div style={{ 
            background: '#f9fafb', 
            border: '2px dashed #d1d5db', 
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              Electrical Basics
            </h3>
            <p>Master electrical wiring, safety protocols, and circuit design</p>
          </div>

          <div style={{ 
            background: '#f9fafb', 
            border: '2px dashed #d1d5db', 
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏗️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              Construction Skills
            </h3>
            <p>Learn carpentry, framing, and general construction techniques</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;