"use client";
import React, { useMemo } from "react";
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  toolbarPlugin,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  ListsToggle,
  markdownShortcutPlugin,
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";

const MarkdownEditorComponent = React.memo(({ value, onChange, placeholder }) => {
  const plugins = useMemo(
    () => [
      headingsPlugin(),
      listsPlugin(),
      quotePlugin(),
      thematicBreakPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      tablePlugin(),
      markdownShortcutPlugin(),
      toolbarPlugin({
        toolbarContents: () => (
          <>
            <UndoRedo />
            <BoldItalicUnderlineToggles />
            <BlockTypeSelect />
            <CreateLink />
            <InsertTable />
            <ListsToggle />
          </>
        ),
      }),
    ],
    []
  );

  const handleChange = useMemo(() => (value) => {
    onChange(value);
  }, [onChange]);

  console.log("editor rendered");

  return (
    <div className="relative min-h-[200px] w-full rounded-md border border-input bg-background">
      <MDXEditor
        markdown={value}
        onChange={handleChange}
        placeholder={placeholder}
        contentEditableClassName="prose dark:prose-invert max-w-none dark:text-white"
        plugins={plugins}
      />
    </div>
  );
});

MarkdownEditorComponent.displayName = "MarkdownEditor";

export const MarkdownEditor = MarkdownEditorComponent;
