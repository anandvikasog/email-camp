import React, { useRef } from 'react';
import { Control, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CampaignValues } from './campaign-form';

const RichTextEditor = ({
  index,
  control,
  variables,
}: {
  index: number;
  control: Control<CampaignValues>;
  variables: string[];
}) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const insertText = (text: string) => {
    const editor = quillRef.current?.getEditor();
    const cursorPosition = editor?.getSelection()?.index;
    if (editor) {
      const positionToInsert =
        cursorPosition !== undefined ? cursorPosition : editor.getLength() - 1;

      editor.insertText(positionToInsert, `{{${text}}}`);
    }
  };
  return (
    <div className="flex justify-between gap-5 items-start">
      <Controller
        name={`mails.${index}.body`}
        control={control}
        render={({ field }) => (
          <ReactQuill {...field} ref={quillRef} className="flex-1" />
        )}
      />
      <div className="w-[30%]">
        <h3 className="mb-2">Insert variables</h3>
        <div className="flex flex-wrap gap-3">
          {variables.map((elem) => (
            <div
              className="border p-1 rounded border-[#6950e9] cursor-pointer text-sm"
              onClick={() => insertText(elem)}
              key={elem}
            >
              {elem}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
