import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./AdminDashboard.css";

const EmployeeDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState(null);
  const [salary, setSalary] = useState(null);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState({
    payroll: false,
    salary: false,
    stats: false,
  });

  const [fetched, setFetched] = useState({
    payroll: false,
    salary: false,
    stats: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setEmployeeDetails("No record");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get("/api/employees/mydetails", { headers })
      .then((res) => setEmployeeDetails(res.data))
      .catch(() => setEmployeeDetails("No record"));
  }, []);

  const fetchData = async (type, url, setState) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState("No record");
      setFetched((prev) => ({ ...prev, [type]: true }));
      return;
    }

    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setState(res.data);
    } catch {
      setState("No record");
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
      setFetched((prev) => ({ ...prev, [type]: true }));
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    navigate("/"); // Redirect to the login page
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Employee Dashboard</h1>
          <p className="dashboard-subtitle">View your personal information</p>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#f87171',
              color: '#fff',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              width: '200px',
              marginTop: '1rem'
            }}
          >
            Logout
          </button>
        </div>

        <div className="dashboard-content">
          {/* Employee Details Section */}
          <div className="dashboard-section">
            <div className="personal-details-header">
              <h2 className="personal-details-title">My Details</h2>
            </div>
            {employeeDetails ? (
              <div className="personal-details-content">
                <div className="personal-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{employeeDetails.Name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Employee ID</span>
                    <span className="detail-value">{employeeDetails.EmployeeID}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Department</span>
                    <span className="detail-value">{employeeDetails.Department}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Contact</span>
                    <span className="detail-value">{employeeDetails.ContactNo}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{employeeDetails.Address}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{employeeDetails.Email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Role ID</span>
                    <span className="detail-value">{employeeDetails.RoleID}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date of Joining</span>
                    <span className="detail-value">{employeeDetails.DateOfJoining}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Supervisor ID</span>
                    <span className="detail-value">{employeeDetails.SupervisorID}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          {/* Performance Stats Section */}
          <div className="dashboard-section">
            <div className="personal-details-header">
              <h2 className="personal-details-title">Performance Statistics</h2>
            </div>
            <div className="form-container">
              <button
                onClick={() => fetchData("stats", "/api/employees/mystats", setStats)}
                disabled={loading.stats}
              >
                {loading.stats ? "Loading..." : "Fetch Performance Stats"}
              </button>
              
              {loading.stats ? (
                <p>Loading performance data...</p>
              ) : !fetched.stats ? (
                <p>Click button to fetch performance stats</p>
              ) : !stats ? (
                <p>No performance records found</p>
              ) : (
                <div className="data-display">
                  {stats.performanceStats.map((stat, index) => (
                    <div key={index} className="detail-item">
                      <h4>Evaluation {index + 1}</h4>
                      <div className="personal-details-grid">
                        <p><strong>Grade:</strong> {stat.Grade}</p>
                        <p><strong>Date:</strong> {new Date(stat.EvaluationDate).toLocaleDateString()}</p>
                        <p><strong>Comments:</strong> {stat.Comments}</p>
                        <p><strong>Evaluator:</strong> {stat.Evaluator.Name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Current Salary and Payroll History in a row */}
          <div className="dashboard-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', gridColumn: '1 / -1' }}>
            {/* Salary Section */}
            <div className="dashboard-section" style={{ margin: 0 }}>
              <div className="personal-details-header">
                <h2 className="personal-details-title">Current Salary Details</h2>
              </div>
              <div className="form-container">
                <button
                  onClick={() => fetchData("salary", "/api/employees/mysalary", setSalary)}
                  disabled={loading.salary}
                >
                  {loading.salary ? "Loading..." : "Fetch Salary Details"}
                </button>
                
                {loading.salary ? (
                  <p>Loading salary details...</p>
                ) : !fetched.salary ? (
                  <p>Click button to fetch salary details</p>
                ) : !salary ? (
                  <p>No salary details available</p>
                ) : (
                  <div className="data-display">
                    <div className="detail-item">
                      <div className="personal-details-grid">
                        <p><strong>Basic Pay:</strong> ₹{salary.BasicPay}</p>
                        <p><strong>Allowances:</strong> ₹{salary.Allowances}</p>
                        <p><strong>Deductions:</strong> ₹{salary.Deductions}</p>
                        <p><strong>Bonuses:</strong> ₹{salary.Bonuses}</p>
                        <p><strong>Total:</strong> ₹{(
                          parseFloat(salary.BasicPay) +
                          parseFloat(salary.Allowances) +
                          parseFloat(salary.Bonuses) -
                          parseFloat(salary.Deductions)
                        ).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payroll History Section */}
            <div className="dashboard-section" style={{ margin: 0 }}>
              <div className="personal-details-header">
                <h2 className="personal-details-title">Payroll History</h2>
              </div>
              <div className="form-container">
                <button
                  onClick={() => fetchData("payroll", "/api/employees/mypayrollhistory", setPayrollHistory)}
                  disabled={loading.payroll}
                >
                  {loading.payroll ? "Loading..." : "Fetch Payroll History"}
                </button>
                
                {loading.payroll ? (
                  <p>Loading payroll data...</p>
                ) : !fetched.payroll ? (
                  <p>Click button to fetch payroll history</p>
                ) : !payrollHistory ? (
                  <p>No payroll records found</p>
                ) : (
                  <div className="data-display">
                    {payrollHistory.map((record, index) => (
                      <div key={record.SalaryID} className="detail-item">
                        <h4>Salary Record {index + 1}</h4>
                        <div className="personal-details-grid">
                          <p><strong>Date:</strong> {new Date(record.Date).toLocaleDateString()}</p>
                          <p><strong>Basic Pay:</strong> ₹{record.BasicPay}</p>
                          <p><strong>Allowances:</strong> ₹{record.Allowances}</p>
                          <p><strong>Deductions:</strong> ₹{record.Deductions}</p>
                          <p><strong>Bonuses:</strong> ₹{record.Bonuses}</p>
                          <p><strong>Total:</strong> ₹{(
                            parseFloat(record.BasicPay) +
                            parseFloat(record.Allowances) +
                            parseFloat(record.Bonuses) -
                            parseFloat(record.Deductions)
                          ).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
