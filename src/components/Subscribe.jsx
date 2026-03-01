import { useParams, useNavigate } from "react-router-dom";
import data2026 from "../data/2026.json";

export default function Subscribe() {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const company = data2026.find(
    (item) => String(item.id) === String(id)
  );

  // const handlePayment = async () => {
  //   const storedUser = JSON.parse(localStorage.getItem("user"));

  //   if (!storedUser) {
  //     navigate("/login");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       "http://localhost:5000/api/makeSubscription",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           sub: storedUser.sub,
  //           company_id: id,
  //           subscription_type: type,
  //         }),
  //       }
  //     );

  //     const data = await response.json();
  //     console.log("Subscription response:", data);

  //     // After successful subscription
  //     if (type === "pyq") {
  //       navigate(`/company/${id}/pyq`);
  //     } else {
  //       navigate(`/company/${id}/call`);
  //     }

  //   } catch (error) {
  //     console.error("Payment Error:", error);
  //   }
  // };


  const handlePayment = async () => {

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }
  const response = await fetch("https://iet-placement-tracker-pre-prod-production.up.railway.app/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      company_id: company.id,
      package_type: type
    })
  });

  const data = await response.json();

  openRazorpay(data);
};

const openRazorpay = (data) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }
  const options = {
    key: data.key,
    amount: data.amount,
    currency: data.currency,
    order_id: data.orderId,

    handler: async function (response) {

      const verifyRes = await fetch("https://iet-placement-tracker-pre-prod-production.up.railway.app/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          package_id: data.package_id,
          sub: storedUser.sub,
          subscription_type: "pyq",
          company_id: 1
        })
      });

      const result = await verifyRes.json();
      console.log("Verification result:", result);
      if (verifyRes.ok) {
        // ✅ redirect after backend confirms
        navigate(`/company/${1}/pyq`);
      } else {
        alert("Payment verification failed");
      }
    }

  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};



  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 text-white flex items-center justify-center">
        Company Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 text-white p-10">

      <button
        onClick={() => navigate(-1)}
        className="mb-8 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
      >
        ← Back
      </button>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-10 shadow-2xl flex flex-col md:flex-row items-center gap-8">

        <h1 className="text-2xl md:text-3xl font-semibold">
          Unlock {type.toUpperCase()} of{" "}
          <span className="text-blue-400 font-bold">
            {company.Company}
          </span>
        </h1>

        <button disabled
          onClick={handlePayment}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-lg font-medium transition duration-300 shadow-lg hover:shadow-blue-500/40"
        >
          Unlock
        </button>
        <h1 className="text-3xl">Coming Soon !!!</h1>

      </div>

    </div>
  );
}
