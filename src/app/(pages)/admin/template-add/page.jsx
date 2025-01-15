"use client"
import { firestore } from '@/Backend/Firebase'
import DashboardNavbar from '@/components/AdminDashboard/DashboardNavbar'
import DashboardPageInfo from '@/components/AdminDashboard/DashboardPageInfo'
import Sidebar from '@/components/AdminDashboard/Sidebar'
import CustomToast from '@/components/CoustomToast/CoustomToast'
import AdminProtectedRoutes from '@/ProtectedRoutes/AdminProtectedRoutes'
import { doc, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { FaUser } from 'react-icons/fa'

const page = () => {
      const [toast, setToast] = useState({
        message: "",
        type: "",
        visible: false,
        duration: 5000,
      });

      const [formData,setFormData] = useState({
        id:"",
        template:"",
        template_backend_message:"",
        template_title:"",

      })
      const [loading, setLoading] =useState(false);
      const showToast = (message, type = "info", duration = 2000) => {
        setToast({ message, type, visible: true, duration });
      };
    

      const handleChange=(e)=>{
        const {name,value} = e.target;
        setFormData((prev)=>({...prev,[name]:value}))
      }

      const handleFormSubmit =async(e)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const docRef = doc(firestore,"email_templates",formData.id);
            const snapshot =await setDoc(docRef,formData);
            showToast("Template Added Successfully","success",2000);
            console.log(snapshot);

            setFormData({
                id:"",
                template:"",
                template_backend_message:"",
                template_title:"",

            })
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
      }

      const handleCloseToast = () => {
        setToast({ ...toast, visible: false });
      };
  return (
    <AdminProtectedRoutes>
      <div className="flex w-full">
        {toast.visible && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={handleCloseToast}
          />
        )}
        <Sidebar />
        <div className="w-full bg-bgcolor">
          <DashboardNavbar />
          <div className="p-10">
            <DashboardPageInfo
              DashboardPageInfo={"Add Email Templates"}
              icons={<FaUser size={20} />}
            />
            <div className="flex flex-col gap-2 bg-white">
              <div className="flex justify-between py-3 w-full items-center px-5">
                <h2 className="font-medium">Add Email Templates</h2>
              </div>
              <div className="p-5">
                <form
                  onSubmit={handleFormSubmit}
                  className="flex flex-col gap-2"
                >
                
                <div>
                    
                    <div className='flex flex-col '> 
                        <label className="text-primary font-bold pb-3" >Template Id</label>
                        <input name='id' onChange={handleChange} value={formData.id} className='p-3 border rounded bg-gray-50' placeholder='email_registration........'/>
                    </div>
                    <div className='flex flex-col '> 
                        <label className="text-primary font-bold pt-5 pb-3">Template BackEnd Message</label>
                        <input name='template_backend_message' onChange={handleChange} value={formData.template_backend_message} className='p-3 border rounded bg-gray-50'placeholder='template_backend_message........'/>
                    </div>
                    <div className='flex flex-col '> 
                        <label className="text-primary font-bold pt-5 pb-3" >Template Title</label>
                        <input name='template_title' onChange={handleChange} value={formData.template_title} className='p-3 border rounded bg-gray-50' placeholder='Fee Reminder........'/>
                    </div>
                    <div className='flex flex-col '> 
                        <label className="text-primary font-bold pt-5 pb-3" >Template</label>
                        <textarea rows={15} name='template' onChange={handleChange} value={formData.template } className='p-3 border rounded bg-gray-50' placeholder='<DocType......./>'>
                        </textarea>


                        <button type="submit" onClick={handleFormSubmit} className='bg-primary text-white font-bold p-3 rounded w-56 mt-5'>
                            {loading ? "Subitting....." : "Submit"}
                        </button>
                            </div>



                </div>
                 
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  )
}

export default page