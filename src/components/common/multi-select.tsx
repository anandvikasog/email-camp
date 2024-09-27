'use client';
import { useEffect, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';

export interface IOption {
  label: string;
  value: number | string;
}

interface IProps {
  options: IOption[];
  onSelect?: (p: IOption[]) => void;
  hasSelectAll?: boolean;
  defaultValues?: IOption[];
}

const MultiSelectComponent = ({
  options = [],
  onSelect = () => {},
  hasSelectAll = false,
  defaultValues = [],
}: IProps) => {
  const [mutatedOptions, setMutatedOptions] = useState<IOption[]>(options);
  const [defaultSelected, setDefaultSelected] =
    useState<IOption[]>(defaultValues);

  const onListSelect = (selectedList: IOption[], item: IOption) => {
    if (item?.value === 'all') {
      setDefaultSelected(options);
      onSelect(options);
      return;
    }
    onSelect(selectedList);
  };

  const onListRemove = (selectedList: IOption[], item: IOption) => {
    if (item?.value === 'all') {
      setDefaultSelected([]);
      onSelect([]);
      return;
    }
    onSelect(selectedList);
  };

  useEffect(() => {
    if (hasSelectAll) {
      setMutatedOptions([
        { label: 'Select All', value: 'all' },
        ...mutatedOptions,
      ]);
    }
  }, [hasSelectAll, mutatedOptions]);

  return (
    <Multiselect
      options={mutatedOptions}
      selectedValues={defaultSelected}
      onSelect={onListSelect}
      onRemove={onListRemove}
      displayValue="label"
    />
  );
};

export default MultiSelectComponent;
