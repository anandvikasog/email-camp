import { BeatLoader } from 'react-spinners';

const FullscreenLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="text-white text-3xl font-bold animate-pulse">
        <BeatLoader size={30} color="#6950e9" />
      </div>
    </div>
  );
};

export default FullscreenLoader;
