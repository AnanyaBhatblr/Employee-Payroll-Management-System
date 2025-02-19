import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add this import
import "./AdminDashboard.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminDashboard = () => {
  const calculateNetSalary = (basicPay, allowances, deductions, bonuses) => {
    // Convert all values to numbers and handle undefined values
    const basic = Number(basicPay) || 0;
    const allow = Number(allowances) || 0;
    const deduc = Number(deductions) || 0;
    const bonus = Number(bonuses) || 0;

    return basic + allow + bonus - deduc;
  };
  const navigate = useNavigate(); // Add this line
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    navigate("/"); // Redirect to the login page
  };

  const [showManageEmployees, setShowManageEmployees] = useState(false);
  const [adminDetails, setAdminDetails] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState(null);
  const [salary, setSalary] = useState(null);
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState(null);
  //addsalary
  const [salaryFormValues, setSalaryFormValues] = useState({
    EmployeeID: "",
    BasicPay: "",
    Allowances: "",
    Deductions: "",
    Bonuses: "",
    Date: "", // Date input should be in the format YYYY-MM-DD
  });
  const [salaryResponse, setSalaryResponse] = useState(null);
  const [salarryError, setSalarryError] = useState(null);
  const [loadingSalarySubmit, setLoadingSalarySubmit] = useState(false);
  
  // New state for fetching employee by ID
  const [employeeById, setEmployeeById] = useState("");
  const [employeeByIdResponse, setEmployeeByIdResponse] = useState(null);
  const [employeeByIdError, setEmployeeByIdError] = useState(null);
  const [loadingEmployeeById, setLoadingEmployeeById] = useState(false);
  //nextpart(perbyID)
  const [employeeIDForPerformance, setEmployeeIDForPerformance] = useState("");
  const [performanceError, setPerformanceError] = useState(null);
  const [loadingPerformance, setLoadingPerformance] = useState(false);

  //byevaluatorID
  const [evaluatorID, setEvaluatorID] = useState("");
  const [evaluations, setEvaluations] = useState(null);
  const [evaluationsError, setEvaluationsError] = useState(null);
  const [loadingEvaluations, setLoadingEvaluations] = useState(false);
  //payrollhis
  const [payrollEmployeeID, setPayrollEmployeeID] = useState("");
  const [payrollHistoryData, setPayrollHistoryData] = useState(null);
  const [payrollHistoryError, setPayrollHistoryError] = useState(null);
  const [loadingPayrollHistory, setLoadingPayrollHistory] = useState(false);
  //salary
  const [salaryEmployeeID, setSalaryEmployeeID] = useState("");
  const [salaryData, setSalaryData] = useState(null);
  const [salaryError, setSalaryError] = useState(null);
  const [loadingSalary, setLoadingSalary] = useState(false);
  //addevaluation
  const [evaluationEvaluatorID, setEvaluationEvaluatorID] = useState("");
const [evaluationEmployeeID, setEvaluationEmployeeID] = useState("");
const [evaluationGrade, setEvaluationGrade] = useState("");
const [evaluationDate, setEvaluationDate] = useState("");
const [evaluationComments, setEvaluationComments] = useState("");
const [evaluationResponse, setEvaluationResponse] = useState(null);
const [evaluationError, setEvaluationError] = useState(null);
const [loadingEvaluation, setLoadingEvaluation] = useState(false);

  // States for loading and fetched flags for various sections
  const [loading, setLoading] = useState({
    performance: false,
    payroll: false,
    salary: false,
    stats: false,
    employees: false,
    createUser: false,
    createEmployee: false,
  });

  const [fetched, setFetched] = useState({
    performance: false,
    payroll: false,
    salary: false,
    stats: false,
    employees: false,
  });

  // State for the create-user form
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    employeeId: "",
  });
  const [createUserResponse, setCreateUserResponse] = useState(null);
  const [createUserError, setCreateUserError] = useState(null);

  // State for the add-employee form
  const [employeeFormValues, setEmployeeFormValues] = useState({
    Name: "",
    Department: "",
    ContactNo: "",
    Address: "",
    Email: "",
    RoleID: "",
    DateOfJoining: "", // If left blank, your backend will default to the current date
    SupervisorID: "",
  });
  const [employeeAddResponse, setEmployeeAddResponse] = useState(null);
  const [employeeAddError, setEmployeeAddError] = useState(null);
  
  // Fetch admin details on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAdminDetails("No record");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch admin details
    axios
      .get("/api/admins/mydetails", { headers })
      .then((res) => setAdminDetails(res.data))
      .catch(() => setAdminDetails("No record"));

    // Fetch payroll history
    fetchData("payroll", "/api/admins/mypayrollhistory", setPayrollHistory);
    
    // Fetch performance data
    fetchData("performance", "/api/admins/myperformance", setPerformance);
  }, []);

  // Generic function to fetch data from a given endpoint
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
    } catch (err) {
      setState("No record");
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
      setFetched((prev) => ({ ...prev, [type]: true }));
    }
  };
  // Add Salary Form

  const fetchPerformanceByEmployeeID = async () => {
    setPerformance(null);
    setPerformanceError(null);
    setLoadingPerformance(true);

    if (!employeeIDForPerformance) {
      setPerformanceError("Please enter a valid Employee ID");
      setLoadingPerformance(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setPerformanceError("Not authenticated");
      setLoadingPerformance(false);
      return;
    }

    try {
      const res = await axios.get(`/api/admins/performance/${employeeIDForPerformance}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerformance(res.data);
    } catch (error) {
      setPerformanceError("Error fetching performance stats.");
    } finally {
      setLoadingPerformance(false);
    }
  };
  
  const fetchPayrollHistoryByEmployeeID = async () => {
    setPayrollHistoryData(null);
    setPayrollHistoryError(null);
    setLoadingPayrollHistory(true);
  
    if (!payrollEmployeeID) {
      setPayrollHistoryError("Please enter a valid Employee ID");
      setLoadingPayrollHistory(false);
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      setPayrollHistoryError("Not authenticated");
      setLoadingPayrollHistory(false);
      return;
    }
  
    try {
      const res = await axios.get(`/api/admins/payrollhis/${payrollEmployeeID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayrollHistoryData(res.data);
    } catch (error) {
      setPayrollHistoryError("Error fetching payroll history.");
    } finally {
      setLoadingPayrollHistory(false);
    }
  };
  const handleSalaryInputChange = (e) => {
    const { name, value } = e.target;
    setSalaryFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    setSalaryResponse(null);
    setSalarryError(null);
    setLoadingSalarySubmit(true);
  
    const token = localStorage.getItem("token");
    if (!token) {
      setSalarryError("Not authenticated");
      setLoadingSalarySubmit(false);
      return;
    }
  
    const { EmployeeID, BasicPay, Allowances, Deductions, Bonuses, Date } = salaryFormValues;
  
    if (!EmployeeID || !BasicPay || !Date) {
      setSalarryError("Please fill in all required fields (Employee ID, Basic Pay, Date).");
      setLoadingSalarySubmit(false);
      return;
    }
  
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(
        "/api/admins/salary", 
        {
          EmployeeID,
          BasicPay,
          Allowances: Allowances || 0.0,
          Deductions: Deductions || 0.0,
          Bonuses: Bonuses || 0.0,
          Date
        },
        { headers }
      );
      setSalaryResponse(res.data);
    } catch (error) {
      setSalarryError("Error submitting salary details.");
    } finally {
      setLoadingSalarySubmit(false);
    }
  };
  
  
  // Handle form field changes for the create-user form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for creating a user
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setCreateUserResponse(null);
    setCreateUserError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setCreateUserError("Not authenticated");
      return;
    }

    setLoading((prev) => ({ ...prev, createUser: true }));

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(
        "/api/admins/create-user",
        {
          username: formValues.username,
          password: formValues.password,
          employeeId: formValues.employeeId,
        },
        { headers }
      );
      setCreateUserResponse(
        res.data.message || "User credentials created successfully."
      );
      // Optionally clear the form
      setFormValues({ username: "", password: "", employeeId: "" });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setCreateUserError(error.response.data.message);
      } else {
        setCreateUserError("An error occurred while creating the user.");
      }
    } finally {
      setLoading((prev) => ({ ...prev, createUser: false }));
    }
  };

  // Handle form field changes for the add-employee form
  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const fetchSalaryByEmployeeID = async () => {
    setSalaryData(null);
    setSalaryError(null);
    setLoadingSalary(true);
  
    if (!salaryEmployeeID) {
      setSalaryError("Please enter a valid Employee ID");
      setLoadingSalary(false);
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      setSalaryError("Not authenticated");
      setLoadingSalary(false);
      return;
    }
  
    try {
      const res = await axios.get(`/api/admins/salary/${salaryEmployeeID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalaryData(res.data);
    } catch (error) {
      setSalaryError("Error fetching salary details.");
    } finally {
      setLoadingSalary(false);
    }
  };
  const submitEvaluation = async () => {
    setEvaluationResponse(null);
    setEvaluationError(null);
    setLoadingEvaluation(true);
  
    if (!evaluationEvaluatorID || !evaluationEmployeeID || !evaluationGrade || !evaluationDate) {
      setEvaluationError("Please fill all required fields.");
      setLoadingEvaluation(false);
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      setEvaluationError("Not authenticated");
      setLoadingEvaluation(false);
      return;
    }
  
    try {
      const res = await axios.post(`/api/admins/evaluations/${evaluationEvaluatorID}`, {
        employeeID: evaluationEmployeeID,
        grade: evaluationGrade,
        evaluationDate,
        comments: evaluationComments
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setEvaluationResponse(res.data);
    } catch (error) {
      setEvaluationError("Error submitting evaluation.");
    } finally {
      setLoadingEvaluation(false);
    }
  };
  
  // Handle form submission for adding a new employee
  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setEmployeeAddResponse(null);
    setEmployeeAddError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setEmployeeAddError("Not authenticated");
      return;
    }

    setLoading((prev) => ({ ...prev, createEmployee: true }));

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(
        "/api/admins/add",
        {
          // Pass all fields from the form
          Name: employeeFormValues.Name,
          Department: employeeFormValues.Department,
          ContactNo: employeeFormValues.ContactNo,
          Address: employeeFormValues.Address,
          Email: employeeFormValues.Email,
          RoleID: employeeFormValues.RoleID,
          DateOfJoining: employeeFormValues.DateOfJoining, // backend will handle default if empty
          SupervisorID: employeeFormValues.SupervisorID,
        },
        { headers }
      );
      setEmployeeAddResponse(
        res.data.message || "Employee added successfully."
      );
      // Optionally clear the form after success
      setEmployeeFormValues({
        Name: "",
        Department: "",
        ContactNo: "",
        Address: "",
        Email: "",
        RoleID: "",
        DateOfJoining: "",
        SupervisorID: "",
      });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        setEmployeeAddError(error.response.data.error);
      } else {
        setEmployeeAddError("An error occurred while adding the employee.");
      }
    } finally {
      setLoading((prev) => ({ ...prev, createEmployee: false }));
    }
  };
  const fetchEvaluationsByEvaluatorID = async () => {
    setEvaluations(null);
    setEvaluationsError(null);
    setLoadingEvaluations(true);
  
    if (!evaluatorID) {
      setEvaluationsError("Please enter a valid Evaluator ID");
      setLoadingEvaluations(false);
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      setEvaluationsError("Not authenticated");
      setLoadingEvaluations(false);
      return;
    }
  
    try {
      const res = await axios.get(`/api/admins/evaluations/${evaluatorID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvaluations(res.data);
    } catch (error) {
      setEvaluationsError("Error fetching evaluations.");
    } finally {
      setLoadingEvaluations(false);
    }
  };
  
  // Handle change for employee ID query form
  const handleEmployeeByIdChange = (e) => {
    setEmployeeById(e.target.value);
  };

  // Handle form submission to get employee by ID
  const handleEmployeeByIdSubmit = async (e) => {
    e.preventDefault();
    setEmployeeByIdResponse(null);
    setEmployeeByIdError(null);
    setLoadingEmployeeById(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setEmployeeByIdError("Not authenticated");
      setLoadingEmployeeById(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      // Ensure the ID is a number; you might add extra validation as needed.
      const res = await axios.get(`/api/admins/emp/${employeeById}`, {
        headers,
      });
      setEmployeeByIdResponse(res.data);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        setEmployeeByIdError(error.response.data.error);
      } else {
        setEmployeeByIdError("An error occurred while fetching the employee.");
      }
    } finally {
      setLoadingEmployeeById(false);
    }
  };
  
  

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Manage your organization's data</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={() => window.location.href = "https://tax-regime-calc.streamlit.app/"}
              style={{
                backgroundColor: '#4caf50',
                color: '#fff',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                width: '200px'
              }}
            >
              Tax-Calc
            </button>
            <button
              onClick={() => navigate("/manage-employees")} // Use navigate instead of history
              style={{
                backgroundColor: '#60a5fa',
                color: '#fff',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background-color 0.2s',
                width: '200px'
              }}
            >
              Manage Employees
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
                width: '200px'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="dashboard-content" style={{ width: '100%' }}>
          {showManageEmployees ? (
            <div className="dashboard-section" style={{ width: '100%' }}>
              <div className="personal-details-header">
                <h2 className="personal-details-title">Employee Management</h2>
              </div>
              <div className="form-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', width: '100%' }}>
                {/* Create User Section */}
                <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
                  <h3>Create Credentials</h3>
                  <form onSubmit={handleFormSubmit} style={{ width: '100%' }}>
                    <div>
                      <label>
                        Username:
                        <input
                          type="text"
                          name="username"
                          value={formValues.username}
                          onChange={handleInputChange}
                          required
                          style={{ width: '100%' }}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Password:
                        <input
                          type="password"
                          name="password"
                          value={formValues.password}
                          onChange={handleInputChange}
                          required
                          style={{ width: '100%' }}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Employee ID:
                        <input
                          type="text"
                          name="employeeId"
                          value={formValues.employeeId}
                          onChange={handleInputChange}
                          required
                          style={{ width: '100%' }}
                        />
                      </label>
                    </div>
                    <button type="submit" disabled={loading.createUser} style={{ width: '100%' }}>
                      {loading.createUser ? "Creating..." : "Create Credentials"}
                    </button>
                  </form>
                  {createUserResponse && (
                    <p style={{ color: "green" }}>{createUserResponse}</p>
                  )}
                  {createUserError && (
                    <p style={{ color: "red" }}>{createUserError}</p>
                  )}
                </div>

                {/* Add Employee Section */}
                <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
                  <h3>Add Employee</h3>
                  <form onSubmit={handleAddEmployeeSubmit} style={{ width: '100%' }}>
                    <div>
                      <label>
                        Name:*{" "}
                        <input
                          type="text"
                          name="Name"
                          value={employeeFormValues.Name}
                          onChange={handleEmployeeInputChange}
                          required
                          style={{ width: '100%' }}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Department:{" "}
                        <input
                          type="text"
                          name="Department"
                          value={employeeFormValues.Department}
                          onChange={handleEmployeeInputChange}
                          style={{ width: '100%' }}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Contact No:{" "}
                        <input
                          type="text"
                          name="ContactNo"
                          value={employeeFormValues.ContactNo}
                          onChange={handleEmployeeInputChange}
                          style={{ width: '100%' }}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Address:{" "}
                        <textarea
                          name="Address"
                          value={employeeFormValues.Address}
                          onChange={handleEmployeeInputChange}
                          style={{ width: '100%' }}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Email:*{" "}
                        <input
                          type="email"
                          name="Email"
                          value={employeeFormValues.Email}
                          onChange={handleEmployeeInputChange}
                          required
                          style={{ width: '100%' }}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Role ID:*{" "}
                        <input
                          type="number"
                          name="RoleID"
                          value={employeeFormValues.RoleID}
                          onChange={handleEmployeeInputChange}
                          required
                          style={{ width: '100%' }}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Date Of Joining:{" "}
                        <input
                          type="date"
                          name="DateOfJoining"
                          value={employeeFormValues.DateOfJoining}
                          onChange={handleEmployeeInputChange}
                          style={{ width: '100%' }}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Supervisor ID:{" "}
                        <input
                          type="number"
                          name="SupervisorID"
                          value={employeeFormValues.SupervisorID}
                          onChange={handleEmployeeInputChange}
                          style={{ width: '100%' }}
                        />
                      </label>
                    </div>
                    <button type="submit" disabled={loading.createEmployee} style={{ width: '100%' }}>
                      {loading.createEmployee ? "Adding Employee..." : "Add Employee"}
                    </button>
                  </form>
                  {employeeAddResponse && (
                    <p style={{ color: "green" }}>{employeeAddResponse}</p>
                  )}
                  {employeeAddError && (
                    <p style={{ color: "red" }}>{employeeAddError}</p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          
          {/* Admin Details Section */}
          <div className="dashboard-section">
            <div className="personal-details-header">
              <h2 className="personal-details-title">My Details</h2>
            </div>
            {adminDetails ? (
              <div className="personal-details-content">
                <div className="personal-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{adminDetails.Name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Employee ID</span>
                    <span className="detail-value">{adminDetails.EmployeeID}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Department</span>
                    <span className="detail-value">{adminDetails.Department}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Contact</span>
                    <span className="detail-value">{adminDetails.ContactNo}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{adminDetails.Address}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{adminDetails.Email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Role ID</span>
                    <span className="detail-value">{adminDetails.RoleID}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date of Joining</span>
                    <span className="detail-value">{adminDetails.DateOfJoining}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Supervisor ID</span>
                    <span className="detail-value">{adminDetails.SupervisorID}</span>
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
            {loading.performance ? (
              <p>Loading performance data...</p>
            ) : !fetched.performance ? (
              <p>No performance data fetched yet</p>
            ) : !performance ? (
              <p>No performance records found</p>
            ) : (
              <div className="data-display">
                {performance.map((stat, index) => (
                  <div key={index} className="detail-item">
                    <h4>Evaluation {index + 1}</h4>
                    <p><strong>Grade:</strong> {stat.Grade}</p>
                    <p><strong>Date:</strong> {new Date(stat.EvaluationDate).toLocaleDateString()}</p>
                    <p><strong>Comments:</strong> {stat.Comments}</p>
                    <p><strong>Evaluator:</strong> {stat.Evaluator.Name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payroll History Section */}
          <div className="dashboard-section">
            <div className="personal-details-header">
              <h2 className="personal-details-title">Payroll History</h2>
            </div>
            <div className="form-container">
              {loading.payroll ? (
                <p>Loading payroll data...</p>
              ) : !fetched.payroll ? (
                <p>No payroll data fetched yet</p>
              ) : !payrollHistory ? (
                <p>No payroll records found</p>
              ) : (
                <div className="data-display">
                  {payrollHistory.map((record, index) => (
                    <div key={record.SalaryID} className="detail-item">
                      <h4>Salary Record {index + 1}</h4>
                      <div className="personal-details-grid">
                        <p><strong>Date:</strong> {new Date(record.Date).toLocaleDateString()}</p>
                        <p><strong>Basic Pay:</strong> ${record.BasicPay}</p>
                        <p><strong>Allowances:</strong> ${record.Allowances}</p>
                        <p><strong>Deductions:</strong> ${record.Deductions}</p>
                        <p><strong>Bonuses:</strong> ${record.Bonuses}</p>
                        <p><strong>Total:</strong> ${(
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

          {/* Stats Section */}
          <div className="dashboard-section">
            <div className="personal-details-header">
              <h2 className="personal-details-title">Overall Statistics</h2>
            </div>
            <div className="form-container">
              <button
                onClick={() => fetchData("stats", "/api/admins/mystats", setStats)}
                disabled={loading.stats}
              >
                {loading.stats ? "Loading..." : "Fetch Statistics"}
              </button>
              
              {loading.stats ? (
                <p>Loading statistics...</p>
              ) : !fetched.stats ? (
                <p>Click button to fetch statistics</p>
              ) : !stats ? (
                <p>No statistics available</p>
              ) : (
                <div className="data-display">
                  <div className="detail-item">
                    <h4>Performance Statistics</h4>
                    {stats.performanceStats.map((stat, index) => (
                      <div key={stat.EvaluationID} className="personal-details-grid">
                        <p><strong>Evaluation {index + 1}</strong></p>
                        <p><strong>Grade:</strong> {stat.Grade}</p>
                        <p><strong>Date:</strong> {new Date(stat.EvaluationDate).toLocaleDateString()}</p>
                        <p><strong>Comments:</strong> {stat.Comments}</p>
                        <p><strong>Evaluator:</strong> {stat.Evaluator.Name}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="detail-item">
                    <h4>Salary Statistics</h4>
                    {stats.salaryRecords.map((record, index) => (
                      <div key={record.SalaryID} className="personal-details-grid">
                        <p><strong>Record {index + 1}</strong></p>
                        <p><strong>Date:</strong> {new Date(record.Date).toLocaleDateString()}</p>
                        <p><strong>Basic Pay:</strong> ${record.BasicPay}</p>
                        <p><strong>Allowances:</strong> ${record.Allowances}</p>
                        <p><strong>Deductions:</strong> ${record.Deductions}</p>
                        <p><strong>Bonuses:</strong> ${record.Bonuses}</p>
                        <p><strong>Total:</strong> ${(
                          parseFloat(record.BasicPay) +
                          parseFloat(record.Allowances) +
                          parseFloat(record.Bonuses) -
                          parseFloat(record.Deductions)
                        ).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Salary Section */}
          <div className="dashboard-section">
            <div className="personal-details-header">
              <h2 className="personal-details-title">Current Salary Details</h2>
            </div>
            <div className="form-container">
              <button
                onClick={() => fetchData("salary", "/api/admins/mysalary", setSalary)}
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
                      <p><strong>Basic Pay:</strong> ${salary.BasicPay}</p>
                      <p><strong>Allowances:</strong> ${salary.Allowances}</p>
                      <p><strong>Deductions:</strong> ${salary.Deductions}</p>
                      <p><strong>Bonuses:</strong> ${salary.Bonuses}</p>
                      <p><strong>Total:</strong> ${(
                        parseFloat(salary.BasicPay) +
                        parseFloat(salary.Allowances) +
                        parseFloat(salary.Bonuses) -
                        parseFloat(salary.Deductions)
                      ).toFixed(2)}</p>
                      <div>
                        <p><strong>Net Salary:</strong> ${calculateNetSalary(salary.BasicPay, salary.Allowances, salary.Deductions, salary.Bonuses)}</p>
                      </div>
                      <button
                        onClick={() => {
                          const doc = new jsPDF();
                          const totalAmount = calculateNetSalary(
                            salary.BasicPay,
                            salary.Allowances,
                            salary.Deductions,
                            salary.Bonuses
                          );
                      
                          doc.setFontSize(20);
                          doc.text("Salary Slip", 85, 20);
                          doc.setFontSize(12);
                          doc.text(`Employee Name: ${adminDetails.Name}`, 20, 35);
                          doc.text(`Employee ID: ${adminDetails.EmployeeID}`, 20, 42);
                          doc.text(`Department: ${adminDetails.Department}`, 20, 49);
                          doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 56);
                      
                          const tableData = [
                            ["Component", "Amount ($)"],
                            ["Basic Pay", salary.BasicPay],
                            ["Allowances", salary.Allowances],
                            ["Bonuses", salary.Bonuses],
                            ["Deductions", salary.Deductions],
                            ["Total", totalAmount]
                          ];
                      
                          doc.autoTable({
                            startY: 65,
                            head: [tableData[0]],
                            body: tableData.slice(1),
                            theme: 'grid'
                          });
                      
                          doc.save(`salary-slip-${adminDetails.Name.replace(/ /g, "-")}.pdf`);
                        }}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: '#fff',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.25rem',
                          border: 'none',
                          cursor: 'pointer',
                          marginTop: '1rem'
                        }}
                      >
                        Download Salary Slip
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Remove the All Employees Section entirely */}
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
