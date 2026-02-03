import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
  type MRT_PaginationState,
} from 'material-react-table';
import { Eye, FileText, Download } from 'lucide-react';
import { Application } from '../../types/application.types';
import { applicationApi } from '../../api/application.api';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ApplicationDetailModal } from './application/ApplicationDetailModal';

export const ApplicationTable = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; application: Application | null }>({
    isOpen: false,
    application: null,
  });
  
  // Pagination state
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  
  const [totalApplications, setTotalApplications] = useState(0);

  useEffect(() => {
    fetchApplications();
  }, [pagination.pageIndex, pagination.pageSize]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationApi.getApplication();
      setApplications(response?.data || []);
      setTotalApplications(response?.total || 0);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application: Application) => {
    setViewModal({ isOpen: true, application });
  };

  const handleDownloadResume = (application: Application) => {
    if (application.ResumeURL) {
      window.open(application.ResumeURL, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = useMemo<MRT_ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: 'CandidateName',
        header: 'Candidate Name',
        size: 180,
      },
      {
        accessorKey: 'JobTitle',
        header: 'Job Title',
        size: 200,
      },
      {
        accessorKey: 'Email',
        header: 'Email',
        size: 200,
        Cell: ({ cell }) => (
          <a 
            href={`mailto:${cell.getValue<string>()}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {cell.getValue<string>()}
          </a>
        ),
      },
      {
        accessorKey: 'Phone',
        header: 'Phone',
        size: 140,
      },
      {
        accessorKey: 'CurrentLocation',
        header: 'Location',
        size: 150,
      },
      {
        accessorKey: 'YearsOfExperience',
        header: 'Experience',
        size: 120,
        Cell: ({ cell }) => (
          <span className="text-gray-700">
            {cell.getValue<number>()} years
          </span>
        ),
      },
      {
        accessorKey: 'ExpectedSalary',
        header: 'Expected Salary',
        size: 150,
        Cell: ({ cell }) => {
          const salary = cell.getValue<number>();
          return salary ? `₹${salary.toLocaleString()}` : '-';
        },
      },
      {
        accessorKey: 'NoticePeriod',
        header: 'Notice Period',
        size: 130,
      },
      {
        accessorKey: 'ApplicationStatus',
        header: 'Status',
        size: 120,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          const getStatusStyle = (status: string) => {
            switch (status?.toLowerCase()) {
              case 'pending':
                return 'bg-yellow-100 text-yellow-800';
              case 'reviewed':
                return 'bg-blue-100 text-blue-800';
              case 'shortlisted':
                return 'bg-purple-100 text-purple-800';
              case 'accepted':
                return 'bg-green-100 text-green-800';
              case 'rejected':
                return 'bg-red-100 text-red-800';
              default:
                return 'bg-gray-100 text-gray-800';
            }
          };
          
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(status)}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'AppliedDate',
        header: 'Applied Date',
        size: 140,
        Cell: ({ cell }) => {
          const date = cell.getValue<string>();
          return date ? formatDate(date) : '-';
        },
      },
      {
        accessorKey: 'Skills',
        header: 'Skills',
        size: 200,
        Cell: ({ cell }) => {
          const skills = cell.getValue<string[]>();
          if (!skills || skills.length === 0) return '-';
          
          // Show first 3 skills with +X more
          const displaySkills = skills.slice(0, 3);
          const remaining = skills.length - 3;
          
          return (
            <div className="flex flex-wrap gap-1">
              {displaySkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {skill}
                </span>
              ))}
              {remaining > 0 && (
                <span className="text-xs text-gray-500">+{remaining} more</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'Source',
        header: 'Source',
        size: 120,
        Cell: ({ cell }) => (
          <span className="text-gray-700">
            {cell.getValue<string>()}
          </span>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: applications,
    enableRowActions: true,
    positionActionsColumn: 'first',
    state: {
      isLoading: loading,
      pagination,
    },
    manualPagination: true,
    rowCount: totalApplications,
    onPaginationChange: setPagination,
    renderRowActions: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleViewApplication(row.original)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDownloadResume(row.original)}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
          title="Download Resume"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate(`/applications/notes/${row.original._id}`)}
          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
          title="Add Notes"
        >
          <FileText className="w-4 h-4" />
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
    muiTableBodyCellProps: {
      sx: {
        fontSize: '0.875rem',
      },
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="mt-1 text-sm text-gray-600">
              Total {totalApplications} applications • Page {pagination.pageIndex + 1} of {Math.ceil(totalApplications / pagination.pageSize)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={pagination.pageSize}
              onChange={(e) => setPagination(prev => ({ ...prev, pageSize: Number(e.target.value) }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        <MaterialReactTable table={table} />
      </div>

      {viewModal.application && (
        <ApplicationDetailModal
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, application: null })}
          application={viewModal.application}
          onStatusChange={fetchApplications} // Refresh after status change
        />
      )}
    </DashboardLayout>
  );
};