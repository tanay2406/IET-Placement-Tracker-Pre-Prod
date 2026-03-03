import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SubscribeConsultation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const handleUnlock = async () => {
    setLoading(true);
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://iet-placement-tracker-pre-prod-production.up.railway.app/api/makeSubscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sub: storedUser.sub,
            company_id: 100,  // default id
            subscription_type: "consultation",
            transaction_id: "FREE_CONSULTATION"
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      navigate("/subscriptions");
    } catch (error) {
      console.error("Error:", error);
    }finally {
          setLoading(false);
    }
  };

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
          Unlock 1:1 consultation
          
        </h1>

        <button 
          onClick={handleUnlock}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-lg font-medium transition duration-300 shadow-lg hover:shadow-blue-500/40"
        >
          Unlock
        </button>
        

      </div>
      <br /><br /><br />
      <div>
        <h3> <h1 className="text-2xl">📘 Placement Consultation (Free Session)</h1><br />

This consultation is a general discussion about:

How placements happened in previous years

The overall placement scenario

Preparation strategy and common mistakes

Any doubts you have regarding placements

You will be meeting with a senior from the 2026 batch, who has experienced the placement process firsthand.
<br></br><br></br>
<h1 className="text-2xl">📅 How It Works </h1><br />

The meeting link will be shared on your provided Gmail ID along with the scheduled time.

The session duration will be around 20–25 minutes.

This session is completely free of cost (for now).
<br></br><br></br>
<h1 className="text-2xl">📩 Need Help?</h1> 
For any queries, you can reach out to us at:
ietplacementtracker@gmail.com
</h3>


{/* ✅ loader HERE */}
      {loading && (
  <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
    <div className="h-10 w-10 rounded-full border-4 border-white/30 border-t-white animate-spin" />
  </div>
)}
      </div>



    </div>
  );
}