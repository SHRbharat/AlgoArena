import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Moon, Sun, RotateCcw, Maximize2, Minimize2, Play, Loader } from 'lucide-react'
import { Editor, useMonaco } from "@monaco-editor/react"
import { languages } from "@/assets/mapping"
import { createSubmission } from "@/api/problemApi"
import { useTheme } from "./ThemeProvider"

const getLanguageBoilerplate = (languageId) => {
  const languageMap = languages
  return languageMap[languageId]?.boilerplate || ""
}

// Monaco editor language mapping
const monacoLanguageMap = {
  "50": "c",
  "54": "cpp",
  "62": "java",
  "63": "javascript",
  "35": "python"
}

export function OnlineCompiler() {
  const [languageId, setLanguageId] = useState("54") // Default to C++
  const [code, setCode] = useState(() => atob(getLanguageBoilerplate(languageId)))
  const { theme } = useTheme()
  const [output, setOutput] = useState("")
  const [input, setInput] = useState("")
  const [editorTheme, setEditorTheme] = useState(theme === 'light' ? 'light' : 'vs-dark')
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [IsRunning, setIsRunning] = useState(false)
  const editorRef = useRef(null)
  const monaco = useMonaco()

  const handleLanguageChange = useCallback((newLanguageId) => {
    setLanguageId(newLanguageId)
    setCode(atob(getLanguageBoilerplate(newLanguageId)))
  }, [])

  const handleReset = useCallback(() => {
    setCode(atob(getLanguageBoilerplate(languageId)))
    setInput("")
    setOutput("")
  }, [languageId])

  const handleRunCode = async () => {
    try {
      setIsRunning(true)
      setOutput("Code is running...")

      const data = {
        source_code: btoa(code), // Encode source code in Base64
        language_id: languageId,
        stdin: btoa(input), // Encode stdin in Base64
      }

      const result = await createSubmission(data)

      if (result.status.id === 3 || result.stdout) {
        setOutput(atob(result.stdout))
      } else {
        const decodedOutput = new TextDecoder("utf-8").decode(
          Uint8Array.from(atob(result.compile_output), (c) => c.charCodeAt(0))
        )
        setOutput(result.status.description + "\n" + decodedOutput)
      }
    } catch (error) {
      console.error("Error running the code", error)
    } finally {
      setIsRunning(false)
    }
  }

  const onMount = useCallback((editor) => {
    editorRef.current = editor
    editor.focus()
  }, [])

  const handleThemeChange = useCallback(() => {
    setEditorTheme(prevTheme => (prevTheme === 'vs-dark' ? 'light' : 'vs-dark'))
  }, [])

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev)
  }, [])

  const editorOptions = useMemo(() => ({
    fontSize: 14,
    minimap: { enabled: false },
    scrollBeyondLastLine: true,
    lineNumbers: "on",
    roundedSelection: false,
    padding: { top: 10, bottom: 10 },
    cursorStyle: "line",
    automaticLayout: true,
    wordWrap: "on",
    tabSize: 4,
    insertSpaces: true,
    fontFamily: "monospace"
  }), [])

  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(editorTheme)
    }
  }, [monaco, editorTheme, theme])

  return (
    <div className={`w-full h-[calc(100vh-4rem)] ${isFullScreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={30}>
          <Card className="h-full rounded-none border-0">
            <CardHeader className="border-b px-4 py-2">
              <div className="flex items-center justify-between">
                <Select value={languageId} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languages)
                      //.filter(([_, lang]) => !lang.is_archived)
                      .map(([id, lang]) => (
                        <SelectItem key={id} value={id}>
                          {lang.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={handleThemeChange}>
                    {editorTheme === 'vs-dark' ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
                    {isFullScreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white min-w-[120px]"
                    onClick={handleRunCode}
                    disabled={IsRunning}
                  >
                    {IsRunning ? (
                      <Loader className="animate-spin h-4 w-4" size={20} />
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100vh-4rem)]">
              <Editor
                height="100%"
                theme={editorTheme}
                language={monacoLanguageMap[languageId]}
                value={code}
                onChange={(value) => setCode(value || "")}
                onMount={onMount}
                options={editorOptions}
              />
            </CardContent>
          </Card>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50} minSize={20}>
              <Card className="h-full rounded-none border-0">
                <CardHeader className="border-b px-4 py-2">
                  <CardTitle>Input</CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-[calc(100%-3rem)]">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter input here..."
                    className="font-mono h-full resize-none"
                  />
                </CardContent>
              </Card>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={20}>
              <Card className="h-full rounded-none border-0">
                <CardHeader className="border-b px-4 py-2">
                  <CardTitle>Output</CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-[calc(100%-3rem)]">
                  <pre className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap h-full overflow-auto">
                    {output || 'Run the code to see output...'}
                  </pre>
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
