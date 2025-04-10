


// import { useParams } from "react-router-dom";
// import React, { useState, useEffect } from 'react';

// export function Shownotes() {
//   const { noteid } = useParams();
//   const [note, setNote] = useState(null);
//   const [editingIndex, setEditingIndex] = useState(-1);
//   const [editedContent, setEditedContent] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [contentArray, setContentArray] = useState([]);

//   useEffect(() => {
//     const fetchNote = async () => {
//       try {
//         const response = await fetch('https://autonotebackend.shadowbites10.workers.dev/getfiletitle', {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('autotoken69')}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ id: parseInt(noteid) }),
//         });

//         const data = await response.json();
//         if (data.success) {
//           setNote(data.res);
//           const parsedContent = parseContent(data.res.content);
//           setContentArray(parsedContent);
//         }
//       } catch (error) {
//         console.error('Error fetching note:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNote();
//   }, [noteid]);

//   const parseContent = (content) => {
//     try {
//       const parsed = JSON.parse(content);
//       return Array.isArray(parsed) ? parsed : [parsed];
//     } catch (e) {
//       return [content];
//     }
//   };

//   const handleEditStart = (index, content) => {
//     setEditingIndex(index);
//     setEditedContent(content.replace(/\\n/g, '\n'));
//   };

//   const handleSave = async (index) => {
//     try {
//       setIsSaving(true);
      
//       // Update local state first
//       const newArray = [...contentArray];
//       newArray[index] = editedContent.replace(/\n/g, '\\n');
//       setContentArray(newArray);
      
//       // Update backend
//       const response = await fetch(`https://autonotebackend.shadowbites10.workers.dev/addcontent`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('autotoken69')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           id: parseInt(noteid),
//           content: JSON.stringify(newArray)
//         }),
//       });
//       const data = await response.json();
//       console.log(data);
//       if (response.ok) {
//         setNote({ ...note, content: JSON.stringify(newArray) });
//         setEditingIndex(-1);
//       }
//     } catch (error) {
//       console.error('Error saving note:', error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleAddNote = () => {
//     setContentArray([...contentArray, "New note"]);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!note) return <div className="text-center mt-8 text-red-500">Note not found</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-start mb-6">
//           <h1 className="text-xl font-semibold text-gray-800">{note.title}</h1>
//           <button
//             onClick={handleAddNote}
//             className="px-3 py-1 rounded-md text-sm bg-green-600 text-white hover:opacity-90"
//           >
//             Add New Note
//           </button>
//         </div>

//         <div className="space-y-4">
//           {contentArray.map((section, index) => (
//             <div key={index} className="group relative border-b pb-4">
//               {editingIndex === index ? (
//                 <div className="space-y-2">
//                   <textarea
//                     value={editedContent}
//                     onChange={(e) => setEditedContent(e.target.value)}
//                     className="w-full h-32 p-3 border rounded-md font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
//                   />
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleSave(index)}
//                       disabled={isSaving}
//                       className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
//                     >
//                       {isSaving ? 'Saving...' : 'Save'}
//                     </button>
//                     <button
//                       onClick={() => setEditingIndex(-1)}
//                       className="px-4 py-2 text-sm rounded-md bg-gray-200 text-gray-700"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex justify-between items-start">
//                   <pre className="whitespace-pre-wrap break-words font-mono text-sm bg-gray-50 p-3 rounded-md border border-gray-200 flex-1">
//                     {section.replace(/\\n/g, '\n').replace(/\\"/g, '"')}
//                   </pre>
//                   <button
//                     onClick={() => handleEditStart(index, section)}
//                     className="ml-2 text-blue-600 hover:text-blue-800"
//                   >
//                     Edit
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';

export function Shownotes() {
  const { noteid } = useParams();
  const [note, setNote] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedContent, setEditedContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [contentArray, setContentArray] = useState([]);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch('https://oppurt_backend.codegenerator458.workers.dev/getfiletitle', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('autotoken69')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: parseInt(noteid) }),
        });

        const data = await response.json();
        if (data.success) {
          setNote(data.res);
          const parsedContent = parseContent(data.res.content);
          setContentArray(parsedContent);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteid]);

  const parseContent = (content) => {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return [content];
    }
  };

  const handleEditStart = (index, content) => {
    setEditingIndex(index);
    setEditedContent(content.replace(/\\n/g, '\n'));
  };

  const handleSave = async (index) => {
    try {
      setIsSaving(true);
      
      // Update local state first
      const newArray = [...contentArray];
      newArray[index] = editedContent.replace(/\n/g, '\\n');
      setContentArray(newArray);
      
      // Update backend
      const response = await fetch(`https://oppurt_backend.codegenerator458.workers.devaddcontent`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('autotoken69')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: parseInt(noteid),
          content: JSON.stringify(newArray)
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setNote({ ...note, content: JSON.stringify(newArray) });
        setEditingIndex(-1);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = () => {
    setContentArray([...contentArray, "New note"]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!note) return <div className="text-center mt-8 text-red-500">Note not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6 gap-4">
          <h1 className="text-xl font-semibold text-gray-800 break-words max-w-[80%]">
            {note.title}
          </h1>
          <button
            onClick={handleAddNote}
            className="px-3 py-1 rounded-md text-sm bg-green-600 text-white hover:opacity-90 whitespace-nowrap shrink-0"
          >
            Add New Note
          </button>
        </div>

        <div className="space-y-4">
          {contentArray.map((section, index) => (
            <div key={index} className="group relative border-b pb-4">
              {editingIndex === index ? (
                <div className="space-y-2">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-32 p-3 border rounded-md font-mono text-sm bg-gray-50 
                             focus:ring-2 focus:ring-blue-500 outline-none break-words 
                             whitespace-pre-wrap resize-y"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(index)}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingIndex(-1)}
                      className="px-4 py-2 text-sm rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <pre className="whitespace-pre-wrap break-words font-mono text-sm bg-gray-50 p-3 
                                rounded-md border border-gray-200 flex-1 min-w-0 overflow-x-auto">
                    {section.replace(/\\n/g, '\n').replace(/\\"/g, '"')}
                  </pre>
                  <button
                    onClick={() => handleEditStart(index, section)}
                    className="ml-2 text-blue-600 hover:text-blue-800 shrink-0"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}