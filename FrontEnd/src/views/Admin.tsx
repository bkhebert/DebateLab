import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../constants/constant";
const Admin = () => {
  const [extensionDownloads, setExtensionDownloads] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allDownloads, setAllDownloads] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch extension download count
        const downloadRes = await axios.get(`${baseURL}/api/admin/count/extension`);
        setExtensionDownloads(downloadRes.data.count);

        // Fetch user count
        const userRes = await axios.get(`${baseURL}/api/admin/users/count`);
        setUserCount(userRes.data.users);

        try {
          const allRes = await axios.get(`${baseURL}/api/admin/all`);
          setAllDownloads(allRes.data);
        } catch (err) {
          setError("Failed to fetch all stats");
          console.error(err)
        }
      } catch (err) {
        setError("Failed to fetch admin stats");
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        <p>
          <strong>Total Extension Downloads:</strong>{" "}
          {extensionDownloads !== null ? extensionDownloads : "Loading..."}
        </p>
        <p>
          <strong>Total Registered Users:</strong>{" "}
          {userCount !== null ? userCount : "Loading..."}
        </p>
      </div>
      <div className="mt-6">
  <h2 className="text-xl font-semibold mb-2">All Download Counters</h2>
  {allDownloads.length === 0 ? (
    <p className="text-cstmgray">No stats available yet.</p>
  ) : (
    <table className="w-full text-left border border-gray-300 rounded-md">
      <thead>
        <tr className="bg-gray-100 dark:bg-cstmgray text-sm">
          <th className="px-4 py-2 border-b">Name</th>
          <th className="px-4 py-2 border-b">Count</th>
        </tr>
      </thead>
      <tbody>
        {allDownloads.map((item) => (
          <tr key={item.name} className="hover:bg-gray-50 dark:hover:bg-cstmdarkaccent">
            <td className="px-4 py-2 border-b">{item.name}</td>
            <td className="px-4 py-2 border-b">{item.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
    </div>
  );
};

export default Admin;
