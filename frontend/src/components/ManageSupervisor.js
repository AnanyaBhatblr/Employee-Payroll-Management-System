import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const ManageSupervisor = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/supervisors');
  };

  const [subordinates, setSubordinates] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(null); // New state for employee details
  const [employeeId, setEmployeeId] = useState(""); // New state for input
  const [performanceStats, setPerformanceStats] = useState(null); // New state for performance stats
  const [evaluations, setEvaluations] = useState(null); // New state for evaluations by evaluator
  const [evaluationForm, setEvaluationForm] = useState({
    employeeID: "",
    grade: "",
    evaluationDate: "",
    comments: ""
  }); // State for evaluation form inputs
  const [evaluationResponse, setEvaluationResponse] = useState(null); // State for evaluation response
  const [payrollHistory, setPayrollHistory] = useState([]); // New state for payroll history
  const [salaryData, setSalaryData] = useState(null); // New state for salary data

  // Function to fetch salary data
  const fetchSalaryData = async () => {
    if (!employeeId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setSalaryData(null);
      return;
    }

    try {
      const response = await axios.get(`/api/supervisors/salary/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalaryData(response.data); // Set the salary data
    } catch (error) {
      setSalaryData(null); // Set to null on error
    }
  };

  // Function to fetch payroll history
  const fetchPayrollHistory = async () => {
    if (!employeeId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setPayrollHistory([]);
      return;
    }

    try {
      const response = await axios.get(`/api/supervisors/payrollhist/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayrollHistory(response.data); // Set the payroll history
    } catch (error) {
      setPayrollHistory([]); // Set to an empty array on error
    }
  };

  // Function to fetch subordinates
  const fetchSubordinates = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSubordinates([]); // Set to an empty array if no token
      setFetched(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get("/api/supervisors/mysubs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubordinates(response.data.employees); // Access the employees array
    } catch (error) {
      setSubordinates([]); // Set to an empty array on error
    } finally {
      setLoading(false);
      setFetched(true);
    }
  };

  // Function to fetch employee details by ID
  const fetchEmployeeById = async () => {
    if (!employeeId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setEmployeeDetails(null);
      return;
    }

    try {
      const response = await axios.get(`/api/supervisors/byId/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeeDetails(response.data); // Set the employee details
    } catch (error) {
      setEmployeeDetails(null); // Set to null on error
    }
  };

  // Function to fetch performance stats by employee ID
  const fetchPerformanceStats = async () => {
    if (!employeeId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setPerformanceStats(null);
      return;
    }

    try {
      const response = await axios.get(`/api/supervisors/performance/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerformanceStats(response.data); // Set the performance stats
    } catch (error) {
      setPerformanceStats(null); // Set to null on error
    }
  };

  // Function to fetch evaluations by the evaluator
  const fetchEvaluationsByEvaluator = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setEvaluations(null);
      return;
    }

    try {
      const response = await axios.get("/api/supervisors/evalbyme", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvaluations(response.data); // Set the evaluations
    } catch (error) {
      setEvaluations(null); // Set to null on error
    }
  };

  // Function to handle evaluation form submission
  const handleEvaluationSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setEvaluationResponse("Not authenticated");
      return;
    }

    try {
      const response = await axios.post("/api/supervisors/addeval", evaluationForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvaluationResponse("Evaluation added successfully");
    } catch (error) {
      setEvaluationResponse("Error adding evaluation");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <button
          onClick={handleBack}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '10px 20px',
            backgroundColor: '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            width: 'auto'
          }}
        >
          Back
        </button>
        <div className="dashboard-header">
          <h1 className="dashboard-title">Manage My Team</h1>
          <p className="dashboard-subtitle">Manage your team and evaluations</p>
        </div>

        <div className="dashboard-content" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr', // Two columns
          gap: '4rem',
          rowGap: '5rem',
          width: '100%',
          padding: '3rem',
          maxWidth: '1400px',
          margin: '2rem auto',
          paddingLeft: '1rem'
        }}>
          {/* Salary Details Section */}
          <div className="dashboard-section" style={{
            height: 'auto',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem'
          }}>
            <h2 className="personal-details-title">Salary Details</h2>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter Employee ID"
              style={{
                marginBottom: '1rem',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}
            />
            <button
              onClick={fetchSalaryData}
              style={{
                backgroundColor: '#60a5fa',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Fetch Salary
            </button>
            {salaryData && (
              <div className="salary-details">
                <p><strong>ID:</strong> {salaryData.id}</p>
                <p><strong>Employee ID:</strong> {salaryData.EmployeeID}</p>
                <p><strong>Salary ID:</strong> {salaryData.SalaryID}</p>
                <p><strong>Basic Pay:</strong> ${salaryData.BasicPay}</p>
                <p><strong>Allowances:</strong> ${salaryData.Allowances}</p>
                <p><strong>Deductions:</strong> ${salaryData.Deductions}</p>
                <p><strong>Bonuses:</strong> ${salaryData.Bonuses}</p>
                <p><strong>Date:</strong> {new Date(salaryData.Date).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {/* Employee Details Section */}
          <div className="dashboard-section" style={{ 
            height: 'auto',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem'
          }}>
            <h2 className="personal-details-title">Employee Details</h2>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter Employee ID"
              style={{
                marginBottom: '1rem',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}
            />
            <button
              onClick={fetchEmployeeById}
              style={{
                backgroundColor: '#60a5fa',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Fetch Employee
            </button>
            {employeeDetails && (
              <div className="employee-details">
                <p><strong>Employee ID:</strong> {employeeDetails.EmployeeID}</p>
                <p><strong>Name:</strong> {employeeDetails.Name}</p>
                <p><strong>Department:</strong> {employeeDetails.Department}</p>
                <p><strong>Contact No:</strong> {employeeDetails.ContactNo}</p>
                <p><strong>Address:</strong> {employeeDetails.Address}</p>
                <p><strong>Email:</strong> {employeeDetails.Email}</p>
                <p><strong>Date Of Joining:</strong> {employeeDetails.DateOfJoining}</p>
                <p><strong>Role ID:</strong> {employeeDetails.RoleID}</p>
                <p><strong>Supervisor ID:</strong> {employeeDetails.SupervisorID}</p>
              </div>
            )}
          </div>

          {/* Performance Stats Section */}
          <div className="dashboard-section" style={{ 
            height: 'auto',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem'
          }}>
            <h2 className="personal-details-title">Performance Stats</h2>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter Employee ID for Performance Stats"
              style={{
                marginBottom: '1rem',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}
            />
            <button
              onClick={fetchPerformanceStats}
              style={{
                backgroundColor: '#60a5fa',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Fetch Performance Stats
            </button>
            {performanceStats && performanceStats.length > 0 ? (
              <ul>
                {performanceStats.map((stat) => (
                  <li key={stat.EvaluationID}>
                    <p><strong>Grade:</strong> {stat.Grade}</p>
                    <p><strong>Date:</strong> {new Date(stat.EvaluationDate).toLocaleDateString()}</p>
                    <p><strong>Comments:</strong> {stat.Comments}</p>
                    <p><strong>Evaluator:</strong> {stat.Evaluator.Name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No performance stats available.</p>
            )}
          </div>

          {/* Payroll History Section */}
          <div className="dashboard-section" style={{
            height: 'auto',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem'
          }}>
            <h2 className="personal-details-title">Payroll History</h2>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter Employee ID"
              style={{
                marginBottom: '1rem',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}
            />
            <button
              onClick={fetchPayrollHistory}
              style={{
                backgroundColor: '#60a5fa',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Fetch Payroll History
            </button>
            {payrollHistory.length > 0 ? (
              <ul>
                {payrollHistory.map(record => (
                  <li key={record.SalaryID}>
                    <p><strong>Salary ID:</strong> {record.SalaryID}</p>
                    <p><strong>Basic Pay:</strong> ${record.BasicPay}</p>
                    <p><strong>Allowances:</strong> ${record.Allowances}</p>
                    <p><strong>Deductions:</strong> ${record.Deductions}</p>
                    <p><strong>Bonuses:</strong> ${record.Bonuses}</p>
                    <p><strong>Date:</strong> {new Date(record.Date).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No payroll history available.</p>
            )}
          </div>

          {/* Subordinates Section */}
          <div className="dashboard-section" style={{ 
            height: 'auto',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem'
          }}>
            <h2 className="personal-details-title">My Subordinates</h2>
            <button
              onClick={fetchSubordinates}
              disabled={loading}
              style={{
                backgroundColor: '#60a5fa',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {loading ? "Loading..." : "Fetch Subordinates"}
            </button>
            {fetched && subordinates.length > 0 && (
              <div className="data-display">
                {subordinates.map(({ employee, performanceStats, salaryRecords }) => (
                  <div key={employee.EmployeeID} className="detail-item">
                    <h3>Employee ID: {employee.EmployeeID}</h3>
                    <p><strong>Name:</strong> {employee.Name}</p>
                    <p><strong>Department:</strong> {employee.Department}</p>
                    <h4>Performance Stats:</h4>
                    {performanceStats.length > 0 ? (
                      <ul>
                        {performanceStats.map(stat => (
                          <li key={stat.EvaluationID}>
                            Grade: {stat.Grade}, Date: {new Date(stat.EvaluationDate).toLocaleDateString()}, Comments: {stat.Comments}, Evaluator: {stat.Evaluator.Name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No performance stats available.</p>
                    )}
                    <h4>Salary Records:</h4>
                    {salaryRecords.length > 0 ? (
                      <ul>
                        {salaryRecords.map(record => (
                          <li key={record.SalaryID}>
                            Date: {new Date(record.Date).toLocaleDateString()}, Basic Pay: ${record.BasicPay}, Allowances: ${record.Allowances}, Deductions: ${record.Deductions}, Bonuses: ${record.Bonuses}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No salary records available.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {fetched && subordinates.length === 0 && <p>No subordinates found.</p>}
          </div>

          {/* Evaluations by Evaluator Section */}
          <div className="dashboard-section" style={{ 
            height: 'auto',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem'
          }}>
            <h2 className="personal-details-title">Evaluations by Me</h2>
            <button
              onClick={fetchEvaluationsByEvaluator}
              style={{
                backgroundColor: '#60a5fa',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Fetch My Evaluations
            </button>
            {evaluations && evaluations.length > 0 ? (
              <div className="evaluations-list">
                {evaluations.map((evaluation) => (
                  <div key={evaluation.EvaluationID} className="evaluation-item" style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                    <p><strong>Evaluation ID:</strong> {evaluation.EvaluationID}</p>
                    <p><strong>Employee ID:</strong> {evaluation.EmployeeID}</p>
                    <p><strong>Grade:</strong> {evaluation.Grade}</p>
                    <p><strong>Evaluation Date:</strong> {new Date(evaluation.EvaluationDate).toLocaleDateString()}</p>
                    <p><strong>Comments:</strong> {evaluation.Comments}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No evaluations found.</p>
            )}
          </div>

          {/* Add Evaluation Section */}
          <div className="dashboard-section" style={{ 
            height: 'auto',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem'
          }}>
            <h2 className="personal-details-title">Add Evaluation</h2>
            <form onSubmit={handleEvaluationSubmit} className="form-container">
              <input
                type="text"
                name="employeeID"
                value={evaluationForm.employeeID}
                onChange={(e) => setEvaluationForm({ ...evaluationForm, employeeID: e.target.value })}
                placeholder="Employee ID"
                required
              />
              <input
                type="text"
                name="grade"
                value={evaluationForm.grade}
                onChange={(e) => setEvaluationForm({ ...evaluationForm, grade: e.target.value })}
                placeholder="Grade"
                required
              />
              <input
                type="date"
                name="evaluationDate"
                value={evaluationForm.evaluationDate}
                onChange={(e) => setEvaluationForm({ ...evaluationForm, evaluationDate: e.target.value })}
                placeholder="Evaluation Date"
                required
              />
              <textarea
                name="comments"
                value={evaluationForm.comments}
                onChange={(e) => setEvaluationForm({ ...evaluationForm, comments: e.target.value })}
                placeholder="Comments"
                required
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#60a5fa',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Add Evaluation
              </button>
            </form>
            {evaluationResponse && <p>{evaluationResponse}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSupervisor;