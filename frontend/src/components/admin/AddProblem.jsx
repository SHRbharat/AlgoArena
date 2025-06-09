import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PlusCircle, MinusCircle, Upload, Loader } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { MarkdownEditor } from '../ui/mdx-editor';
import { problemSchema } from '../../schemas/problemSchema';
import { saveProblem, uploadToS3 } from '@/api/problemApi';
import { languages } from '@/assets/mapping';
import { useAppSelector } from '@/redux/hook';
import { toast } from 'sonner';

const difficulties = ['Easy', 'Medium', 'Hard'];

export function AddProblem() {
  const navigate = useNavigate();
  const topics = useAppSelector((state) => state.topics);
  const companies = useAppSelector((state) => state.companies);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      difficulty: '',
      topics: [],
      companies: [],
      description: '',
      inputFormat: '',
      constraints: '',
      outputFormat: '',
      ownerCode: '',
      ownerCodeLanguage: '',
      testCases: [{ input: null, output: null, isExample: false }],
      resources: [{ file: null, caption: '' }]
    }
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const formData = {
        ...data,
        ownerCode: btoa(data.ownerCode),
        testCases: data.testCases.map((testCase) => testCase.isExample),
        resources: data.resources.map((resource) => resource.caption)
      };

      const results = await saveProblem(formData);

      await Promise.all(
        data.testCases.map(async (testCase, index) => {
          const urls = results.testcasesURLs[index];
          if (testCase.input && urls.inputUrl) {
            await uploadToS3(urls.inputUrl, testCase.input, testCase.input.type);
          }
          if (testCase.output && urls.outputUrl) {
            await uploadToS3(urls.outputUrl, testCase.output, testCase.output.type);
          }
        })
      );

      await Promise.all(
        data.resources.map(async (resource, index) => {
          const url = results.resourceURLs[index];
          if (resource.file && url) {
            await uploadToS3(url, resource.file, resource.file.type);
          }
        })
      );

      toast.success('Problem created successfully');
      navigate('/dashboard/problems');
    } catch (error) {
      console.error('Error in submitting problem', error);
      toast.error('Problem Submission Failed!!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMultiSelectChange = useCallback((field, value) => {
    setValue(field, value);
  }, [setValue]);

  const handleTestCaseChange = useCallback((index, field, value) => {
    setValue(`testCases.${index}.${field}`, value);
  }, [setValue]);

  const handleResourceChange = useCallback((index, field, value) => {
    setValue(`resources.${index}.${field}`, value);
  }, [setValue]);

  const addTestCase = useCallback(() => {
    setValue('testCases', [...watch('testCases'), { input: null, output: null, isExample: false }]);
  }, [setValue, watch]);

  const removeTestCase = useCallback((index) => {
    setValue('testCases', watch('testCases').filter((_, i) => i !== index));
  }, [setValue, watch]);

  const addResource = useCallback(() => {
    setValue('resources', [...watch('resources'), { file: null, caption: '' }]);
  }, [setValue, watch]);

  const removeResource = useCallback((index) => {
    setValue('resources', watch('resources').filter((_, i) => i !== index));
  }, [setValue, watch]);

  const testCases = watch('testCases');
  const resources = watch('resources');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Problem</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input id="title" {...field} className="max-w-md" />}
              />
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((diff) => (
                          <SelectItem key={diff} value={diff}>
                            {diff}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.difficulty && <p className="text-red-500">{errors.difficulty.message}</p>}
              </div>

              <div>
                <Label htmlFor="topics">Topics</Label>
                <Controller
                  name="topics"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={topics}
                      selected={field.value.map((topic) => topic.id)}
                      onChange={(values) =>
                        handleMultiSelectChange(
                          'topics',
                          topics.filter((topic) => values.includes(topic.id))
                        )
                      }
                      placeholder="Select topics"
                      label="Available Topics"
                    />
                  )}
                />
                {errors.topics && <p className="text-red-500">{errors.topics.message}</p>}
              </div>

              <div>
                <Label htmlFor="companies">Companies</Label>
                <Controller
                  name="companies"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={companies}
                      selected={field.value.map((company) => company.id)}
                      onChange={(values) =>
                        handleMultiSelectChange(
                          'companies',
                          companies.filter((company) => values.includes(company.id))
                        )
                      }
                      placeholder="Select companies"
                      label="Available Companies"
                    />
                  )}
                />
                {errors.companies && <p className="text-red-500">{errors.companies.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {['description', 'inputFormat', 'constraints', 'outputFormat'].map((field) => (
              <div key={field}>
                <Label htmlFor={field} className="capitalize mb-2 block">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Controller
                  name={field}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <MarkdownEditor
                      value={value}
                      onChange={onChange}
                      placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}...`}
                    />
                  )}
                />
                {errors[field] && <p className="text-red-500">{errors[field]?.message}</p>}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="ownerCode">Owner Code</Label>
              <Controller
                name="ownerCode"
                control={control}
                render={({ field }) => <Textarea id="ownerCode" {...field} rows={10} />}
              />
              {errors.ownerCode && <p className="text-red-500">{errors.ownerCode.message}</p>}
            </div>

            <div>
              <Label htmlFor="ownerCodeLanguage">Owner Code Language</Label>
              <Controller
                name="ownerCodeLanguage"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(languages).map(([id, language]) => (
                        <SelectItem key={id} value={id}>
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.ownerCodeLanguage && (
                <p className="text-red-500">{errors.ownerCodeLanguage.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Cases</h3>
            {testCases.map((testCase, index) => (
              <Card key={index}>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Input</Label>
                    <input
                      type="file"
                      accept="text/*"
                      onChange={(e) => handleTestCaseChange(index, 'input', e.target.files[0])}
                    />
                    {errors.testCases?.[index]?.input && (
                      <p className="text-red-500">{errors.testCases[index].input.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Output</Label>
                    <input
                      type="file"
                      accept="text/*"
                      onChange={(e) => handleTestCaseChange(index, 'output', e.target.files[0])}
                    />
                    {errors.testCases?.[index]?.output && (
                      <p className="text-red-500">{errors.testCases[index].output.message}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label>Is Example</Label>
                    <Controller
                      name={`testCases.${index}.isExample`}
                      control={control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                    {testCases.length > 1 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTestCase(index)}
                        className="ml-auto"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addTestCase} type="button" className="flex items-center space-x-2">
              <PlusCircle className="h-5 w-5" />
              <span>Add Test Case</span>
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            {resources.map((resource, index) => (
              <Card key={index}>
                <CardContent className="space-y-4">
                  <div>
                    <Label>File</Label>
                    <input
                      type="file"
                      onChange={(e) => handleResourceChange(index, 'file', e.target.files[0])}
                    />
                    {errors.resources?.[index]?.file && (
                      <p className="text-red-500">{errors.resources[index].file.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Caption</Label>
                    <Controller
                      name={`resources.${index}.caption`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Enter caption" />
                      )}
                    />
                    {errors.resources?.[index]?.caption && (
                      <p className="text-red-500">{errors.resources[index].caption.message}</p>
                    )}
                  </div>
                  {resources.length > 1 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeResource(index)}
                      className="ml-auto"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addResource} type="button" className="flex items-center space-x-2">
              <PlusCircle className="h-5 w-5" />
              <span>Add Resource</span>
            </Button>
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Problem
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
