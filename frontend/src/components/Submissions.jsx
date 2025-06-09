import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { formatDistanceToNow, format } from "date-fns";
import { languages, statuses } from "@/assets/mapping";
import { setRecentSubmission } from "@/redux/slice/problemSlice";

export function Submissions({ handleTab }) {
  const { user } = useAppSelector((state) => state.auth);
  const submissions = useAppSelector((state) => state.problem.submissions);
  const dispatch = useAppDispatch();

  const getStatusBadge = (status) => {
    if (status <= 2) {
      return <Badge variant="secondary">{statuses[status]}</Badge>;
    } else if (status === 3) {
      return <Badge variant="success">{statuses[status]}</Badge>;
    } else {
      return <Badge variant="destructive">{statuses[status]}</Badge>;
    }
  };

  const formatSubmissionTime = (createdAt) => {
    const submissionDate = new Date(createdAt);
    const now = new Date();

    if (submissionDate.toDateString() === now.toDateString()) {
      return format(submissionDate, "HH:mm");
    } else {
      return formatDistanceToNow(submissionDate, { addSuffix: true });
    }
  };

  const getLanguageName = (languageId) => {
    return languages[languageId]?.name || "Unknown Language";
  };

  const handleShowSubmission = (index) => {
    dispatch(setRecentSubmission(submissions[index]));
    handleTab("results");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Please login to view submissions</p>
      </div>
    );
  }

  return (
    <>
      {submissions.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">No submissions found</p>
        </div>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-16rem)] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Runtime</TableHead>
                    <TableHead>Memory</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission, index) => (
                    <TableRow
                      key={submission.id}
                      onClick={() => handleShowSubmission(index)}
                      className="cursor-pointer"
                    >
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>
                        {submission.time ? `${submission.time}s` : "N/A"}
                      </TableCell>
                      <TableCell>
                        {submission.memory ? `${submission.memory} KB` : "N/A"}
                      </TableCell>
                      <TableCell>{getLanguageName(submission.language)}</TableCell>
                      <TableCell>{formatSubmissionTime(submission.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </>
  );
}
