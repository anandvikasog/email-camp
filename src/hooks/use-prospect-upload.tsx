import React, { useState } from 'react';
import Papa, { ParseResult } from 'papaparse';

export interface CsvRow {
  [key: string]: string | number;
}

const useProspectUpload = () => {
  const [csvData, setCsvData] = useState<Array<CsvRow>>([]);
  const [csvError, setCsvError] = useState<null | string>(null);
  const [variables, setVariables] = useState<string[]>([]);

  const handleDownloadSample = () => {
    const filePath = '/doc/Prospects_template.csv';
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'Prospects_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const populateData = (list: any) => {
    setCsvData(list);
    if (list.length > 0) {
    }
    setVariables(Object.keys(list[0]));
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null);
    const file = event.target.files?.[0];

    if (file) {
      Papa.parse<CsvRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult<CsvRow>) => {
          populateData(results.data);
        },
        error: (error) => {
          setCsvError('File not supported.');
        },
      });
    }
    event.target.value = '';
  };

  return {
    csvData,
    csvError,
    onChangeHandler,
    variables,
    handleDownloadSample,
    populateData,
  };
};

export default useProspectUpload;
