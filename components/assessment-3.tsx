/* Question 2: There's a para. Add a search input through which 
user should be able to highlight the paragraph whatever gets typed in search input  */
'use client';
import { useState } from 'react';

export const AssessmentQuestion = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text
      .split(regex)
      .map((part, index) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={index}>{part}</mark>
        ) : (
          part
        )
      );
  };

  return (
    <>
      <div> Search and Highlight Component </div>
      <div>
        {' '}
        Type in the search box to highlight matching text in the paragraph
        below.{' '}
      </div>
      <div className="my-4">
        <label htmlFor="search"> Search: </label>
        <input
          id="search"
          type="search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mb-4"
          placeholder="Search and highlight..."
        />
      </div>

      <label htmlFor="paragraph"> Paragraph: </label>

      <div id="paragraph"> {highlightText(paragraph, searchTerm)}</div>
    </>
  );
};

const paragraph = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
