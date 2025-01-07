"use client"
import React, { useState } from 'react'

const GetCertificte = () => {

    const [formData,setFormData] = useState({
        cnic:"",
        email:"",
        batch:""
    })
    const [error,setError]=useState({
        cnic:"",
        email:"",
        batch:""
    })

    const handleChange =(e)=>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value});
        setError({...error,[name]:""});
    }

    const handleBlur =(e)=>{
        const {name,value} = e.target;
        if(!value){
            setError({...error,[name]:`${name} is required`})
        }
    }

    const handleFormSubmit = (e)=>{
        e.preventDefault();
        let validateErrors = {};

        if(!formData.cnic ){
            validateErrors.cnic = "CNIC is required";
        }else if(formData.cnic.length < 13 || formData.cnic.length >13 ){
            validateErrors.cnic = "Please Enter 13 digits CNIC without dashes"
        }
        if(!formData.email ){
            validateErrors.email = "Email is required"
        }else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            validateErrors.email = 'Invalid email format';
          }

        if(!formData.batch || formData.batch==="#"){
            validateErrors.batch="Please select a batch"
        }

        setError(validateErrors);

        if(Object.keys(validateErrors).length===0){
            alert("Form submitted successfully")
        }
    }

    


  return (
    <div className=' flex items-center justify-center p-3 lg:p-5'>
        
        <div className='felx flex-col border shadow-2xl text-center p-5 lg:w-[35rem] '>
            <img className='w-36 h-36 mx-auto' src="/logo.jpg" alt="" />
            <h1 className='text-4xl font-bold pb-5'>CERTIFICATE</h1>
         <form onSubmit={handleFormSubmit}>
         <div>
                <div className='flex flex-col'>
                <label htmlFor="" className='text-left pb-1'>Enter Your CNIC:</label>
                <input onChange={handleChange} onBlur={handleBlur} type="number" name='cnic' value={formData.cnic} className={`border px-2 py-1 rounded ${error.cnic ? "border-red-700" :"border"}`} placeholder='Enter your CNIC here' />
                {error.cnic && <p className='text-left text-red-700'>{error.cnic} </p>}
               
                </div>
                <div className='flex flex-col'>
                <label htmlFor="" className='text-left pb-1 pt-3'>Email:</label>
                <input onChange={handleChange} onBlur={handleBlur} type="email" name='email' value={formData.email} className={`border px-2 py-1 rounded ${error.email ? "border-red-700" :"border"}`} placeholder='Enter Your Email here' />
                {error.email && <p className='text-left text-red-700'>{error.email} </p>}
                </div>
                <div className='flex flex-col'>
                <label htmlFor=""  className='text-left pb-1 pt-3'>Select Badge:</label>
                <select name="batch" id=""  onChange={handleChange} onBlur={handleBlur} value={formData.batch} className={`border px-2 py-2 rounded ${error.batch ? "border-red-700" :"border"}` }>
                    <option value="#">Select your badge from here</option>
                    <option value="Batch1">Batch1</option>
                    <option value="Batch2">Batch2</option>
                    <option value="Batch3">Batch3</option>
                </select>
                {error.batch && <p className='text-left text-red-700'> {error.batch} </p>}

                </div>


            <button type='submit' className='bg-primary p-3 text-white hover:bg-second rounded mt-5'>Login Certificate Portal</button>
         </div>
            </form>
        </div>
        
        </div>
  )
}

export default GetCertificte