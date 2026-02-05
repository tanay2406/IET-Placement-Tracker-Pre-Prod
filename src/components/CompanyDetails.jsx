import { useParams, useNavigate } from "react-router-dom";
import data2026 from "../data/2026.json";

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const company = data2026.find(
    (item) => String(item.id) === String(id)
  );

  if (!company) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1>Company Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-blue-600 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {company.Company}
      </h1>

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
