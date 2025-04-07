'use client';

import { useState } from 'react';
import img from '@/app/assets/image-badge.png'
import { IoCloseOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { Image } from 'next/image';
const SourceProductForm = () => {
    const [image, setImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="flex">
            <div className="w-full md:max-w-5xl py-6">
                <h2 className="md:text-3xl text-xl font-lato font-semibold text-[#F98F5C]">Source A Product</h2>
                <div className="w-4/12 border-b-4 border-[#F98F5C] mb-4"></div>

                <h4 className="text-xl font-semibold mt-2 font-lato">Your Search Ends Here!</h4>
                <h5 className="mb-6 text-black text-lg pt-1 font-lato">
                    If you can’t find your desired product, let us know—we’ll do our best to source it for you.
                </h5>


                <div className="bg-white shadow p-4 rounded-xl mb-6">
                    <h3 className="text-lg font-semibold">General Information</h3>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-3">
                        <div> <label htmlFor="" className='text-[#777980] block mb-1'>Product Name</label>
                            <input type="text" placeholder="Type product name here..." className=" p-2 bg-[#F9F9FC] border border-[#E0E2E7] rounded text-[#858D9D] w-full" />
                        </div>
                        <div> <label htmlFor="" className='text-[#777980] block mb-1'>Category Type</label>
                            <select className="border p-2 bg-[#F9F9FC] border-[#E0E2E7] rounded text-[#858D9D] w-full">
                                <option>Select a category type</option>
                            </select>
                        </div>
                        <div> <label htmlFor="" className='text-[#777980] block mb-1'>Expected Price</label>
                            <select className="border p-2 bg-[#F9F9FC] border-[#E0E2E7] rounded text-[#858D9D] w-full">
                                <option>Select a price</option>
                            </select>
                        </div>
                        <div> <label htmlFor="" className='text-[#777980] block mb-1'>Expected Daily Orders</label>
                            <select className="border p-2 bg-[#F9F9FC] border-[#E0E2E7] rounded text-[#858D9D] w-full">
                                <option>Select</option>
                            </select>
                        </div>

                    </div>
                    <div className='mt-3'>
                        <label htmlFor="" className='text-[#777980] block mb-1'>Product URL</label>
                        <input type="text" placeholder="Product URL" className=" p-2 bg-[#F9F9FC] border border-[#E0E2E7] rounded text-[#858D9D] w-full col-span-2" />
                    </div>
                </div>

                <div className="bg-white shadow p-4 rounded-xl mb-6">
                    <h3 className="text-lg font-semibold">Product Image</h3>
                    <label htmlFor="" className='text-[#777980] block mt-1'>Photo</label>
                    <div className="border-dashed border-2 border-gray-300 bg-[#F9F9FC] rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 mt-3">
                        {image ? (
                            <Image src={image} alt="Uploaded" className="w-32 h-32 object-cover rounded-xl" />
                        ) : (
                            <>
                                <Image src={img} alt="Image Gallary" className='p-3' />
                                <p className="mt-2">Drag and drop image here, or click add image</p>
                            </>
                        )}
                        <input type="file" className="hidden" id="upload" onChange={handleImageUpload} />
                        <label htmlFor="upload" className="mt-3 px-4 py-2 text-[#F98F5C] bg-[#f98e5c49]  rounded-md cursor-pointer">Add Image</label>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button className="px-4 py-2 border rounded-md flex items-center gap-2" ><IoCloseOutline /> Cancel</button>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-md flex items-center gap-2" ><FaPlus /> Submit Request</button>
                </div>
            </div>
        </div>
    );
};

export default SourceProductForm;
