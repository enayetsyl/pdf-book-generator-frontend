import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [title, setTitle] = useState('');
  const [texts, setTexts] = useState([]);
  const [images, setImages] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');

  const handleTextChange = (index, event) => {
    const newTexts = texts.slice();
    newTexts[index] = event.target.value;
    setTexts(newTexts);
  };

  const handleAddText = () => {
    setTexts([...texts, '']);
  };

  const handleImageChange = (event) => {
    setImages([...images, ...event.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    texts.forEach(text => formData.append('texts', text));
    images.forEach(image => formData.append('images', image));

    try {
      const response = await axios.post('http://localhost:5000/generate_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPdfUrl(`http://localhost:5000${response.data.pdfUrl}`);
    } catch (error) {
      console.error('Error generating PDF', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          {texts.map((text, index) => (
            <div key={index}>
              <label htmlFor={`text-${index}`}>Text {index + 1}:</label>
              <textarea
                id={`text-${index}`}
                value={text}
                onChange={(e) => handleTextChange(index, e)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddText}>Add Text</button>
        </div>
        <div>
          <label htmlFor="images">Images:</label>
          <input
            type="file"
            id="images"
            onChange={handleImageChange}
            multiple
            required
          />
        </div>
        <button type="submit">Generate PDF</button>
      </form>
      {pdfUrl && (
        <div>
          <h2>PDF Generated!</h2>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Download PDF</a>
        </div>
      )}
    </div>
  );
}

export default App;
