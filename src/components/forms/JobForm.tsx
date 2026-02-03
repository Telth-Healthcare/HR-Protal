import { useState, FormEvent } from 'react';
import { JobFormData, Location } from '../../types/job.types';
import { Plus, Trash2 } from 'lucide-react';

interface JobFormProps {
  initialData?: JobFormData;
  onSubmit: (data: JobFormData) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
}

const defaultFormData: JobFormData = {
  title: '',
  description: '',
  department: '',
  type: 'Full-time',
  experience: '',
  locations: [{ city: '', country: '', type: 'Onsite' }],
  salaryRange: { min: 0, max: 0 },
  closingDate: '',
  status: 'Active',
  posterLink: '',
  sites: [''],
};

export const JobForm = ({ initialData, onSubmit, submitLabel, loading = false }: JobFormProps) => {
  const [formData, setFormData] = useState<JobFormData>(initialData || defaultFormData);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanedData = {
      ...formData,
      sites: formData.sites.filter((site) => site.trim() !== ''),
    };


    if (cleanedData.locations.some((loc) => !loc.city || !loc.country)) {
      setError('Please fill in all location fields');
      return;
    }

    try {
      await onSubmit(cleanedData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save job posting');
    }
  };

  const addLocation = () => {
    setFormData({
      ...formData,
      locations: [...formData.locations, { city: '', country: '', type: 'Onsite' }],
    });
  };

  const removeLocation = (index: number) => {
    setFormData({
      ...formData,
      locations: formData.locations.filter((_, i) => i !== index),
    });
  };

  const updateLocation = (index: number, field: keyof Location, value: string) => {
    const newLocations = [...formData.locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setFormData({ ...formData, locations: newLocations });
  };

  const addSite = () => {
    setFormData({ ...formData, sites: [...formData.sites, ''] });
  };

  const removeSite = (index: number) => {
    setFormData({
      ...formData,
      sites: formData.sites.filter((_, i) => i !== index),
    });
  };

  const updateSite = (index: number, value: string) => {
    const newSites = [...formData.sites];
    newSites[index] = value;
    setFormData({ ...formData, sites: newSites });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Senior Software Engineer"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
            Department *
          </label>
          <input
            id="department"
            type="text"
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Engineering"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
            Experience Required *
          </label>
          <input
            id="experience"
            type="text"
            required
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 3-5 years"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div>
          <label htmlFor="closingDate" className="block text-sm font-medium text-gray-700 mb-2">
            Closing Date *
          </label>
          <input
            id="closingDate"
            type="date"
            required
            value={formData.closingDate}
            onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Job Description *
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe the role, responsibilities, and what you're looking for..."
        />
      </div>

      <div>
        <label htmlFor="posterLink" className="block text-sm font-medium text-gray-700 mb-2">
          Poster Link
        </label>
        <input
          id="posterLink"
          type="url"
          value={formData.posterLink}
          onChange={(e) => setFormData({ ...formData, posterLink: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/poster.jpg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Salary *
          </label>
          <input
            type="number"
            required
            value={formData.salaryRange.min}
            onChange={(e) =>
              setFormData({
                ...formData,
                salaryRange: { ...formData.salaryRange, min: Number(e.target.value) },
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="50000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Salary *
          </label>
          <input
            type="number"
            required
            value={formData.salaryRange.max}
            onChange={(e) =>
              setFormData({
                ...formData,
                salaryRange: { ...formData.salaryRange, max: Number(e.target.value) },
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="80000"
          />
        </div>
      </div>


      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Locations *</label>
          <button
            type="button"
            onClick={addLocation}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Location
          </button>
        </div>
        <div className="space-y-3">
          {formData.locations.map((location, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={location.city}
                  onChange={(e) => updateLocation(index, 'city', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                  required
                />
                <input
                  type="text"
                  value={location.country}
                  onChange={(e) => updateLocation(index, 'country', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Country"
                  required
                />
                <select
                  value={location.type}
                  onChange={(e) => updateLocation(index, 'type', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Onsite">Onsite</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              {formData.locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocation(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Job Sites</label>
          <button
            type="button"
            onClick={addSite}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Site
          </button>
        </div>
        <div className="space-y-2">
          {formData.sites.map((site, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={site}
                onChange={(e) => updateSite(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mytelth,Telthorg"
              />
              {formData.sites.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSite(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};
