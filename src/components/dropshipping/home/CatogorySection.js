import product from '@/app/assets/cat1.png';
import product1 from '@/app/assets/cat2.png';
import product3 from '@/app/assets/cat4.png';
import product4 from '@/app/assets/cat5.png';
import product5 from '@/app/assets/cat6.png';
import product6 from '@/app/assets/cat7.png';
import Image from 'next/image';
const categories = [
    { name: "Category Name", image: product },
    { name: "Skincare", image: product1 },
    { name: "Handmade", image:product6},
    { name: "Health", image: product3 },
    { name: "Shoes", image: product4 },
    { name: "Beverages", image: product5},
    { name: "Gadgets", image: product6 }
  ];
  
  const CategorySection = () => {
    return (
      <section className="xl:p-6 pt-5">
        <div className="container">
          <h2 className="md:text-[24px] text-lg  text-[#F98F5C] font-lato font-bold">Top Categories</h2>
          <div className="md:w-[281px]  border-b-3 border-[#F98F5C] mt-1 mb-4"></div>
          <div className="xl:grid grid-cols-7   flex overflow-auto gap-4 py-4 justify-between">
            {categories.map((category, index) => (
              <div key={index} className="flex w-full md:justify-items-start justify-center  p-3  items-center">
                <div>
                <div className="md:w-[134px] md:h-[132px]  w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-white">
                  <Image src={category.image} alt={category.name} className="w-full h-full object-cover" />
                </div>
                <p className="mt-2  text-[#222222] text-center font-lato font-medium text-[16px] whitespace-nowrap">{category.name}</p>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default CategorySection;
  