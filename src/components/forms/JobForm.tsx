import { useState, FormEvent } from 'react';
import { JobFormData, Location } from '../../types/job.types';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../Toast/contexts/ToastContext';

interface JobFormProps {
  initialData?: JobFormData;
  onSubmit: (data: JobFormData) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
}

// ✅ Enum options (same as before)
const DEPARTMENT_OPTIONS = [
  "Engineering", "Product", "Design", "Marketing", "Sales",
  "Business Development", "HR", "Finance", "Operations", "Quality Assurance"
];

const JOB_TYPE_OPTIONS = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const STATUS_OPTIONS = ["Active", "Inactive", "Closed", "Filled"];
const CITY_OPTIONS = ["Chennai", "Salem", "Delhi", "London", "Remote"];
const COUNTRY_OPTIONS = ["India", "UK", "USA", "Global"];
const LOCATION_TYPE_OPTIONS = ["Onsite", "Hybrid", "Remote"];
const SITE_OPTIONS = ["telth", "mytelth", "telthcare", "natlife", "telthorg", "medpass"];

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
  posterLink: 'https://careers.mytelth.com/careers/Application',
  sites: [''],
};

export const JobForm = ({ initialData, onSubmit, submitLabel, loading = false }: JobFormProps) => {
  const [formData, setFormData] = useState<JobFormData>(initialData || defaultFormData);
  const { showError, showSuccess, showWarning } = useToast(); // ✅ Add showWarning here

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // ✅ Filter out empty sites
    const cleanedData = {
      ...formData,
      sites: formData.sites.filter((site) => site.trim() !== ''),
    };

    // ✅ Validate all location fields
    if (cleanedData.locations.some((loc) => !loc.city || !loc.country)) {
      showError('Validation Error', ['Please fill in all location fields']);
      return;
    }

    // ✅ Validate at least one site is selected
    if (cleanedData.sites.length === 0) {
      showError('Validation Error', ['At least one site must be selected']);
      return;
    }
    // ✅ Validate salary values are greater than zero
    if (
  cleanedData.salaryRange.min <= 0 ||
  cleanedData.salaryRange.max <= 0
) {
  showError('Validation Error', ['Salary must be greater than zero']);
  return;
}


    // ✅ Validate salary range
    if (cleanedData.salaryRange.max < cleanedData.salaryRange.min) {
      showError('Validation Error', ['Maximum salary must be greater than minimum salary']);
      return;
    }

    try {
      await onSubmit(cleanedData);
      showSuccess('Job post saved successfully!');
    } catch (err: any) {
      // ✅ Handle backend validation errors
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        showError('Failed to save job post', err.response.data.errors);
      } else {
        showError(err.response?.data?.message || 'Failed to save job posting');
      }
    }
  };

  const addLocation = () => {
    setFormData({
      ...formData,
      locations: [...formData.locations, { city: '', country: '', type: 'Onsite' }],
    });
  };

  const removeLocation = (index: number) => {
    if (formData.locations.length === 1) {


      
      showWarning('At least one location is required');
      return;
    }
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
    if (formData.sites.filter(s => s.trim()).length === 1) {
      showWarning('At least one site is required');
      return;
    }
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
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

        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
            Department *
          </label>
          <select
            id="department"
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Department</option>
            {DEPARTMENT_OPTIONS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Employment Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type *
          </label>
          <select
            id="type"
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Type</option>
            {JOB_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Experience */}
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

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            id="status"
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Status</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Closing Date */}
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

      {/* Description */}
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

      {/* Poster Link */}
      <div>
        <label htmlFor="posterLink" className="block text-sm font-medium text-gray-700 mb-2">
          Apply Link
        </label>
        <input
          id="posterLink"
          type="url"
          value={formData.posterLink}
          onChange={(e) => setFormData({ ...formData, posterLink: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://careers.mytelth.com/careers/Application"
        />
      </div>

      {/* Salary Range */}
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

      {/* Locations */}
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
                <select
                  value={location.city}
                  onChange={(e) => updateLocation(index, 'city', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select City</option>
                  {CITY_OPTIONS.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>

                <select
                  value={location.country}
                  onChange={(e) => updateLocation(index, 'country', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Country</option>
                  {COUNTRY_OPTIONS.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>

                <select
                  value={location.type}
                  onChange={(e) => updateLocation(index, 'type', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Type</option>
                  {LOCATION_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
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

      {/* Sites */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Job Sites *</label>
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
              <select
                value={site}
                onChange={(e) => updateSite(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Site</option>
                {SITE_OPTIONS.map((siteOption) => (
                  <option key={siteOption} value={siteOption}>{siteOption}</option>
                ))}
              </select>

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

      {/* Submit Button */}
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