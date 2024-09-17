import { BeatLoader } from 'react-spinners';

const FullscreenLoader = ({ title = '' }: { title: string }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="text-white text-3xl font-bold animate-pulse">
        <BeatLoader size={50} color="grey" />
      </div>
    </div>
  );
};

export default FullscreenLoader;
