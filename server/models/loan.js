import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      require: true,
    },
    terms: {
      type: Number,
      require: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Auth",
    },
    status: {
      type: String,
      default: "pending",
    },
    outStanding:{
      type:Number
    },
    remainingAmount:{
      type:Number
    },
    repayments: [
      {
        date: String,
        amount: Number,
        status:{
          type:String,
          default:"pending"
        }
      },
    ],
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
