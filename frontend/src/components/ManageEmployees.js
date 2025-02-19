import React, { useState } from "react";
import axios from "axios";
import "./AdminDashboard.css"; // Using the same CSS file for consistency
import { useNavigate } from "react-router-dom";

const ManageEmployees = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/admins');
  };
  // Combine all state declarations at the top
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    employeeId: "",
  });
  const [employeeFormValues, setEmployeeFormValues] = useState({
    Name: "",
    Department: "",
    ContactNo: "",
    Address: "",
    Email: "",
    RoleID: "",
    DateOfJoining: "",
    SupervisorID: "",
  });
  const [salaryFormValues, setSalaryFormValues] = useState({
    EmployeeID: "",
    BasicPay: "",
    Allowances: "",
    Deductions: "",
    Bonuses: "",
    Date: "",
  });
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [updateResponse, setUpdateResponse] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [salaryResponse, setSalaryResponse] = useState(null);
  const [salarryError, setSalarryError] = useState(null);
  const [loadingSalarySubmit, setLoadingSalarySubmit] = useState(false);
  const [salaryEmployeeID, setSalaryEmployeeID] = useState("");
const [salaryData, setSalaryData] = useState(null);
const [salaryError, setSalaryError] = useState(null);
const [loadingSalary, setLoadingSalary] = useState(false);
  const [payrollEmployeeID, setPayrollEmployeeID] = useState("");
const [payrollHistoryData, setPayrollHistoryData] = useState(null);
const [payrollHistoryError, setPayrollHistoryError] = useState(null);
const [loadingPayrollHistory, setLoadingPayrollHistory] = useState(false);

  const [createUserResponse, setCreateUserResponse] = useState(null);
  const [createUserError, setCreateUserError] = useState(null);
  const [employeeAddResponse, setEmployeeAddResponse] = useState(null);
  const [employeeAddError, setEmployeeAddError] = useState(null);
  // These are the correct declarations to keep (at the top)
  const [employees, setEmployees] = useState(null);
  const [employeeById, setEmployeeById] = useState("");
const [employeeByIdResponse, setEmployeeByIdResponse] = useState(null);
const [employeeByIdError, setEmployeeByIdError] = useState(null);
const [loadingEmployeeById, setLoadingEmployeeById] = useState(false);
const [evaluationEvaluatorID, setEvaluationEvaluatorID] = useState("");
  const [evaluationEmployeeID, setEvaluationEmployeeID] = useState("");
  const [evaluationGrade, setEvaluationGrade] = useState("");
  const [evaluationDate, setEvaluationDate] = useState("");
  const [evaluationComments, setEvaluationComments] = useState("");
  const [evaluationResponse, setEvaluationResponse] = useState(null);
  const [evaluationError, setEvaluationError] = useState(null);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [updateEmployeeForm, setUpdateEmployeeForm] = useState({
    employeeID: "",
    Name: "",
    Department: "",
    ContactNo: "",
    Address: "",
    Email: "",
    RoleID: "",
    DateOfJoining: "",
    SupervisorID: ""
  });
  
  const [loading, setLoading] = useState({
    createUser: false,
    createEmployee: false,
    employees: false,
  });
  const [fetched, setFetched] = useState({
    employees: false,
  });
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
  const handleUpdateEmployeeSubmit = async (e) => {
    e.preventDefault();
    setUpdateResponse(null);
    setUpdateError(null);
    setLoadingUpdate(true);
  
    const token = localStorage.getItem("token");
    if (!token) {
      setUpdateError("Not authenticated");
      setLoadingUpdate(false);
      return;
    }
  
    // Create an object with only the fields that have values
    const updateData = {};
    Object.keys(updateEmployeeForm).forEach(key => {
      if (updateEmployeeForm[key]) {
        updateData[key] = updateEmployeeForm[key];
      }
    });
  
    // Basic email validation
    if (updateData.Email && !updateData.Email.includes('@')) {
      setUpdateError("Please enter a valid email address");
      setLoadingUpdate(false);
      return;
    }
  
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(
        `/api/admins/update/${updateEmployeeForm.employeeID}`,
        updateData,
        { headers }
      );
      setUpdateResponse("Employee updated successfully");
      // Clear form after successful update
      setUpdateEmployeeForm({
        employeeID: "",
        Name: "",
        Department: "",
        ContactNo: "",
        Address: "",
        Email: "",
        RoleID: "",
        DateOfJoining: "",
        SupervisorID: ""
      });
    } catch (error) {
      setUpdateError(error.response?.data?.error || "Error updating employee");
    } finally {
      setLoadingUpdate(false);
    }
  };
  
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateEmployeeForm(prev => ({
      ...prev,
      [name]: value
    }));
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
    // Clear form after successful submission
    setSalaryFormValues({
      EmployeeID: "",
      BasicPay: "",
      Allowances: "",
      Deductions: "",
      Bonuses: "",
      Date: "",
    });
  } catch (error) {
    setSalarryError("Error submitting salary details.");
  } finally {
    setLoadingSalarySubmit(false);
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
      
      // Clear form after successful submission
      setEvaluationEvaluatorID("");
      setEvaluationEmployeeID("");
      setEvaluationGrade("");
      setEvaluationDate("");
      setEvaluationComments("");
    } catch (error) {
      setEvaluationError("Error submitting evaluation.");
    } finally {
      setLoadingEvaluation(false);
    }
  };
  const handleEmployeeByIdChange = (e) => {
    setEmployeeById(e.target.value);
  };
  const handleEmployeeByIdSubmit = async (e) => {
    e.preventDefault();
    setEmployeeByIdResponse(null);
  setEmployeeByIdError(null);

  const token = localStorage.getItem("token");
  if (!token) {
    setEmployeeByIdError("Not authenticated");
    return;
  }
  setLoadingEmployeeById(true);
  try {
    const res = await axios.get(`/api/admins/emp/${employeeById}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEmployeeByIdResponse(res.data);
  } catch (error) {
    setEmployeeByIdError(
      error.response?.data?.message || "Error fetching employee details"
    );
  } finally {
    setLoadingEmployeeById(false);
  }
};
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
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
  const calculateNetSalary = (payroll) => {
    const basicPay = parseFloat(payroll.BasicPay) || 0;
    const allowances = parseFloat(payroll.Allowances) || 0;
    const deductions = parseFloat(payroll.Deductions) || 0;
    const bonuses = parseFloat(payroll.Bonuses) || 0;
    
    return (basicPay + allowances + bonuses - deductions).toFixed(2);
  };
  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
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
          Name: employeeFormValues.Name,
          Department: employeeFormValues.Department,
          ContactNo: employeeFormValues.ContactNo,
          Address: employeeFormValues.Address,
          Email: employeeFormValues.Email,
          RoleID: employeeFormValues.RoleID,
          DateOfJoining: employeeFormValues.DateOfJoining,
          SupervisorID: employeeFormValues.SupervisorID,
        },
        { headers }
      );
      setEmployeeAddResponse(
        res.data.message || "Employee added successfully."
      );
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


  // Add this new function
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

  // New state variables for performance and evaluations
  const [employeeIDForPerformance, setEmployeeIDForPerformance] = useState("");
  const [performance, setPerformance] = useState(null);
  const [performanceError, setPerformanceError] = useState(null);
  const [loadingPerformance, setLoadingPerformance] = useState(false);

  const [evaluatorID, setEvaluatorID] = useState("");
  const [evaluations, setEvaluations] = useState(null);
  const [evaluationsError, setEvaluationsError] = useState(null);
  const [loadingEvaluations, setLoadingEvaluations] = useState(false);

  // Function to fetch performance stats
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
      setPerformanceError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Error fetching performance stats. Please check if the employee ID exists."
      );
    } finally {
      setLoadingPerformance(false);
    }
  };

  // Function to fetch evaluations by evaluator ID
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

  return (
    <div className="admin-dashboard">
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
        ← Back
      </button>
      <div className="dashboard-container" style={{ padding: '2rem' }}>
        <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="dashboard-title" style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '1rem' }}>
            Manage Employees
          </h1>
          <p className="dashboard-subtitle" style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
            Add and manage employee information
          </p>
        </div>

        <div className="dashboard-content" style={{ 
  width: '100%', 
  color: '#e2e8f0',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)', // Changed from 'repeat(3, 1fr)'
  gap: '2rem',
  padding: '1rem'
}}>
          {/* Create User Section */}
          <div style={{ 
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(148, 163, 184, 0.1)'
          }}>
            <h3 style={{ 
              color: '#fff', 
              fontSize: '1.5rem', 
              marginBottom: '1.5rem',
              borderBottom: '2px solid #60a5fa',
              paddingBottom: '0.5rem'
            }}>Create Credentials</h3>
            <form onSubmit={handleFormSubmit}>
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
          <div style={{ 
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(148, 163, 184, 0.1)'
          }}>
            <h3 style={{ 
              color: '#fff', 
              fontSize: '1.5rem', 
              marginBottom: '1.5rem',
              borderBottom: '2px solid #60a5fa',
              paddingBottom: '0.5rem'
            }}>Add Employee</h3>
            <form onSubmit={handleAddEmployeeSubmit}>
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
          <div style={{ 
  background: 'rgba(30, 41, 59, 0.5)',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(148, 163, 184, 0.1)',
}}>

{/* Get Employee by ID Section */}
<div style={{ 
  background: 'rgba(30, 41, 59, 0.5)',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(148, 163, 184, 0.1)',
}}>
  <h3 style={{ 
    color: '#fff', 
    fontSize: '1.5rem', 
    marginBottom: '1.5rem',
    borderBottom: '2px solid #60a5fa',
    paddingBottom: '0.5rem'
  }}>Get Employee by ID</h3>
  <form onSubmit={handleEmployeeByIdSubmit}>
    
    <div>
      <label>
        Employee ID:
        <input
          type="number"
          value={employeeById}
          onChange={handleEmployeeByIdChange}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
      </label>
    </div>
    <button 
      type="submit" 
      disabled={loadingEmployeeById}
      style={{
        width: '100%',
        backgroundColor: '#60a5fa',
        color: '#fff',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      {loadingEmployeeById ? "Fetching..." : "Get Employee"}
    </button>
  </form>
  
  {employeeByIdResponse && (
    <div style={{
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: 'rgba(51, 65, 85, 0.4)',
      borderRadius: '8px'
    }}>
      <h4 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Employee Details:</h4>
      <div style={{ 
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        padding: '1rem',
        borderRadius: '8px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <p><strong>Employee ID:</strong> {employeeByIdResponse.EmployeeID}</p>
        <p><strong>Name:</strong> {employeeByIdResponse.Name}</p>
        <p><strong>Department:</strong> {employeeByIdResponse.Department || 'N/A'}</p>
        <p><strong>Contact:</strong> {employeeByIdResponse.ContactNo || 'N/A'}</p>
        <p><strong>Email:</strong> {employeeByIdResponse.Email || 'N/A'}</p>
        <p><strong>Role ID:</strong> {employeeByIdResponse.RoleID || 'N/A'}</p>
        <p><strong>Supervisor ID:</strong> {employeeByIdResponse.SupervisorID || 'N/A'}</p>
        <p><strong>Date of Joining:</strong> {employeeByIdResponse.DateOfJoining || 'N/A'}</p>
        <p><strong>Address:</strong> {employeeByIdResponse.Address || 'N/A'}</p>
      </div>
    </div>
  )}
  
  {employeeByIdError && (
    <p style={{ color: "#ef4444", marginTop: '1rem' }}>{employeeByIdError}</p>
  )}
</div>
{/* All Employees Section */}
<div style={{ 
  background: 'rgba(30, 41, 59, 0.5)',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(148, 163, 184, 0.1)',
}}>
  <h3 style={{ 
    color: '#fff', 
    fontSize: '1.5rem', 
    marginBottom: '1.5rem',
    borderBottom: '2px solid #60a5fa',
    paddingBottom: '0.5rem'
  }}>All Employees</h3>
  
            
            <button
              onClick={() => fetchData("employees", "/api/admins/", setEmployees)}
              disabled={loading.employees}
              style={{
                width: '100%',
                backgroundColor: '#60a5fa',
                color: '#fff',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              {loading.employees ? "Loading..." : "Fetch All Employees"}
            </button>
          
            {fetched.employees && (
              <div style={{
                backgroundColor: 'rgba(51, 65, 85, 0.4)',
                borderRadius: '8px',
                padding: '1rem',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {employees ? (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {Array.isArray(employees) && employees.map((employee) => (
                      <div key={employee.EmployeeID} style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(148, 163, 184, 0.1)'
                      }}>
                        <h4 style={{ color: '#60a5fa', marginBottom: '0.5rem' }}>
                          {employee.Name} (ID: {employee.EmployeeID})
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                          <p>Department: {employee.Department || 'N/A'}</p>
                          <p>Contact: {employee.ContactNo || 'N/A'}</p>
                          <p>Email: {employee.Email || 'N/A'}</p>
                          <p>Role ID: {employee.RoleID || 'N/A'}</p>
                          <p>Supervisor ID: {employee.SupervisorID || 'N/A'}</p>
                          <p>Joining Date: {employee.DateOfJoining || 'N/A'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#94a3b8', textAlign: 'center' }}>No record</p>
                )}
              </div>
            )}
          </div>
        </div>
                  {/* Add Performance Stats Section */}
                  <div style={{ 
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
          }}>
            <h3 style={{ 
              color: '#fff', 
              fontSize: '1.5rem', 
              marginBottom: '1.5rem',
              borderBottom: '2px solid #60a5fa',
              paddingBottom: '0.5rem'
            }}>Performance Stats</h3>
            
            <div>
              <label>
                Employee ID:
                <input
                  type="number"
                  placeholder="Enter Employee ID"
                  value={employeeIDForPerformance}
                  onChange={(e) => setEmployeeIDForPerformance(e.target.value)}
                  style={{ width: '100%', marginBottom: '1rem' }}
                />
              </label>
            </div>
            
            <button 
              onClick={fetchPerformanceByEmployeeID} 
              disabled={loadingPerformance}
              style={{
                width: '100%',
                backgroundColor: '#60a5fa',
                color: '#fff',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              {loadingPerformance ? "Loading..." : "Fetch Performance Stats"}
            </button>

            {performanceError && (
              <p style={{ color: "#ef4444", marginTop: '1rem' }}>{performanceError}</p>
            )}

            {performance && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'rgba(51, 65, 85, 0.4)',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Performance Details:</h4>
                <div style={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  padding: '1rem',
                  borderRadius: '8px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {Array.isArray(performance) && performance.map((evaluation) => (
                    <div 
                      key={evaluation.EvaluationID}
                      style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                        display: 'grid',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 2fr))', gap: '2rem' }}>
                        <p><strong>Evaluation ID:</strong> {evaluation.EvaluationID}</p>
                        <p><strong>Grade:</strong> {evaluation.Grade}</p>
                        <p><strong>Date:</strong> {new Date(evaluation.EvaluationDate).toLocaleDateString()}</p>
                        <p><strong>Employee:</strong> {evaluation.Employee.Name} (ID: {evaluation.Employee.EmployeeID})</p>
                        <p><strong>Evaluator:</strong> {evaluation.Evaluator.Name} (ID: {evaluation.Evaluator.EmployeeID})</p>
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <p><strong>Comments:</strong> {evaluation.Comments}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ 
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '2rem',
  width: '100%'
}}>
          {/* Evaluations by Evaluator ID */}
  <div style={{ 
    background: 'rgba(30, 41, 59, 0.5)',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    gridColumn: '1 / -1'  
  }}>
    <h3 style={{ 
      color: '#fff', 
      fontSize: '1.5rem', 
      marginBottom: '1.5rem',
      borderBottom: '2px solid #60a5fa',
      paddingBottom: '0.5rem'
    }}>Evaluations by Evaluator ID</h3>
            
            <div>
              <label>
                Evaluator ID:
                <input
                  type="number"
                  placeholder="Enter Evaluator ID"
                  value={evaluatorID}
                  onChange={(e) => setEvaluatorID(e.target.value)}
                  style={{ width: '100%', marginBottom: '1rem' }}
                />
              </label>
            </div>
            
            <button 
              onClick={fetchEvaluationsByEvaluatorID} 
              disabled={loadingEvaluations}
              style={{
                width: '100%',
                backgroundColor: '#60a5fa',
                color: '#fff',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              {loadingEvaluations ? "Loading..." : "Fetch Evaluations"}
            </button>

            {evaluationsError && (
              <p style={{ color: "#ef4444", marginTop: '1rem' }}>{evaluationsError}</p>
            )}

            {evaluations && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'rgba(51, 65, 85, 0.4)',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Evaluation Details:</h4>
                <div style={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  padding: '1rem',
                  borderRadius: '8px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {Array.isArray(evaluations) && evaluations.map((evaluation) => (
                    <div 
                      key={evaluation.EvaluationID}
                      style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                        display: 'grid',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <p><strong>Evaluation ID:</strong> {evaluation.EvaluationID}</p>
                        <p><strong>Grade:</strong> {evaluation.Grade}</p>
                        <p><strong>Date:</strong> {new Date(evaluation.EvaluationDate).toLocaleDateString()}</p>
                        <p><strong>Employee:</strong> {evaluation.Employee.Name} (ID: {evaluation.Employee.EmployeeID})</p>
                        <p><strong>Evaluator:</strong> {evaluation.Evaluator.Name} (ID: {evaluation.Evaluator.EmployeeID})</p>
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <p><strong>Comments:</strong> {evaluation.Comments}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Add Payroll History Section */}
<div style={{ 
  background: 'rgba(30, 41, 59, 0.5)',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(148, 163, 184, 0.1)',
  gridColumn: '1 / -1'
}}>
  <h3 style={{ 
    color: '#fff', 
    fontSize: '1.5rem', 
    marginBottom: '1.5rem',
    borderBottom: '2px solid #60a5fa',
    paddingBottom: '0.5rem'
  }}>Payroll History by Employee ID</h3>
  
  <div>
    <label>
      Employee ID:
      <input
        type="number"
        placeholder="Enter Employee ID"
        value={payrollEmployeeID}
        onChange={(e) => setPayrollEmployeeID(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />
    </label>
  </div>
  
  <button 
    onClick={fetchPayrollHistoryByEmployeeID} 
    disabled={loadingPayrollHistory}
    style={{
      width: '100%',
      backgroundColor: '#60a5fa',
      color: '#fff',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      marginBottom: '1rem'
    }}
  >
    {loadingPayrollHistory ? "Loading..." : "Fetch Payroll History"}
  </button>

  {payrollHistoryError && (
    <p style={{ color: "#ef4444", marginTop: '1rem' }}>{payrollHistoryError}</p>
  )}

  {payrollHistoryData && (
    <div style={{
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: 'rgba(51, 65, 85, 0.4)',
      borderRadius: '8px'
    }}>
      <h4 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Payroll History:</h4>
      <div style={{ 
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        padding: '1rem',
        borderRadius: '8px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {Array.isArray(payrollHistoryData) && payrollHistoryData.map((payroll) => (
          <div 
            key={payroll.PayrollID}
            style={{
              padding: '1rem',
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
              display: 'grid',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <p><strong>Payroll ID:</strong> {payroll.PayrollID}</p>
              <p><strong>Employee ID:</strong> {payroll.EmployeeID}</p>
              <p><strong>Basic Pay:</strong> ${payroll.BasicPay}</p>
              <p><strong>Allowances:</strong> ${payroll.Allowances}</p>
              <p><strong>Deductions:</strong> ${payroll.Deductions}</p>
              <p><strong>Bonuses:</strong> ${payroll.Bonuses}</p>
              <p><strong>Date:</strong> {new Date(payroll.Date).toLocaleDateString()}</p><p><strong>Net Salary:</strong> ${calculateNetSalary(payroll)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
</div>
<div style={{ 
  background: 'rgba(30, 41, 59, 0.5)',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(148, 163, 184, 0.1)',
}}>
  <h3 style={{ 
    color: '#fff', 
    fontSize: '1.5rem', 
    marginBottom: '1.5rem',
    borderBottom: '2px solid #60a5fa',
    paddingBottom: '0.5rem'
  }}>Salary by Employee ID</h3>
  
  <div>
    <label>
      Employee ID:
      <input
        type="number"
        placeholder="Enter Employee ID"
        value={salaryEmployeeID}
        onChange={(e) => setSalaryEmployeeID(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />
    </label>
  </div>
  
  <button 
    onClick={fetchSalaryByEmployeeID} 
    disabled={loadingSalary}
    style={{
      width: '100%',
      backgroundColor: '#60a5fa',
      color: '#fff',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      marginBottom: '1rem'
    }}
  >
    {loadingSalary ? "Loading..." : "Fetch Salary"}
  </button>

  {salaryError && (
    <p style={{ color: "#ef4444", marginTop: '1rem' }}>{salaryError}</p>
  )}

  {salaryData && (
    <div style={{
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: 'rgba(51, 65, 85, 0.4)',
      borderRadius: '8px'
    }}>
      <h4 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Salary Details:</h4>
      <div style={{ 
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        padding: '1rem',
        borderRadius: '8px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <p><strong>Employee ID:</strong> {salaryData.EmployeeID}</p>
        <p><strong>Basic Pay:</strong> ${salaryData.BasicPay}</p>
        <p><strong>Allowances:</strong> ${salaryData.Allowances || '0'}</p>
        <p><strong>Deductions:</strong> ${salaryData.Deductions || '0'}</p>
        <p><strong>Bonuses:</strong> ${salaryData.Bonuses || '0'}</p>
        <p><strong>Date:</strong> {new Date(salaryData.Date).toLocaleDateString()}</p>
        <p><strong>Net Salary:</strong> ${calculateNetSalary(salaryData)}</p>
      </div>
    </div>
  )}
</div>
<div style={{ 
  background: 'rgba(30, 41, 59, 0.5)',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(148, 163, 184, 0.1)',
}}>
  <h3 style={{ 
    color: '#fff', 
    fontSize: '1.5rem', 
    marginBottom: '1.5rem',
    borderBottom: '2px solid #60a5fa',
    paddingBottom: '0.5rem'
  }}>Add Employee Evaluation</h3>
  
  <div style={{ display: 'grid', gap: '1rem' }}>
    <div>
      <label>
        Evaluator ID:
        <input
          type="number"
          placeholder="Enter Evaluator ID"
          value={evaluationEvaluatorID}
          onChange={(e) => setEvaluationEvaluatorID(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
      </label>
    </div>

    <div>
      <label>
        Employee ID:
        <input
          type="number"
          placeholder="Enter Employee ID"
          value={evaluationEmployeeID}
          onChange={(e) => setEvaluationEmployeeID(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
      </label>
    </div>

    <div>
      <label>
        Grade:
        <input
          type="text"
          placeholder="Grade (e.g., A, B, C)"
          value={evaluationGrade}
          onChange={(e) => setEvaluationGrade(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
      </label>
    </div>

    <div>
      <label>
        Evaluation Date:
        <input
          type="date"
          value={evaluationDate}
          onChange={(e) => setEvaluationDate(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
      </label>
    </div>

    <div>
      <label>
        Comments:
        <textarea
          placeholder="Comments (Optional)"
          value={evaluationComments}
          onChange={(e) => setEvaluationComments(e.target.value)}
          style={{ 
            width: '100%', 
            minHeight: '100px', 
            marginBottom: '0.5rem',
            padding: '0.5rem',
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '0.375rem',
            color: '#fff'
          }}
        />
      </label>
    </div>
  </div>
  
  <button 
    onClick={submitEvaluation} 
    disabled={loadingEvaluation}
    style={{
      width: '100%',
      backgroundColor: '#60a5fa',
      color: '#fff',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      marginTop: '1rem'
    }}
  >
    {loadingEvaluation ? "Submitting..." : "Submit Evaluation"}
  </button>

  {evaluationError && (
    <p style={{ color: "#ef4444", marginTop: '1rem' }}>{evaluationError}</p>
  )}
  {evaluationResponse && (
    <p style={{ color: "#22c55e", marginTop: '1rem' }}>{evaluationResponse.message}</p>
  )}
</div>
<div style={{ 
  background: 'rgba(30, 41, 59, 0.5)',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(148, 163, 184, 0.1)',
}}>
  <h3 style={{ 
    color: '#fff', 
    fontSize: '1.5rem', 
    marginBottom: '1.5rem',
    borderBottom: '2px solid #60a5fa',
    paddingBottom: '0.5rem'
  }}>Add Salary</h3>
  
  <form onSubmit={handleSalarySubmit}>
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <label>
          Employee ID:*
          <input
            type="text"
            name="EmployeeID"
            value={salaryFormValues.EmployeeID}
            onChange={handleSalaryInputChange}
            required
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
        </label>
      </div>

      <div>
        <label>
          Basic Pay:*
          <input
            type="number"
            name="BasicPay"
            value={salaryFormValues.BasicPay}
            onChange={handleSalaryInputChange}
            required
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
        </label>
      </div>

      <div>
        <label>
          Allowances:
          <input
            type="number"
            name="Allowances"
            value={salaryFormValues.Allowances}
            onChange={handleSalaryInputChange}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
        </label>
      </div>

      <div>
        <label>
          Deductions:
          <input
            type="number"
            name="Deductions"
            value={salaryFormValues.Deductions}
            onChange={handleSalaryInputChange}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
        </label>
      </div>

      <div>
        <label>
          Bonuses:
          <input
            type="number"
            name="Bonuses"
            value={salaryFormValues.Bonuses}
            onChange={handleSalaryInputChange}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
        </label>
      </div>

      <div>
        <label>
          Date:*
          <input
            type="date"
            name="Date"
            value={salaryFormValues.Date}
            onChange={handleSalaryInputChange}
            required
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
        </label>
      </div>
    </div>

    <button 
      type="submit" 
      disabled={loadingSalarySubmit}
      style={{
        width: '100%',
        backgroundColor: '#60a5fa',
        color: '#fff',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        marginTop: '1rem'
      }}
    >
      {loadingSalarySubmit ? "Submitting..." : "Submit Salary"}
    </button>
  </form>

  {salaryResponse && (
    <p style={{ color: "#22c55e", marginTop: '1rem' }}>
      {salaryResponse.message || "Salary added successfully."}
    </p>
  )}
  {salarryError && (
    <p style={{ color: "#ef4444", marginTop: '1rem' }}>{salarryError}</p>
  )}
</div>
<div style={{ flex: '1 1 45%', minWidth: '300px', marginTop: '20px' }}>
  <h3>Update Employee</h3>
  <form onSubmit={handleUpdateEmployeeSubmit} style={{ width: '100%' }}>
    <div>
      <label>
        Employee ID:*
        <input
          type="text"
          name="employeeID"
          value={updateEmployeeForm.employeeID}
          onChange={handleUpdateInputChange}
          required
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div>
      <label>
        Name:
        <input
          type="text"
          name="Name"
          value={updateEmployeeForm.Name}
          onChange={handleUpdateInputChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div>
      <label>
        Department:
        <input
          type="text"
          name="Department"
          value={updateEmployeeForm.Department}
          onChange={handleUpdateInputChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div>
      <label>
        Contact No:
        <input
          type="text"
          name="ContactNo"
          value={updateEmployeeForm.ContactNo}
          onChange={handleUpdateInputChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div>
      <label>
        Address:
        <textarea
          name="Address"
          value={updateEmployeeForm.Address}
          onChange={handleUpdateInputChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div>
      <label>
        Email:
        <input
          type="email"
          name="Email"
          value={updateEmployeeForm.Email}
          onChange={handleUpdateInputChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div>
      <label>
        Role ID:
        <input
          type="number"
          name="RoleID"
          value={updateEmployeeForm.RoleID}
          onChange={handleUpdateInputChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div>
      <label>
        Date Of Joining:
        <input
          type="date"
          name="DateOfJoining"
          value={updateEmployeeForm.DateOfJoining}
          onChange={handleUpdateInputChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div>
      <label>
        Supervisor ID:
        <input
          type="number"
          name="SupervisorID"
          value={updateEmployeeForm.SupervisorID}
          onChange={handleUpdateInputChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <button type="submit" disabled={loadingUpdate} style={{ width: '100%' }}>
      {loadingUpdate ? "Updating..." : "Update Employee"}
    </button>
  </form>
  {updateResponse && (
    <p style={{ color: "green" }}>{updateResponse}</p>
  )}
  {updateError && (
    <p style={{ color: "red" }}>{updateError}</p>
  )}
</div>
      </div>
      </div>
      </div>
  );
};

export default ManageEmployees;