import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsApi } from '../../api/jobs.api';
import { JobFormData } from '../../types/job.types';
import { ArrowLeft } from 'lucide-react';
import { JobForm } from '../../components/forms/JobForm';

export const EditJobPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<JobFormData | null>(null);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobsApi.getJobId(id);
      const job = response.data;
      
      // Transform API response to form data format
      const formData: JobFormData = {
        title: job.title || '',
        description: job.description || '',
        department: job.department || '',
        type: job.type || 'Full-time',
        experience: job.experience || '',
        requirements: job.requirements?.length ? job.requirements : [''],
        locations: job.locations?.length ? job.locations : [{ city: '', country: '', type: 'Onsite' }],
        salaryRange: job.salaryRange || { min: 0, max: 0 },
        closingDate: job.closingDate ? job.closingDate.split('T')[0] : '',
        status: job.status || 'Active',
        posterLink: job.posterLink || '',
        sites: job.sites?.length ? job.sites : [''],
      };
      
      setInitialData(formData);
    } catch (error) {
      console.error('Failed to fetch job details:', error);
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: JobFormData) => {
    if (!id) return;
    
    try {
      setSubmitting(true);
      
      const submitData = {
        ...data,
        closingDate: data.closingDate ? new Date(data.closingDate).toISOString() : null,
      };
      
      await jobsApi.updateJob(id, submitData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update job:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Job Posting</h1>
          <p className="mt-2 text-gray-600">
            Update the job details below. Fields marked with * are required.
          </p>
        </div>

        {/* Form */}
        {initialData && (
          <JobForm
            initialData={initialData}
            onSubmit={handleSubmit}
            submitLabel="Update Job Posting"
            loading={submitting}
          />
        )}
      </div>
    </div>
  );
};