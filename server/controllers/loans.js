import Loan from "../models/loan.js";

export const getLoans = async (req, res) => {
  try {
    let loans;
    if (req.user.user_type === "admin") {
      loans = await Loan.find().populate("user_id");
    } else {
      loans = await Loan.find({ user_id: req.user._id });
    }
    return res.status(200).json({ Loans: loans });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error });
  }
};

export const createLoan = async (req, res) => {
  try {
    const { amount, terms } = req.body;
    const loan = new Loan({
      user_id: req.user._id,
      amount,
      terms,
      repayments: [],
      remainingAmount: amount,
    });

    // Generate scheduled repayments
    const repaymentAmount = (amount / terms).toFixed(2);
    const today = new Date();
    for (let i = 0; i < terms; i++) {
      const repaymentDate = new Date(today);
      repaymentDate.setDate(today.getDate() + 7 * (i + 1));
      loan.repayments.push({
        date: repaymentDate,
        amount: repaymentAmount,
      });
    }

    await loan.save();
    return res.status(201).json({ loan });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error });
  }
};

export const updateLoan = async (req, res) => {
  try {
    console.log(req.user.user_type);
    if (req.user.user_type !== "admin") throw "you are not authorized";
    const { id, status } = req.body;
    const loan = await Loan.findByIdAndUpdate(id, { status });
    loan.status = status;
    return res.status(200).json({ msg: "Status updated!", loan });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error });
  }
};

export const repayLoan = async (req, res) => {
  try {
    const { loanId, installmentId } = req.body;
    const loan = await Loan.findById(loanId);
    const installmentAmount = loan.repayments[0].amount;
    loan.repayments.filter((installment) => {
      if (installment._id == installmentId) installment.status = "paid";
    });
    loan.remainingAmount -= installmentAmount;
    await Loan.findByIdAndUpdate(loanId, loan);
    return res.status(200).json({ msg: "Installment paid" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error });
  }
};
