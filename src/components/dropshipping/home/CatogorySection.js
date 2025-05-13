import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { HashLoader } from 'react-spinners';
import product3 from '@/app/assets/cat4.png';

const CategorySection = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchCategory = useCallback(async () => {
    const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));

    if (dropshipperData?.project?.active_panel !== "dropshipper") {
      localStorage.removeItem("shippingData");
      router.push("/dropshipping/auth/login");
      return;
    }

    const dropshippertoken = dropshipperData?.security?.token;
    if (!dropshippertoken) {
      router.push("/dropshipping/auth/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://https://sleeping-owl-we0m.onrender.com/api/category", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dropshippertoken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        Swal.fire({
          icon: "error",
          title: "Something Wrong!",
          text: errorMessage.error || errorMessage.message || "Your session has expired. Please log in again.",
        });
        throw new Error(errorMessage.message || errorMessage.error || "Something Wrong!");
      }

      const result = await response.json();
      if (result) {
        setCategoryData(result?.categories || []);
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <HashLoader size={60} color="#F97316" loading={true} />
      </div>
    );
  }
  return (
    <section className="xl:p-6 pt-5">
      <div className="container">
        <h2 className="md:text-[24px] text-lg text-[#F98F5C] font-lato font-bold">Top Categories</h2>
        <div className="md:w-[281px] border-b-3 border-[#F98F5C] mt-1 mb-4"></div>
        {
          categoryData.length>0 ? ( <div className="xl:grid grid-cols-7 flex overflow-auto gap-4 py-4 justify-between">
          {categoryData.map((category, index) => (
            <div key={index} className="flex w-full md:justify-items-start justify-center p-3 items-center">
              <div>
                <div className="md:w-[134px] md:h-[132px] w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-white relative">
                  <Image
                    src={product3}
                    alt={category.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <p className="mt-2 text-[#222222] text-center font-lato font-medium text-[16px] capitalize whitespace-nowrap">{category.name}</p>
              </div>
            </div>
          ))}
        </div>):(
          <p className='text-center'>No Category Found</p>
        )
        }
       
      </div>
    </section>
  );
};

export default CategorySection;
