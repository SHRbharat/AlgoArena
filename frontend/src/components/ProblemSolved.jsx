import { useState, useEffect } from "react";
import { GetSolvedProblems } from "../api/userApi";
import { Spinner } from "./ui/Spinner";

export const ProblemSolved = ({ username }) => {
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSolvedProblems = async () => {
            try {
                if (!username) return;
                setLoading(true);
                const { data } = await GetSolvedProblems(username, page);
                setSolvedProblems(data.solvedProblems);
                setTotal(data.total);
            } catch (error) {
                console.error("Failed to fetch solved problems:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSolvedProblems();
    }, [page, username]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 min-h-80">
            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <Spinner />
                </div>
            ) : (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Problems Solved</h2>

                    {/* Filters and search UI commented out */}

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Problem
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Difficulty
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Date Solved
                                    </th>
                                </tr>
                            </thead>
                            {solvedProblems.length === 0 ? (
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-3 text-center" colSpan={4}>
                                            No problems solved
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {solvedProblems.map((problem, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm font-medium">{problem.name}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        problem.type === "Easy"
                                                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                                                            : problem.type === "Medium"
                                                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                                                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                                                    }`}
                                                >
                                                    {problem.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {JSON.parse(problem.category).name}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {problem.dateSolved}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                        </table>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {Math.min((page - 1) * 3 + solvedProblems.length, total)} of {total} problems
                        </p>
                        <div className="flex space-x-2">
                            <button
                                className={`px-3 py-1 rounded-md text-sm ${
                                    page === 1
                                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                }`}
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            <button
                                className={`px-3 py-1 rounded-md text-sm ${
                                    page * 3 >= total
                                        ? "bg-blue-300 text-white cursor-not-allowed"
                                        : "bg-blue-600 text-white"
                                }`}
                                onClick={() => setPage(page + 1)}
                                disabled={page * 3 >= total}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
