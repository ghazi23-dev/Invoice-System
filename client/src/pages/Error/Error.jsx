import { FaExclamationTriangle } from "react-icons/fa";
import './Error.css';

export default function ErrorPage() {
  return (
    <div id="error-page">
      <h1>Oh no!</h1>
      <FaExclamationTriangle  size={100} 
        
      />
      <h2>This is an Error Page.</h2>
      <h2>The requested page was not found.</h2>
    </div>
  );
}
