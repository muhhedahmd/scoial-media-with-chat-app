import { Skeleton } from '@nextui-org/react';
import { LoaderCircle } from 'lucide-react';

interface LoaderMediaItemsProps {
  isLinks: boolean;
  second: boolean;
  isOthers : boolean;
}

export const LoaderMediaItems: React.FC<LoaderMediaItemsProps> = ({ isLinks, second  , isOthers}) => {
  if (second) {
    return (
      <div className='w-full   p-2 '>
        <LoaderCircle className='w-5 h-5 animate-spin text-gray-800 ' />
      </div>
    );
  }

  if (isLinks) {
    return (
      <div className='flex flex-col gap-2'>
        {[1, 2, 3, 4 ,5].map((e) => (
          <Skeleton key={e} className='bg-gray-800 rounded-sm shadow-md   w-full h-6' />
        ))}
      </div>
    );
  }

  if (isOthers) {
    return (
   <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3,4 ].map((e) => (
        <Skeleton key={e} className="w-[7rem] h-20 rounded-md shadow-md  aspect-square bg-gray-700" />
      ))}
    </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2">
      {[1, 2, 3,4 ].map((e) => (
        <Skeleton key={e} className="w-20 h-20 rounded-md shadow-md  aspect-square bg-gray-700" />
      ))}
    </div>
  );
};

