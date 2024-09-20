import { ClipLoader } from 'react-spinners';

const SpinnerLoader = ({ color = 'white' }: { color?: string }) => {
  return <ClipLoader size={25} color={color} />;
};

export default SpinnerLoader;
