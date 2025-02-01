import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard2Content = () => {
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
    <div style={{ margin: "20px" }}>
      <h2>Admin Dashboard</h2>

      {/* All Employees Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>All Employees</h3>
        <button
          onClick={() => fetchData("employees", "/api/admins/", setEmployees)}
          disabled={loading.employees}
        >
          {loading.employees ? "Loading..." : "Fetch All Employees"}
        </button>
        <pre>
          {fetched.employees
            ? employees
              ? JSON.stringify(employees, null, 2)
              : "No record"
            : ""}
        </pre>
      </div>

      {/* Create User Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Create Credentials</h3>
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
              />
            </label>
          </div>
          <button type="submit" disabled={loading.createUser}>
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
      <div style={{ marginBottom: "20px" }}>
        <h3>Add Employee</h3>
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
              />
            </label>
          </div>
          <button type="submit" disabled={loading.createEmployee}>
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

      {/* Get Employee by ID Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Get Employee by ID</h3>
        <form onSubmit={handleEmployeeByIdSubmit}>
          <div>
            <label>
              Employee ID:
              <input
                type="number"
                value={employeeById}
                onChange={handleEmployeeByIdChange}
                required
              />
            </label>
          </div>
          <button type="submit" disabled={loadingEmployeeById}>
            {loadingEmployeeById ? "Fetching..." : "Get Employee"}
          </button>
        </form>
        {employeeByIdResponse && (
          <div>
            <h4>Employee Details:</h4>
            <pre>{JSON.stringify(employeeByIdResponse, null, 2)}</pre>
          </div>
        )}
        {employeeByIdError && (
          <p style={{ color: "red" }}>{employeeByIdError}</p>
        )}
      </div>
      {/* Performance Stats by Employee ID */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Performance Stats (By Employee ID)</h3>
        <input
          type="number"
          placeholder="Enter Employee ID"
          value={employeeIDForPerformance}
          onChange={(e) => setEmployeeIDForPerformance(e.target.value)}
        />
        <button onClick={fetchPerformanceByEmployeeID} disabled={loadingPerformance}>
          {loadingPerformance ? "Loading..." : "Fetch Performance Stats"}
        </button>
        {performanceError && <p style={{ color: "red" }}>{performanceError}</p>}
        <pre>{performance ? JSON.stringify(performance, null, 2) : ""}</pre>
      </div>
      {/* Evaluations by Evaluator ID Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Evaluations by Evaluator ID</h3>
        <input
            type="number"
            placeholder="Enter Evaluator ID"
            value={evaluatorID}
            onChange={(e) => setEvaluatorID(e.target.value)}
        />
        <button onClick={fetchEvaluationsByEvaluatorID} disabled={loadingEvaluations}>
          {loadingEvaluations ? "Loading..." : "Fetch Evaluations"}
        </button>
        {evaluationsError && <p style={{ color: "red" }}>{evaluationsError}</p>}
        <pre>{evaluations ? JSON.stringify(evaluations, null, 2) : ""}</pre>
        </div>
      {/* Payroll History by Employee ID Section */}
<div style={{ marginBottom: "20px" }}>
  <h3>Payroll History by Employee ID</h3>
  <input
    type="number"
    placeholder="Enter Employee ID"
    value={payrollEmployeeID}
    onChange={(e) => setPayrollEmployeeID(e.target.value)}
  />
  <button onClick={fetchPayrollHistoryByEmployeeID} disabled={loadingPayrollHistory}>
    {loadingPayrollHistory ? "Loading..." : "Fetch Payroll History"}
  </button>
  {payrollHistoryError && <p style={{ color: "red" }}>{payrollHistoryError}</p>}
  <pre>{payrollHistoryData ? JSON.stringify(payrollHistoryData, null, 2) : ""}</pre>
</div>
    {/* Salary by Employee ID Section */}
<div style={{ marginBottom: "20px" }}>
  <h3>Salary by Employee ID</h3>
  <input
    type="number"
    placeholder="Enter Employee ID"
    value={salaryEmployeeID}
    onChange={(e) => setSalaryEmployeeID(e.target.value)}
  />
  <button onClick={fetchSalaryByEmployeeID} disabled={loadingSalary}>
    {loadingSalary ? "Loading..." : "Fetch Salary"}
  </button>
  {salaryError && <p style={{ color: "red" }}>{salaryError}</p>}
  <pre>{salaryData ? JSON.stringify(salaryData, null, 2) : ""}</pre>
</div>
{/* Add Employee Evaluation Section */}
<div style={{ marginBottom: "20px" }}>
  <h3>Add Employee Evaluation</h3>
  
  <input
    type="number"
    placeholder="Evaluator ID"
    value={evaluationEvaluatorID}
    onChange={(e) => setEvaluationEvaluatorID(e.target.value)}
  />
  
  <input
    type="number"
    placeholder="Employee ID"
    value={evaluationEmployeeID}
    onChange={(e) => setEvaluationEmployeeID(e.target.value)}
  />
  
  <input
    type="text"
    placeholder="Grade (e.g., A, B, C)"
    value={evaluationGrade}
    onChange={(e) => setEvaluationGrade(e.target.value)}
  />
  
  <input
    type="date"
    placeholder="Evaluation Date"
    value={evaluationDate}
    onChange={(e) => setEvaluationDate(e.target.value)}
  />
  
  <textarea
    placeholder="Comments (Optional)"
    value={evaluationComments}
    onChange={(e) => setEvaluationComments(e.target.value)}
  />
  
  <button onClick={submitEvaluation} disabled={loadingEvaluation}>
    {loadingEvaluation ? "Submitting..." : "Submit Evaluation"}
  </button>

  {evaluationError && <p style={{ color: "red" }}>{evaluationError}</p>}
  {evaluationResponse && <p style={{ color: "green" }}>{evaluationResponse.message}</p>}
</div>
{/* Add Salary Section */}
<div style={{ marginBottom: "20px" }}>
  <h3>Add Salary</h3>
  <form onSubmit={handleSalarySubmit}>
    <div>
      <label>
        Employee ID:
        <input
          type="text"
          name="EmployeeID"
          value={salaryFormValues.EmployeeID}
          onChange={handleSalaryInputChange}
          required
        />
      </label>
    </div>
    <div>
      <label>
        Basic Pay:
        <input
          type="number"
          name="BasicPay"
          value={salaryFormValues.BasicPay}
          onChange={handleSalaryInputChange}
          required
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
        />
      </label>
    </div>
    <div>
      <label>
        Date:
        <input
          type="date"
          name="Date"
          value={salaryFormValues.Date}
          onChange={handleSalaryInputChange}
          required
        />
      </label>
    </div>
    <button type="submit" disabled={loadingSalarySubmit}>
      {loadingSalarySubmit ? "Submitting..." : "Submit Salary"}
    </button>
  </form>
  {salaryResponse && (
    <p style={{ color: "green" }}>{salaryResponse.message || "Salary added successfully."}</p>
  )}
  {salaryError && <p style={{ color: "red" }}>{salaryError}</p>}
</div>

  </div>

  );
};

export default AdminDashboard2Content;
