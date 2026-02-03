import { X, Download, Mail, Phone, MapPin, Briefcase, Calendar, Globe, FileText, User, Award } from 'lucide-react';
import { Application } from '../../types/application.types';

interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  onStatusChange?: () => void;
}

export const ApplicationDetailModal = ({ 
  isOpen, 
  onClose, 
  application,
  onStatusChange 
}: ApplicationDetailModalProps) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await applicationApi.updateApplicationStatus(application._id, newStatus);
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{application.CandidateName}</h3>
              <p className="mt-1 text-sm text-gray-500">Applied for {application.JobTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Status & Actions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">Application Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.ApplicationStatus)}`}>
                      {application.ApplicationStatus}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <select
                      value={application.ApplicationStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    
                    <button
                      onClick={() => window.open(application.ResumeURL, '_blank')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900">Contact Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <a 
                          href={`mailto:${application.Email}`}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {application.Email}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900">{application.Phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Current Location</p>
                        <p className="text-sm text-gray-900">{application.CurrentLocation}</p>
                        {application.WillingToRelocate && (
                          <span className="text-xs text-green-600">Willing to relocate</span>
                        )}
                      </div>
                    </div>
                    
                    {application.LinkedInURL && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">LinkedIn</p>
                          <a 
                            href={application.LinkedInURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block"
                          >
                            {application.LinkedInURL}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {application.PortfolioURL && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Portfolio</p>
                          <a 
                            href={application.PortfolioURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block"
                          >
                            {application.PortfolioURL}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900">Job Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Years of Experience</p>
                      <p className="text-sm text-gray-900">{application.YearsOfExperience} years</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Notice Period</p>
                      <p className="text-sm text-gray-900">{application.NoticePeriod}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Expected Salary</p>
                      <p className="text-sm text-gray-900">₹{application.ExpectedSalary?.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Source</p>
                      <p className="text-sm text-gray-900">{application.Source}</p>
                    </div>
                    
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Applied Date</p>
                      <p className="text-sm text-gray-900">{formatDate(application.AppliedDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column - Education & Skills */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cover Letter */}
                {application.CoverLetter && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Cover Letter</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.CoverLetter}</p>
                    </div>
                  </div>
                )}

                {/* Education */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Education</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{application.Education.degree}</p>
                        <p className="text-sm text-gray-600">{application.Education.institution}</p>
                        <p className="text-xs text-gray-500">Graduated {application.Education.graduationYear}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {application.Skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Custom Answers */}
                {application.CustomAnswers && Object.keys(application.CustomAnswers).length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Application Questions</h4>
                    <div className="space-y-3">
                      {Object.entries(application.CustomAnswers).map(([question, answer], index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-900 mb-1">{question}</p>
                          <p className="text-sm text-gray-700">{answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* References */}
                {application.References && application.References.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">References</h4>
                    <div className="space-y-3">
                      {application.References.map((reference, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{reference.name}</p>
                              <p className="text-sm text-gray-600">{reference.position} at {reference.company}</p>
                              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <p className="text-gray-500">Phone</p>
                                  <p className="text-gray-700">{reference.phone}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Email</p>
                                  <a 
                                    href={`mailto:${reference.email}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    {reference.email}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {application.Notes && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Notes</h4>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.Notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};