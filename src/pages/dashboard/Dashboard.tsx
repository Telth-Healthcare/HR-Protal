import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { JobsTable } from "./JobsTable";

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/jobs/create");
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
          <p className="text-gray-600 mt-1">
            Manage all your job listings in one place
          </p>
          <div className="flex justify-end">
            <button
              onClick={handleClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-md
            hover:bg-blue-700 transition"
            >
              Create Job
            </button>
          </div>
        </div>

        <JobsTable />
      </div>
    </DashboardLayout>
  );
};
