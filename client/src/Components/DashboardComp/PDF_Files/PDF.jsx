import { useState } from 'react';
import Select from 'react-select';
import './PDF.css';
import { FaFilePdf, FaDownload } from "react-icons/fa6"; // Import FaDownload icon

const PdfResource = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null); // Store selected PDF object

  const monthOptions = [
    { value: 'september', label: 'September' },
    { value: 'august', label: 'August' },
    { value: 'july', label: 'July' }
  ];

  const subjectOptions = [
    { value: 'math', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' }
  ];

  const pdfItems = [
    { title: 'Invoice FA2024-001', description: 'Invoice for services rendered in September 2023', date: '2023-09-18', fileUrl: '/FFS.pdf' },
    { title: 'Invoice FA2024-002', description: 'Invoice for services rendered in October 2023', date: '2023-10-20', fileUrl: '/FF.pdf' },
    { title: 'Invoice FA2024-003', description: 'Invoice for consulting services in September 2023', date: '2023-09-22', fileUrl: '/FF.pdf' },
    { title: 'Invoice FA2024-004', description: 'Invoice for training session on financial management', date: '2023-09-25', fileUrl: '/FF.pdf' }
  ];
  

  const handlePdfClick = (pdf) => {
    setSelectedPdf(pdf);
  };

  return (
    <div className="pdf-resource-container">
      <div className="sidebar">
        <div className="filter-bar">
          <Select
            className="filter-select"
            placeholder="Month"
            options={monthOptions}
            onChange={setSelectedMonth}
          />
          <Select
            className="filter-select"
            placeholder="Subject"
            options={subjectOptions}
            onChange={setSelectedSubject}
          />
        </div>

        <div className="pdf-list">
          {pdfItems.map((item, index) => (
            <div key={index} className="pdf-item">
              <div className="pdf-icon" onClick={() => handlePdfClick(item)}>
                <span>📄</span>
              </div>
              <div className="pdf-description" onClick={() => handlePdfClick(item)}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p>{item.date}</p>
              </div>
              <a href={item.fileUrl} download>
                <FaDownload className="download-icon" title="Download PDF" />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="pdf-preview">
        {selectedPdf ? (
          <>
            <iframe
              src={selectedPdf.fileUrl}
              width="100%"
              height="300px"
              title="PDF Preview"
            />
            <div className="pdf-info">
              <FaFilePdf style={{fontSize: '2rem',  }}/>
              <h3>{selectedPdf.title}</h3>
              <p>{selectedPdf.description}</p>
              <p><strong>Date:</strong> {selectedPdf.date}</p>
            </div>
          </>
        ) : (
          <h1>Please select a PDF to preview <br /><br />
            <FaFilePdf style={{ fontSize: '10rem', position: "absolute", marginLeft: "12rem" }} />
          </h1>
        )}
      </div>

      <style>{`
        .pdf-resource-container {
          display: flex;
          height: 100vh;
        }

        .filter-bar {
          display: flex;
          flex-direction: table;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .pdf-list {
          margin-top: 1rem;
        }

        .pdf-item {
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 1rem;
          background-color: #fff;
          border-radius: 8px;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s;
          justify-content: space-between;
        }

        .pdf-item:hover {
          background-color: #eaeaea;
        }

        .pdf-icon {
          font-size: 2rem;
          margin-right: 1rem;
        }

        .pdf-description {
          flex: 1;
        }

        .download-icon {
          font-size: 1.5rem;
          margin-left: 1rem;
          cursor: pointer;
          color: #007BFF;
          transition: color 0.3s;
        }
        
        .download-icon:hover {
          color: #0056b3;
        }

        .pdf-preview {
          width: 70%;
          padding: 1rem;
          background-color: #f9f9f9;
          display: flex;
          flex-direction: column; 
        }

         .pdf-preview iframe {
          width: 70%;
          height: 63%;
          border: 1px solid #000;
         margin-left: 5rem;
          right: 1rem;
        }

        .pdf-info {
          margin-top: 1rem;
          padding: 1rem;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          width: 70%;
          margin-left: 5rem;
               

        }

        .pdf-info h3 {
          margin: 0 0 0.5rem; /* Added margin */
        }
        
        .pdf-info p {
          margin: 0.2rem 0; /* Added margin */
        }
      `}</style>
    </div>
  );
};

export default PdfResource;
