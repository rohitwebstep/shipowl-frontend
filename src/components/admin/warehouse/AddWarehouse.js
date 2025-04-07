
export default function AddWarehouse() {
    return (
        <>
            <section className="add-warehouse xl:w-8/12">
                <div className="bg-white rounded-2xl p-5 ">
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                        <div>
                            <label htmlFor="" className="font-bold block text-[#232323]">Warehouse Name </label>
                            <input type="text" name="" id="" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" placeholder="Charlene Store House" />
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold block text-[#232323]">Warehouse GST Number  </label>
                            <input type="text" name="" id="" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" placeholder="GST289571412" />
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold block text-[#232323]">Contact Name  </label>
                            <input type="text" name="" id="" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" placeholder="Charlene Reed " />
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold block text-[#232323]">Contact No </label>
                            <input type="text" name="" id="" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" placeholder="+9876543210" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="" className="font-bold block text-[#232323]">Address Line 1  </label>
                        <textarea name="" id="" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" placeholder="San Jose, California, USA" />
                    </div>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                        <div>
                            <label htmlFor="" className="font-bold block text-[#232323]">Address Line 2 </label>
                            <input type="text" name="" id="" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" placeholder="San Jose, California, USA" />
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold block text-[#232323]">City  </label>
                            <input type="text" name="" id="" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" placeholder="San Jose" />
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold block text-[#232323]">Postal Code  </label>
                            <input type="text" name="" id="" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" placeholder="45962 " />
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold block text-[#232323]">Sate </label>
                            <input type="text" name="" id="" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" placeholder="USA" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                        <button className="bg-orange-500 text-white px-15 rounded-md p-3">Save</button>
                        <button className="bg-gray-500 text-white px-15 rounded-md p-3">Cancel</button>
                    </div>
                </div>
            </section>

        </>
    )
}
