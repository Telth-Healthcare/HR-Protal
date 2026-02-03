import React, { useState } from 'react';
import telthlogo from '../../../../public/Telth Logo.png'


// Interface defining the structure of form data
interface Education {
  degree: string;
  institution: string;
  graduationYear: number | undefined;
}
interface Reference {
  name: string;
  position: string;
  company: string;
  email: string;
}



interface ApplicationFormData {
  JobID: string;
  JobTitle: string;
  CandidateName: string;
  DOB: string; // Date string in YYYY-MM-DD format
  Email: string;
  Phone: string;
  CurrentLocation: string;
  WillingToRelocate: boolean;
  ExpectedSalary: number | undefined;
  Currentsalary: string;
  NoticePeriod: string;
  YearsOfExperience: number;
  Education: Education;
  LinkedInURL: string;
  PortfolioURL: string;
  CoverLetter: string;
  ResumeURL: string;
  Skills: string[];
  References: Reference[];
  CustomAnswers: Record<string, string>;
  Notes: string;
  Source: string;
}

const ApplicationForm: React.FC = () => {
  // State to manage form data with initial empty values
  const [formData, setFormData] = useState<ApplicationFormData>({
    JobID: "",
    JobTitle: "",
    CandidateName: "",
    DOB: "",
    Email: "",
    Phone: "",
    CurrentLocation: "",
    WillingToRelocate: false,
    ExpectedSalary: undefined,
    Currentsalary: "",
    NoticePeriod: "",
    YearsOfExperience: 0,
    Education: {
      degree: "",
      institution: "",
      graduationYear: undefined,
    },
    LinkedInURL: "",
    PortfolioURL: "",
    CoverLetter: "",
    ResumeURL: "",
    Skills: [],
    References: [],
    CustomAnswers: {},
    Notes: "",
    Source: "Website",
  });

  // Temporary state for adding skills (comma-separated input)
  const [skillInput, setSkillInput] = useState("");
  // Temporary state for adding references (comma-separated input)
  const [referenceInput, setReferenceInput] = useState<Reference>({
    name: "",
    position: "",
    company: "",
    email: "",
  });

  // State for resume file upload
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  // State for drag-drop visual feedback
  const [isDragging, setIsDragging] = useState(false);
  // State for upload progress
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  // Replace with your actual backend URL
  const BACKEND_URL = 'http://192.168.1.47:8080/api/storage';
  const JOB_POST_URL = 'http://192.168.1.47:8080/api/careers';

  // Generic handler for text, number, checkbox inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // For checkboxes, use 'checked' property instead of 'value'
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    }
    // For number inputs, convert to number or undefined
    else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : Number(value)
      }));
    }
    // For text/email/tel/date/textarea inputs
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handler specifically for nested Education object fields
  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      Education: {
        ...prev.Education,
        // Convert graduationYear to number, otherwise keep as string
        [name]: name === 'graduationYear'
          ? (value === '' ? undefined : Number(value))
          : value
      }
    }));
  };

  // Convert comma-separated string to array and update Skills
  const handleSkillsAdd = () => {
    if (skillInput.trim()) {
      // Split by comma, trim whitespace, filter empty strings
      const newSkills = skillInput.split(',').map(s => s.trim()).filter(s => s);
      setFormData(prev => ({
        ...prev,
        Skills: [...prev.Skills, ...newSkills]
      }));
      setSkillInput(""); // Clear input after adding
    }
  };

  // Convert comma-separated string to array and update References (limit to 2)
  const handleReferencesAdd = () => {
    if (!referenceInput.name || !referenceInput.email) {
      alert("Name and Email are required for reference");
      return;
    }

    if (formData.References.length >= 2) {
      alert("Maximum 2 references allowed");
      return;
    }

    setFormData(prev => ({
      ...prev,
      References: [...prev.References, referenceInput],
    }));

    setReferenceInput({
      name: "",
      position: "",
      company: "",
      email: "",
    });
  };


  // Remove skill from array by index
  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      Skills: prev.Skills.filter((_, i) => i !== index)
    }));
  };

  // Remove reference from array by index
  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      References: prev.References.filter((_, i) => i !== index)
    }));
  };

  // Upload resume to SharePoint and get the web URL
  const uploadResumeToSharePoint = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      setUploadError("");

      // Step 1: Upload file to SharePoint
      const formData = new FormData();
      formData.append('resume', file);

      const uploadResponse = await fetch(`${BACKEND_URL}/upload-resume`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload resume to TelthDB');
      }

      const uploadData = await uploadResponse.json();
      const fileId = uploadData?.data?.fileId;

      if (!fileId) {
        throw new Error('No file ID returned from upload');
      }

      // Step 2: Get the web URL using the file ID
      const urlResponse = await fetch(`${BACKEND_URL}/file-url/${fileId}`);

      if (!urlResponse.ok) {
        throw new Error('Failed to get file URL from SharePoint');
      }

      const urlData = await urlResponse.json();
      const webUrl = urlData?.data?.webUrl;

      if (!webUrl) {
        throw new Error('No web URL returned');
      }

      return webUrl;
    } catch (error) {
      console.error('Error uploading to SharePoint:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file drop event
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await processFile(files[0]);
    }
  };

  // Handle drag over event (required to allow drop)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave event
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }

  // Handle file input change
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      await processFile(files[0]);
    }
  };

  // Process and upload file
  const processFile = async (file: File) => {
    // Only accept PDF, DOC, DOCX files
    if (file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {

      setResumeFile(file);

      try {
        // Upload to SharePoint and get web URL
        const webUrl = await uploadResumeToSharePoint(file);

        // Update form data with the SharePoint web URL
        setFormData(prev => ({ ...prev, ResumeURL: webUrl }));

        alert('Resume uploaded successfully!');
      } catch (error) {
        setUploadError('Failed to upload resume. Please try again.');
        setResumeFile(null);
        alert('Failed to upload resume. Please try again.');
      }
    } else {
      alert('Please upload PDF or Word document only');
    }
  };

  // Remove uploaded resume file
  const removeResumeFile = () => {
    setResumeFile(null);
    setFormData(prev => ({ ...prev, ResumeURL: "" }));
    setUploadError("");
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    // Validate that resume is uploaded
    if (!formData.ResumeURL) {
      alert('Please upload your resume before submitting the application.');
      return;
    }

    // Validate required fields
    if (!formData.CandidateName || !formData.Email || !formData.Phone || !formData.DOB) {
      alert('Please fill in all required fields marked with *');
      return;
    }
    // Here you can send the formData to your backend endpoint for application submission
    try {
      // Example submission (uncomment and modify as needed):

      const response = await fetch(`${JOB_POST_URL}/submitapplication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();
      alert('Application submitted successfully!');
      // Reset form or redirect user

    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo placeholder - replace src with your actual logo */}
              <img
                src={telthlogo}
                alt="Company Logo"
                className="h-14 w-14 rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">Telth pvt Ltd</h1>
                <p className="text-purple-100 text-sm">Career Opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-purple-900 mb-2">Job Application Form</h2>
          <p className="text-gray-600 mb-8">Please fill out all required fields marked with <span className="text-red-500">*</span></p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job ID
                  </label>
                  <input
                    type="text"
                    name="JobID"
                    value={formData.JobID}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="JobTitle"
                    value={formData.JobTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="CandidateName"
                    value={formData.CandidateName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  {/* Date input type provides calendar picker */}
                  <input
                    type="date"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Location
                  </label>
                  <input
                    type="text"
                    name="CurrentLocation"
                    value={formData.CurrentLocation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    name="WillingToRelocate"
                    checked={formData.WillingToRelocate}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Willing to Relocate
                  </label>
                </div>
              </div>
            </div>

            {/* Employment Details Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Employment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="YearsOfExperience"
                    value={formData.YearsOfExperience}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Salary in (LPA)
                  </label>
                  <input
                    type="text"
                    name="Currentsalary"
                    value={formData.Currentsalary}
                    onChange={handleChange}
                    placeholder="e.g, 5LPA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Salary in (LPA)
                  </label>
                  <input
                    type="number"
                    name="ExpectedSalary"
                    value={formData.ExpectedSalary || ''}
                    onChange={handleChange}
                    placeholder="e.g, 5.5LPA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Period
                  </label>
                  <select
                    name="NoticePeriod"
                    value={formData.NoticePeriod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select...</option>
                    <option value="Immediate">Immediate</option>
                    <option value="15 Days">15 Days</option>
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Education</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.Education.degree}
                    onChange={handleEducationChange}
                    placeholder="e.g., Bachelor's in Computer Science"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.Education.institution}
                    onChange={handleEducationChange}
                    placeholder="e.g., MIT"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.Education.graduationYear || ''}
                    onChange={handleEducationChange}
                    placeholder="e.g., 2020"
                    min="1950"
                    max="2030"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Enter skills separated by commas"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  // Press Enter to add skills without submitting form
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillsAdd())}
                />
                <button
                  type="button"
                  onClick={handleSkillsAdd}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Add
                </button>
              </div>
              {/* Display added skills as removable badges */}
              <div className="flex flex-wrap gap-2">
                {formData.Skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-2 text-purple-600 hover:text-purple-800 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>



            {/* Resume Section - Drag & Drop Upload */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Resume <span className="text-red-500">*</span>
              </h2>

              {uploadError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {uploadError}
                </div>
              )}

              {/* Drag and Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 bg-gray-50'
                  } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <svg
                      className="animate-spin h-12 w-12 text-purple-600 mb-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="text-sm text-gray-600">Uploading to SharePoint...</p>
                  </div>
                ) : !resumeFile ? (
                  <div>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      <label className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium">
                        Click to upload
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileInput}
                        />
                      </label>
                      {' '}or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-8 w-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{resumeFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(resumeFile.size / 1024).toFixed(2)} KB
                        </p>
                        {formData.ResumeURL && (
                          <p className="text-xs text-green-600 mt-1">✓ Uploaded to SharePoint</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeResumeFile}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* References Section - Only show when Source is "Referral" */}
            {formData.Source === "Referral" && (
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">References</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Maximum 2 references allowed ({formData.References.length}/2 added)
                </p>
                <div className="flex gap-2 mb-3 flex-wrap ">
                  <input
                    type="text"
                    value={referenceInput.name}
                    onChange={e => setReferenceInput({ ...referenceInput, name: e.target.value })}
                    placeholder="Enter references separated by commas"
                    disabled={formData.References.length >= 2}
                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${formData.References.length >= 2 ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleReferencesAdd())}
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={referenceInput.position}
                     className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    onChange={e => setReferenceInput({ ...referenceInput, position: e.target.value })}
                  />

                  <input
                    type="text"
                    placeholder="Company"
                    value={referenceInput.company}
                     className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    onChange={e => setReferenceInput({ ...referenceInput, company: e.target.value })}
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={referenceInput.email}
                     className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    onChange={e => setReferenceInput({ ...referenceInput, email: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={handleReferencesAdd}
                    disabled={formData.References.length >= 2}
                    className={`px-4 py-2 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${formData.References.length >= 2
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.References.map((reference, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {reference.company}
                      <button
                        type="button"
                        onClick={() => removeReference(index)}
                        className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Additional Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="LinkedInURL"
                    value={formData.LinkedInURL}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    name="PortfolioURL"
                    value={formData.PortfolioURL}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select
                    name="Source"
                    value={formData.Source}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Job Board">Job Board</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter
                  </label>
                  {/* Multiline text input */}
                  <textarea
                    name="CoverLetter"
                    value={formData.CoverLetter}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us why you're a great fit for this role..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="Notes"
                    value={formData.Notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any additional information..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading}
                className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-purple-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-purple-200 text-sm">
                We are committed to finding the best talent and providing excellent career opportunities.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-purple-200">
                <li>Email: careers@company.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Business St, City, State</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-800 mt-8 pt-6 text-center text-sm text-purple-300">
            <p>&copy; 2024 Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ApplicationForm;