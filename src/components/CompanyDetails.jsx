    import { useParams, useNavigate } from "react-router-dom";
    import { useState } from "react";
    import data2026 from "../data/2026.json";

    export default function CompanyDetails() {
      const { id } = useParams();
      const navigate = useNavigate();
      const [toast, setToast] = useState(null);
      const company = data2026.find(
        (item) => String(item.id) === String(id)
      );

      const checkSubscriptionAndNavigate_PYQ = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        // if (!storedUser) {
        //   navigate("/login");
        //   return;
        // }
          if (!storedUser) {
            setToast("Please login first");

            setTimeout(() => {
              setToast(null);
            }, 2000);

            return;
          }

        try {
          const response = await fetch(
            "http://localhost:5000/api/isSubscription",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sub: String(storedUser.sub),
                company_id: company.id,
                subscription_type: "pyq",
              }),
            }
          );

          const data = await response.json();
          console.log("Subscription status:", data.isSubscribed);
          if (data.isSubscribed) {
            navigate(`/company/${company.id}/pyq`);
          } else {
            navigate(`/subscribe/${company.id}/pyq`);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      const checkSubscriptionAndNavigate_Call = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        // if (!storedUser) {
        //   navigate("/login");
        //   return;
        // }

          if (!storedUser) {
            setToast("Please login first");

            setTimeout(() => {
              setToast(null);
            }, 2000);

            return;
          }

        try {
          const response = await fetch(
            "http://localhost:5000/api/isSubscription",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sub: String(storedUser.sub),
                company_id: company.id,
                subscription_type: "call",
              }),
            }
          );

          const data = await response.json();
          console.log("Subscription status:", data.subscribed_status_call);
          if (data.subscribed_status_call) {
            navigate(`/company/${company.id}/call`);
          } else {
            navigate(`/subscribe/${company.id}/call`);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      if (!company) {
        return (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <h1>Company Not Found</h1>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gray-950 text-white p-10">

          <button
            onClick={() => navigate(-1)}
            className="mb-6 bg-blue-600 px-4 py-2 rounded"
          >
            ← Back
          </button>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              {company.Company}
            </h1>

            <div className="flex gap-4">
              <button
                onClick={checkSubscriptionAndNavigate_PYQ}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition"
              >
                PYQ
              </button>

              <button
                onClick={checkSubscriptionAndNavigate_Call}
                className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md transition"
              >
                1:1 Call
              </button>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                {Object.entries(company).map(([key, value]) => (
                  <tr key={key} className="border-b border-white/20">
                    <td className="px-6 py-3 font-semibold w-1/3">
                      {key}
                    </td>
                    <td className="px-6 py-3">
                      {value?.toString() || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
{/* ✅ TOAST HERE */}
{toast && (
  <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
    <div className="bg-red-600 text-white px-8 py-4 rounded-xl shadow-2xl text-base font-medium min-w-[280px] text-center transition-all duration-300">
      {toast}
    </div>
  </div>
)}
        </div>
        
      );
    }
