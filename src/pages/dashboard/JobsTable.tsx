import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Job } from '../../types/job.types';
import { jobsApi } from '../../api/jobs.api';
import { DeleteConfirmationModal } from '../../components/common/DeleteConfirmationModal';
import { JobDetailModal } from './JobDetailModal';

export const JobsTable = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; job: Job | null }>({
    isOpen: false,
    job: null,
  });
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; job: Job | null }>({
    isOpen: false,
    job: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsApi.getJobs();
      setJobs(response?.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.job) return;

    try {
      setDeleteLoading(true);
      await jobsApi.deleteJob(deleteModal.job._id || deleteModal.job.id || '');
      setJobs(jobs.filter((job) => (job._id || job.id) !== (deleteModal.job!._id || deleteModal.job!.id)));
      setDeleteModal({ isOpen: false, job: null });
    } catch (error) {
      console.error('Failed to delete job:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewJob = (job: Job) => {
    setViewModal({ isOpen: true, job });
  };

  const columns = useMemo<MRT_ColumnDef<Job>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        size: 200,
      },
      {
        accessorKey: 'department',
        header: 'Department',
        size: 150,
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 120,
        Cell: ({ cell }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'locations',
        header: 'Location',
        size: 180,
        Cell: ({ cell }) => {
          const locations = cell.getValue<any[]>();
          if (!locations || locations.length === 0) return '-';
          const firstLocation = locations[0];
          return `${firstLocation.city}, ${firstLocation.country} (${firstLocation.type})`;
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          const isActive = status?.toLowerCase() === 'active';
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'closingDate',
        header: 'Closing Date',
        size: 120,
        Cell: ({ cell }) => {
          const date = cell.getValue<string>();
          return date ? new Date(date).toLocaleDateString() : '-';
        },
      },
      {
        accessorKey: 'salaryRange',
        header: 'Salary Range',
        size: 150,
        Cell: ({ cell }) => {
          const salary = cell.getValue<any>();
          if (!salary || (!salary.min && !salary.max)) return '-';
          return `$${salary.min?.toLocaleString()} - $${salary.max?.toLocaleString()}`;
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: jobs,
    enableRowActions: true,
    positionActionsColumn: 'first',
    state: {
      isLoading: loading,
    },
    renderRowActions: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleViewJob(row.original)}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate(`/jobs/edit/${row.original._id }`)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => setDeleteModal({ isOpen: true, job: row.original })}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#f9fafb',
        fontWeight: 600,
        fontSize: '0.875rem',
      },
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, job: null })}
        onConfirm={handleDelete}
        title="Delete Job Posting"
        message={`Are you sure you want to delete "${deleteModal.job?.title}"? This action cannot be undone.`}
        loading={deleteLoading}
      />

      {viewModal.job && (
        <JobDetailModal
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, job: null })}
          job={viewModal.job}
        />
      )}
    </>
  );
};