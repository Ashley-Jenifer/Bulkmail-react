import { useState } from 'react';
import axios from "axios"
import * as XLSX from "xlsx"

function App() {

  const[msg,setmsg] = useState("")
  const[status,setstatus]=useState(false)
  const[emailList,setemailList]=useState([])

  function handlemsg(evt)
  {
    setmsg(evt.target.value)
  }  

  function handleFile(evt)
  {
    const file = evt.target.files[0];
    console.log(file)
    const reader = new FileReader(); 
    reader.onload = function (event) 
    {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName]; // Note the correction here
        const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' }); // Note the correction here
        const totalemail = emailList.map(function(item)
        {
          return item.A
        })
        setemailList(totalemail)
        
    }
    reader.readAsBinaryString(file);   
       
    }
  

  function send()
  {
    setstatus(true);
  axios.post("https://bulkmail-react.vercel.app/sendmail",{msg:msg, emailList:emailList})
    .then(function (response) {
      
      if (response.data === true) {
        alert("Email sent successfully");
        setstatus(false);
        setemailList("")
        setmsg("")
      } else {
        alert("Failed to send email");
      }
    })
    .catch(function (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email");
    });
  }
  
  return (
    <div>
      <div className="bg-blue-950 text-white text-center"> 
        <h1 className="text-2xl font-medium px-5 py-3">Bulkmail</h1>
      </div>
      <div className="bg-blue-800 text-white text-center"> 
        <h1 className= "font-medium px-5 py-3">We can help your business by sending multiple emails at once</h1>
      </div>
      <div className="bg-blue-600 text-white text-center"> 
        <h1 className= "font-medium px-5 py-3">Drag and drop</h1>
      </div>
      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea onChange={handlemsg} value={msg} className="w-[80%] h-32 px-2 outline-none border border-black rounded-md " placeholder="Enter the email text..."></textarea>
        <div>
          <input onChange={handleFile} type="file" className="border-4 border-dashed py-4 px-4 mt-5 mb-5" ></input>
        </div>
        <p>Total emails in the file : {emailList.length}</p>
        <button onClick={send} className= "mt-2 bg-blue-950 text-white py-2 px-2 font-medium rounded-md w-fit">{status?"sending...":"send"}</button>
      </div>  
       
      <div className="bg-blue-300 text-white text-center p-8 "> 
      </div>

      <div className="bg-blue-200 text-white text-center p-8"> 
      </div>
    </div>       
  );
}

export default App;
