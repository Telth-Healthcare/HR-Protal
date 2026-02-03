import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { JobForm } from '../../components/forms/JobForm';
import { JobFormData } from '../../types/job.types';
import { jobsApi } from '../../api/jobs.api';
import { ArrowLeft } from 'lucide-react';

export const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: JobFormData) => {
    setLoading(true);
    try {
      await jobsApi.createJob(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create job:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Job Posting</h2>
            <p className="text-gray-600 mt-1">Fill in the details to post a new job opportunity</p>
          </div>
        </div>

        <JobForm onSubmit={handleSubmit} submitLabel="Create Job Posting" loading={loading} />
      </div>
    </DashboardLayout>
  );
};
