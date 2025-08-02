import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';

interface ModuleData {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  videoUrl: string;
  arContent: {
    model: string;
    instructions: string;
  };
  steps: Array<{
    id: number;
    title: string;
    content: string;
    videoTimestamp: string;
    arTrigger: string;
  }>;
}

interface UserProgress {
  courses: {
    [key: string]: {
      steps: Array<{
        id: number;
        title: string;
        completed: boolean;
      }>;
    };
  };
}

const TrainingModule: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [module, setModule] = useState<ModuleData | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showAR, setShowAR] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!moduleId) return;

      try {
        const [moduleData, progressData] = await Promise.all([
          authService.getModule(moduleId),
          authService.getProgress()
        ]);
        
        setModule(moduleData);
        setProgress(progressData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId]);

  const handleStepComplete = async (stepId: number) => {
    if (!moduleId) return;

    try {
      const response = await authService.updateProgress(moduleId, stepId.toString());
      setProgress(response.progress);
    } catch (err: any) {
      console.error('Failed to update progress:', err.message);
    }
  };

  const isStepCompleted = (stepId: number): boolean => {
    if (!progress || !moduleId) return false;
    const courseProgress = progress.courses[moduleId];
    if (!courseProgress) return false;
    
    const step = courseProgress.steps.find(s => s.id === stepId);
    return step ? step.completed : false;
  };

  if (loading) {
    return (
      <div className="training-container">
        <div style={{ textAlign: 'center', fontSize: '1.25rem', color: '#6b7280' }}>
          Loading training module...
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="training-container">
        <div style={{ 
          background: '#fee2e2', 
          color: '#dc2626', 
          padding: '1rem', 
          borderRadius: '0.5rem' 
        }}>
          Error: {error || 'Module not found'}
        </div>
        <Link to="/dashboard" className="btn btn-primary mt-2">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="training-container">
      {/* Module Header */}
      <div className="module-header">
        <h1 className="module-title">{module.title}</h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '1rem' }}>
          {module.description}
        </p>
        <div className="module-meta">
          <span>⏱️ Duration: {module.duration}</span>
          <span>📊 Level: {module.difficulty}</span>
          <span>🎯 {module.steps.length} Steps</span>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/dashboard" className="btn btn-outline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Video Section */}
      <div className="video-section">
        <div className="video-placeholder">
          🎥 Training Video: {module.title}
          <div style={{ fontSize: '1rem', marginTop: '1rem', opacity: 0.7 }}>
            In a real implementation, this would be an embedded video player
            <br />
            Video URL: {module.videoUrl}
          </div>
        </div>
      </div>

      {/* AR Section */}
      <div className="ar-section">
        <h2 className="ar-title">🥽 Augmented Reality Experience</h2>
        <p className="ar-description">
          {module.arContent.instructions}
        </p>
        
        <div className="ar-placeholder">
          {showAR ? (
            <div>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                🔧 AR Model Active: {module.arContent.model}
              </div>
              <p>
                Simulated AR overlay showing welding technique visualization.
                In a real app, this would show 3D models, safety zones, and interactive guides.
              </p>
              <button 
                onClick={() => setShowAR(false)}
                className="btn btn-outline mt-2"
              >
                Stop AR View
              </button>
            </div>
          ) : (
            <div>
              <p>Click to activate AR visualization for hands-on guidance</p>
              <button 
                onClick={() => setShowAR(true)}
                className="btn btn-primary mt-2"
              >
                🥽 Activate AR View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Steps Section */}
      <div className="steps-section">
        <h2 className="steps-title">Step-by-Step Instructions</h2>
        
        {module.steps.map((step) => {
          const completed = isStepCompleted(step.id);
          const isActive = activeStep === step.id;
          
          return (
            <div 
              key={step.id} 
              className={`step ${completed ? 'completed' : ''}`}
            >
              <div 
                className="step-header"
                onClick={() => setActiveStep(isActive ? null : step.id)}
              >
                <h3 className="step-title">
                  Step {step.id}: {step.title}
                </h3>
                <div className="step-status">
                  {completed && <span className="text-green">✅ Completed</span>}
                  <span>{isActive ? '▼' : '▶'}</span>
                </div>
              </div>
              
              {isActive && (
                <>
                  <div className="step-content">
                    <p>{step.content}</p>
                    
                    <div style={{ 
                      background: '#f3f4f6', 
                      padding: '1rem', 
                      borderRadius: '0.5rem', 
                      margin: '1rem 0',
                      fontSize: '0.9rem'
                    }}>
                      <strong>Video Section:</strong> {step.videoTimestamp}<br />
                      <strong>AR Trigger:</strong> {step.arTrigger}
                    </div>
                  </div>
                  
                  <div className="step-actions">
                    {!completed ? (
                      <button 
                        onClick={() => handleStepComplete(step.id)}
                        className="btn btn-success"
                      >
                        Mark as Complete
                      </button>
                    ) : (
                      <div className="text-green">
                        ✅ This step has been completed
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Course Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '3rem',
        padding: '2rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
      }}>
        <Link to="/dashboard" className="btn btn-outline">
          ← Back to Dashboard
        </Link>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
            Progress: {module.steps.filter(step => isStepCompleted(step.id)).length}/{module.steps.length} steps
          </div>
          <div className="progress-bar" style={{ width: '200px' }}>
            <div 
              className="progress-fill" 
              style={{ 
                width: `${(module.steps.filter(step => isStepCompleted(step.id)).length / module.steps.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={() => {
            const nextStep = module.steps.find(step => !isStepCompleted(step.id));
            if (nextStep) {
              setActiveStep(nextStep.id);
            }
          }}
        >
          {module.steps.every(step => isStepCompleted(step.id)) ? 'Course Complete!' : 'Next Step →'}
        </button>
      </div>
    </div>
  );
};

export default TrainingModule;