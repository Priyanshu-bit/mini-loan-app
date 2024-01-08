import { useContext, useState } from "react";
import { AuthContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateLoan = () => {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!amount || !term) throw "Fill all details!";
      await axios.post(
        "https://loan-app-be-onjz.onrender.com/api/v1/loans/create",
        { amount, terms: term },
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      alert("Loan creation successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(`Can't create the loan!\nError: ${error}`);
    }
  };

  return (
    <div className="CreateLoan">
      <div>
        <h2>Loan Application Form</h2>
        <form onSubmit={handleFormSubmit}>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Terms:
            <input
              type="number"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoan;
