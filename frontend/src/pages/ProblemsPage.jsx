import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { getAllProblems, fetchProblems } from "@/api/problemApi";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, CheckCircleIcon, Circle } from 'lucide-react';
import { MultiSelect } from "@/components/ui/multi-select";
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { getAllTopics } from '@/api/topicApi';
import { getAllCompanies } from '@/api/companyApi';
import { setTopics } from '@/redux/slice/topicSlice';
import { setCompanies } from '@/redux/slice/companySlice';
import { Spinner } from '@/components/ui/Spinner';
import { ProblemProgressCard } from '@/components/ProblemProgressCard';
import { getUserProgress } from '@/api/userApi';
import { toast } from 'sonner';

const MemoizedProblemProgressCard = React.memo(ProblemProgressCard, (prevProps, nextProps) => {
  return (
    prevProps.totalProblems.Easy === nextProps.totalProblems.Easy &&
    prevProps.totalProblems.Medium === nextProps.totalProblems.Medium &&
    prevProps.totalProblems.Hard === nextProps.totalProblems.Hard &&
    prevProps.solved === nextProps.solved
  );
});

export function ProblemsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [problems, setProblems] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState([]);
  const [companyFilter, setCompanyFilter] = useState([]);

  const topics = useAppSelector((state) => state.topics);
  const companies = useAppSelector((state) => state.companies);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [totalProblems, setTotalProblems] = useState({
    Easy: 0,
    Medium: 0,
    Hard: 0,
  });
  const [solved, setSolved] = useState([]);

  const dispatch = useAppDispatch();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (topics.length === 0) {
      getAllTopics().then((topics) => {
        dispatch(setTopics(topics));
      }).catch((error) => {
        console.log(error);
      });
    }

    if (companies.length === 0) {
      getAllCompanies().then((companies) => {
        dispatch(setCompanies(companies));
      }).catch((error) => {
        console.log(error);
      });
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getAllProblems(currentPage)
      .then((problemsData) => {
        setProblems(problemsData.problems);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error(`Error in fetching problems: ${err.message}`);
      });
  }, [currentPage]);

  useEffect(() => {
    if (isAuthenticated) {
      getUserProgress()
        .then((progressData) => {
          setSolved(progressData.solvedProblems);
          setTotalProblems(progressData.totalProblems);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isAuthenticated]);

  const solvedProblemsMap = useMemo(() => {
    return new Map(solved.map(item => [JSON.parse(item).id, true]));
  }, [solved]);

  const handleFilter = async () => {
    const topicIds = topicFilter.map(topic => topic.id);
    const companyIds = companyFilter.map(company => company.id);
    const data = await fetchProblems(searchTerm, difficultyFilter, topicIds, companyIds, currentPage);
    setSearchTerm("");
    setProblems(data.problems);
  };

  const handleMultiSelectChange = (filterType, values) => {
    if (filterType === "topic") {
      setTopicFilter(values);
    } else {
      setCompanyFilter(values);
    }
  };

  const removeFilter = useCallback((filterType, value) => {
    if (filterType === "topic") {
      setTopicFilter(prev => prev.filter(item => item.id !== value.id));
    } else {
      setCompanyFilter(prev => prev.filter(item => item.id !== value.id));
    }
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <h1 className="text-3xl font-bold mb-6">Problems</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            <Input
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-1/3"
            />
            <Select onValueChange={(value) => setDifficultyFilter(value)}>
              <SelectTrigger className="max-w-fit md:w-1/5">
                <SelectValue placeholder="Difficulty&nbsp;" className='p-2' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Difficulties&nbsp;</SelectItem>
                <SelectItem value="Easy">Easy&nbsp; </SelectItem>
                <SelectItem value="Medium">Medium&nbsp;</SelectItem>
                <SelectItem value="Hard">Hard&nbsp;</SelectItem>
              </SelectContent>
            </Select>
            <div className="grow md:w-1/5">
              <MultiSelect
                options={topics.map(topic => ({ id: topic.id, name: topic.name }))}
                selected={topicFilter.map(topic => topic.id)}
                onChange={(values) => handleMultiSelectChange('topic', topics.filter(topic => values.includes(topic.id)))}
                placeholder="Select topics"
                label="Topics"
              />
            </div>
            <div className="grow md:w-1/5">
              <MultiSelect
                options={companies.map(company => ({ id: company.id, name: company.name }))}
                selected={companyFilter.map(company => company.id)}
                onChange={(values) => handleMultiSelectChange('company', companies.filter(company => values.includes(company.id)))}
                placeholder="Select companies"
                label="Companies"
              />
            </div>
            <Button className='grow' onClick={handleFilter}>Filter</Button>
          </div>
          <div className="border rounded-lg p-4 mb-4">
            <div className="flex flex-wrap gap-2">
              {topicFilter.map(topic => (
                <div key={topic.name} className="relative inline-block">
                  <button
                    onClick={() => removeFilter('topic', topic)}
                    className="absolute -top-1 -left-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-1 rounded-full">
                    {topic.name}
                  </span>
                </div>
              ))}
              {companyFilter.map(company => (
                <div key={company.name} className="relative inline-block">
                  <button
                    onClick={() => removeFilter('company', company)}
                    className="absolute -top-1 -left-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-1 rounded-full">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold md:pl-4">Title</TableHead>
                  <TableHead className="font-semibold">Difficulty</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isloading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <Spinner />
                    </TableCell>
                  </TableRow>) :
                  (problems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                        No problems found
                      </TableCell>
                    </TableRow>
                  ) : (
                    problems.map((problem) => (
                      <TableRow key={problem.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium cursor-pointer md:pl-4 hover:text-blue-600" onClick={() => navigate(`/problems/${problem.problemId}`)}>
                          {problem.title}
                        </TableCell>

                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                            {problem.difficulty}
                          </span>
                        </TableCell>

                        <TableCell className='flex justify-center'>
                          {solvedProblemsMap.has(problem.problemId) ?
                            <CheckCircleIcon className="text-green-500 h-4 w-4" /> : <Circle className="text-gray-500 h-4 w-4" />}
                        </TableCell>
                      </TableRow>
                    )))
                  )}
              </TableBody>
            </Table>
          </div>

          {!(problems.length === 0 && currentPage === 1) &&
            (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="font-medium text-sm text-muted-foreground"> Page {currentPage} </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  variant="outline"
                  size="sm"
                  disabled={problems.length < 10}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            )
          }
        </div>

        <div className="lg:w-1/4">
          {isAuthenticated ? (
            <MemoizedProblemProgressCard totalProblems={totalProblems} solved={solved} />
          ) : (
            <div className="bg-muted/40 p-4 rounded-lg border border-dashed text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Sign in to view your progress
              </p>
              <Button
                onClick={() => {
                  navigate("/auth");
                }}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
