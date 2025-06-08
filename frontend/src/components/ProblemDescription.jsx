import React from 'react'
import { useAppSelector } from "@/redux/hook"
import ReactMarkdown from 'react-markdown'
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Building, Tag } from 'lucide-react'

export function ProblemDescription() {
    const problem = useAppSelector((state) => state.problem)

    const renderMarkdown = (content) => (
        <ReactMarkdown
            components={{
                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                li: ({ children }) => <li className="mb-2">{children}</li>,
                code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded">{children}</code>,
            }}
        >
            {content}
        </ReactMarkdown>
    )

    const getBadgeVariant = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case "easy":
                return "success"
            case "medium":
                return "warning"
            case "hard":
                return "destructive"
            default:
                return "default"
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-2 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{problem.title}</h1>
                <Badge variant={getBadgeVariant(problem.difficulty)}>
                    {problem.difficulty}
                </Badge>
            </div>

            <Separator className="my-4" />

            <Section title="Description" content={problem.description} renderContent={renderMarkdown} />
            <Section title="Input" content={problem.inputFormat} renderContent={renderMarkdown} />
            <Section title="Output" content={problem.outputFormat} renderContent={renderMarkdown} />
            <Section title="Constraints" content={problem.constraints} renderContent={renderMarkdown} />

            <Separator className="my-4" />

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="topics">
                    <AccordionTrigger>
                        <div className="flex justify-center gap-2 items-center">
                            <Tag className="h-4 w-4"/>
                            Topics
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-2">
                            {problem.topics.map((topic, index) => { 
                                const topicObj = JSON.parse(topic);
                                return (
                                    <Badge key={index} variant="outline">{topicObj.name}</Badge>
                                )
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="companies">
                    <AccordionTrigger>
                        <div className="flex justify-center gap-2 items-center">
                            <Building className="h-4 w-4"/>
                            Companies
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-2">
                            {problem.companies.map((company, index) => {
                                const companyObj = JSON.parse(company);
                                return (
                                    <Badge key={index} variant="outline">{companyObj.name}</Badge>
                                )
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

function Section({ title, content, renderContent }) {
    return (
        <div className="space-y-2">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div>{renderContent(content)}</div>
        </div>
    )
}
