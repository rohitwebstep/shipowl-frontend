import React from 'react'

export default function Create() {
    return (
        <section className="add-warehouse xl:w-8/12">
            <div className="bg-white rounded-2xl p-5 ">
                <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                    <div>
                        <label htmlFor="" className="font-bold block text-[#232323]">Brand Name</label>
                        <input type="text" name="" id="" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" />
                    </div>
                    <div>
                        <label htmlFor="" className="font-bold block text-[#232323]">Brand Description</label>
                        <input type="text" name="" id="" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" />
                    </div>
                </div>
                <div className='mt-2'>
                    <label htmlFor="" className="font-bold block text-[#232323]">Brand Image</label>
                    <input type="file" name="" id="" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" />
                </div>
                <div className="flex flex-wrap gap-3 mt-5">
                    <button className="bg-orange-500 text-white px-15 rounded-md p-3">Save</button>
                    <button className="bg-gray-500 text-white px-15 rounded-md p-3">Cancel</button>
                </div>
            </div>
        </section>
    )
}
