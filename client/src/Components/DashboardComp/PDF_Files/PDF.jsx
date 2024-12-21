import  { useState, useEffect } from 'react';
import { FaFilePdf, FaDownload, FaSearch } from 'react-icons/fa';
import axiosInstance from '../../../Auth/AxiosInstance';
import { Button } from 'antd';

const PdfResource = () => {
  const [pdfItems, setPdfItems] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const subjectOptions = [
    { value: 'invoice', label: 'Invoice' },
    { value: 'report', label: 'Report' },
    { value: 'contract', label: 'Contract' }
  ];

  useEffect(() => {
    // Fetch the list of PDFs from the backend
    axiosInstance.get('/api/v1/listPdfs')
      .then(response => {
        if (response.data.success) {
          setPdfItems(response.data.pdfs);
        }
      })
      .catch(err => console.error('Error fetching PDFs:', err));
  }, []);

  const isDateInMonth = (dateString, monthValue) => {
    if (!monthValue || !dateString) return true;
    try {
      // Extract month from the date string (format: "2024-10-27")
      const dateMonth = dateString.split('-')[1];
      return dateMonth === monthValue;
    } catch (error) {
      console.error('Error parsing date:', error);
      return false;
    }
  };

  const filteredPdfItems = pdfItems.filter(item =>
    (selectedMonth === '' || isDateInMonth(item.date, selectedMonth)) &&
    (selectedSubject === '' || item.subject === selectedSubject) &&
    (searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePdfClick = (pdf) => {
    setSelectedPdf(pdf);
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await axiosInstance.get(`${fileUrl}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-full md:w-1/3 p-4 bg-white shadow-md overflow-y-auto">
        <div className="mb-4">
          <div className="flex items-center bg-gray-100 p-2 rounded-md">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search PDFs..."
              className="bg-transparent border-none focus:outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            className="p-2 border rounded-md flex-grow"
            onChange={(e) => setSelectedMonth(e.target.value)}
            value={selectedMonth}
          >
            <option value="">All Months</option>
            {monthOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select
            className="p-2 border rounded-md flex-grow"
            onChange={(e) => setSelectedSubject(e.target.value)}
            value={selectedSubject}
          >
            <option value="">All Subjects</option>
            {subjectOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-4">
          {filteredPdfItems.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FaFilePdf className="text-red-500 text-2xl mr-2" />
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                </div>
                <Button 
                  onClick={() => handleDownload(item.fileUrl, item.title)}
                  variant="ghost"
                  size="icon"
                >
                  <FaDownload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-600 text-sm mb-1">{item.description}</p>
              <p className="text-gray-500 text-xs">{formatDate(item.date)}</p>
              <Button 
                onClick={() => handlePdfClick(item)}
                variant="link"
                className="mt-2"
              >
                Preview
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-2/3 p-4 bg-gray-200">
        {selectedPdf ? (
          <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">{selectedPdf.title}</h2>
              <p className="text-gray-600 mb-1">{selectedPdf.description}</p>
              <p className="text-gray-500 text-sm">Date: {formatDate(selectedPdf.date)}</p>
            </div>
            <div className="flex-grow">
              <iframe
                src={`${import.meta.env.VITE_BASE_API_URL}${selectedPdf.fileUrl}`}
                className="w-full h-full border border-gray-300 rounded"
                title="PDF Preview"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FaFilePdf className="text-red-500 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700">Select a PDF to preview</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfResource;