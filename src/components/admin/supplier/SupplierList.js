import React from 'react'

export default function SupplierList() {
    const suppliers = [
        {
          id: 1,
          name: "Rajesh Kumar",
          email: "rajesh.kumar@example.com",
          dob: "1985-04-12",
          present_address: "123, Green Street, Delhi",
          permanent_address: "456, Blue Lane, Mumbai",
          state: "Maharashtra",
          city: "Mumbai",
          postal_code: "400001",
          pincode: "123456",
          gst_number: "27ABCDE1234F1Z5",
          pan_card_id: "ABCDE1234F",
          aadhar_card_id: "1234-5678-9012",
        },
        {
          id: 2,
          name: "Sneha Verma",
          email: "sneha.verma@example.com",
          dob: "1990-08-25",
          present_address: "789, Red Road, Bangalore",
          permanent_address: "101, Yellow Building, Hyderabad",
          state: "Karnataka",
          city: "Bangalore",
          postal_code: "560001",
          pincode: "654321",
          gst_number: "29XYZ9876K1Z8",
          pan_card_id: "XYZ9876K1",
          aadhar_card_id: "5678-1234-9012",
        },
        {
          id: 3,
          name: "Anil Sharma",
          email: "anil.sharma@example.com",
          dob: "1978-01-15",
          present_address: "321, Sunset Blvd, Pune",
          permanent_address: "654, Mountain View, Ahmedabad",
          state: "Gujarat",
          city: "Ahmedabad",
          postal_code: "380001",
          pincode: "789012",
          gst_number: "24LMNOP5678A1Z9",
          pan_card_id: "LMNOP5678A",
          aadhar_card_id: "8901-2345-6789",
        },
        {
          id: 4,
          name: "Pooja Gupta",
          email: "pooja.gupta@example.com",
          dob: "1995-06-10",
          present_address: "987, Lake View, Kolkata",
          permanent_address: "123, City Center, Chennai",
          state: "West Bengal",
          city: "Kolkata",
          postal_code: "700001",
          pincode: "321654",
          gst_number: "19QRST4321B1Z7",
          pan_card_id: "QRST4321B",
          aadhar_card_id: "2345-6789-0123",
        }
      ];
      
    return (
        <>

            <div className="bg-white p-5 rounded-2xl ">
                <h2 className='text-4xl font-bold text-center py-5 text-[#2C3454]'>Supplier List</h2>
                <div className="overflow-x-auto">
                    <table className='min-w-full'>
                        <thead>
                            <tr className='bg-[#F98F5C] text-white border border-[#2B3674]'>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">Sr.</th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">Name</th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">Email</th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">Date Of Birth</th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">Present Address</th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">Permanent Address</th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">State</th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">City</th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">Postal Code</th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">Pincode</th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">GST Number</th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">Pan Card ID</th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">Aadhar Card ID</th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((item, index) => {
                                return (
                                    <tr key={item.id} className='text-[#2B3674] font-semibold border relative'>
                                       
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">{index+1}</td>
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">{item.name}</td>
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">{item.email}</td>
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">{item.dob}</td>
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">{item.present_address}</td>
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">{item.permanent_address}</td>
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">{item.state}</td>
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">{item.city}</td>
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">{item.postal_code}</td>
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">{item.pincode}</td>
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">{item.gst_number}</td>
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">{item.pan_card_id}</td>
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">{item.aadhar_card_id}</td>
                                        <td className=" p-2 border px-4 whitespace-nowrap text-left">

                                            <button className='p-3 px-5 rounded-md bg-orange-500 text-white'>
                                                Edit
                                            </button>
                                            <button className='p-3  px-5 ms-2  rounded-md bg-red-500 text-white'>
                                                Delete
                                            </button>
                                        </td>

                                       
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                </div>
            </div>


        </>
    )
}
