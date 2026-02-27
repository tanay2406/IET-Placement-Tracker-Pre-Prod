import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MySubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/getUserSubscriptions",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sub: String(storedUser.sub),
              
            }),
          }
        );

        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, [navigate]);

  const pyqSubs = subscriptions.filter(
    (sub) => sub.subscription_type === "pyq"
  );

  const callSubs = subscriptions.filter(
    (sub) => sub.subscription_type === "call"
  );

  const consultationSubs = subscriptions.filter(
  (sub) => sub.subscription_type === "consultation"
);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">My Subscriptions</h1>

      {/* PYQ Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">
          PYQ Subscriptions
        </h2>

        {pyqSubs.length === 0 ? (
          <p className="text-gray-400">No PYQ subscriptions yet.</p>
        ) : (
          pyqSubs.map((sub) => (
            <div
              key={sub.company_id}
              className="bg-gray-800 p-5 rounded-lg mb-4 flex justify-between items-center"
            >
              <span className="text-lg">
                {sub.company_name} PYQ
              </span>

              <button
                onClick={() =>
                  navigate(`/company/${sub.company_id}/pyq`)
                }
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
              >
                Open
              </button>
            </div>
          ))
        )}
      </div>

      {/* CALL Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-green-400">
          1:1 Call Subscriptions
        </h2>

        {callSubs.length === 0 ? (
          <p className="text-gray-400">No Call subscriptions yet.</p>
        ) : (
          callSubs.map((sub) => (
            <div
              key={sub.company_id}
              className="bg-gray-800 p-5 rounded-lg mb-4 flex justify-between items-center"
            >
              <span className="text-lg">
                {sub.company_name} 1:1 Call
              </span>

              <button
                onClick={() =>
                  navigate(`/company/${sub.company_id}/call`)
                }
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
              >
                Open
              </button>
            </div>
          ))
        )}
      </div>

      {/* Consultation Section */}
<div className="mt-10">
  <h2 className="text-2xl font-bold mb-4 text-blue-400">
    Consultation
  </h2>

  {consultationSubs.length === 0 ? (
    <p className="text-gray-400">No consultation booked yet.</p>
  ) : (
    <div className="space-y-4">
      {consultationSubs.map((sub) => (
        <div
          key={sub.subscription_id}
          className="bg-gray-800 p-5 rounded-lg mb-4 flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg">
              1:1 Consultation
            </h3>
            {/* <p className="text-sm text-gray-400">
              Transaction ID: {sub.transaction_id}
            </p> */}
          </div>

          <button
            // onClick={() => navigate("/consultation")}
            onClick={() => window.open("https://meet.google.com/hpe-pyym-mne", "_blank")}
            className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md transition"
          >
            Open
          </button>
        </div>
      ))}
    </div>
  )}
</div>
    </div>
  );
}