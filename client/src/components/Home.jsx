import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [loans, setLoans] = useState([]);
  const { user, token, setLoggedIn, setUser } = useContext(AuthContext);
  const [showDetails, updateShowDetails] = useState("-1");
  const navigate = useNavigate();

  const fetchLoans = async () => {
    try {
      const loanData = await axios.get(
        "https://loan-app-be-onjz.onrender.com/api/v1/loans",
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      setLoans(loanData.data.Loans);
      console.log(loanData.data.Loans);
    } catch (err) {
      console.error(err);
      alert(`Can't fetch the loans\nError: ${err}`);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `https://loan-app-be-onjz.onrender.com/api/v1/loans/update-status/`,
        { id, status },
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      alert("Updated the loan status");
      window.location.reload(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(`Can't update status!\nError:${error}`);
    }
  };

  const updatePayment = async (loanId, installmentId) => {
    try {
      await axios.patch(
        `https://loan-app-be-onjz.onrender.com/api/v1/loans/repay/`,
        { loanId, installmentId },
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      alert("Paid the installment");
      window.location.reload(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(`Can't pay installment!\nError:${error}`);
    }
  };

  const handleLogout = () => {
    // Clear local storage and navigate to login page
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {user && user.user_type === "admin" ? (
        <div>
          <h3 className="text-2xl font-bold">Admin</h3>
        </div>
      ) : (
        <div>
          {user && <h3 className="text-2xl font-bold"> Name: {user.name}</h3>}
          {user && <h3 className="text-2xl font-bold"> Email: {user.email}</h3>}
        </div>
      )}

      <button
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleLogout}
      >
        Logout
      </button>

      {loans.length ? (
        <>
          <table className="min-w-full bg-white border border-gray-300 mt-4">
            <thead>
              <tr>
                {user.user_type === "admin" && <th>User Id</th>}
                {user.user_type === "admin" && <th>Name</th>}
                {user.user_type === "admin" && <th>Email</th>}
                <th>Amount</th>
                <th>Terms</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, idx) => (
                <>
                  <tr key={idx}>
                    {user.user_type === "admin" && <td>{loan.user_id._id}</td>}
                    {user.user_type === "admin" && <td>{loan.user_id.name}</td>}
                    {user.user_type === "admin" && (
                      <td>{loan.user_id.email}</td>
                    )}
                    <td>{loan.amount}</td>
                    <td>{loan.terms}</td>
                    <td>{loan.status}</td>
                    <td>{loan.createdAt.slice(0, 10)}</td>
                    <td>
                      {user &&
                      user.user_type === "admin" &&
                      loan.status === "pending" ? (
                        <>
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            onClick={() => updateStatus(loan._id, "accepted")}
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => updateStatus(loan._id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      ) : loan.status !== "rejected" ? (
                        <>
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => updateShowDetails(loan._id)}
                          >
                            View Details
                          </button>{" "}
                        </>
                      ) : (
                        <button
                          className="bg-gray-300 text-gray-600 px-4 py-2 rounded"
                          disabled
                        >
                          Rejected :(
                        </button>
                      )}
                    </td>
                  </tr>
                  {showDetails === loan._id && (
                    <>
                      {/* {loan} */}
                      <h2>Total Amount:{loan.amount}</h2>
                      <h2>Remaining Amount:{loan.remainingAmount}</h2>
                      <table>
                        {loan.repayments && (
                          <>
                            <tr>
                              <th>Amount</th>
                              <th>Due</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                            {loan.repayments.map((repay) => (
                              <tr key={repay._id}>
                                <td>{repay.amount}</td>
                                <td>{repay.date.slice(0, 15)}</td>
                                <td>{repay.status}</td>
                                <td>
                                  {repay.status === "pending" ? (
                                    <button
                                      disabled={loan.status !== "accepted"}
                                      onClick={() => {
                                        updatePayment(loan._id, repay._id);
                                      }}
                                    >
                                      Repay
                                    </button>
                                  ) : (
                                    <button disabled>Paid :)</button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </table>
                    </>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No loans found!</p>
      )}
      <br />
      <a href="/createLoan" className="text-blue-500">
        Create New Loan +
      </a>
    </div>
  );
};

export default Home;
