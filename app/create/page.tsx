"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Create.module.css';

type Step = {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
};

const CreatePage: React.FC = () => {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    title: '',
    profileName: '',
    profileAvatarUrl: '',
    flights: '',
    accommodations: '',
    restaurants: '',
    activities: '',
    mediaUrls: '',
    initialComment: '',
  });

  const steps: Step[] = [
    { name: 'title', label: 'Title', placeholder: 'Itinerary Title', required: true },
    { name: 'profileName', label: 'Name', placeholder: 'Your Name', required: true },
    { name: 'profileAvatarUrl', label: 'Avatar', placeholder: 'Profile Avatar URL', required: true },
    { name: 'flights', label: 'Flights', placeholder: 'Flights (comma-separated)' },
    { name: 'accommodations', label: 'Accommodations', placeholder: 'Accommodations' },
    { name: 'restaurants', label: 'Restaurants', placeholder: 'Restaurants (comma-separated)' },
    { name: 'activities', label: 'Activities', placeholder: 'Activities (comma-separated)' },
    { name: 'mediaUrls', label: 'Videos', placeholder: 'Videos (comma-separated)' },
    { name: 'initialComment', label: 'Comment', placeholder: 'Initial Comment', textarea: true },
  ];

  const summaryStepIndex = steps.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (searchParams) {
      setFormData({
        title: searchParams.get('title') || '',
        profileName: searchParams.get('profileName') || '',
        profileAvatarUrl: searchParams.get('profileAvatarUrl') || '',
        flights: searchParams.get('flights') || '',
        accommodations: searchParams.get('accommodations') || '',
        restaurants: searchParams.get('restaurants') || '',
        activities: searchParams.get('activities') || '',
        mediaUrls: searchParams.get('mediaUrls') || '',
        initialComment: '',
      });
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const goToStep = (stepIndex: number) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(stepIndex);
      setAnimating(false);
    }, 500);
  };

  const goToNextStep = () => {
    goToStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    goToStep(currentStep - 1);
  };

  const handleFinalSubmit = async () => {
    const newItinerary = {
      ...formData,
      flights: formData.flights.split(',').map((f) => f.trim()).filter(Boolean),
      restaurants: formData.restaurants.split(',').map((r) => r.trim()).filter(Boolean),
      activities: formData.activities.split(',').map((a) => a.trim()).filter(Boolean),
      media: formData.mediaUrls.split(',').map((url) => ({ url: url.trim(), type: 'image' })).filter((m) => m.url !== ''),
      comments: formData.initialComment ? [{ text: formData.initialComment }] : [],
    };

    const response = await fetch('/api/itineraries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItinerary),
    });

    if (response.ok) {
      setSubmitted(true);
    } else {
      alert('Failed to create itinerary. Please try again.');
    }
  };

  const isSummary = currentStep === summaryStepIndex;

  // Use a ternary to ensure currentField is either a step or null
  const currentField: Step | null = isSummary ? null : steps[currentStep];

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2>Steps</h2>
        <ul className={styles.navList}>
          {steps.map((s, i) => (
            <li 
              key={s.name}
              onClick={() => !submitted && goToStep(i)}
              className={`${styles.navItem} ${!isSummary && i === currentStep ? styles.navItemActive : ''}`}>
              {s.label}
            </li>
          ))}
          <li
            onClick={() => !submitted && goToStep(summaryStepIndex)}
            className={`${styles.navItem} ${isSummary && !submitted ? styles.navItemActive : ''}`}
          >
            Summary
          </li>
        </ul>
      </div>

      <div className={styles.main}>
        <h1 className={styles.h1}>Create a New Itinerary</h1>
        <div className={styles.cardWrapper}>
          {isSummary ? (
            <div className={`${styles.card} ${animating ? styles.fadeOut : ''} ${styles.summaryCard}`}>
              {submitted && (
                <div className={styles.successMessage}>
                  Itinerary created successfully!
                </div>
              )}
              <h2>Summary</h2>
              <ul className={styles.summaryList}>
                <li><strong>Title:</strong> {formData.title}</li>
                <li><strong>Name:</strong> {formData.profileName}</li>
                <li><strong>Avatar URL:</strong> {formData.profileAvatarUrl}</li>
                <li><strong>Flights:</strong> {formData.flights}</li>
                <li><strong>Accommodations:</strong> {formData.accommodations}</li>
                <li><strong>Restaurants:</strong> {formData.restaurants}</li>
                <li><strong>Activities:</strong> {formData.activities}</li>
                <li><strong>Videos:</strong> {formData.mediaUrls}</li>
                <li><strong>Initial Comment:</strong> {formData.initialComment}</li>
              </ul>

              {!submitted && (
                <div className={styles.navigation}>
                  {summaryStepIndex > 0 && (
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className={styles.button}
                      disabled={animating}
                    >
                      Previous
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className={styles.button}
                    disabled={animating}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={`${styles.card} ${animating ? styles.fadeOut : ''}`}>
              <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                {currentField && (currentField.textarea ? (
                  <textarea
                    name={currentField.name}
                    placeholder={currentField.placeholder}
                    value={formData[currentField.name as keyof typeof formData] as string}
                    onChange={handleChange}
                    required={!!currentField.required}
                    className={styles.textarea}
                  />
                ) : (
                  <input
                    type="text"
                    name={currentField.name}
                    placeholder={currentField.placeholder}
                    value={formData[currentField.name as keyof typeof formData] as string}
                    onChange={handleChange}
                    required={!!currentField.required}
                    className={styles.input}
                  />
                ))}

                <div className={styles.navigation}>
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className={styles.button}
                      disabled={animating}
                    >
                      Previous
                    </button>
                  )}

                  {currentStep < steps.length - 1 && (
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className={styles.button}
                      disabled={animating}
                    >
                      Next
                    </button>
                  )}

                  {currentStep === steps.length - 1 && (
                    <button
                      type="button"
                      onClick={() => goToStep(summaryStepIndex)}
                      className={styles.button}
                      disabled={animating}
                    >
                      Next
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
