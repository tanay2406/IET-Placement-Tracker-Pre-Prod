import { useParams, useNavigate } from "react-router-dom";
import data2026 from "../data/2026.json";

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const company = data2026.find(
    (item) => String(item.id) === String(id)
  );

  const checkSubscriptionAndNavigate = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/check-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            googleId: storedUser.sub,
          }),
        }
      );

      const data = await response.json();

      if (data.isSubscribed) {
        navigate(`/company/${company.id}/pyq`);
      } else {
        navigate("/subscribe");
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
            onClick={checkSubscriptionAndNavigate}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition"
          >
            PYQ
          </button>

          <button
            onClick={() => navigate(`/company/${company.id}/call`)}
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

    </div>
  );
}
