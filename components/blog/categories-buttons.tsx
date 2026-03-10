'use client';

import { PostsCategoryOptions } from '@/types/pocketbase';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import React from 'react';

interface CategoriesButtonsProps {
  categories: PostsCategoryOptions[];
}

export default function CategoriesButtons({
  categories,
}: Readonly<CategoriesButtonsProps>) {
  const [selectedCategory, setSelectedCategory] = useQueryState(
    'categoria',
    parseAsStringEnum<PostsCategoryOptions>(
      Object.values(PostsCategoryOptions),
    ).withOptions({ shallow: false }),
  );

  return (
    <div className='flex gap-2'>
      {categories.map((category, i) => (
        <React.Fragment key={category}>
          <button
            className={`underline-magical-2 ${
              selectedCategory === category
                ? 'text-background bg-size-[100%_100%]'
                : ''
            }`}
            onClick={() =>
              setSelectedCategory(
                category === selectedCategory ? null : category,
              )
            }
          >
            {category}
          </button>
          {categories.length - 1 !== i && (
            <span className='grow flex my-1 w-px bg-foreground/50' />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
