import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const [supervisorDetails, setSupervisorDetails] = useState(null);
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

  // Fetch supervisor details on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSupervisorDetails("No record");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get("/api/supervisors/mydetails", { headers })
      .then((res) => setSupervisorDetails(res.data))
      .catch(() => setSupervisorDetails("No record"));
  }, []);

  // Function to fetch data (payroll, salary, stats)
  const fetchData = async (type, url, setState) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState("No record");
      setFetched((prev) => ({ ...prev, [type]: true }));
      return;
    }

    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setState(res.data);
    } catch (error) {
      setState("No record");
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
      setFetched((prev) => ({ ...prev, [type]: true }));
    }
  };

  // Function to navigate to manage supervisor page
  const handleManageSupervisorClick = () => {
    navigate("/manage-supervisor");
  };

  // Helper function to calculate net salary
  const calculateNetSalary = (basicPay, allowances, deductions, bonuses) => {
    // Convert all values to numbers and handle undefined values
    const basic = Number(basicPay) || 0;
    const allow = Number(allowances) || 0;
    const deduc = Number(deductions) || 0;
    const bonus = Number(bonuses) || 0;
  
    return basic + allow + bonus - deduc;
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
          <h1 className="dashboard-title">Supervisor Dashboard</h1>
          <p className="dashboard-subtitle">Welcome to your supervisor portal</p>
          <button
            onClick={() => window.location.href = "https://indian-tax-regime-calc.streamlit.app/"}
            style={{
              backgroundColor: '#4caf50',
              color: '#fff',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              width: '200px',
              marginTop: '1rem',
              marginRight: '1rem'
            }}
          >
            Tax-Calc
          </button>
          <button
            onClick={handleManageSupervisorClick}
            style={{
              backgroundColor: '#60a5fa',
              color: '#fff',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              width: '200px',
              marginTop: '1rem'
            }}
          >
            Manage Team & Evaluations
          </button>
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
              marginTop: '1rem',
              marginLeft: '1rem'
            }}
          >
            Logout
          </button>
        </div>

        <div className="dashboard-content" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          rowGap: '5rem',
          width: '100%',
          padding: '3rem',
          maxWidth: '1400px',
          margin: '2rem auto',
          paddingLeft: '1rem'
        }}>
          {/* My Details Section */}
          <div className="dashboard-section" style={{ 
            height: '100%', 
            minHeight: '300px',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            marginLeft: '0'
          }}>
            <div className="personal-details-header">
              <h2 className="personal-details-title">My Details</h2>
            </div>
            {supervisorDetails && supervisorDetails !== "No record" ? (
              <div className="personal-details-content">
                <div className="personal-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{supervisorDetails.Name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Employee ID</span>
                    <span className="detail-value">{supervisorDetails.EmployeeID}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Department</span>
                    <span className="detail-value">{supervisorDetails.Department}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Contact</span>
                    <span className="detail-value">{supervisorDetails.ContactNo}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{supervisorDetails.Address}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{supervisorDetails.Email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Role ID</span>
                    <span className="detail-value">{supervisorDetails.RoleID}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date of Joining</span>
                    <span className="detail-value">{supervisorDetails.DateOfJoining}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Supervisor ID</span>
                    <span className="detail-value">{supervisorDetails.SupervisorID}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p>No details available</p>
            )}
          </div>

          {/* Payroll History Section */}
          <div className="dashboard-section" style={{ 
            height: '100%', 
            minHeight: '300px',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem'
          }}>
            <div className="personal-details-header">
              <h2 className="personal-details-title">My Payroll History</h2>
              <button
                onClick={() => fetchData("payroll", "/api/supervisors/mypayrollhistory", setPayrollHistory)}
                disabled={loading.payroll}
                style={{
                  backgroundColor: '#60a5fa',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {loading.payroll ? "Loading..." : "Fetch Payroll History"}
              </button>
            </div>
            {fetched.payroll && payrollHistory && payrollHistory !== "No record" && (
              <div className="data-display">
                {payrollHistory.map((record) => (
                  <div key={record.SalaryID} className="detail-item">
                    <p><strong>Date:</strong> {new Date(record.Date).toLocaleDateString()}</p>
                    <p><strong>Basic Pay:</strong> ${record.BasicPay}</p>
                    <p><strong>Allowances:</strong> ${record.Allowances}</p>
                    <p><strong>Deductions:</strong> ${record.Deductions}</p>
                    <p><strong>Bonuses:</strong> ${record.Bonuses}</p>
                    <p><strong>Net Salary:</strong> ${calculateNetSalary(record.BasicPay, record.Allowances, record.Deductions, record.Bonuses)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="dashboard-section" style={{ 
            height: '100%', 
            minHeight: '300px',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem'
          }}>
            <div className="personal-details-header">
              <h2 className="personal-details-title">My Statistics</h2>
              <button
                onClick={() => fetchData("stats", "/api/supervisors/mystats", setStats)}
                disabled={loading.stats}
                style={{
                  backgroundColor: '#60a5fa',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {loading.stats ? "Loading..." : "View Stats"}
              </button>
            </div>
            {fetched.stats && stats && stats !== "No record" && (
              <div className="data-display">
                <div className="personal-details-grid" style={{ display: 'flex', flexDirection: 'column' }}>
                  {stats.performanceStats && (
                    <div className="detail-item" style={{ width: '100%' }}>
                      <h4 style={{ width: '100%', whiteSpace: 'nowrap' }}>Performance Stats</h4>
                      <ul>
                        {stats.performanceStats.map((stat, index) => (
                          <li key={index}>
                            <p><strong>Grade:</strong> {stat.Grade}</p>
                            <p><strong>Date:</strong> {new Date(stat.EvaluationDate).toLocaleDateString()}</p>
                            <p><strong>Comments:</strong> {stat.Comments}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {stats.employeeDetails && (
                    <div className="detail-item">
                      <h4>Additional Details</h4>
                      <p><strong>Department:</strong> {stats.employeeDetails.Department}</p>
                      <p><strong>Role:</strong> {stats.employeeDetails.RoleID}</p>
                      <p><strong>Join Date:</strong> {new Date(stats.employeeDetails.DateOfJoining).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current Salary Section */}
          <div className="dashboard-section" style={{ 
            height: '100%', 
            minHeight: '300px',
            gridColumn: '1 / -1',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            marginTop: '2rem'
          }}>
            <div className="personal-details-header">
              <h2 className="personal-details-title">Current Salary</h2>
              <button
                onClick={() => fetchData("salary", "/api/supervisors/sal/mysalary", setSalary)}
                disabled={loading.salary}
                style={{
                  backgroundColor: '#60a5fa',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {loading.salary ? "Loading..." : "View Current Salary"}
              </button>
            </div>
            {fetched.salary && salary && salary !== "No record" && (
              <div className="data-display">
                <div className="detail-item">
                  <p><strong>Basic Pay:</strong> ${salary.BasicPay}</p>
                  <p><strong>Allowances:</strong> ${salary.Allowances}</p>
                  <p><strong>Deductions:</strong> ${salary.Deductions}</p>
                  <p><strong>Bonuses:</strong> ${salary.Bonuses}</p> {/* Added Bonuses field */}
                  <p><strong>Net Salary:</strong> ${calculateNetSalary(salary.BasicPay, salary.Allowances, salary.Deductions, salary.Bonuses)}</p> {/* Updated calculation */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;