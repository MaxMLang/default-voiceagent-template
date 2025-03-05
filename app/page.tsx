"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Visualizer from "@/components/visualizer";
import Orb from "@/components/orb";

// Configuration for pages
const pageConfig = {
  welcome: {
    enabled: true,
    order: 1,
    title: "Welcome to Interview Assistant",
    content: "Before we begin, please review the information below and provide your consent.",
    consentText: "I agree to participate in this interview and understand how my data will be used.",
  },
  interview: {
    enabled: true,
    order: 2,
    title: "Interview Assistant",
    content: "Welcome to the Interview Assistant. This tool helps conduct interviews using AI technology. The system will ask questions and engage in conversation to gather insights. Please respond naturally and honestly to the questions.",
  },
  survey: {
    enabled: true, // Set to false to disable the survey page
    order: 3,
    title: "Post-Interview Survey",
    content: "Please take a moment to complete this short survey about your experience.",
    submitButtonText: "Submit Survey",
  },
  thankYou: {
    enabled: true,
    order: 4, // Updated order to come after the survey
    title: "Thank You",
    content: "Thank you for completing the interview and survey. Your responses have been recorded.",
    additionalInfo: "You may close this window now or you will be redirected shortly.",
  }
};

// Set this to 'orb' or 'visualizer' to switch between components
const ACTIVE_COMPONENT = 'visualizer';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [surveyResponses, setSurveyResponses] = useState({
    satisfaction: "",
    feedback: "",
    improvements: ""
  });
  
  // Determine the first enabled page on initial load
  useEffect(() => {
    if (currentPage === null) {
      const enabledPages = Object.entries(pageConfig)
        .filter(([_, config]) => config.enabled)
        .sort((a, b) => a[1].order - b[1].order);
      
      if (enabledPages.length > 0) {
        setCurrentPage(enabledPages[0][0]);
      }
    }
  }, [currentPage]);

  // Function to move to the next page
  const goToNextPage = () => {
    const enabledPages = Object.entries(pageConfig)
      .filter(([_, config]) => config.enabled)
      .sort((a, b) => a[1].order - b[1].order)
      .map(([key]) => key);
    
    const currentIndex = enabledPages.indexOf(currentPage as string);
    if (currentIndex < enabledPages.length - 1) {
      setCurrentPage(enabledPages[currentIndex + 1]);
    }
  };

  // Handle complete interview click
  const handleCompleteClick = () => {
    setShowConfirmation(true);
  };

  // Handle survey input changes
  const handleSurveyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSurveyResponses(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle survey submission
  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the survey data to your backend
    console.log("Survey responses:", surveyResponses);
    // Move to the thank you page
    goToNextPage();
  };

  // Confirmation dialog component
  const ConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Interview</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to complete the interview? You won&apos;t be able to return to this conversation.</p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={() => setShowConfirmation(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            No, continue
          </button>
          <button 
            onClick={() => {
              setShowConfirmation(false);
              goToNextPage();
            }}
            className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Yes, complete
          </button>
        </div>
      </div>
    </div>
  );

  // Render welcome page with consent
  const renderWelcomePage = () => (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{pageConfig.welcome.title}</h2>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-700">{pageConfig.welcome.content}</p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={consentGiven} 
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="h-5 w-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
          />
          <span className="text-gray-700">{pageConfig.welcome.consentText}</span>
        </label>
      </div>
      
      <button 
        className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
          consentGiven 
            ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' 
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!consentGiven}
        onClick={goToNextPage}
      >
        Continue
      </button>
    </div>
  );

  // Render interview page
  const renderInterviewPage = () => (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{pageConfig.interview.title}</h2>
      <p className="text-gray-600 mb-6">{pageConfig.interview.content}</p>
      
      <div className="mt-6">
        {ACTIVE_COMPONENT === 'visualizer' ? <Visualizer /> : <Orb />}
      </div>
      
      <div className="mt-8 flex justify-center items-center">
        <button 
          onClick={handleCompleteClick}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Complete Interview
        </button>
      </div>
      
      {showConfirmation && <ConfirmationDialog />}
    </div>
  );

  // Render survey page
  const renderSurveyPage = () => (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{pageConfig.survey.title}</h2>
      <p className="text-gray-600 mb-6">{pageConfig.survey.content}</p>
      
      <form onSubmit={handleSurveySubmit} className="space-y-6">
        {/* Satisfaction Rating */}
        <div>
          <label htmlFor="satisfaction" className="block text-sm font-medium text-gray-700 mb-1">
            How would you rate your overall experience?
          </label>
          <select
            id="satisfaction"
            name="satisfaction"
            value={surveyResponses.satisfaction}
            onChange={handleSurveyChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            required
          >
            <option value="" disabled>Please select an option</option>
            <option value="5">Excellent (5)</option>
            <option value="4">Very Good (4)</option>
            <option value="3">Good (3)</option>
            <option value="2">Fair (2)</option>
            <option value="1">Poor (1)</option>
          </select>
        </div>
        
        {/* Feedback */}
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
            What aspects of the interview did you find most helpful?
          </label>
          <textarea
            id="feedback"
            name="feedback"
            rows={3}
            value={surveyResponses.feedback}
            onChange={handleSurveyChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            placeholder="Please share your thoughts..."
          />
        </div>
        
        {/* Improvements */}
        <div>
          <label htmlFor="improvements" className="block text-sm font-medium text-gray-700 mb-1">
            How could we improve the interview experience?
          </label>
          <textarea
            id="improvements"
            name="improvements"
            rows={3}
            value={surveyResponses.improvements}
            onChange={handleSurveyChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            placeholder="Please share any suggestions for improvement..."
          />
        </div>
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {pageConfig.survey.submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );

  // Render thank you page
  const renderThankYouPage = () => (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center">
      <div className="mb-6">
        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{pageConfig.thankYou.title}</h2>
      <p className="text-gray-600 mb-4">{pageConfig.thankYou.content}</p>
      <p className="text-sm text-gray-500">{pageConfig.thankYou.additionalInfo}</p>
    </div>
  );

  // Render the current page based on state
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'welcome':
        return renderWelcomePage();
      case 'interview':
        return renderInterviewPage();
      case 'survey':
        return renderSurveyPage();
      case 'thankYou':
        return renderThankYouPage();
      default:
        return (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        );
    }
  };

  // Progress indicator
  const renderProgressIndicator = () => {
    if (!currentPage) return null;
    
    const enabledPages = Object.entries(pageConfig)
      .filter(([_, config]) => config.enabled)
      .sort((a, b) => a[1].order - b[1].order)
      .map(([key]) => key);
    
    const currentIndex = enabledPages.indexOf(currentPage);
    const totalSteps = enabledPages.length;
    
    return (
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between mb-2">
          {enabledPages.map((page, index) => (
            <div key={page} className="flex flex-col items-center">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index < currentIndex 
                  ? 'bg-blue-600 text-white' 
                  : index === currentIndex 
                    ? 'bg-blue-100 border-2 border-blue-600 text-blue-600' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className="text-xs mt-1 text-gray-500">{pageConfig[page as keyof typeof pageConfig].title.split(' ')[0]}</span>
            </div>
          ))}
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div style={{ width: `${(currentIndex / (totalSteps - 1)) * 100}%` }} 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500">
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      {renderProgressIndicator()}
      {renderCurrentPage()}
    </main>
  );
}
