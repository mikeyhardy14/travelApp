"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Create.module.css';
import TravelSearchEngine from '../components/TravelSearchEngine'; // Import your TravelSearchEngine component

type Person = {
  name: string;
  avatarUrl?: string | null;
};

type Step = {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
  multiple?: boolean;
};

const CreatePage: React.FC = () => {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    travelMode: 'train',  // default selection
    startDestination: '',
    stopDestination: '',
    travelDate: '',
    travelReturnDate: '',
    names: [] as Person[],
    profileAvatarUrl: '',
    accommodations: '',
    restaurants: '',
    activities: '',
    mediaUrls: '',
    initialComment: '',
  });

  const steps: Step[] = [
    { name: 'travel', label: 'Travel', placeholder: 'Select mode, route and dates', required: true },
    { name: 'names', label: 'Names', placeholder: 'Enter a name', required: true, multiple: true },
    { name: 'profileAvatarUrl', label: 'Avatar', placeholder: 'Profile Avatar URL', required: true },
    { name: 'accommodations', label: 'Accommodations', placeholder: 'Accommodations' },
    { name: 'restaurants', label: 'Restaurants', placeholder: 'Restaurants (comma-separated)' },
    { name: 'activities', label: 'Activities', placeholder: 'Activities (comma-separated)' },
    { name: 'mediaUrls', label: 'Videos', placeholder: 'Videos (comma-separated)' },
    { name: 'initialComment', label: 'Comment', placeholder: 'Initial Comment', textarea: true }
  ];

  const summaryStepIndex = steps.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    if (searchParams) {
      setFormData({
        travelMode: 'train',
        startDestination: '',
        stopDestination: '',
        travelDate: '',
        travelReturnDate: '',
        names: [],
        profileAvatarUrl: searchParams.get('profileAvatarUrl') || '',
        accommodations: searchParams.get('accommodations') || '',
        restaurants: searchParams.get('restaurants') || '',
        activities: searchParams.get('activities') || '',
        mediaUrls: searchParams.get('mediaUrls') || '',
        initialComment: '',
      });
    }
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setAllUsers(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name !== 'names') {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
  const currentField: Step | null = isSummary ? null : steps[currentStep];

  const matchedUsers = nameInput.trim() === ''
    ? []
    : allUsers.filter((user: any) => user.name.toLowerCase().includes(nameInput.trim().toLowerCase()));

  const addName = (nameToAdd: string, avatarUrl?: string | null) => {
    if (nameToAdd.trim() !== '') {
      setFormData((prev) => ({ ...prev, names: [...prev.names, { name: nameToAdd.trim(), avatarUrl: avatarUrl || null }] }));
      setNameInput('');
    }
  };

  const removeName = (index: number) => {
    setFormData((prev) => {
      const newNames = [...prev.names];
      newNames.splice(index, 1);
      return { ...prev, names: newNames };
    });
  };

  // Callback to update travel data from TravelSearchEngine
  const handleTravelChange = (data: {
    travelMode: string;
    startDestination: string;
    stopDestination: string;
    travelDate: string;
    travelReturnDate: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      travelMode: data.travelMode,
      startDestination: data.startDestination,
      stopDestination: data.stopDestination,
      travelDate: data.travelDate,
      travelReturnDate: data.travelReturnDate,
    }));
  };

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
                <li><strong>Travel Mode:</strong> {formData.travelMode}</li>
                <li><strong>From:</strong> {formData.startDestination}</li>
                <li><strong>To:</strong> {formData.stopDestination}</li>
                <li><strong>Leave Date:</strong> {formData.travelDate}</li>
                <li><strong>Return Date:</strong> {formData.travelReturnDate}</li>
                <li><strong>Names:</strong> 
                  <ul>
                    {formData.names.map((person, idx) => (
                      <li key={idx} style={{display:'flex', alignItems: 'center', gap:'10px'}}>
                        {person.avatarUrl && <img src={person.avatarUrl} alt={person.name} style={{width:'30px', height:'30px', borderRadius:'50%'}} />}
                        <span>{person.name}</span>
                      </li>
                    ))}
                  </ul>
                </li>
                <li><strong>Avatar URL:</strong> {formData.profileAvatarUrl}</li>
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
                {currentField && currentField.name === 'travel' ? (
                  <TravelSearchEngine
                    travelData={{
                      travelMode: formData.travelMode,
                      startDestination: formData.startDestination,
                      stopDestination: formData.stopDestination,
                      travelDate: formData.travelDate,
                      travelReturnDate: formData.travelReturnDate
                    }}
                    onTravelChange={handleTravelChange}
                  />
                ) : currentField && currentField.name === 'names' ? (
                  // Names step logic remains the same
                  <div>
                    <input
                      type="text"
                      placeholder={currentField.placeholder}
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required={!!currentField.required}
                      className={styles.input}
                    />

                    {nameInput.trim() !== '' && matchedUsers.length === 0 && (
                      <p>No users found for "{nameInput.trim()}". You can still add this name.</p>
                    )}

                    {matchedUsers.length > 0 && (
                      <ul style={{ marginTop: '10px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', maxHeight: '100px', overflowY: 'auto' }}>
                        {matchedUsers.map((user: any) => (
                          <li key={user.id} style={{marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                              <img src={user.avatarUrl} alt={user.name} style={{width:'30px', height:'30px', borderRadius:'50%'}} />
                              <span>{user.name}</span>
                            </div>
                            <button type="button" className={styles.button} onClick={() => addName(user.name, user.avatarUrl)}>
                              Add Name
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <button type="button" onClick={() => addName(nameInput)} className={styles.button} style={{marginTop: '10px'}}>
                      Add Name As Entered
                    </button>

                    <ul style={{marginTop: '10px'}}>
                      {formData.names.map((person, idx) => (
                        <li key={idx} style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'5px'}}>
                          {person.avatarUrl && <img src={person.avatarUrl} alt={person.name} style={{width:'30px', height:'30px', borderRadius:'50%'}} />}
                          <span>{person.name}</span>
                          <button type="button" className={styles.button} style={{background:'red'}} onClick={() => removeName(idx)}>Remove</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : currentField && currentField.textarea ? (
                  <textarea
                    name={currentField.name}
                    placeholder={currentField.placeholder}
                    value={formData[currentField.name as keyof typeof formData] as string}
                    onChange={handleChange}
                    required={!!currentField.required}
                    className={styles.textarea}
                  />
                ) : currentField ? (
                  <input
                    type="text"
                    name={currentField.name}
                    placeholder={currentField.placeholder}
                    value={formData[currentField.name as keyof typeof formData] as string}
                    onChange={handleChange}
                    required={!!currentField.required}
                    className={styles.input}
                  />
                ) : null}

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
