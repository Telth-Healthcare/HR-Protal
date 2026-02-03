import { X } from 'lucide-react';
import { Job } from '../../types/job.types';

interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

export const JobDetailModal = ({ isOpen, onClose, job }: JobDetailModalProps) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{job.department} • {job.type}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Status & Closing Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      job.status?.toLowerCase() === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Closing Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {job.closingDate ? formatDate(job.closingDate) : 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-500">Experience Required</label>
                  <p className="mt-1 text-sm text-gray-900">{job.experience || 'Not specified'}</p>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-500">Salary Range</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {job.salaryRange?.min && job.salaryRange?.max 
                      ? `$${job.salaryRange.min.toLocaleString()} - $${job.salaryRange.max.toLocaleString()}`
                      : 'Not specified'
                    }
                  </p>
                </div>

                {/* Locations */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Locations</label>
                  <div className="space-y-2">
                    {job.locations?.map((location, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {location.type}
                        </span>
                        <span className="text-sm text-gray-900">
                          {location.city}, {location.country}
                        </span>
                      </div>
                    )) || <p className="text-sm text-gray-500">No locations specified</p>}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Description</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {job.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Requirements</label>
                  <ul className="space-y-1">
                    {job.requirements?.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                        {req}
                      </li>
                    )) || <p className="text-sm text-gray-500">No requirements specified</p>}
                  </ul>
                </div>

                {/* Job Sites */}
                {job.sites && job.sites.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Posted On</label>
                    <div className="flex flex-wrap gap-2">
                      {job.sites.map((site, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {site}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Poster Link */}
                {job.posterLink && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Poster Link</label>
                    <a
                      href={job.posterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block"
                    >
                      {job.posterLink}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end">
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