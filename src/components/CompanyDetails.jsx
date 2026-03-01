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
            "https://iet-placement-tracker-pre-prod-production.up.railway.app/api/isSubscription",
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
            "https://iet-placement-tracker-pre-prod-production.up.railway.app/api/isSubscription",
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
        <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6 md:p-10">

          <button
            onClick={() => navigate(-1)}
            className="mb-4 md:mb-6 bg-blue-600 hover:bg-blue-700 px-3 md:px-4 py-2 rounded text-sm transition"
          >
            ← Back
          </button>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold break-words">
              {company.Company}
            </h1>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={checkSubscriptionAndNavigate_PYQ}
                className="bg-blue-500 hover:bg-blue-600 px-3 md:px-4 py-2 rounded-md transition text-sm whitespace-nowrap"
              >
                PYQ
              </button>

              <button
                onClick={checkSubscriptionAndNavigate_Call}
                className="bg-indigo-500 hover:bg-indigo-600 px-3 md:px-4 py-2 rounded-md transition text-sm whitespace-nowrap"
              >
                1:1 Call
              </button>
            </div>
          </div>

          {/* Mobile: stacked key/value rows */}
          <div className="md:hidden bg-white/10 rounded-lg overflow-hidden divide-y divide-white/15">
            {Object.entries(company).map(([key, value]) => (
              <div key={key} className="px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-blue-100/70">{key}</p>
                <p className="text-sm text-white break-words mt-1">{value?.toString() || "-"}</p>
              </div>
            ))}
          </div>

          {/* Desktop/tablet: table */}
          <div className="hidden md:block bg-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <tbody>
                  {Object.entries(company).map(([key, value]) => (
                    <tr key={key} className="border-b border-white/20">
                      <td className="px-6 py-3 font-semibold w-1/3 whitespace-nowrap">
                        {key}
                      </td>
                      <td className="px-6 py-3 break-words">
                        {value?.toString() || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
